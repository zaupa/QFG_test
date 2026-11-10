export const DUNGEON_CHALLENGES=[
 {id:'trap',name:'Trap',allowed:['H','S','D'],attributes:'Body and Mind'},
 {id:'puzzle',name:'Puzzle',allowed:['S','C','D'],attributes:'Mind and Cunning'},
 {id:'physical-barrier',name:'Physical Barrier',allowed:['H','D'],attributes:'Body'},
 {id:'magical-barrier',name:'Magical Barrier',allowed:['S','D'],attributes:'Mind'},
 {id:'deceiving-encounter',name:'Deceiving Encounter',allowed:['C','D'],attributes:'Cunning'}
];
export function dungeonChallenge(id:string){const type=DUNGEON_CHALLENGES.find(t=>t.id===id);if(!type)throw Error('Invalid dungeon Challenge type');return type}
export function rollDungeonChallenge(){return DUNGEON_CHALLENGES[Math.floor(Math.random()*DUNGEON_CHALLENGES.length)].id}
export function weightedEnemyIndex(weights:number[],random=Math.random()):number {if(!weights.length||weights.some(w=>!Number.isInteger(w)||w<1||w>4)||!Number.isFinite(random)||random<0||random>=1)throw Error('Invalid encounter weights or roll');let roll=random*weights.reduce((sum,w)=>sum+w,0);for(let i=0;i<weights.length;i++){roll-=weights[i];if(roll<0)return i}return weights.length-1}
export function validateEnemyWeights(weights:Record<string,number>|undefined,ids:string[]){if(weights===undefined)return;if(!weights||typeof weights!=='object'||Array.isArray(weights))throw Error('Invalid enemy weights');for(const [id,weight]of Object.entries(weights))if(!ids.includes(id)||!Number.isInteger(weight)||weight<1||weight>4)throw Error('Enemy weights must be integers from 1 to 4 for listed enemies')}
