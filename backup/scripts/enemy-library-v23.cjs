'use strict';
// Pure rules shared by the library build and the standalone application.
function keywordText(keywords){return keywords.join(' - ')}
function parseKeywordInput(text){if(String(text).includes(','))throw Error('Commas are not allowed in keywords. Separate keywords with "-".');return String(text).split('-').map(s=>s.trim()).filter(Boolean)}
function normalizeKeywords(value,legacy=false){
 if(legacy&&(value==null||typeof value==='string'))return value==null||!value.trim()?[]:value.split(/\s+-\s+/).map(s=>s.trim()).filter(Boolean);
 if(!Array.isArray(value)||value.some(s=>typeof s!=='string'||!s.trim()))throw Error('Keywords must be an array of nonempty text values');
 if(!legacy&&value.some(s=>s.includes(',')))throw Error('Commas are not allowed in keywords');
 return value.map(s=>s.trim());
}
function normalizeItem(item,legacy=false){
 if(!item||typeof item!=='object'||Array.isArray(item))throw Error('Invalid item');
 const keywords=normalizeKeywords(item.keywords,legacy),baseValue=legacy&&item.baseValue==null?1:item.baseValue;
 const description=item.description==null?'':item.description;
 if(typeof description!=='string')throw Error('Item Description must be text');
 let name=item.name;
 if(legacy&&name==null)name=description.trim()||keywordText(keywords)||'Item';
 if(typeof name!=='string'||!name.trim()||name.length>300)throw Error('Item Name is required (maximum 300 characters)');
 if(!Number.isSafeInteger(baseValue)||baseValue<0)throw Error('Invalid item Base Value');
 if(description.length+keywordText(keywords).length>300)throw Error('Item Description and Keywords exceed 300 characters');
 const normalized={name:name.trim(),description,keywords,baseValue};
 if(item.equipment!=null)normalized.equipment=normalizeEquipment(item.equipment);
 return normalized;
}
function normalizeEquipment(e){
 if(!e||typeof e!=='object'||Array.isArray(e)||!['weapon','armor'].includes(e.type))throw Error('Choose Weapon or Armor');
 if(!Number.isSafeInteger(e.modifier)||e.modifier<1||e.modifier>Number.MAX_SAFE_INTEGER-364)throw Error('Modifier must be a positive supported whole number');
 const usage=e.usage===undefined?[true,true,true,true]:e.usage;
 const enabled=e.enabled===undefined?true:e.enabled;
 if(!Array.isArray(usage)||usage.length!==4||usage.some(v=>typeof v!=='boolean')||typeof enabled!=='boolean')throw Error('Equipment needs four usage points and an enabled status');
 return {type:e.type,modifier:e.modifier,usage:[...usage],enabled:usage.some(Boolean)&&enabled};
}
function usableEquipment(item){return !!(item?.equipment?.enabled&&item.equipment.usage.some(Boolean))}
function weaponBonusFor(character){return usableEquipment(character.equipment?.weapon)?character.equipment.weapon.equipment.modifier:0}
function armorReductionFor(character,wound){return usableEquipment(character.equipment?.armor)?Math.min(wound,character.equipment.armor.equipment.modifier):0}
function validateEnemyCard(card,legacy=false){
 const keys=['id','name','description','CV','WV','F','C','KW','Item'];
 if(!card||typeof card!=='object'||Array.isArray(card)||keys.some(k=>!Object.prototype.hasOwnProperty.call(card,k))||Object.keys(card).some(k=>!keys.includes(k)))throw Error('Enemy card has missing or unexpected fields');
 if(typeof card.name!=='string'||!card.name.trim()||card.id!==card.name||typeof card.description!=='string')throw Error('Enemy id must match its name; description must be text');
 for(const [key,min]of [['CV',1],['WV',0],['F',0],['C',0]])if(!Number.isSafeInteger(card[key])||card[key]<min)throw Error('Invalid enemy '+key);
 if(card.CV>Number.MAX_SAFE_INTEGER-6)throw Error('Enemy CV is too large for the modifier');
 return {id:card.id,name:card.name,description:card.description,CV:card.CV,WV:card.WV,F:card.F,C:card.C,KW:normalizeKeywords(card.KW,legacy),Item:card.Item===null?null:normalizeItem(card.Item,legacy)};
}
function validateEnemyLibrary(data){
 if(!data||data.format!=='quest-for-glory-enemy-cards'||data.version!==3||!Array.isArray(data.enemies))throw Error('Invalid enemy library format');
 const enemies=data.enemies.map(card=>validateEnemyCard(card)),ids=new Set();
 for(const enemy of enemies){if(ids.has(enemy.id))throw Error('Duplicate enemy name: '+enemy.id);ids.add(enemy.id)}
 return {format:data.format,version:3,enemies};
}
function migrateCombatEnemy(enemy,base,wound){
 if(enemy&&Object.prototype.hasOwnProperty.call(enemy,'CV')){
  const card=validateEnemyCard(enemy,true);if(card.CV!==base||card.WV!==wound)throw Error('Enemy CV/WV do not match the encounter');return card;
 }
 const old=enemy||{name:'Enemy',fateReward:0,coinReward:0,itemReward:null};
 if(typeof old.name!=='string'||!old.name.trim())throw Error('Invalid enemy name');
 return validateEnemyCard({id:old.name,name:old.name,description:typeof old.description==='string'?old.description:'',CV:base,WV:wound,F:old.fateReward,C:old.coinReward,KW:normalizeKeywords(old.keywords,true),Item:old.itemReward==null?null:normalizeItem(old.itemReward,true)},true);
}
function copyItem(item){return {...item,keywords:[...item.keywords],...(item.equipment?{equipment:{...item.equipment,usage:[...item.equipment.usage]}}:{})}}
// NODE EXPORTS
module.exports={keywordText,parseKeywordInput,normalizeKeywords,normalizeItem,validateEnemyCard,validateEnemyLibrary,migrateCombatEnemy,copyItem,normalizeEquipment,usableEquipment,weaponBonusFor,armorReductionFor};
