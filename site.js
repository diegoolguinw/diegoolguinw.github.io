// Apply saved theme before first paint to prevent flash
(function(){
  var t=localStorage.getItem('theme')||(matchMedia('(prefers-color-scheme:dark)').matches?'dark':'light');
  document.documentElement.dataset.theme=t;
})();

// ── Translations ─────────────────────────────────────────────────────────────
var T={
  // Nav
  'nav.about':          {en:'About',es:'Sobre mí'},
  'nav.pubs':           {en:'Publications',es:'Publicaciones'},
  'pubs.desc':          {en:'Preprints and journal articles in applied mathematics, nonlinear filtering, and digital health.',es:'Preprints y artículos en revistas de matemáticas aplicadas, filtrado no lineal y salud digital.'},

  // Hero
  'hero.eyebrow':       {en:'Research Engineer · Digital Health',es:'Ingeniero de Investigación · Salud Digital'},
  'hero.role':          {en:'Mathematical Engineer &amp; MSc in Applied Mathematics.',es:'Ingeniero Matemático &amp; Magíster en Matemáticas Aplicadas.'},
  'hero.lede':          {
    en:'Currently a <strong>Research Engineer</strong> in the Digital Health research line at the <strong>Center for Mathematical Modeling</strong>, University of Chile — working on data science, machine learning, and dynamical systems for healthcare and public health.',
    es:'Actualmente <strong>Ingeniero de Investigación</strong> en la línea de Salud Digital del <strong>Centro de Modelamiento Matemático</strong>, Universidad de Chile — trabajando en ciencia de datos, aprendizaje automático y sistemas dinámicos para la salud y la salud pública.'
  },
  'hero.lede.alt':      {
    en:'Currently a <strong>Research Engineer</strong> in the Digital Health research line at the <strong>Center for Mathematical Modeling</strong>, University of Chile, working on data science, machine learning, and dynamical systems for healthcare and public health.',
    es:'Actualmente <strong>Ingeniero de Investigación</strong> en la línea de Salud Digital del <strong>Centro de Modelamiento Matemático</strong>, Universidad de Chile, trabajando en ciencia de datos, aprendizaje automático y sistemas dinámicos para la salud y la salud pública.'
  },
  'hero.btn.pubs':      {en:'View publications',es:'Ver publicaciones'},
  'hero.btn.cv':        {en:'Curriculum vitae',es:'Currículum vitae'},

  // About section
  'sec.about':          {en:'About',es:'Sobre mí'},
  'about.lead':         {en:'Theoretical and applied Mathematics',es:'Matemáticas teóricas y aplicadas'},
  'about.lead.alt':     {en:'Theoretical and applied mathematics.',es:'Matemáticas teóricas y aplicadas.'},
  'about.p1':           {
    en:'I hold a degree in Mathematical Engineering and an MSc in Applied Mathematics from the University of Chile. My research focuses on the use of <strong style="color:var(--ink);font-weight:600;">data science</strong>, <strong style="color:var(--ink);font-weight:600;">machine learning</strong>, and <strong style="color:var(--ink);font-weight:600;">artificial intelligence</strong> in healthcare and public health.',
    es:'Soy Ingeniero Matemático y Magíster en Matemáticas Aplicadas por la Universidad de Chile. Mi investigación se centra en el uso de <strong style="color:var(--ink);font-weight:600;">ciencia de datos</strong>, <strong style="color:var(--ink);font-weight:600;">aprendizaje automático</strong> e <strong style="color:var(--ink);font-weight:600;">inteligencia artificial</strong> en salud y salud pública.'
  },
  'about.p2':           {
    en:'Beyond these areas, I apply methods from statistics, optimization, optimal control, differential equations, and operations research to challenges in healthcare and to problems related to climate change. Alongside research, I teach at the University of Chile — from undergraduate mathematics to graduate courses in machine learning and artificial intelligence in health.',
    es:'Además, aplico métodos de estadística, optimización, control óptimo, ecuaciones diferenciales e investigación operativa a desafíos en salud y a problemas relacionados con el cambio climático. Junto a la investigación, hago docencia en la Universidad de Chile — desde matemáticas de pregrado hasta cursos de posgrado en aprendizaje de máquinas e inteligencia artificial en salud.'
  },

  // Research focus
  'sec.focus':          {en:'Research focus',es:'Área de investigación'},
  'focus.core':         {en:'Core areas',es:'Áreas principales'},
  'focus.methods':      {en:'Methods &amp; applications',es:'Métodos y aplicaciones'},

  // Chips
  'chip.healthcare':    {en:'Healthcare',es:'Salud'},
  'chip.pubhealth':     {en:'Public Health',es:'Salud Pública'},
  'chip.epi':           {en:'Epidemiology',es:'Epidemiología'},
  'chip.stats':         {en:'Statistics',es:'Estadística'},
  'chip.optim':         {en:'Optimization',es:'Optimización'},
  'chip.optctrl':       {en:'Optimal Control',es:'Control Óptimo'},
  'chip.diffeq':        {en:'Differential Equations',es:'Ec. Diferenciales'},
  'chip.opsres':        {en:'Operations Research',es:'Inv. Operativa'},
  'chip.nlfilter':      {en:'Nonlinear Filtering',es:'Filtrado No Lineal'},
  'chip.climate':       {en:'Climate Change',es:'Cambio Climático'},
  'chip.ai':            {en:'Artificial Intelligence',es:'Inteligencia Artificial'},

  // Selected work
  'sec.selected':       {en:'Selected work',es:'Trabajo destacado'},
  'cat.article':        {en:'Article',es:'Artículo'},
  'link.allpubs':       {en:'All publications',es:'Todas las publicaciones'},

  // Teaching (home)
  'sec.teaching':       {en:'Teaching',es:'Docencia'},
  'teach.home.lead':    {en:'A deep commitment to <em>teaching</em>',es:'Un profundo compromiso con la <em>docencia</em>'},
  'teach.home.intro':   {
    en:'From <strong style="color:var(--ink);font-weight:600;">August 2026</strong> I will be a Lecturer (<em>Profesor de Cátedra</em>) at the University of Chile for the following courses:',
    es:'Desde <strong style="color:var(--ink);font-weight:600;">agosto de 2026</strong> seré Profesor de Cátedra en la Universidad de Chile en los siguientes cursos:'
  },
  'link.teachcv':       {en:'Full teaching record',es:'Trayectoria docente completa'},

  // Footer (shared)
  'foot.contact':       {en:'Get in touch',es:'Contacto'},
  'foot.talk':          {en:"Let's talk research.",es:'Hablemos de investigación.'},
  'foot.collab':        {en:'Open to collaborations in applied mathematics, modeling, and digital health.',es:'Abierto a colaboraciones en matemáticas aplicadas, modelamiento y salud digital.'},
  'foot.profiles':      {en:'Profiles',es:'Perfiles'},
  'foot.affil':         {en:'Affiliation',es:'Afiliación'},
  'foot.affil.text':    {en:'Center for Mathematical Modeling<br>University of Chile<br>Santiago, Chile',es:'Centro de Modelamiento Matemático<br>Universidad de Chile<br>Santiago, Chile'},
  'colophon.right':     {en:'Mathematical Engineering · Applied Mathematics',es:'Ingeniería Matemática · Matemáticas Aplicadas'},

  // CV page
  'cv.eyebrow':         {en:'Curriculum vitae',es:'Currículum vitae'},
  'cv.desc':            {
    en:'Mathematical Engineer and MSc in Applied Mathematics — Research Engineer in Digital Health at the Center for Mathematical Modeling, University of Chile.',
    es:'Ingeniero Matemático y Magíster en Matemáticas Aplicadas — Ingeniero de Investigación en Salud Digital en el Centro de Modelamiento Matemático, Universidad de Chile.'
  },
  'cv.contact.btn':     {en:'Contact ↗',es:'Contacto ↗'},

  'cv.sec.edu':         {en:'Education',es:'Educación'},
  'cv.sec.exp':         {en:'Experience',es:'Experiencia'},
  'cv.sec.prog':        {en:'Programming',es:'Programación'},
  'cv.sec.teach':       {en:'Teaching',es:'Docencia'},
  'cv.sec.service':     {en:'Service',es:'Servicio'},

  'edu.msc':            {en:'MSc in Applied Mathematics',es:'Magíster en Matemáticas Aplicadas'},
  'edu.matheng':        {en:'Mathematical Engineering',es:'Ingeniería Matemática'},
  'edu.bsc':            {en:'BSc in Engineering Sciences',es:'Lic. en Ciencias de la Ingeniería'},
  'edu.minor':          {en:'— minor in Mathematics',es:'— mención en Matemáticas'},
  'edu.univ':           {en:'University of Chile',es:'Universidad de Chile'},

  'exp.outreach.title': {en:'Outreach Coordinator',es:'Coordinador de Extensión'},
  'exp.outreach.desc':  {en:'Coordinate the outreach activities of the Center.',es:'Coordinación de las actividades de extensión del Centro.'},
  'exp.re.title':       {en:'Research Engineer',es:'Ingeniero de Investigación'},
  'exp.re.desc1':       {en:'Digital Health and Mathematical Education research lines.',es:'Líneas de investigación en Salud Digital y Educación Matemática.'},
  'exp.visit.title':    {en:'Research Visit',es:'Visita de Investigación'},
  'exp.visit.place':    {en:'France',es:'Francia'},
  'exp.visit.desc':     {en:'Research in multimodal deep learning interpretability and information theory.',es:'Investigación en interpretabilidad de deep learning multimodal y teoría de la información.'},
  'exp.re.desc2':       {en:'Digital Health research line.',es:'Línea de investigación en Salud Digital.'},
  'exp.ra.title':       {en:'Research Assistant',es:'Asistente de Investigación'},
  'exp.ra1.desc':       {en:'Mathematical modeling of epidemic processes incorporating population, regional, and group structures. Joint Fund for Chile–Mexico Cooperation.',es:'Modelamiento matemático de procesos epidémicos incorporando estructuras de población, región y grupo. Fondo Conjunto de Cooperación Chile–México.'},
  'exp.ra2.desc':       {en:'Research on unique continuation principles in the context of Physics-Informed Neural Networks.',es:'Investigación sobre principios de continuación única en el contexto de redes neuronales informadas por física.'},
  'exp.ra3.desc':       {en:'Hybrid optimization algorithms combining Bayesian optimization with evolutionary algorithms for hyperparameter tuning of Physics-Informed Neural Networks.',es:'Algoritmos de optimización híbridos que combinan optimización bayesiana con algoritmos evolutivos para el ajuste de hiperparámetros de redes neuronales informadas por física.'},
  'exp.intern.title':   {en:'Internship',es:'Pasantía'},
  'exp.intern.desc':    {en:'Built a framework for solving differential equations using deep learning methods in Python.',es:'Desarrolló un marco de trabajo para resolver ecuaciones diferenciales usando métodos de aprendizaje profundo en Python.'},
  'exp.cmm':            {en:'Center for Mathematical Modeling',es:'Centro de Modelamiento Matemático'},
  'exp.univ.chile':     {en:'University of Chile',es:'Universidad de Chile'},

  'skill.adv':          {en:'Advanced',es:'Avanzado'},
  'skill.int':          {en:'Intermediate',es:'Intermedio'},

  'teach.prof.meta':    {en:'Lecturer · From Aug 2026',es:'Profesor de Cátedra · Desde ago 2026'},
  'teach.prof.title':   {en:'University courses as Lecturer',es:'Cursos como Profesor de Cátedra'},
  'teach.prof.c1':      {en:'Machine Learning',es:'Aprendizaje de Máquinas'},
  'teach.prof.c1w':     {en:'Master in Data Science · University of Chile',es:'Magíster en Ciencia de Datos · Universidad de Chile'},
  'teach.prof.c2':      {en:'Interdisciplinary Module: Modeling, Data Science and Artificial Intelligence in Health',es:'Módulo Interdisciplinario: Modelamiento, Ciencia de Datos e Inteligencia Artificial en Salud'},
  'teach.prof.c2w':     {en:'Innovation Area, Faculty of Physical and Mathematical Sciences · University of Chile',es:'Área de Innovación, Facultad de Ciencias Físicas y Matemáticas · Universidad de Chile'},
  'teach.prof.c3':      {en:'Artificial Intelligence in Medicine: Quantitative Foundations and Clinical Reasoning',es:'Inteligencia Artificial en Medicina: Bases Cuantitativas y Razonamiento Clínico'},
  'teach.prof.c3w':     {en:'Faculty of Medicine · University of Chile',es:'Facultad de Medicina · Universidad de Chile'},

  'teach.lect.meta':    {en:'Lecturer · Dec 2024',es:'Docente · Dic 2024'},
  'teach.lect.title':   {en:'Mini-course in Deep Learning',es:'Mini-curso en Aprendizaje Profundo'},
  'teach.lect.desc':    {
    en:'Lecturer during the National Mathematical Engineering Meeting, co-taught with Javier Maass. Materials available in this <a href="https://github.com/diegoolguinw/Math_Behind_Magic" target="_blank" rel="noopener">repository ↗</a>.',
    es:'Docente en el Encuentro Nacional de Ingeniería Matemática, co-impartido con Javier Maass. Materiales disponibles en este <a href="https://github.com/diegoolguinw/Math_Behind_Magic" target="_blank" rel="noopener">repositorio ↗</a>.'
  },
  'teach.coord.meta':   {en:'Coordinator · Dept. of Mathematical Engineering',es:'Coordinador · Depto. de Ingeniería Matemática'},
  'teach.coord.title':  {en:'Mathematics Common Track Courses Coordinator',es:'Coordinador de Cursos del Tronco Común'},
  'teach.coord.desc':   {en:'Coordinated and organized teaching assistants for grading of assessments and exams — including recruitment, supervision, and grading.',es:'Coordinó y organizó ayudantes para corrección de evaluaciones y exámenes — incluyendo reclutamiento, supervisión y corrección.'},
  'teach.ta.meta':      {en:'Teaching Assistant · Mathematics',es:'Ayudante · Matemáticas'},
  'teach.ta.title':     {en:'Mathematics courses',es:'Cursos de Matemáticas'},
  'teach.grad.meta':    {en:'Teaching Assistant · Graduate School',es:'Ayudante · Posgrado'},
  'teach.grad.title':   {en:'Data Science courses',es:'Cursos de Ciencia de Datos'},
  'teach.grad.desc':    {en:'Teaching Assistant in Machine Learning for the Master in Data Science (Spring 2024, Fall 2025).',es:'Ayudante en Aprendizaje Automático para el Magíster en Ciencia de Datos (primavera 2024, otoño 2025).'},
  'teach.innov.meta':   {en:'Teaching Assistant · Innovation',es:'Ayudante · Innovación'},
  'teach.innov.title':  {en:'Multidisciplinary Module',es:'Módulo Multidisciplinario'},
  'teach.innov.desc':   {en:'Innovation course with multidisciplinary collaboration in the Common Track of Engineering, introducing mathematical models and computational techniques for climate-change problems.',es:'Curso de innovación con colaboración multidisciplinaria en el Tronco Común de Ingeniería, introduciendo modelos matemáticos y técnicas computacionales para problemas de cambio climático.'},
  'teach.mat.meta':     {en:'Materials · Engineering &amp; Sciences School',es:'Materiales · Fac. de Cs. Físicas y Matemáticas'},
  'teach.mat.title':    {en:'Introduction to University Life',es:'Introducción a la Vida Universitaria'},
  'teach.mat.desc':     {en:'Created mathematics material for new students of the Common Track of Engineering at the Faculty of Physical and Mathematical Sciences, University of Chile.',es:'Creó material de matemáticas para nuevos estudiantes del Tronco Común de Ingeniería de la Facultad de Ciencias Físicas y Matemáticas, Universidad de Chile.'},

  'course.ode':         {en:'Ordinary Differential Equations',es:'Ec. Diferenciales Ordinarias'},
  'course.advcalc':     {en:'Advanced Calculus &amp; Applications',es:'Cálculo Avanzado y Aplicaciones'},
  'course.intcalc':     {en:'Introduction to Calculus',es:'Introducción al Cálculo'},
  'course.algebra':     {en:'Introduction to Algebra',es:'Introducción al Álgebra'},
  'course.stats':       {en:'Statistics',es:'Estadística'},
  'course.multcalc':    {en:'Multivariable Calculus',es:'Cálculo Multivariable'},
  'course.pde':         {en:'Partial Differential Equations',es:'Ec. Diferenciales Parciales'},
  'course.linalg':      {en:'Linear Algebra',es:'Álgebra Lineal'},
  'course.mathopt':     {en:'Mathematical Optimization',es:'Optimización Matemática'},
  'course.mldl':        {en:'ML, Deep Learning &amp; Neural Networks',es:'ML, Deep Learning y Redes Neuronales'},

  'serv.title':         {en:'Assistants Coordinator',es:'Coordinador de Asistentes'},
  'serv.desc':          {en:'Coordinated assistants for scientific outreach and dissemination activities.',es:'Coordinó asistentes para actividades de divulgación y extensión científica.'},
};

// ── Theme ─────────────────────────────────────────────────────────────────────
function applyTheme(v){
  document.documentElement.dataset.theme=v;
  localStorage.setItem('theme',v);
  var b=document.getElementById('theme-toggle');
  if(b) b.textContent=v==='dark'?'☀':'☾';
}

// ── Language ──────────────────────────────────────────────────────────────────
function applyLang(v){
  document.documentElement.lang=v;
  localStorage.setItem('lang',v);
  var b=document.getElementById('lang-toggle');
  if(b) b.textContent=v==='en'?'ES':'EN';
  document.querySelectorAll('[data-i18n]').forEach(function(el){
    var tr=T[el.dataset.i18n];
    if(tr&&tr[v]!==undefined) el.innerHTML=tr[v];
  });
}

// ── Init ──────────────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded',function(){
  var savedTheme=localStorage.getItem('theme')||(matchMedia('(prefers-color-scheme:dark)').matches?'dark':'light');
  applyTheme(savedTheme);
  var tb=document.getElementById('theme-toggle');
  if(tb) tb.addEventListener('click',function(){
    applyTheme(document.documentElement.dataset.theme==='dark'?'light':'dark');
  });

  var savedLang=localStorage.getItem('lang')||'en';
  applyLang(savedLang);
  var lb=document.getElementById('lang-toggle');
  if(lb) lb.addEventListener('click',function(){
    applyLang(document.documentElement.lang==='en'?'es':'en');
  });
});
