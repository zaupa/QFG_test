'use strict';
// Pure rules shared by the library build and the standalone application.
function keywordText(keywords){return keywords.join(' - ')}
function parseKeywordInput(text){if(String(text).includes(','))throw Error('Commas are not allowed in keywords. Separate keywords with "-".');return String(text).split('-').map(s=>s.trim()).filter(Boolean)}
function normalizeKeywords(value,legacy=false){
 if(legacy&&(value==null||typeof value==='string'))return value==null||!value.trim()?[]:value.split(/\s+-\s+|,/).map(s=>s.trim()).filter(Boolean);
 if(!Array.isArray(value)||value.some(s=>typeof s!=='string'||!s.trim()))throw Error('Keywords must be an array of nonempty text values');
 if(legacy)return value.flatMap(s=>s.split(/\s+-\s+|,/)).map(s=>s.trim()).filter(Boolean);
 if(value.some(s=>s.includes(',')))throw Error('Commas are not allowed in keywords');
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
 if(!Array.isArray(usage)||usage.length!==4||usage.some(v=>typeof v!=='boolean'))throw Error('Equipment needs four usage points');
 return {type:e.type,modifier:e.modifier,usage:[...usage]};
}
function usableEquipment(item){return !!(item?.equipment&&item.equipment.usage.some(Boolean))}
function weaponBonusFor(character){return usableEquipment(character.equipment?.weapon)?character.equipment.weapon.equipment.modifier:0}
function armorReductionFor(character,wound){return usableEquipment(character.equipment?.armor)?Math.min(wound,character.equipment.armor.equipment.modifier):0}
function keywordKey(text){return text.trim().replace(/\s+/g,' ').toLowerCase()}
function hasKeyword(item,word){return !!item?.keywords?.some(k=>keywordKey(k)===keywordKey(word))}
function enemyAssociations(keywords){
 const seen=new Set(),effects=[];
 for(const text of keywords){const match=/^(unprotected|resistant|weak|strong)\s+(?:against\s+)?(.+)$/i.exec(text.trim());if(!match)continue;
  const kind=match[1].toLowerCase(),target=keywordKey(match[2]),key=kind+':'+target;
  if(!target||seen.has(key))continue;seen.add(key);effects.push({kind,target});
 }return effects;
}
function combatValuesFor(character,attempt=character.combat?.attempt??0){
 const c=character.combat,enemy=c.enemy,matches=[];let cvDelta=0,wvDelta=0;
 for(const effect of enemyAssociations(enemy.KW)){
  const defense=['unprotected','resistant'].includes(effect.kind),item=character.equipment?.[defense?'weapon':'armor'];
  if(!usableEquipment(item)||!hasKeyword(item,effect.target))continue;
  const delta=effect.kind==='unprotected'?-6:effect.kind==='resistant'?6:effect.kind==='weak'?-2:2;
  if(defense)cvDelta+=delta;else wvDelta+=delta;
  matches.push({...effect,stat:defense?'CV':'WV',delta});
 }
 const baseCV=Math.max(1,enemy.CV+cvDelta),wv=Math.max(0,enemy.WV+wvDelta),cv=Math.max(1,baseCV-2*attempt);
 if(!Number.isSafeInteger(baseCV)||!Number.isSafeInteger(wv)||!Number.isSafeInteger(cv+6))throw Error('Combat keyword values exceed the supported range');
 return {baseCV,cv,wv,cvDelta,wvDelta,matches};
}
function validateKeywordCatalog(data){
 if(!data||data.format!=='quest-for-glory-keywords'||data.version!==1||!Array.isArray(data.keywords))throw Error('Invalid keyword catalog');
 const seen=new Set(),keywords=data.keywords.map(entry=>{
  if(!entry||typeof entry.keyword!=='string'||!entry.keyword.trim()||/[,\-]/.test(entry.keyword)||typeof entry.category!=='string'||!entry.category.trim()||!Array.isArray(entry.uses)||!entry.uses.length||entry.uses.some(u=>!['weapon','armor','generic'].includes(u))||new Set(entry.uses).size!==entry.uses.length)throw Error('Invalid keyword suggestion');
  const keyword=entry.keyword.trim(),category=entry.category.trim(),key=keywordKey(keyword)+':'+keywordKey(category);
  if(seen.has(key))throw Error('Duplicate keyword suggestion');seen.add(key);return {keyword,category,uses:[...entry.uses]};
 });return {format:data.format,version:1,keywords};
}
function validateEnemyCard(card,legacy=false){
 const keys=['id','name','description','CV','WV','F','C','KW','Item'];
 if(!card||typeof card!=='object'||Array.isArray(card)||keys.some(k=>!Object.prototype.hasOwnProperty.call(card,k))||Object.keys(card).some(k=>!keys.includes(k)))throw Error('Enemy card has missing or unexpected fields');
 if(typeof card.name!=='string'||!card.name.trim()||card.id!==card.name||typeof card.description!=='string')throw Error('Enemy id must match its name; description must be text');
 for(const [key,min]of [['CV',1],['WV',0],['F',0],['C',0]])if(!Number.isSafeInteger(card[key])||card[key]<min)throw Error('Invalid enemy '+key);
 const associations=enemyAssociations(normalizeKeywords(card.KW,legacy));
 if(card.WV>Number.MAX_SAFE_INTEGER-2*associations.filter(a=>a.kind==='strong').length)throw Error('Enemy WV is too large for keyword effects');
 if(card.CV>Number.MAX_SAFE_INTEGER-6-6*associations.filter(a=>a.kind==='resistant').length)throw Error('Enemy CV is too large for the modifier');
 return {id:card.id,name:card.name,description:card.description,CV:card.CV,WV:card.WV,F:card.F,C:card.C,KW:normalizeKeywords(card.KW,legacy),Item:card.Item===null?null:normalizeItem(card.Item,legacy)};
}
function validateEnemyLibrary(data){
 if(!data||data.format!=='quest-for-glory-enemy-cards'||data.version!==4||!Array.isArray(data.enemies))throw Error('Invalid enemy library format');
 const enemies=data.enemies.map(card=>validateEnemyCard(card)),ids=new Set();
 for(const enemy of enemies){if(ids.has(enemy.id))throw Error('Duplicate enemy name: '+enemy.id);ids.add(enemy.id)}
 return {format:data.format,version:4,enemies};
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
module.exports={keywordText,parseKeywordInput,normalizeKeywords,normalizeItem,validateEnemyCard,validateEnemyLibrary,migrateCombatEnemy,copyItem,normalizeEquipment,usableEquipment,weaponBonusFor,armorReductionFor,keywordKey,hasKeyword,enemyAssociations,combatValuesFor,validateKeywordCatalog};
