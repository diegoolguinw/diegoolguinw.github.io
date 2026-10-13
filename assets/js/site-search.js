(function () {
  'use strict';
  const widget = document.querySelector('[data-site-search]');
  if (!widget || !window.SiteSearch || typeof HTMLDialogElement === 'undefined') return;
  const spanish = widget.dataset.lang === 'es';
  const labels = spanish ? {
    loading: 'Buscando en el sitio…',
    found: 'Estos extractos del sitio pueden ayudarte:',
    missing: 'No encontré coincidencias suficientes. Prueba con un tema como investigación, publicaciones, docencia o contacto.',
    error: 'No pude cargar el contenido del sitio. Intenta buscar de nuevo o consulta el currículum.',
    cv: 'Ver currículum',
    you: 'Tú: ',
    open: 'Abrir enlace citado',
    related: 'Relacionado con el tema de tu consulta.',
  } : {
    loading: 'Searching this site…',
    found: 'These excerpts from the site may help:',
    missing: 'I couldn’t find enough matching information. Try a topic such as research, publications, teaching or contact.',
    error: 'I couldn’t load the site content. Please search again or browse the CV.',
    cv: 'View CV',
    you: 'You: ',
    open: 'Open cited link',
    related: 'Related to the topic of your question.',
  };
  const launcher = widget.querySelector('.site-search__launcher');
  const panel = widget.querySelector('dialog');
  const log = widget.querySelector('[role="log"]');
  const status = widget.querySelector('[role="status"]');
  const form = widget.querySelector('form');
  const input = widget.querySelector('input');
  const submit = form.querySelector('button');
  const suggestions = [...widget.querySelectorAll('.site-search__suggestions button')];
  let corpusPromise;
  let busy = false;

  function safeURL(value) {
    const url = new URL(value, location.href);
    return ['http:', 'https:', 'mailto:'].includes(url.protocol) ? url : null;
  }

  async function fetchLocal(value, asJSON = false) {
    const url = safeURL(value);
    if (!url || url.origin !== location.origin) throw new Error('Search sources must belong to this site');
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000);
    try {
      const response = await fetch(url.href, { signal: controller.signal });
      if (!response.ok) throw new Error('Could not load search source');
      return await (asJSON ? response.json() : response.text());
    } finally { clearTimeout(timeout); }
  }

  function extractPassages(html, entry, references) {
    const parsed = new DOMParser().parseFromString(html, 'text/html');
    const body = parsed.querySelector('.archive, .page__content');
    if (!body) return [];
    body.querySelectorAll('script, style').forEach(node => node.remove());
    const passages = [];
    const headings = [];
    const mergedLists = new WeakSet();
    let anchor = '';
    body.querySelectorAll('h1, h2, h3, h4, h5, h6, p, li').forEach(node => {
      if (/^H[1-6]$/.test(node.tagName)) {
        if (node.classList.contains('page__title')) return;
        const level = Number(node.tagName[1]);
        headings.length = level;
        headings[level - 1] = node.textContent.trim();
        anchor = node.id ? '#' + encodeURIComponent(node.id) : '';
        return;
      }
      // A list item is one passage, including any paragraphs nested inside it.
      if (node.parentElement.closest('li')) return;
      if (node.closest('ul, ol') && mergedLists.has(node.closest('ul, ol'))) return;
      const onlyLink = node.children.length === 1 && node.firstElementChild.tagName === 'A' ? node.firstElementChild : null;
      if (onlyLink && node.textContent.trim() === onlyLink.textContent.trim()) {
        const target = safeURL(onlyLink.getAttribute('href'));
        if (target && target.origin === location.origin) return;
      }
      const copy = node.cloneNode(true);
      const next = node.nextElementSibling;
      const associatedList = node.tagName === 'P' && /:$/.test(node.textContent.trim()) && next && /^(UL|OL)$/.test(next.tagName) ? next : null;
      if (associatedList) {
        copy.append(' ', associatedList.cloneNode(true));
        mergedLists.add(associatedList);
      }
      copy.querySelectorAll('br').forEach(br => br.replaceWith(' '));
      copy.querySelectorAll('li').forEach(item => item.append(' '));
      copy.querySelectorAll('a[href^="mailto:"]').forEach(link => {
        const email = link.getAttribute('href').slice(7).split('?')[0];
        if (!link.textContent.includes(email)) link.append(' (' + email + ')');
      });
      const text = copy.textContent.replace(/\s+/g, ' ').trim();
      if (!text) return;
      const article = node.closest('.archive__item');
      const linkNodes = [...copy.querySelectorAll('a[href]'), ...(article ? article.querySelectorAll('.archive__item-title a[href]') : [])];
      const links = linkNodes.map(link => {
        const url = safeURL(new URL(link.getAttribute('href'), new URL(entry.url, location.href)).href);
        return url ? { url: url.href, title: link.textContent.trim() || labels.open } : null;
      }).filter(Boolean);
      const linkedSources = [...new Set(links.map(link => references.get(link.url)).filter(Boolean))];
      const metadata = linkedSources.length === 1 ? linkedSources[0] : entry;
      passages.push({
        title: entry.title, heading: headings.filter(Boolean).join(' / '), text, url: entry.url + anchor, links,
        sourceKey: metadata.url, topics: metadata.topics || [], collection: metadata.collection,
        alternateTitle: metadata.alternateTitle, venue: metadata.venue, venueEs: metadata.venueEs,
        authors: metadata.authors,
      });
    });
    return passages;
  }

  function loadCorpus() {
    if (!corpusPromise) {
      corpusPromise = fetchLocal(widget.dataset.index, true).then(entries => {
        const references = new Map();
        entries.filter(entry => entry.collection).forEach(entry => {
          references.set(new URL(entry.url, location.href).href, entry);
          if (entry.reference) references.set(new URL(entry.reference, location.href).href, entry);
        });
        const sources = entries.filter(entry => entry.lang === widget.dataset.lang || entry.collection);
        return Promise.all(sources.map(async entry => extractPassages(await fetchLocal(entry.url), entry, references)));
      }).then(pages => {
        const passages = pages.flat();
        if (!passages.length) throw new Error('No searchable content');
        return passages;
      }).catch(error => { corpusPromise = null; throw error; });
    }
    return corpusPromise;
  }

  function addText(parent, tag, text, className) {
    const node = document.createElement(tag);
    node.textContent = text;
    if (className) node.className = className;
    parent.append(node);
    return node;
  }

  function addLink(parent, text, value, className) {
    const url = safeURL(value);
    if (!url) return;
    const link = addText(parent, 'a', text, className);
    link.href = url.href;
  }

  async function ask(question) {
    question = question.trim().slice(0, 300);
    if (!question || busy) return;
    busy = true;
    submit.disabled = true;
    suggestions.forEach(button => { button.disabled = true; });
    input.value = '';
    addText(log, 'p', labels.you + question, 'site-search__question');
    // Keep this tab's conversation bounded; nothing is stored between visits.
    while (log.children.length > 39) log.firstElementChild.remove();
    status.textContent = labels.loading;
    log.scrollTop = log.scrollHeight;
    const answer = document.createElement('div');
    answer.className = 'site-search__answer';
    try {
      const corpus = await loadCorpus();
      const matches = window.SiteSearch.rank(question, corpus);
      addText(answer, 'p', matches.length ? labels.found : labels.missing);
      matches.forEach(match => {
        const result = document.createElement('div');
        result.className = 'site-search__result';
        addLink(result, match.heading ? match.title + ' · ' + match.heading : match.title, match.url, 'site-search__source');
        if (match.related) addText(result, 'p', labels.related, 'site-search__related');
        addText(result, 'p', match.text.length > 650 ? match.text.slice(0, 650) + '…' : match.text);
        // Preserve useful references such as email, papers and course materials.
        match.links.filter(link => {
          const url = safeURL(link.url);
          return url && (url.protocol === 'mailto:' || url.origin !== location.origin);
        }).slice(0, 2).forEach(link => addLink(addText(result, 'p', ''), link.title, link.url));
        answer.append(result);
      });
    } catch (_) {
      addText(answer, 'p', labels.error);
      const base = new URL('.', new URL(widget.dataset.index, location.href));
      addLink(answer, labels.cv, new URL(spanish ? 'es/cv/' : 'cv/', base).href);
    } finally {
      log.append(answer);
      status.textContent = '';
      submit.disabled = false;
      suggestions.forEach(button => { button.disabled = false; });
      busy = false;
      log.scrollTop = log.scrollHeight;
      if (panel.open) input.focus();
    }
  }

  function close() {
    panel.close();
    launcher.setAttribute('aria-expanded', 'false');
    launcher.focus();
  }
  launcher.addEventListener('click', () => {
    if (panel.open) close();
    else { panel.show(); launcher.setAttribute('aria-expanded', 'true'); input.focus(); }
  });
  widget.querySelector('.site-search__close').addEventListener('click', close);
  panel.addEventListener('keydown', event => {
    if (event.key === 'Escape') { event.preventDefault(); close(); }
  });
  form.addEventListener('submit', event => { event.preventDefault(); ask(input.value); });
  suggestions.forEach(button => button.addEventListener('click', () => ask(button.textContent)));
  launcher.hidden = false;
})();
