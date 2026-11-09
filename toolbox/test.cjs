const {chromium}=require('playwright');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
(async()=>{
 const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||'/usr/bin/chromium',headless:true,args:['--no-sandbox']});
 const page=await browser.newPage({acceptDownloads:true});page.setDefaultTimeout(5000);const errors=[];page.on('pageerror',e=>errors.push(e.message));const prompts=[];page.on('dialog',d=>{prompts.push(d.message());return d.message().includes('unlisted silver')?d.dismiss():d.accept()});
 await page.addInitScript(()=>{window.showOpenFilePicker=undefined;window.showSaveFilePicker=undefined});
 const tab=async name=>page.getByRole('navigation').getByRole('button',{name,exact:true}).click();
 let checks=0;const check=(v)=>{assert.ok(v);checks++};
 try{
 // Managed Chromium blocks file:// URLs; load the complete standalone bytes
 // into an empty document, without a web server or companion app.
 await page.evaluate(()=>{window.showOpenFilePicker=undefined;window.showSaveFilePicker=undefined});
 await page.setContent(fs.readFileSync(path.join(__dirname,'data-editor.html'),'utf8'));
 check(await page.getByRole('heading',{name:'Data workshop',exact:true}).isVisible());
 check(await page.evaluate(()=>Object.keys(libraries).every(k=>!!validated(k,libraries[k]))));
 const original=await page.evaluate(()=>clone(libraries));
 check(await page.evaluate(()=>validated('dungeons',libraries.dungeons).dungeons[0].completionFateReward===0));
 await page.getByRole('button',{name:'+ Add entry',exact:true}).click();await page.getByRole('button',{name:'Discard draft',exact:true}).click();check(await page.evaluate(()=>libraries.enemies.enemies.length===initial.enemies.enemies.length&&!draftDirty));
 await page.getByLabel('Name',{exact:true}).fill('Workshop Rat');await page.getByRole('button',{name:'Apply entry',exact:true}).click();
 check(await page.evaluate(()=>libraries.enemies.enemies[0].id==='Workshop Rat'&&libraries.dungeons.dungeons.some(d=>d.encounters.some(e=>e.enemyId==='Workshop Rat'))));
 await page.getByRole('button',{name:'Delete entry',exact:true}).click();check((await page.locator('#message').innerText()).includes('referenced'));
 await page.getByLabel('Challenge value (CV)').fill('-1');await page.getByRole('button',{name:'Apply entry',exact:true}).click();check((await page.locator('#message').innerText()).includes('Invalid enemy CV'));
 await page.getByRole('button',{name:'Discard draft',exact:true}).click();check(await page.getByLabel('Challenge value (CV)').inputValue()==='6');

 // Associations use two editable parts, preserve legacy spellings until edited,
 // and accept both predefined and custom targets.
 await page.locator('#entries').getByRole('button',{name:'Skeleton',exact:true}).click();
 check(await page.getByLabel('Effect',{exact:true}).inputValue()==='Resistant'&&await page.getByLabel('Target keyword',{exact:true}).inputValue()==='slash');
 await page.getByRole('button',{name:'Apply entry',exact:true}).click();check(await page.evaluate(()=>libraries.enemies.enemies.find(e=>e.name==='Skeleton').KW[0]==='resistant slash'));
 await page.getByLabel('Effect',{exact:true}).selectOption('Weak');await page.getByLabel('Target keyword',{exact:true}).fill('Full Body');await page.getByRole('button',{name:'Apply entry',exact:true}).click();check(await page.evaluate(()=>libraries.enemies.enemies.find(e=>e.name==='Skeleton').KW[0]==='Weak against Full Body'));
 await page.locator('#entries').getByRole('button',{name:'Workshop Rat',exact:true}).click();
 const options=await page.getByLabel('New target keyword').evaluate(el=>[...document.getElementById(el.getAttribute('list')).options].map(o=>o.value));
 check(options.length===new Set(original.keywords.keywords.map(k=>k.keyword)).size&&options.every((v,i)=>i===0||options[i-1].localeCompare(v,'en',{sensitivity:'base'})<=0));
 for(const [effect,target] of [['Unprotected','slash'],['Resistant','metal'],['Weak','Full Body'],['Strong','moon glass']]){await page.getByLabel('New effect',{exact:true}).selectOption(effect);await page.getByLabel('New target keyword',{exact:true}).fill(target);await page.getByRole('button',{name:'Add association',exact:true}).click()}
 check(await page.evaluate(()=>libraries.keywords.keywords.some(k=>k.keyword==='moon glass'&&k.category==='Custom'&&k.uses[0]==='armor')&&dirty.has('keywords')));
 await page.getByRole('button',{name:'Apply entry',exact:true}).click();check(await page.evaluate(()=>JSON.stringify(libraries.enemies.enemies[0].KW)===JSON.stringify(['Unprotected against slash','Resistant against metal','Weak against Full Body','Strong against moon glass'])));
 await page.getByLabel('New target keyword',{exact:true}).fill(' SLASH ');await page.getByRole('button',{name:'Add association',exact:true}).click();check((await page.locator('#message').innerText()).includes('already selected'));
 await page.getByLabel('New target keyword',{exact:true}).fill('bad, keyword');await page.getByRole('button',{name:'Add association',exact:true}).click();check((await page.locator('#message').innerText()).includes('Commas are not allowed'));

 const beforePrompts=prompts.length;await page.getByLabel('New effect',{exact:true}).selectOption('Weak');await page.getByLabel('New target keyword',{exact:true}).fill('unlisted silver');await page.getByRole('button',{name:'Add association',exact:true}).click();await page.getByRole('button',{name:'Apply entry',exact:true}).click();
 check(prompts.length===beforePrompts+1&&prompts.at(-1).includes('not in the predefined keyword list'));
 check(await page.evaluate(()=>!libraries.keywords.keywords.some(k=>k.keyword==='unlisted silver')&&libraries.enemies.enemies[0].KW.includes('Weak against unlisted silver')));
 await page.getByLabel('Target keyword',{exact:true}).first().fill('');await page.getByRole('button',{name:'Apply entry',exact:true}).click();check((await page.locator('#message').innerText()).includes('target keyword'));await page.getByRole('button',{name:'Discard draft',exact:true}).click();
 await tab('Keywords');await page.getByRole('button',{name:'+ Add entry',exact:true}).click();await page.getByLabel('Keyword',{exact:true}).fill('moon silver');await page.getByLabel('Category',{exact:true}).fill('Material');await page.getByRole('button',{name:'Apply entry',exact:true}).click();check(await page.evaluate(()=>libraries.keywords.keywords.some(k=>k.keyword==='moon silver')));
 const keywordNames=await page.locator('#entries button').allTextContents();check(keywordNames.every((v,i)=>i===0||keywordNames[i-1].localeCompare(v,'en',{sensitivity:'base'})<=0));
 await tab('Items');await page.getByRole('button',{name:'+ Add entry',exact:true}).click();await page.getByLabel('Name',{exact:true}).fill('Workshop Sword');await page.getByRole('button',{name:'+ Add equipment',exact:true}).click();await page.getByLabel('Modifier',{exact:true}).fill('3');const chips=await page.locator('.chips button').allTextContents();check(chips.every((v,i)=>i===0||chips[i-1].localeCompare(v,'en',{sensitivity:'base'})<=0));await page.getByRole('button',{name:'moon silver',exact:true}).click();await page.getByRole('button',{name:'+ Add keyword',exact:true}).click();await page.getByLabel('Keyword',{exact:true}).last().fill('starlight');await page.getByRole('button',{name:'Apply entry',exact:true}).click();check(await page.evaluate(()=>libraries.keywords.keywords.some(k=>k.keyword==='starlight'&&k.uses.includes('weapon'))));check(await page.evaluate(()=>libraries.items.items.at(-1).equipment.modifier===3&&libraries.items.items.at(-1).keywords.includes('moon silver')));
 await tab('Enemies');await page.getByRole('button',{name:'+ Add entry',exact:true}).click();await page.getByLabel('Name',{exact:true}).fill('Workshop Goblin');await page.getByRole('button',{name:'+ Add reward item',exact:true}).click();await page.getByLabel('Copy item preset').selectOption({label:'Workshop Sword'});await page.getByRole('button',{name:'Apply entry',exact:true}).click();check(await page.evaluate(()=>libraries.enemies.enemies.at(-1).Item.equipment.modifier===3));
 await tab('Dungeons');await page.locator('fieldset').filter({has:page.locator('legend').filter({hasText:/^Coin reward$/})}).getByLabel('Base',{exact:true}).fill('9');await page.getByRole('button',{name:'Apply entry',exact:true}).click();check(await page.evaluate(()=>libraries.dungeons.dungeons[0].coinReward.base===9));
 // Invalid encounter coverage blocks serialization; it never exports malformed data.
 await page.evaluate(()=>{draft.encounters[0].rolls=[1];draftDirty=true});await page.getByRole('button',{name:'Apply entry',exact:true}).click();check((await page.locator('#message').innerText()).includes('cover every roll'));await page.getByRole('button',{name:'Discard draft',exact:true}).click();
 // The download is a real JSON round trip, including copied nested equipment.
 await tab('Enemies');const downloadPromise=page.waitForEvent('download');await page.getByRole('button',{name:'Download current JSON',exact:true}).click();const download=await downloadPromise;const exported=JSON.parse(fs.readFileSync(await download.path(),'utf8'));check(exported.enemies.at(-1).Item.equipment.modifier===3);
 // Direct save writes, closes, and clears the correct dirty marker.
 await page.evaluate(()=>{window.savedText='';window.closedStream=false;window.showSaveFilePicker=async()=>({createWritable:async()=>({write:async text=>{window.savedText=text},close:async()=>{window.closedStream=true}})})});await page.getByRole('button',{name:'Save current file',exact:true}).click();await page.waitForFunction(()=>window.closedStream);check(await page.evaluate(()=>JSON.parse(window.savedText).enemies.at(-1).name==='Workshop Goblin'&&!dirty.has('enemies')));
 // Import of dependent files succeeds together, regardless of input order.
 await page.locator('#files').setInputFiles(['dungeons','enemies','keywords'].map(k=>({name:k+'.json',mimeType:'application/json',buffer:Buffer.from(JSON.stringify(original[k]))})));await page.waitForFunction(()=>libraries.enemies.enemies[0].name==='Giant Rats');check(await page.evaluate(()=>libraries.enemies.enemies[0].name==='Giant Rats'&&libraries.dungeons.dungeons[0].coinReward.base===3));
 const before=await page.evaluate(()=>JSON.stringify(libraries));await page.locator('#files').setInputFiles({name:'bad.json',mimeType:'application/json',buffer:Buffer.from('{broken')});await page.waitForFunction(()=>document.querySelector('#message').textContent.startsWith('Files were not loaded'));check(await page.evaluate(()=>JSON.stringify(libraries))===before);
 await tab('Keywords');await page.getByRole('button',{name:'+ Add entry',exact:true}).click();await page.getByLabel('Keyword',{exact:true}).fill('<img src=x onerror=alert(1)>');await page.getByLabel('Category',{exact:true}).fill('Test');await page.getByRole('button',{name:'Apply entry',exact:true}).click();check(await page.locator('#entries img').count()===0);
 await page.setViewportSize({width:390,height:844});check(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));await tab('Enemies');check(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));assert.deepEqual(errors,[]);
 console.log(`PASS: ${checks} checks (standalone startup, validation, references, presets, editing, import, download, direct save, escaping, mobile width)`);
 }finally{await browser.close()}
})().catch(e=>{console.error(e);process.exitCode=1});
