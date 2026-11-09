import {validateItemLibrary,validateUniqueNames} from '../game/definitions';
import type {EnemyLibrary,KeywordLibrary,DungeonLibrary,ItemLibrary} from '../game/types';
import {validateEnemyLibrary,validateKeywordCatalog,validateDungeonLibrary} from '../game/rules';
import {readRecord,writeRecord} from './storage';
export interface LibraryBundle {enemies:EnemyLibrary;keywords:KeywordLibrary;dungeons:DungeonLibrary;items?:ItemLibrary;loadedAt:number}
function validate(bundle:LibraryBundle):LibraryBundle {const enemies=validateEnemyLibrary(bundle.enemies),keywords=validateKeywordCatalog(bundle.keywords),dungeons=validateDungeonLibrary(bundle.dungeons,enemies.enemies);validateUniqueNames(enemies.enemies);const items=validateItemLibrary(bundle.items??{format:'quest-for-glory-items',version:1,items:[]});return {enemies,keywords,dungeons,items,loadedAt:bundle.loadedAt}}
export async function loadLibraries(db:IDBDatabase):Promise<{bundle:LibraryBundle;notice:string}>{
  try{const files=['enemies','keywords','dungeons','items'];const values=await Promise.all(files.map(async name=>{const response=await fetch(new URL(`data/${name}.json`,document.baseURI),{cache:'no-store',signal:AbortSignal.timeout(5000)});if(!response.ok)throw Error(`Cannot load ${name}: ${response.status}`);return response.json()}));const bundle=validate({enemies:values[0],keywords:values[1],dungeons:values[2],items:values[3],loadedAt:Date.now()});await writeRecord(db,'libraries',bundle);return {bundle,notice:''}}
  catch(error){const saved=await readRecord<LibraryBundle>(db,'libraries');if(saved)return {bundle:validate(saved),notice:`Using the last validated libraries (${new Date(saved.loadedAt).toLocaleString()}). ${navigator.onLine?'The current JSON files could not be loaded or validated.':'You are offline.'}`};throw new Error('No valid game libraries are available yet. Open the app online once, and check data/enemies.json, keywords.json, dungeons.json and items.json. '+String(error))}
}
