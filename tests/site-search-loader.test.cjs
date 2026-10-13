const assert=require('node:assert/strict');
const test=require('node:test');
let loader;
try {loader=require('../assets/js/site-search-loader.js');} catch(_) {}
const entries=[{url:'/es/',lang:'es'},{url:'/cv/',lang:'en'},{url:'/publication/covid/',lang:'en',collection:'publications'}];
test('a failed source does not hide results from available pages',async()=>{
  assert.equal(typeof loader?.load,'function');
  const result=await loader.load(entries,'es',async entry=>{if(entry.collection)throw new Error('Unavailable');return entry.url;},(html,entry)=>[{text:html,url:entry.url}]);
  assert.deepEqual(result.passages,[{text:'/es/',url:'/es/'}]);
  assert.deepEqual(result.failedSources,['/publication/covid/']);
});
test('all unavailable sources produce an error instead of an empty successful search',async()=>{
  await assert.rejects(loader.load(entries,'es',async()=>{throw new Error('Unavailable');},()=>[]));
});
test('malformed source HTML is isolated like a network failure',async()=>{
  const result=await loader.load(entries,'es',async entry=>entry.url,(html,entry)=>entry.collection?[]:[{text:html,url:entry.url}]);
  assert.equal(result.passages.length,1);
  assert.equal(result.failedSources.length,1);
});
