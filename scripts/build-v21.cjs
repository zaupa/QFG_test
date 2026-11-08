#!/usr/bin/env node
'use strict';
const fs=require('node:fs'),path=require('node:path');
const {validateEnemyLibrary}=require('./enemy-library.cjs');
const root=path.resolve(__dirname,'..'),args=process.argv.slice(2);
let dataFile=path.join(root,'data/enemies.json'),output=path.join(root,'board_game_tracker_v21.html');
for(let i=0;i<args.length;i++){if(args[i]==='--data'&&args[i+1])dataFile=path.resolve(args[++i]);else if(args[i]==='--output'&&args[i+1])output=path.resolve(args[++i]);else throw Error('Usage: node scripts/build-v21.cjs [--data FILE] [--output FILE]')}
try{
 const library=validateEnemyLibrary(JSON.parse(fs.readFileSync(dataFile,'utf8')));
 let html=fs.readFileSync(path.join(root,'board_game_tracker_v21.html'),'utf8');
 const escapeJSON=text=>text.replace(/</g,'\\u003c').replace(/>/g,'\\u003e').replace(/&/g,'\\u0026').replace(/\u2028/g,'\\u2028').replace(/\u2029/g,'\\u2029');
 const dataPattern=/<script id="enemyLibraryData" type="application\/json">[\s\S]*?<\/script>/;
 const rulesPattern=/\/\/ BEGIN ENEMY DATA RULES[\s\S]*?\/\/ END ENEMY DATA RULES/;
 if(!dataPattern.test(html)||!rulesPattern.test(html))throw Error('V21 HTML build markers are missing');
 const rules=fs.readFileSync(path.join(__dirname,'enemy-library.cjs'),'utf8').split('// NODE EXPORTS')[0];
 html=html.replace(dataPattern,()=>'<script id="enemyLibraryData" type="application/json">'+escapeJSON(JSON.stringify(library,null,2))+'</script>');
 html=html.replace(rulesPattern,()=>'// BEGIN ENEMY DATA RULES\n'+rules+'// END ENEMY DATA RULES');
 const temporary=output+'.'+process.pid+'.tmp';
 try{fs.writeFileSync(temporary,html,{flag:'wx'});fs.renameSync(temporary,output)}finally{if(fs.existsSync(temporary))fs.unlinkSync(temporary)}
 console.log('Built '+output+' with '+library.enemies.length+' validated enemies.');
}catch(error){console.error('Build failed: '+error.message);process.exitCode=1}
