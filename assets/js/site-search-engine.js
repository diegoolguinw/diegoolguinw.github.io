/* Local search with bilingual vocabulary and source-backed topic associations. */
(function (root) {
  'use strict';
  const stopWords = new Set(('a al algo algun alguna algunos ante como con cual cuales cuando de del desde donde el ella en entre es esta este esto hay la las le lo los me mi mis o para por puedo que quien se si sobre su sus te tiene tienes tu tus un una unos y yo ' +
    'am an and are at can do does for from how i in is it me my of on or the their this to what when where which who with you your ' +
    'diego olguin wende hola hello please favor dime saber quisiera quiero puedes could would tell about contigo conmigo ' +
    'manejas utilizas usas relacionados relacionadas relacionado relacionada asociadas asociados trata trate tratan has have any related using use find buscar encontrar informacion information').split(' '));
  const groups = [
    ['contacto', 'contact', 'contactar', 'contactarte', 'contactarme', 'correo', 'email', 'mail', 'escribir', 'escribirte', 'escribirme', 'hablar', 'comunicar', 'comunicarme', 'comunicarse'],
    ['docencia', 'teaching', 'teach', 'teaches', 'taught', 'curso', 'cursos', 'course', 'courses', 'clase', 'clases', 'impartes', 'imparte', 'ensenar', 'ensenas', 'profesor', 'lecturer'],
    ['ayudantia', 'ayudantias', 'ayudante', 'ayudantes', 'auxiliar', 'auxiliares'],
    ['publicacion', 'publicaciones', 'publication', 'publications', 'paper', 'papers', 'articulo', 'articulos', 'preprint', 'preprints'],
    ['investigacion', 'investigar', 'investigas', 'research', 'researching', 'investiga'],
    ['programacion', 'programming', 'programar', 'lenguaje', 'lenguajes', 'language', 'languages', 'software', 'habilidades', 'skills'],
    ['educacion', 'education', 'formacion', 'estudios', 'estudio', 'estudiaste', 'estudias', 'degree', 'degrees'],
    ['experiencia', 'experience', 'trayectoria', 'trabajo', 'trabajos', 'work', 'worked', 'jobs', 'career'],
    ['salud', 'health', 'healthcare'],
    ['medicina', 'medicine'],
    ['aprendizaje', 'learning'],
    ['maquinas', 'machine'],
    ['datos', 'data'],
    ['matematicas', 'matematica', 'matematico', 'mathematics', 'mathematical', 'math'],
    ['doctorado', 'doctoral', 'doctorate', 'phd'],
    ['epidemiologia', 'epidemiology', 'epidemiological', 'epidemiologico', 'epidemiologica', 'epidemiologicos', 'epidemiologicas', 'epidemia', 'epidemias', 'epidemic', 'epidemics', 'epidemico', 'epidemicos'],
    ['covid', 'covid19', 'covid 19', 'sars cov 2', 'coronavirus'],
    ['vacunacion', 'vacuna', 'vacunas', 'vaccination', 'vaccinations', 'vaccine', 'vaccines', 'inmunizacion', 'immunization'],
    ['refuerzo', 'refuerzos', 'booster', 'boosters'],
    ['pandemia', 'pandemias', 'pandemic', 'pandemics'],
    ['salud_publica', 'salud publica', 'public health'],
    ['enfermedades_infecciosas', 'enfermedades infecciosas', 'infectious diseases', 'infectious disease'],
    ['machine_learning', 'machine learning', 'aprendizaje automatico', 'aprendizaje de maquinas', 'aprendizaje de maquina', 'ml'],
    ['deep_learning', 'deep learning', 'aprendizaje profundo'],
    ['inteligencia_artificial', 'inteligencia artificial', 'artificial intelligence', 'ia', 'ai'],
    ['redes_neuronales', 'redes neuronales', 'red neuronal', 'neural networks', 'neural network'],
    ['pinn', 'pinns', 'physics informed neural networks', 'physics informed neural network', 'redes neuronales informadas por fisica'],
    ['ciencia_datos', 'ciencia de datos', 'data science'],
    ['multimodal', 'multimodales', 'multimodality'],
    ['imagenes_medicas', 'imagenes medicas', 'imagen medica', 'medical imaging', 'medical images'],
    ['razonamiento_clinico', 'razonamiento clinico', 'clinical reasoning'],
    ['clinica', 'clinico', 'clinicos', 'clinical'],
    ['interpretabilidad', 'interpretability', 'explicabilidad', 'explainability'],
    ['teoria_informacion', 'teoria de la informacion', 'information theory'],
    ['optimizacion_bayesiana', 'optimizacion bayesiana', 'bayesian optimization'],
    ['optimizacion', 'optimization', 'optimisation'],
    ['hiperparametros', 'hiperparametro', 'hyperparameters', 'hyperparameter'],
    ['ecuaciones_diferenciales', 'ecuaciones diferenciales', 'differential equations'],
    ['edo', 'ecuaciones diferenciales ordinarias', 'ordinary differential equations', 'ode', 'odes'],
    ['edp', 'ecuaciones en derivadas parciales', 'partial differential equations', 'pde', 'pdes'],
    ['estadistica', 'statistics', 'statistical'],
    ['control_optimo', 'control optimo', 'optimal control'],
    ['filtrado', 'filtering', 'filter', 'filtro', 'filtros'],
    ['estimacion', 'estimation', 'estimar', 'estimate'],
    ['parametros', 'parameters', 'parameter'],
    ['kernel', 'kernels', 'nucleos'],
    ['cotas_error', 'cotas de error', 'error bounds'],
    ['trayectorias', 'trajectories', 'trajectory', 'trayectoria reconstruida'],
    ['modelamiento', 'modelado', 'modeling', 'modelling'],
    ['cambio_climatico', 'cambio climatico', 'climate change'],
    ['pasantia', 'pasantias', 'internship', 'internships'],
    ['magister', 'maestria', 'master', 'masters', 'msc'],
    ['uchile', 'universidad de chile', 'university of chile', 'u de chile'],
    ['cmm', 'centro de modelamiento matematico', 'center for mathematical modeling'],
  ];
  const aliases = new Map();
  groups.forEach(group => group.forEach(word => aliases.set(word, group[0])));
  const phrases = [...aliases.keys()].filter(word => word.includes(' ')).sort((a, b) => b.length - a.length)
    .map(phrase => [new RegExp('\\b' + phrase + '\\b', 'g'), aliases.get(phrase)]);
  // Direction matters: a narrower field belongs to its parent topic, but a
  // general mention of medicine does not imply COVID or medical imaging.
  const parents = {
    machine_learning: ['inteligencia_artificial'],
    deep_learning: ['machine_learning', 'redes_neuronales'],
    pinn: ['redes_neuronales'],
    edo: ['ecuaciones_diferenciales'],
    edp: ['ecuaciones_diferenciales'],
    optimizacion_bayesiana: ['optimizacion'],
    imagenes_medicas: ['medicina'],
    razonamiento_clinico: ['clinica', 'medicina'],
    medicina: ['salud'],
    epidemiologia: ['salud_publica'],
    salud_publica: ['salud'],
  };

  function terms(text) {
    let normalized = String(text).normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[-–]/g, ' ')
      .replace(/\bteaching assistants?\b/g, 'ayudantia')
      .replace(/\b(?:quien eres|quien es diego|who are you|who is diego|sobre mi|about me)\b/g, 'biografia')
      .replace(/^(?:soy|i am)\b/, 'biografia');
    phrases.forEach(([pattern, canonical]) => { normalized = normalized.replace(pattern, canonical); });
    return [...new Set(normalized.match(/[a-z0-9_]+/g) || [])].filter(word => (word.length > 1 || word === 'r') && !stopWords.has(word))
      .map(word => aliases.get(word) || word);
  }

  function rank(query, passages, limit = 3) {
    const requested = [...new Set(terms(query))];
    if (!requested.length) return [];
    const indexed = passages.map(passage => {
      const body = new Set(terms(passage.text));
      const heading = new Set(terms(passage.heading || ''));
      const title = new Set(terms(passage.title || ''));
      const topics = new Set(terms([...(passage.topics || []), passage.alternateTitle || '', passage.venue || '', passage.venueEs || '', passage.authors || '',
        passage.collection === 'publications' ? 'publicaciones' : passage.collection === 'teaching' ? 'docencia' : ''].join(' ')));
      const concepts = new Set([...body, ...heading, ...title, ...topics]);
      for (const concept of concepts) {
        (parents[concept] || []).forEach(parent => { topics.add(parent); concepts.add(parent); });
      }
      return { passage, body, heading, title, topics };
    });
    const weights = new Map(requested.map(term => [term, 1 + Math.log(1 + indexed.length /
      (1 + indexed.filter(entry => entry.body.has(term) || entry.heading.has(term) || entry.title.has(term) || entry.topics.has(term)).length))]));
    const scored = indexed.map(entry => {
      if (requested.length === 1 && requested[0] === 'biografia' && !entry.body.has('biografia')) {
        return { ...entry.passage, score: 0 };
      }
      let matched = 0;
      let topicOnly = false;
      let score = 0;
      for (const term of requested) {
        const literal = (entry.body.has(term) ? 3 : 0) +
          (entry.heading.has(term) ? 3 / Math.sqrt(entry.heading.size) : 0) + (entry.title.has(term) ? 2 : 0);
        const strength = literal || (entry.topics.has(term) ? 2 : 0);
        if (!literal && entry.topics.has(term)) topicOnly = true;
        if (strength) { matched++; score += strength * weights.get(term); }
      }
      // Require most meaningful words, so a different disease is not ignored.
      return { ...entry.passage, related: topicOnly, score: matched / requested.length >= 0.6 ? score * matched / requested.length : 0 };
    }).filter(entry => entry.score > 0).sort((a, b) => b.score - a.score ||
      Number(b.url.split('#')[0] === b.sourceKey) - Number(a.url.split('#')[0] === a.sourceKey) || a.text.length - b.text.length);
    const seen = new Set();
    const distinct = scored.filter(entry => {
      const key = entry.text.replace(/\s+/g, ' ').trim();
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
    const sources = new Set();
    const selected = [];
    const remaining = [];
    distinct.forEach(entry => {
      const source = entry.sourceKey || entry.url.split('#')[0];
      if (!sources.has(source)) { sources.add(source); selected.push(entry); }
      else if (!entry.collection) remaining.push(entry);
    });
    return [...selected, ...remaining].slice(0, limit);
  }

  const engine = { rank };
  if (typeof module !== 'undefined' && module.exports) module.exports = engine;
  else root.SiteSearch = engine;
})(typeof window !== 'undefined' ? window : this);
