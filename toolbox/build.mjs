import fs from 'node:fs';
import ts from 'typescript';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';
process.chdir(fileURLToPath(new URL('../', import.meta.url)));
function compile(name){return ts.transpileModule(fs.readFileSync('src/game/'+name+'.ts','utf8').replace(/^import .*$/gm,'').replace(/^export \{.*\};?\s*$/gm,'').replace(/\bexport\s+/g,''),{compilerOptions:{target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.None}}).outputText}
const rules=compile('rules');
const world=['definitions','adventure-rules','commerce','world'].map(compile).join('\n');
const catalogs={enemies:'enemies',keywords:'keywords',items:'items',dungeons:'dungeons',cities:'cities',terrainTypes:'terrain-types',maps:'maps',modules:'adventure-modules',shops:'shops'};
const data={};
for(const [key,name]of Object.entries(catalogs)) data[key]=JSON.parse(fs.readFileSync(`public/data/${name}.json`));
// Validate every authored library and template using the current runtime rules.
const validate=vm.runInNewContext(rules+world+`;({enemies:validateEnemyLibrary,keywords:validateKeywordCatalog,items:data=>{if(data.format!=='quest-for-glory-items'||data.version!==1||!Array.isArray(data.items))throw Error('Invalid item library');const seen=new Set();for(const item of data.items){const normalized=normalizeItem(item),key=normalized.name.normalize('NFKC').trim().replace(/\\s+/g,' ').toLowerCase();if(seen.has(key))throw Error('Duplicate item name: '+normalized.name);seen.add(key)}return data},shops:data=>validateShops(data,${JSON.stringify(data.items.items)}),dungeons:data=>validateDungeonLibrary(data,${JSON.stringify(data.enemies.enemies)})})`);
for(const name of fs.readdirSync('public/data').filter(name=>name.endsWith('.json'))){
 const kind=name.split('.')[0];const key=Object.keys(catalogs).find(k=>catalogs[k]===kind);if(!key)throw Error('Unsupported data file: '+name);
 try{const value=JSON.parse(fs.readFileSync('public/data/'+name));if(validate[kind])validate[kind](value);const all=name.includes('.template.')&&!['cities','terrainTypes','maps','modules'].includes(key)?data:{...data,[key]:value};vm.runInNewContext(rules+world+`;validateShops(${JSON.stringify(all.shops)},${JSON.stringify(all.items.items)});for(const city of ${JSON.stringify(all.cities.cities)})if(city.amenities.shop&&!${JSON.stringify(all.shops.shops.map(s=>s.id))}.includes(city.amenities.shop.shopId))throw Error('Unknown city shop');validateWorld(${JSON.stringify({terrains:all.terrainTypes,cities:all.cities,maps:all.maps,adventures:all.modules})},${JSON.stringify(all.dungeons.dungeons)},${JSON.stringify(all.enemies.enemies)})`)}catch(error){throw Error(name+': '+error.message)}
 console.log('Validated public/data/'+name);
}
const escape=s=>s.replace(/</g,'\\u003c');
const markers=Object.fromEntries(['city','dungeon'].map(type=>[type,'data:image/svg+xml;base64,'+fs.readFileSync(`public/icons/location-${type}.svg`).toString('base64')]));
const html=fs.readFileSync('toolbox/editor.template.html','utf8').replace('/* SHARED_RULES */',()=>rules+'\n'+world).replace('/* INITIAL_DATA */',()=>escape(JSON.stringify(data))).replace('/* LOCATION_MARKERS */',()=>JSON.stringify(markers));
fs.writeFileSync('toolbox/data-editor.html',html);
console.log('Built toolbox/data-editor.html (standalone, no runtime dependencies)');
