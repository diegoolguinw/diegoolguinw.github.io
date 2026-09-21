import os
import re
import unittest
from pathlib import Path


SITE_ROOT = Path(os.environ.get("SITE_OUTPUT", "_site"))


def page(relative_path: str) -> str:
    path = SITE_ROOT / relative_path
    if not path.is_file():
        raise AssertionError(f"Built page is missing: {path}")
    return path.read_text(encoding="utf-8")


class AcademicPagesMigrationTests(unittest.TestCase):
    def test_expected_routes_are_generated(self):
        expected = (
            "index.html",
            "publications/index.html",
            "cv/index.html",
            "es/index.html",
            "es/publicaciones/index.html",
            "es/cv/index.html",
            "404.html",
            "publications.html",
            "cv.html",
        )
        missing = [name for name in expected if not (SITE_ROOT / name).is_file()]
        self.assertEqual([], missing, f"Missing generated routes: {missing}")

    def test_pages_declare_language_and_alternates(self):
        pairs = (
            ("index.html", "en", "https://diegoolguinw.github.io/es/"),
            ("publications/index.html", "en", "https://diegoolguinw.github.io/es/publicaciones/"),
            ("cv/index.html", "en", "https://diegoolguinw.github.io/es/cv/"),
            ("es/index.html", "es", "https://diegoolguinw.github.io/"),
            ("es/publicaciones/index.html", "es", "https://diegoolguinw.github.io/publications/"),
            ("es/cv/index.html", "es", "https://diegoolguinw.github.io/cv/"),
        )
        for path, language, alternate in pairs:
            with self.subTest(path=path):
                html = page(path)
                self.assertRegex(html, rf'<html[^>]+lang=["\']{language}["\']')
                self.assertIn('hreflang="en"', html)
                self.assertIn('hreflang="es"', html)
                self.assertIn(f'href="{alternate}"', html)

    def test_language_switcher_targets_equivalent_pages(self):
        expected_links = (
            ("index.html", "/es/", "ES"),
            ("publications/index.html", "/es/publicaciones/", "ES"),
            ("cv/index.html", "/es/cv/", "ES"),
            ("es/index.html", "/", "EN"),
            ("es/publicaciones/index.html", "/publications/", "EN"),
            ("es/cv/index.html", "/cv/", "EN"),
        )
        for path, target, label in expected_links:
            with self.subTest(path=path):
                html = page(path)
                pattern = rf'<a[^>]+href=["\']{re.escape(target)}["\'][^>]*>\s*{label}\s*</a>'
                self.assertRegex(html, pattern)

    def test_home_pages_preserve_biography_and_research_focus(self):
        english = page("index.html")
        spanish = page("es/index.html")
        self.assertIn("Mathematical Engineer", english)
        self.assertIn("Digital Health", english)
        self.assertIn("Research interests", english)
        self.assertIn("Ingeniero Matemático", spanish)
        self.assertIn("Salud Digital", spanish)
        self.assertIn("Intereses de investigación", spanish)

    def test_publications_exist_in_both_languages(self):
        titles = (
            "Improved error bounds for Koopman operator",
            "Koopman Kalman Filter (KKF)",
            "Impact of the first booster vaccine against SARS-CoV-2 in Chile",
        )
        for path in ("publications/index.html", "es/publicaciones/index.html"):
            html = page(path)
            for title in titles:
                with self.subTest(path=path, title=title):
                    self.assertIn(title, html)
        self.assertIn("Preprints", page("publications/index.html"))
        self.assertIn("Artículos en revistas", page("es/publicaciones/index.html"))

    def test_cv_exists_in_both_languages(self):
        english = page("cv/index.html")
        spanish = page("es/cv/index.html")
        for heading in ("Education", "Experience", "Programming", "Teaching", "Service"):
            self.assertIn(heading, english)
        for heading in ("Educación", "Experiencia", "Programación", "Docencia", "Servicio"):
            self.assertIn(heading, spanish)
        self.assertIn("Outreach Coordinator", english)
        self.assertIn("Coordinador de Extensión", spanish)

    def test_academic_pages_shell_and_identity_are_present(self):
        html = page("index.html")
        self.assertIn('id="site-nav"', html)
        self.assertIn('id="theme-toggle"', html)
        self.assertIn("Diego Olguín-Wende", html)
        self.assertIn("/images/profile-web.jpg", html)
        self.assertTrue((SITE_ROOT / "assets/css/main.css").is_file())

    def test_navigation_controls_and_footer_are_localized(self):
        english = page("index.html")
        spanish = page("es/index.html")
        self.assertIn('aria-label="Open navigation"', english)
        self.assertIn('aria-label="Toggle theme"', english)
        self.assertIn('aria-label="Abrir navegación"', spanish)
        self.assertIn('aria-label="Cambiar tema"', spanish)
        self.assertIn("a fork of", english)
        self.assertIn("basado en", spanish)

    def test_template_placeholders_and_old_translation_markup_are_absent(self):
        forbidden = (
            "Your Name",
            "Your Sidebar Name",
            "Red Brick University",
            "none@example.org",
            "data-i18n",
        )
        html_files = list(SITE_ROOT.rglob("*.html")) if SITE_ROOT.exists() else []
        self.assertTrue(html_files, "No generated HTML files were found")
        combined = "\n".join(path.read_text(encoding="utf-8") for path in html_files)
        for value in forbidden:
            with self.subTest(value=value):
                self.assertNotIn(value, combined)

    def test_old_html_routes_redirect_to_canonical_pages(self):
        redirects = {
            "publications.html": "/publications/",
            "cv.html": "/cv/",
        }
        for path, target in redirects.items():
            with self.subTest(path=path):
                html = page(path)
                self.assertIn(target, html)
                self.assertRegex(html, r'http-equiv=["\']refresh["\']')


if __name__ == "__main__":
    unittest.main()
