const {chromium}=require('playwright');
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
(async()=>{
 const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||'/usr/bin/chromium',args:['--no-sandbox']});
 const page=await browser.newPage({acceptDownloads:true});page.setDefaultTimeout(5000);const errors=[];page.on('pageerror',e=>errors.push(e.message));page.on('dialog',d=>d.accept());
 const tab=async name=>{await page.getByRole('navigation').getByRole('button',{name,exact:true}).click();if(name==='Maps')await page.locator('#advancedMap').evaluate(el=>el.open=true)};const apply=async()=>{await page.getByRole('button',{name:'Apply entry',exact:true}).click();if(await page.locator('#advancedMap').count())await page.locator('#advancedMap').evaluate(el=>el.open=true)};const discard=async()=>{await page.getByRole('button',{name:'Discard draft',exact:true}).click();if(await page.locator('#advancedMap').count())await page.locator('#advancedMap').evaluate(el=>el.open=true)};let checks=0;const check=v=>{assert.ok(v);checks++};
 try{
 await page.setContent(fs.readFileSync(path.join(__dirname,'data-editor.html'),'utf8'));await page.evaluate(()=>{window.showOpenFilePicker=undefined;window.showSaveFilePicker=undefined});
 check(await page.getByRole('navigation').getByRole('button').count()===8);check(await page.evaluate(()=>{validateBundle();return true}));
 // City amenity forms preserve values and omit removed optional services.
 await tab('Cities');await page.getByLabel('Healing cost',{exact:true}).fill('12');await apply();check(await page.evaluate(()=>libraries.cities.cities[0].amenities.temple.healingCost===12));
 await page.getByRole('button',{name:'Remove blacksmith',exact:true}).click();await apply();check(await page.evaluate(()=>!Object.hasOwn(libraries.cities.cities[0].amenities,'blacksmith')));
 await page.getByRole('button',{name:'+ Add blacksmith',exact:true}).click();await page.getByLabel('Repair cost',{exact:true}).fill('0');await apply();check(await page.evaluate(()=>libraries.cities.cities[0].amenities.blacksmith.repairCost===0));
 await page.getByLabel('Attribute points per Fate',{exact:true}).fill('0');await apply();check((await page.locator('#message').innerText()).includes('Invalid city guild'));await discard();
 // New terrain definitions appear immediately in map reference choices.
 await tab('Terrain types');const terrainId=await page.getByLabel('ID',{exact:true}).inputValue();await page.getByRole('button',{name:'Duplicate',exact:true}).click();await apply();check(await page.evaluate(id=>libraries.terrainTypes.terrainTypes.some(t=>t.id===id+'-copy'),terrainId));
 await tab('Maps');await page.getByLabel('Terrain',{exact:true}).first().selectOption(terrainId+'-copy');await page.getByLabel('Space name',{exact:true}).first().fill('Workshop crossing');await apply();check(await page.evaluate(id=>libraries.maps.maps[0].tiles[0].terrainTypeId===id+'-copy'&&libraries.maps.maps[0].tiles[0].name==='Workshop crossing',terrainId));
 // Referenced terrain deletion is blocked without changing the library.
 await tab('Terrain types');await page.locator('#entries button').last().click();await page.getByRole('button',{name:'Delete entry',exact:true}).click();check((await page.locator('#message').innerText()).startsWith('Cannot delete:'));
 await tab('Maps');await page.getByLabel('Adjacent space',{exact:true}).first().selectOption('T01');await apply();check((await page.locator('#message').innerText()).includes('adjacency'));await discard();
 await page.getByRole('button',{name:'Recalculate map adjacency',exact:true}).click();await apply();check(await page.evaluate(()=>{validateBundle();return true}));
 // All geometry fields are editable, with shared-border validation on apply.
 await page.getByLabel('Spaces in ring',{exact:true}).first().fill('2');await apply();check((await page.locator('#message').innerText()).includes('geometry'));await discard();
 await page.getByRole('button',{name:'Duplicate',exact:true}).click();await apply();check(await page.evaluate(()=>libraries.maps.maps.length===initial.maps.maps.length+1));
 const copiedMap=await page.getByLabel('ID',{exact:true}).inputValue();
 await tab('Adventures');await page.getByLabel('Map',{exact:true}).selectOption(copiedMap);await page.getByLabel('Starting type',{exact:true}).selectOption('wilderness');await page.getByLabel('Starting space',{exact:true}).selectOption('T03');await apply();check(await page.evaluate(id=>libraries.modules.modules[0].mapId===id&&libraries.modules.modules[0].startingLocation.spaceId==='T03',copiedMap));
 const downloading=page.waitForEvent('download');await page.getByRole('button',{name:'Download current JSON',exact:true}).click();const file=await downloading;check(file.suggestedFilename()==='adventure-modules.json');const value=JSON.parse(fs.readFileSync(await file.path(),'utf8'));check(value.format==='quest-for-glory-adventure-modules'&&value.modules[0].mapId===copiedMap);
 // Import stages related files together before checking references.
 const updated=await page.evaluate(()=>{const city=clone(libraries.cities),maps=clone(libraries.maps);city.cities.push({id:'new-city',name:'New city',amenities:{}});maps.maps[0].tiles[1].locations.push({type:'city',id:'new-city'});return {city,maps}});
 await page.locator('#files').setInputFiles([{name:'maps.json',mimeType:'application/json',buffer:Buffer.from(JSON.stringify(updated.maps))},{name:'cities.json',mimeType:'application/json',buffer:Buffer.from(JSON.stringify(updated.city))}]);await page.waitForFunction(()=>libraries.cities.cities.some(c=>c.id==='new-city'));check(await page.evaluate(()=>libraries.maps.maps[0].tiles[1].locations.some(l=>l.id==='new-city')));
 const before=await page.evaluate(()=>JSON.stringify(libraries));const bad=await page.evaluate(()=>{const data=clone(libraries.maps);data.maps[0].tiles[0].terrainTypeId='missing-terrain';return data});await page.locator('#files').setInputFiles({name:'maps.json',mimeType:'application/json',buffer:Buffer.from(JSON.stringify(bad))});await page.waitForFunction(()=>document.querySelector('#message').textContent.startsWith('Files were not loaded:'));check(await page.evaluate(()=>JSON.stringify(libraries))===before);
 await page.setViewportSize({width:390,height:844});for(const name of ['Cities','Terrain types','Maps','Adventures']){await tab(name);check(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth))}assert.deepEqual(errors,[]);
 console.log(`PASS: ${checks} world-editor checks (amenities, references, geometry, imports, downloads, mobile)`);
 }finally{await browser.close()}
})().catch(e=>{console.error(e);process.exitCode=1});
