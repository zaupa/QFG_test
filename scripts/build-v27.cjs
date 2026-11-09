#!/usr/bin/env node
'use strict';
const fs=require('node:fs'),path=require('node:path');
const {validateEnemyLibrary,validateKeywordCatalog,validateDungeonLibrary}=require('./enemy-library-v27.cjs');
const root=path.resolve(__dirname,'..'),args=process.argv.slice(2);
let dungeonsFile=path.join(root,'data/dungeons.json');
let audioFile=path.join(root,'audio/medieval_fantasy_victory_fanfare_3s.wav');
let keywordsFile=path.join(root,'data/keywords.json');
let dataFile=path.join(root,'data/enemies.json'),output=path.join(root,'board_game_tracker_v27.html');
for(let i=0;i<args.length;i++){if(args[i]==='--data'&&args[i+1])dataFile=path.resolve(args[++i]);else if(args[i]==='--dungeons'&&args[i+1])dungeonsFile=path.resolve(args[++i]);else if(args[i]==='--audio'&&args[i+1])audioFile=path.resolve(args[++i]);else if(args[i]==='--keywords'&&args[i+1])keywordsFile=path.resolve(args[++i]);else if(args[i]==='--output'&&args[i+1])output=path.resolve(args[++i]);else throw Error('Usage: node scripts/build-v27.cjs [--data FILE] [--dungeons FILE] [--keywords FILE] [--audio FILE] [--output FILE]')}
try{
 const library=validateEnemyLibrary(JSON.parse(fs.readFileSync(dataFile,'utf8')));
 const dungeons=validateDungeonLibrary(JSON.parse(fs.readFileSync(dungeonsFile,'utf8')),library.enemies);
 const catalog=validateKeywordCatalog(JSON.parse(fs.readFileSync(keywordsFile,'utf8')));
 const sound=fs.readFileSync(audioFile);if(sound.length<44||sound.toString('ascii',0,4)!=='RIFF'||sound.toString('ascii',8,12)!=='WAVE'||sound.readUInt32LE(4)+8!==sound.length)throw Error('Invalid victory WAV file');
 let html=fs.readFileSync(path.join(root,'board_game_tracker_v27.html'),'utf8');
 const escapeJSON=text=>text.replace(/</g,'\\u003c').replace(/>/g,'\\u003e').replace(/&/g,'\\u0026').replace(/\u2028/g,'\\u2028').replace(/\u2029/g,'\\u2029');
 const dataPattern=/<script id="enemyLibraryData" type="application\/json">[\s\S]*?<\/script>/;
 const catalogPattern=/<script id="keywordCatalogData" type="application\/json">[\s\S]*?<\/script>/;
 const audioPattern=/<audio id="combatVictorySound"[\s\S]*?<\/audio>/;
 const dungeonPattern=/<script id="dungeonLibraryData" type="application\/json">[\s\S]*?<\/script>/;
 const rulesPattern=/\/\/ BEGIN ENEMY DATA RULES[\s\S]*?\/\/ END ENEMY DATA RULES/;
 if(!dataPattern.test(html)||!rulesPattern.test(html)||!catalogPattern.test(html)||!audioPattern.test(html)||!dungeonPattern.test(html))throw Error('V27 HTML build markers are missing');
 const rules=fs.readFileSync(path.join(__dirname,'enemy-library-v27.cjs'),'utf8').split('// NODE EXPORTS')[0];
 html=html.replace(dataPattern,()=>'<script id="enemyLibraryData" type="application/json">'+escapeJSON(JSON.stringify(library,null,2))+'</script>');
 html=html.replace(catalogPattern,()=>'<script id="keywordCatalogData" type="application/json">'+escapeJSON(JSON.stringify(catalog,null,2))+'</script>');
 html=html.replace(dungeonPattern,()=>'<script id="dungeonLibraryData" type="application/json">'+escapeJSON(JSON.stringify(dungeons,null,2))+'</script>');
 html=html.replace(audioPattern,()=>'<audio id="combatVictorySound" preload="auto" src="data:audio/wav;base64,'+sound.toString('base64')+'"></audio>');
 html=html.replace(rulesPattern,()=>'// BEGIN ENEMY DATA RULES\n'+rules+'// END ENEMY DATA RULES');
 const temporary=output+'.'+process.pid+'.tmp';
 try{fs.writeFileSync(temporary,html,{flag:'wx'});fs.renameSync(temporary,output)}finally{if(fs.existsSync(temporary))fs.unlinkSync(temporary)}
 console.log('Built '+output+' with '+library.enemies.length+' validated enemies.');
}catch(error){console.error('Build failed: '+error.message);process.exitCode=1}
