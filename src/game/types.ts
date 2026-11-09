export interface Equipment {type:'weapon'|'armor';modifier:number;usage:boolean[]}
export interface Item {name:string;description:string;keywords:string[];baseValue:number;equipment?:Equipment|null}
export interface EnemyCard {id:string;name:string;boss:boolean;description:string;CV:number;WV:number;F:number;C:number;KW:string[];Item:Item|null}
export interface EnemyLibrary {format:'quest-for-glory-enemy-cards';version:number;enemies:EnemyCard[]}
export interface KeywordEntry {keyword:string;category:string;uses:Array<'weapon'|'armor'|'generic'>}
export interface KeywordLibrary {format:'quest-for-glory-keywords';version:number;keywords:KeywordEntry[]}
export interface DungeonDefinition {id:string;name:string;type:string;description:string;maxLevel:number;challenge:{base:number;perLevel:number};monsterChance:{base:number;die:number;thresholdPerLevel:number};coinReward:{base:number;perLevel:number};encounters:Array<{rolls:number[];enemyId:string}>;boss:{level:number;enemyId:string};treasure:Item|null;timing?:unknown}
export interface DungeonLibrary {format:'quest-for-glory-dungeons';version:number;dungeons:DungeonDefinition[]}

export type {ItemLibrary,CustomDefinition} from "./definitions";
