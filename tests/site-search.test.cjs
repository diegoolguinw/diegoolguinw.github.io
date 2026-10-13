const assert = require('node:assert/strict');
const test = require('node:test');
let search;
try { search = require('../assets/js/site-search-engine.js'); } catch (_) {}

const passages = [
  {title: 'Currículum vitae', heading: 'Contacto', text: 'Contacto: dolguin@dim.uchile.cl', url: '/es/cv/'},
  {title: 'Currículum vitae', heading: 'Programación', text: 'Avanzado: Python, scikit-learn, PyTorch, Julia, R', url: '/es/cv/#programacion'},
  {title: 'Sobre mí', heading: '', text: 'Soy Ingeniero Matemático y estudiante de doctorado en modelos de Machine Learning multimodales.', url: '/es/'},
  {title: 'Sobre mí', heading: 'Docencia', text: 'Aprendizaje de Máquinas. Magíster en Ciencia de Datos, Universidad de Chile.', url: '/es/#docencia'},
  {title: 'Publicaciones', heading: 'Preprints', text: 'Koopman Kalman Filter: nonlinear filtering and parameter estimation.', url: '/es/publicaciones/#preprints'},
];

test('search engine is available without browser dependencies', () => assert.equal(typeof search?.rank, 'function'));
test('contact paraphrases find the actual email', () => {
  assert.match(search.rank('¿Cómo puedo hablar contigo?', passages)[0].text, /dolguin@/);
  assert.match(search.rank('What is your email?', passages)[0].text, /dolguin@/);
});
test('accents and case do not prevent finding programming skills', () => {
  assert.match(search.rank('¿Qué lenguajes de PROGRAMACIÓN manejas?', passages)[0].text, /Python/);
});
test('literal technical terms retrieve the corresponding source', () => {
  assert.match(search.rank('Koopman Kalman', passages)[0].text, /Koopman Kalman/);
  assert.match(search.rank('doctorado', passages)[0].text, /doctorado/);
});
test('course paraphrases find teaching', () => assert.match(search.rank('¿Qué cursos impartes?', passages)[0].text, /Aprendizaje/));
test('unknown topics, empty queries and greetings do not invent an answer', () => {
  for (const query of ['receta de pizza', '', 'hola', '<script>alert(1)</script>']) {
    assert.deepEqual(search.rank(query, passages), []);
  }
});
test('results keep source links and avoid duplicate excerpts', () => {
  const results = search.rank('Koopman', [...passages, passages[4]]);
  assert.equal(results.length, 1);
  assert.equal(results[0].url, '/es/publicaciones/#preprints');
});

test('general teaching questions prioritize the main course list over subsections', () => {
  const courses = [
    {title: 'Currículum vitae', heading: 'Docencia / Mini-curso en Aprendizaje Profundo', text: 'Docente en un curso de aprendizaje profundo.', url: '/es/cv/#mini-curso'},
    {title: 'Sobre mí', heading: 'Docencia', text: 'Soy Profesor de Cátedra en los siguientes cursos: Aprendizaje de Máquinas. Inteligencia Artificial en Medicina.', url: '/es/#docencia'},
  ];
  assert.equal(search.rank('¿Qué cursos impartes?', courses)[0].url, '/es/#docencia');
});

test('identity questions retrieve the biography', () => {
  assert.match(search.rank('¿Quién es Diego?', passages)[0].text, /Ingeniero Matemático/);
  assert.match(search.rank('Who are you?', passages)[0].text, /Ingeniero Matemático/);
  assert.equal(search.rank('¿Quién es Diego?', passages).length, 1);
});

test('auxiliar and ayudantía variants retrieve teaching assistantships specifically', () => {
  const teaching = [
    {title: 'Currículum vitae', heading: 'Docencia / Ayudante de Matemáticas', text: 'Aprendizaje Automático, Aprendizaje Profundo y Redes Neuronales (2024, 2025, 2026)', url: '/es/cv/#ayudante-de-matematicas'},
    {title: 'Curriculum vitae', heading: 'Teaching / Teaching Assistant in Data Science', text: 'Teaching Assistant in Machine Learning for the Master in Data Science.', url: '/cv/#teaching-assistant-in-data-science'},
    {title: 'Currículum vitae', heading: 'Docencia', text: 'Profesor de Cátedra en cursos universitarios.', url: '/es/#docencia'},
    {title: 'Curriculum vitae', heading: 'Experience', text: 'Research Assistant at Inria Chile.', url: '/cv/#experience'},
  ];
  for (const query of ['Auxiliares', 'auxiliar', 'ayudante', 'ayudantes', 'ayudantía', 'ayudantías', 'teaching assistant', 'teaching assistants']) {
    const results = search.rank(query, teaching);
    assert.equal(results.length, 2, `Expected teaching assistantships for: ${query}`);
    assert.ok(results.every(result => /ayudante-de-|teaching-assistant-in-/.test(result.url)), query);
  }
});
