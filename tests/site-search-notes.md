# Site search

The chat panel retrieves excerpts from the published site. It does not run a
language model, generate answers, or call an AI service. Questions stay in the
current tab and are discarded when the page is reloaded.

Jekyll generates `search-index.json` from titled pages, publications and teaching
collections. On the first question, the browser loads pages in the current
language plus collection pages from the same origin. It extracts the rendered
article content, retaining section anchors, email addresses and source links.
This includes content produced by Liquid includes. Subsequent questions reuse
that content in memory. A failed load clears the cache so another question retries.

Set `search: false` in a page's front matter to omit it from search. The 404 page
and redirect-only pages are omitted automatically. PDFs and external linked
pages are not searched.

`assets/js/site-search-engine.js` holds Spanish/English stopwords, phrase aliases
and a small hierarchy of related concepts. For example, deep learning belongs
to machine learning and AI; the reverse relationship is not assumed. Acronyms
such as ML, IA, AI, PINNs, EDO and EDP match their full names.

Publications and courses carry `search_topics` in their front matter. These
topics must be supported by their content. For example, the booster vaccination
paper includes epidemiology, COVID-19, vaccination and public health. Titles in
both languages, venues and publication authors are also indexed. New content is
still searchable without tags, but explicit tags add associations that its
wording does not provide. Add new topics alongside the source document:

```yaml
search_topics:
  - epidemiología
  - vacunación
```

Ranking weights source text, headings and metadata, requires coverage of most
meaningful query terms, and returns at most three excerpts. It gives different
source pages a place before filling remaining slots with more excerpts from the
same page. A paper linked from the homepage and its own article page are treated
as the same source; the article page wins equal-score ties. Related matches are
labeled in the interface and retain the actual source excerpt.

This is lexical retrieval with explicit topic associations, not a trained
semantic model. Follow-up questions must include their topic. It does not infer
every possible relationship or correct arbitrary spelling mistakes.

Verification:

```sh
bundle exec jekyll build --safe
node --test tests/site-search*.test.cjs
python3 -m unittest discover -s tests -p 'test_*.py'
```

If the default Ruby does not match the installed bundle, use the installed
Ruby 3.3 for the build:

```sh
env PATH=/opt/homebrew/opt/ruby@3.3/bin:$PATH bundle exec jekyll build --safe
```

Browser checks: contact, teaching, publications, programming, unknown topics,
English/Spanish, Escape and focus return, mobile sizing and both color themes.
Also check epidemiology against the COVID paper, vaccine and coronavirus terms,
AI in medicine, PINNs, broader topic relationships, and unknown diseases.
