const assert = require('node:assert/strict');
const test = require('node:test');
const search = require('../assets/js/site-search-engine.js');
const covid = {title:'Impact of the first booster vaccine against SARS-CoV-2 in Chile',text:'Article on booster vaccination in Chile.',url:'/publication/covid/',collection:'publications',topics:['epidemiología','COVID-19','vacunación']};
const programming={title:'CV',heading:'Programación',text:'Python, PyTorch, Julia, R.',url:'/es/cv/#programacion'};
const clinical={title:'Artificial Intelligence in Medicine',text:'Clinical reasoning and artificial intelligence.',url:'/teaching/medicine/',collection:'teaching',topics:['inteligencia artificial','medicina']};
const corpus=[covid,programming,clinical];

test('common typing errors and transpositions still find the intended source',()=>{
  for(const query of ['epidemiolgia','epidemilogía','covdi','vacunacon']) assert.equal(search.rank(query,corpus)[0].url,covid.url,query);
  assert.equal(search.rank('pyton',corpus)[0].url,programming.url);
  assert.equal(search.rank('inteligencia artifical en medicina',corpus)[0].url,clinical.url);
});
test('partial words find content without requiring another hand-written alias',()=>{
  assert.equal(search.rank('epidem',corpus)[0].url,covid.url);
  assert.equal(search.rank('publicac',corpus)[0].url,covid.url);
  assert.equal(search.rank('progra',corpus)[0].url,programming.url);
});
test('long natural questions ignore conversational wording rather than topic qualifiers',()=>{
  const query='Me gustaría que me contaras un poco acerca de tus publicaciones sobre vacunación en Chile';
  assert.equal(search.rank(query,corpus)[0].url,covid.url);
  assert.deepEqual(search.rank('Me gustaría conocer publicaciones sobre vacunas de dengue',corpus),[]);
});
test('corrections are exposed instead of silently changing the question',()=>{
  const result=search.analyze('pyton',corpus);
  assert.equal(result.results[0].url,programming.url);
  assert.deepEqual(result.corrections.map(({from,to})=>({from,to})),[{from:'pyton',to:'python'}]);
});
test('ambiguous spelling proposes choices without inventing a match',()=>{
  const data=[{title:'CV',text:'Julia',url:'/julia/'},{title:'CV',text:'Julio',url:'/julio/'}];
  const result=search.analyze('julii',data);
  assert.deepEqual(result.results,[]);
  assert.equal(result.corrections.length,0);
  assert.ok(result.suggestions.includes('julia'));
  assert.ok(result.suggestions.includes('julio'));
});
test('short acronyms, dates and unrelated topics are not aggressively autocorrected',()=>{
  for(const query of ['XYZ','2039','dengue','cáncer','vacunas de dengue']) assert.deepEqual(search.rank(query,corpus),[],query);
});
