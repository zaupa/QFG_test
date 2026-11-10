import type {Item} from './types';
import {normalizeItem} from './rules';
import {definitionNameKey} from './definitions';
export interface ShopDefinition {id:string;name:string;sellRate:number;purchaseRate:number;stock:{itemId:string;quantity:number}[]}
export interface ShopLibrary {format:'quest-for-glory-shops';version:1;shops:ShopDefinition[]}
export interface ShopState {id:string;name:string;sellRate:number;purchaseRate:number;stock:{item:Item;quantity:number}[]}
const whole=(n:unknown)=>Number.isSafeInteger(n)&&Number(n)>=0;
export function shopPrice(base:number,rate:number,round:'up'|'down'):number {
 if(!whole(base)||typeof rate!=='number'||!Number.isFinite(rate)||rate<0)throw Error('Invalid item value or shop rate');
 const [digits,exponent='0']=rate.toString().toLowerCase().split('e'),parts=digits.split('.');
 const power=Number(exponent)-(parts[1]?.length??0),numerator=BigInt(parts.join(''))*(power>0?10n**BigInt(power):1n),denominator=power<0?10n**BigInt(-power):1n;
 const product=BigInt(base)*numerator,result=product/denominator+(round==='up'&&product%denominator!==0n?1n:0n);
 if(result>BigInt(Number.MAX_SAFE_INTEGER))throw Error('Shop price exceeds the supported limit');return Number(result);
}
export function validateShops(value:unknown,items:Item[]):ShopLibrary {
 const data=value as ShopLibrary;
 if(!data||data.format!=='quest-for-glory-shops'||data.version!==1||!Array.isArray(data.shops))throw Error('Invalid shop library');
 const ids=new Set<string>();for(const shop of data.shops){if(!shop||typeof shop.id!=='string'||!/^[a-z0-9][a-z0-9_-]*$/i.test(shop.id)||ids.has(shop.id)||typeof shop.name!=='string'||!shop.name.trim()||!Array.isArray(shop.stock))throw Error('Invalid or duplicate shop');ids.add(shop.id);shopPrice(0,shop.sellRate,'up');shopPrice(0,shop.purchaseRate,'down');const seen=new Set<string>();for(const row of shop.stock){if(!row||typeof row.itemId!=='string'||seen.has(definitionNameKey(row.itemId))||!whole(row.quantity))throw Error('Invalid shop stock');const item=items.find(i=>definitionNameKey(i.name)===definitionNameKey(row.itemId));if(!item)throw Error('Unknown shop item: '+row.itemId);seen.add(definitionNameKey(row.itemId));shopPrice(item.baseValue,shop.sellRate,'up');shopPrice(item.baseValue,shop.purchaseRate,'down')}}
 return JSON.parse(JSON.stringify(data));
}
export function createShop(shop:ShopDefinition,items:Item[]):ShopState{return {id:shop.id,name:shop.name,sellRate:shop.sellRate,purchaseRate:shop.purchaseRate,stock:shop.stock.map(row=>({item:normalizeItem(items.find(i=>definitionNameKey(i.name)===definitionNameKey(row.itemId))),quantity:row.quantity}))}}
export function stockKey(item:Item):string {const normalized=normalizeItem(item);normalized.name=definitionNameKey(normalized.name);normalized.keywords=[...normalized.keywords].sort();return JSON.stringify(normalized)}
export function validateShopStates(value:unknown):ShopState[]{if(value==null)return [];if(!Array.isArray(value))throw Error('Invalid saved shops');const ids=new Set<string>();return value.map(shop=>{if(!shop||typeof shop.id!=='string'||!/^[a-z0-9][a-z0-9_-]*$/i.test(shop.id)||ids.has(shop.id)||typeof shop.name!=='string'||!shop.name.trim()||!Array.isArray(shop.stock))throw Error('Invalid saved shop');ids.add(shop.id);shopPrice(0,shop.sellRate,'up');shopPrice(0,shop.purchaseRate,'down');const seen=new Set<string>();return {id:shop.id,name:shop.name,sellRate:shop.sellRate,purchaseRate:shop.purchaseRate,stock:shop.stock.map(row=>{const item=normalizeItem(row.item),key=stockKey(item);if(!whole(row.quantity)||seen.has(key))throw Error('Invalid saved stock');seen.add(key);shopPrice(item.baseValue,shop.sellRate,'up');shopPrice(item.baseValue,shop.purchaseRate,'down');return {item,quantity:row.quantity}})}})}
