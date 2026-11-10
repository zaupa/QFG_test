import {validateWorld,type WorldLibraries} from '../game/world';
import {validateItemLibrary,validateUniqueNames} from '../game/definitions';
import type {EnemyLibrary,KeywordLibrary,DungeonLibrary,ItemLibrary} from '../game/types';
import {validateEnemyLibrary,validateKeywordCatalog,validateDungeonLibrary} from '../game/rules';
import {readRecord,writeRecord} from './storage';
export interface LibraryBundle {enemies:EnemyLibrary;keywords:KeywordLibrary;dungeons:DungeonLibrary;items?:ItemLibrary;world?:WorldLibraries;loadedAt:number;recoveryVersion?:1}
const reason=(error:unknown)=>error instanceof Error?error.message:String(error);
function fromFile<T>(name:string,read:()=>T):T{try{return read()}catch(error){throw Error(name+': '+reason(error))}}
function validate(bundle:LibraryBundle):LibraryBundle {
 const enemies=fromFile('enemies.json',()=>{const result=validateEnemyLibrary(bundle.enemies);validateUniqueNames(result.enemies);return result});
 const keywords=fromFile('keywords.json',()=>validateKeywordCatalog(bundle.keywords));
 const dungeons=fromFile('dungeons.json',()=>validateDungeonLibrary(bundle.dungeons,enemies.enemies));
 const items=fromFile('items.json',()=>validateItemLibrary(bundle.items??{format:'quest-for-glory-items',version:1,items:[]}));
 const world=bundle.world?fromFile('adventure libraries',()=>validateWorld(bundle.world,dungeons.dungeons,enemies.enemies)):undefined;
 return {enemies,keywords,dungeons,items,world,loadedAt:bundle.loadedAt,recoveryVersion:1};
}
// Only cached pre-V31 bundles receive the former default healing amount.
// Network definitions stay strict so an incomplete JSON edit cannot replace valid data.
function migrateCached(bundle:LibraryBundle):LibraryBundle{if(bundle.recoveryVersion===1)return bundle;const copy=JSON.parse(JSON.stringify(bundle));const item=(value:any)=>{if(Array.isArray(value?.keywords)&&value.keywords.some((word:unknown)=>typeof word==='string'&&word.trim().toLowerCase()==='heal')&&value.healingAmount==null)value.healingAmount=5};for(const value of copy.items?.items??[])item(value);for(const value of copy.enemies?.enemies??[])item(value.Item);for(const value of copy.dungeons?.dungeons??[])item(value.treasure);return copy}
export async function loadLibraries(db:IDBDatabase):Promise<{bundle:LibraryBundle;notice:string}>{
 try{
  const files=['enemies','keywords','dungeons','items','terrain-types','cities','maps','adventure-modules'];
  const values=await Promise.all(files.map(async name=>{const filename=`${name}.json`;try{const url=new URL(`data/${filename}`,document.baseURI);const response=await fetch(url,{cache:'no-store',signal:AbortSignal.timeout(5000)});if(!response.ok)throw Error(`HTTP ${response.status} at ${url.href}`);return await response.json()}catch(error){throw Error(filename+': '+reason(error))}}));
  const bundle=validate({enemies:values[0],keywords:values[1],dungeons:values[2],items:values[3],world:{terrains:values[4],cities:values[5],maps:values[6],adventures:values[7]},loadedAt:Date.now()});
  await writeRecord(db,'libraries',bundle);return {bundle,notice:''};
 }catch(error){
  const saved=await readRecord<LibraryBundle>(db,'libraries');
  if(saved)return {bundle:validate(migrateCached(saved)),notice:`Using the last validated libraries (${new Date(saved.loadedAt).toLocaleString()}). ${navigator.onLine?'The server files could not be loaded or validated.':'You are offline.'} ${reason(error)}`};
  throw Error('No valid game libraries are available yet. Open the app online once, and check the served data files. '+reason(error));
 }
}
