'use strict';
// Pure rules shared by the library build and the standalone application.
function keywordText(keywords){return keywords.join(' - ')}
function parseKeywordInput(text){return String(text).split(/\s+-\s+/).map(s=>s.trim()).filter(Boolean)}
function normalizeKeywords(value,legacy=false){
 if(legacy&&(value==null||typeof value==='string'))return value==null||!value.trim()?[]:value.split(/\s+-\s+/).map(s=>s.trim()).filter(Boolean);
 if(!Array.isArray(value)||value.some(s=>typeof s!=='string'||!s.trim()))throw Error('Keywords must be an array of nonempty text values');
 return value.map(s=>s.trim());
}
function normalizeItem(item,legacy=false){
 if(!item||typeof item!=='object'||Array.isArray(item)||typeof item.description!=='string')throw Error('Item Description is required');
 const keywords=normalizeKeywords(item.keywords,legacy),baseValue=legacy&&item.baseValue==null?1:item.baseValue;
 if(!item.description.trim()&&(!legacy||!keywords.length))throw Error('Item Description is required');
 if(!Number.isSafeInteger(baseValue)||baseValue<0)throw Error('Invalid item Base Value');
 if(item.description.length+keywordText(keywords).length>300)throw Error('Item Description and Keywords exceed 300 characters');
 return {description:item.description,keywords,baseValue};
}
function validateEnemyCard(card){
 const keys=['id','name','description','CV','WV','F','C','KW','Item'];
 if(!card||typeof card!=='object'||Array.isArray(card)||keys.some(k=>!Object.prototype.hasOwnProperty.call(card,k))||Object.keys(card).some(k=>!keys.includes(k)))throw Error('Enemy card has missing or unexpected fields');
 if(typeof card.name!=='string'||!card.name.trim()||card.id!==card.name||typeof card.description!=='string')throw Error('Enemy id must match its name; description must be text');
 for(const [key,min]of [['CV',1],['WV',0],['F',0],['C',0]])if(!Number.isSafeInteger(card[key])||card[key]<min)throw Error('Invalid enemy '+key);
 if(card.CV>Number.MAX_SAFE_INTEGER-6)throw Error('Enemy CV is too large for the modifier');
 return {id:card.id,name:card.name,description:card.description,CV:card.CV,WV:card.WV,F:card.F,C:card.C,KW:normalizeKeywords(card.KW),Item:card.Item===null?null:normalizeItem(card.Item)};
}
function validateEnemyLibrary(data){
 if(!data||data.format!=='quest-for-glory-enemy-cards'||data.version!==1||!Array.isArray(data.enemies))throw Error('Invalid enemy library format');
 const enemies=data.enemies.map(validateEnemyCard),ids=new Set();
 for(const enemy of enemies){if(ids.has(enemy.id))throw Error('Duplicate enemy name: '+enemy.id);ids.add(enemy.id)}
 return {format:data.format,version:1,enemies};
}
function migrateCombatEnemy(enemy,base,wound){
 if(enemy&&Object.prototype.hasOwnProperty.call(enemy,'CV')){
  const card=validateEnemyCard(enemy);if(card.CV!==base||card.WV!==wound)throw Error('Enemy CV/WV do not match the encounter');return card;
 }
 const old=enemy||{name:'Enemy',fateReward:0,coinReward:0,itemReward:null};
 if(typeof old.name!=='string'||!old.name.trim())throw Error('Invalid enemy name');
 return validateEnemyCard({id:old.name,name:old.name,description:typeof old.description==='string'?old.description:'',CV:base,WV:wound,F:old.fateReward,C:old.coinReward,KW:normalizeKeywords(old.keywords,true),Item:old.itemReward==null?null:normalizeItem(old.itemReward,true)});
}
function copyItem(item){return {...item,keywords:[...item.keywords]}}
// NODE EXPORTS
module.exports={keywordText,parseKeywordInput,normalizeKeywords,normalizeItem,validateEnemyCard,validateEnemyLibrary,migrateCombatEnemy,copyItem};
