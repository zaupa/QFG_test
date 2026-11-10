import fs from 'node:fs';
import ts from 'typescript';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';
process.chdir(fileURLToPath(new URL('../', import.meta.url)));
const rules=ts.transpileModule(fs.readFileSync('src/game/rules.ts','utf8').replace(/^export \{.*\};?\s*$/m,''),{compilerOptions:{target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.None}}).outputText;
const world=ts.transpileModule(fs.readFileSync('src/game/world.ts','utf8').replace(/\bexport\s+/g,''),{compilerOptions:{target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.None}}).outputText;
const catalogs={enemies:'enemies',keywords:'keywords',items:'items',dungeons:'dungeons',cities:'cities',terrainTypes:'terrain-types',maps:'maps',modules:'adventure-modules'};
const data={};
for(const [key,name]of Object.entries(catalogs)) data[key]=JSON.parse(fs.readFileSync(`public/data/${name}.json`));
// Validate every authored library and template using the current runtime rules.
const validate=vm.runInNewContext(rules+world+`;({enemies:validateEnemyLibrary,keywords:validateKeywordCatalog,items:data=>{if(data.format!=='quest-for-glory-items'||data.version!==1||!Array.isArray(data.items))throw Error('Invalid item library');const seen=new Set();for(const item of data.items){const normalized=normalizeItem(item),key=normalized.name.normalize('NFKC').trim().replace(/\\s+/g,' ').toLowerCase();if(seen.has(key))throw Error('Duplicate item name: '+normalized.name);seen.add(key)}return data},dungeons:data=>validateDungeonLibrary(data,${JSON.stringify(data.enemies.enemies)})})`);
for(const name of fs.readdirSync('public/data').filter(name=>name.endsWith('.json'))){
 const kind=name.split('.')[0];const key=Object.keys(catalogs).find(k=>catalogs[k]===kind);if(!key)throw Error('Unsupported data file: '+name);
 try{const value=JSON.parse(fs.readFileSync('public/data/'+name));if(validate[kind])validate[kind](value);const all={...data,[key]:value};vm.runInNewContext(world+`;validateWorld(${JSON.stringify({terrains:all.terrainTypes,cities:all.cities,maps:all.maps,adventures:all.modules})},${JSON.stringify(all.dungeons.dungeons)})`)}catch(error){throw Error(name+': '+error.message)}
 console.log('Validated public/data/'+name);
}
const escape=s=>s.replace(/</g,'\\u003c');
const html=fs.readFileSync('toolbox/editor.template.html','utf8').replace('/* SHARED_RULES */',()=>rules+'\n'+world).replace('/* INITIAL_DATA */',()=>escape(JSON.stringify(data)));
fs.writeFileSync('toolbox/data-editor.html',html);
console.log('Built toolbox/data-editor.html (standalone, no runtime dependencies)');
