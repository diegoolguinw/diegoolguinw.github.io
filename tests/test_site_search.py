import json
import os
import unittest
from pathlib import Path
from urllib.parse import unquote

SITE_ROOT = Path(os.environ.get('SITE_OUTPUT', '_site'))


class SiteSearchIntegrationTests(unittest.TestCase):
    def test_collection_topic_metadata_is_published_for_local_search(self):
        entries = json.loads((SITE_ROOT / 'search-index.json').read_text())
        covid = next(entry for entry in entries if entry['url'] == '/publication/booster-vaccine-chile/')
        self.assertIn('epidemiología', covid['topics'])
        self.assertIn('COVID-19', covid['topics'])
        self.assertEqual(covid['reference'], 'https://doi.org/10.1016/j.idm.2025.12.009')
        self.assertIn('Olguín', covid['authors'])
        for entry in entries:
            self.assertIsInstance(entry['topics'], list)
            if entry['collection']:
                self.assertTrue(entry['topics'], entry['url'])
            if entry['collection'] == 'teaching':
                self.assertTrue(entry['alternateTitle'], entry['url'])

    def test_search_sources_have_real_pages_and_exclude_error_redirect_routes(self):
        entries = json.loads((SITE_ROOT / 'search-index.json').read_text())
        urls = [entry['url'] for entry in entries]
        self.assertEqual(len(urls), len(set(urls)))
        for route in ('/', '/es/', '/cv/', '/es/cv/', '/publications/', '/es/publicaciones/'):
            self.assertIn(route, urls)
        self.assertNotIn('/404.html', urls)
        self.assertNotIn('/cv.html', urls)
        for entry in entries:
            route = unquote(entry['url']).lstrip('/')
            target = SITE_ROOT / route / 'index.html' if entry['url'].endswith('/') else SITE_ROOT / route
            self.assertTrue(target.is_file(), f'Search source missing: {target}')
            self.assertIn(entry['lang'], ('en', 'es'))
            html = target.read_text()
            self.assertTrue('class="archive"' in html or 'class="page__content"' in html)

    def test_search_panel_and_assets_are_available_in_both_languages(self):
        for route in ('index.html', 'es/index.html'):
            html = (SITE_ROOT / route).read_text()
            self.assertIn('role="log"', html)
            self.assertIn('aria-controls="site-search-panel"', html)
            self.assertIn('data-index="/search-index.json"', html)
            for asset in ('css/site-search.css', 'js/site-search-engine.js', 'js/site-search.js'):
                self.assertIn(f'/assets/{asset}', html)
                self.assertTrue((SITE_ROOT / 'assets' / asset).is_file())
        self.assertIn('Buscar conversando', (SITE_ROOT / 'es/index.html').read_text())
        self.assertIn('Ask about this site', (SITE_ROOT / 'index.html').read_text())


if __name__ == '__main__':
    unittest.main()
