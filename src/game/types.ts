export interface Equipment {type:'weapon'|'armor';modifier:number;usage:boolean[]}
export interface Item {name:string;description:string;keywords:string[];baseValue:number;healingAmount?:number;equipment?:Equipment|null}
export interface EnemyCard {id:string;name:string;boss:boolean;description:string;CV:number;WV:number;F:number;C:number;KW:string[];Item:Item|null}
export interface EnemyLibrary {format:'quest-for-glory-enemy-cards';version:number;enemies:EnemyCard[]}
export interface KeywordEntry {keyword:string;category:string;uses:Array<'weapon'|'armor'|'generic'>}
export interface KeywordLibrary {format:'quest-for-glory-keywords';version:number;keywords:KeywordEntry[]}
export interface DungeonDefinition {id:string;name:string;type:string;description:string;maxLevel:number;completionFateReward?:number;challenge:{base:number;perLevel:number};monsterChance:{base:number;die:number;thresholdPerLevel:number};coinReward:{base:number;perLevel:number};encounters:Array<{rolls:number[];enemyId:string}>;boss:{level:number;enemyId:string};treasure:Item|null;timing?:unknown}
export interface DungeonLibrary {format:'quest-for-glory-dungeons';version:number;dungeons:DungeonDefinition[]}

export type {ItemLibrary,CustomDefinition} from "./definitions";

export type RestType='Bad'|'Partial'|'Complete';
export interface RestPlan {level:0|1|2;recovery:5|15|30;location:'normal'|'dungeon'|'inn';cost:number;supply:0|1;wound:boolean}
export interface CityVisit {id?:string;definition?:import('./world').CityDefinition;action:''|'blacksmith'|'shop'|'inn'|'guild'|'temple'}

export type CharacterPosition={type:'wilderness';spaceId:string|null}|{type:'city';cityId:string;spaceId:string|null}|{type:'dungeon';dungeonId:string;spaceId:string|null};

export type MeepleId='hero'|'ranger'|'spellcaster';
export interface PendingTravel {origin:import('./world').MapTile;destination:import('./world').MapTile;cv:number;dangerLevel:number;enemies:EnemyCard[];stage:'challenge'|'encounter'|'combat';roll:number|null;enemyIndex:number|null}
export interface AdventureProgress {adventureActions:0|1|2;restOfferPending:boolean;meeple:MeepleId;pendingTravel:PendingTravel|null}
