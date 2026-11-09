import {readRecord,writeRecord} from './storage';
declare const __GAME_LAYOUT_HASH__:string;
const key='game-layout:'+__GAME_LAYOUT_HASH__;
async function valid(markup:unknown):Promise<boolean>{if(typeof markup!=='string')return false;const digest=await crypto.subtle.digest('SHA-256',new TextEncoder().encode(markup));return Array.from(new Uint8Array(digest),byte=>byte.toString(16).padStart(2,'0')).join('')===__GAME_LAYOUT_HASH__}
export async function loadGameLayout(db:IDBDatabase):Promise<string>{
 try{const response=await fetch(new URL('app/game.html',document.baseURI),{signal:AbortSignal.timeout(5000)});if(!response.ok)throw Error('Interface request failed: '+response.status);const markup=await response.text();if(!await valid(markup))throw Error('The interface does not match this app version.');await writeRecord(db,key,markup);return markup}
 catch{const saved=await readRecord<string>(db,key);if(await valid(saved))return saved;throw Error('The game interface (app/game.html) is not available offline for this app version. Restart your server at the same address and port, then click Retry. Your character storage has not been cleared.')}
}
