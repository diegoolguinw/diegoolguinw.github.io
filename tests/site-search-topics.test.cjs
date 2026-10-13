const assert = require('node:assert/strict');
const test = require('node:test');
const search = require('../assets/js/site-search-engine.js');
const covid = {title: 'Impact of the first booster vaccine against SARS-CoV-2 in Chile', text: 'Journal article studying the impact of the first SARS-CoV-2 booster vaccination campaign in Chile.', url: '/publication/booster-vaccine-chile/', sourceKey: '/publication/booster-vaccine-chile/', topics: ['epidemiología', 'COVID-19', 'vacunación', 'salud pública', 'pandemia'], collection: 'publications'};
const profile = {title: 'Sobre mí', heading: 'Investigación actual', text: 'Mi investigación se centra en modelos de Machine Learning multimodales con aplicaciones en epidemiología e imágenes médicas.', url: '/es/#investigacion-actual', sourceKey: '/es/'};
const clinical = {title:'Artificial Intelligence in Medicine', text:'Course on quantitative foundations of artificial intelligence and clinical reasoning.',url:'/teaching/artificial-intelligence-medicine/',topics:['inteligencia artificial', 'medicina', 'razonamiento clínico'],collection:'teaching'};
const pinn = {title:'Currículum vitae',heading:'Experiencia',text:'Optimización bayesiana de redes neuronales informadas por física en Inria Chile.',url:'/es/cv/#experiencia',sourceKey:'/es/cv/'};

test('epidemiology connects the current profile and COVID paper', () => {
  for (const query of ['epidemiología','epidemiology','epidemias','epidemiológico']) {
    const results = search.rank(query,[profile,covid,pinn]);
    assert.ok(results.some(result => result.url === covid.url),query);
    assert.ok(results.some(result => result.url === profile.url),query);
    assert.equal(results.find(result=>result.url===covid.url).related,true);
  }
});
test('Spanish COVID and vaccination queries retrieve the actual paper', () => {
  for (const query of ['coronavirus','COVID-19','SARS CoV 2','vacunas','inmunización','pandemia','public health','¿Tienes papers sobre vacunación?']) {
    assert.equal(search.rank(query,[profile,covid,clinical])[0].url,covid.url,query);
  }
});
test('clinical and bilingual AI phrases retrieve the medicine course', () => {
  for (const query of ['IA en medicina','AI in medicine','razonamiento clínico','clinical reasoning']) {
    assert.equal(search.rank(query,[profile,covid,clinical])[0].url,clinical.url,query);
  }
});
test('technical abbreviations and Spanish/English phrases match source text', () => {
  for (const query of ['PINNs','physics-informed neural networks','optimización bayesiana','Bayesian optimization']) {
    assert.equal(search.rank(query,[profile,pinn,covid])[0].url,pinn.url,query);
  }
  assert.equal(search.rank('ML multimodal',[profile,pinn])[0].url,profile.url);
});
test('different sources remain visible despite many CV passages', () => {
  const cv = Array.from({length:8},(_,i)=>({title:'CV',heading:'Epidemiología',text:`Epidemiología: trabajo ${i}`,url:`/es/cv/#entry-${i}`,sourceKey:'/es/cv/'}));
  assert.ok(search.rank('epidemiología',[...cv,profile,covid]).some(result=>result.url===covid.url));
});
test('a paper linked from the homepage is not repeated as a separate result', () => {
  const duplicate = {...covid,text:covid.title,url:'/es/#publicaciones',sourceKey:covid.sourceKey};
  const results=search.rank('vacunas',[duplicate,covid]);
  assert.equal(results.length,1);
  assert.equal(results[0].url,covid.url);
});
test('unrelated topics and unknown diseases are not turned into COVID matches', () => {
  for (const query of ['astronomía','cáncer','dengue','receta de pizza','vacunas contra dengue','vacunas de dengue']) {
    assert.deepEqual(search.rank(query,[covid,clinical,pinn]),[],query);
  }
});

test('broader concepts find narrower fields without reversing the relationship', () => {
  const ode={title:'CV',text:'Ecuaciones Diferenciales Ordinarias (2023)',url:'/es/cv/#docencia'};
  const pde={title:'CV',text:'Ecuaciones en Derivadas Parciales (2023)',url:'/es/cv/#docencia'};
  assert.equal(search.rank('IA',[profile])[0].related,true);
  assert.equal(search.rank('redes neuronales',[pinn])[0].url,pinn.url);
  assert.equal(search.rank('ecuaciones diferenciales',[ode,pde]).length,2);
  assert.deepEqual(search.rank('EDO',[pde]),[]);
});
test('single-letter R is searchable as a programming language', () => {
  const programming={title:'CV',heading:'Programación',text:'Avanzado: Python, scikit-learn, PyTorch, Julia, R',url:'/es/cv/#programacion'};
  assert.equal(search.rank('R',[programming])[0].url,programming.url);
});

test('medicine-specific questions favor the clinical course over general health AI', () => {
  const general={title:'Artificial Intelligence in Health',text:'Course on artificial intelligence in health.',url:'/teaching/health/',topics:['inteligencia artificial','salud'],collection:'teaching'};
  assert.equal(search.rank('IA en medicina',[general,clinical])[0].url,clinical.url);
});

test('a specific course outranks a CV paragraph listing many course subjects', () => {
  const aggregate={title:'CV',heading:'Docencia',text:'Machine Learning. Inteligencia Artificial en Salud. Inteligencia Artificial en Medicina: Razonamiento Clínico.',url:'/es/cv/#docencia'};
  assert.equal(search.rank('IA en medicina',[aggregate,clinical])[0].url,clinical.url);
});
