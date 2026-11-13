#!/usr/bin/env python3
"""Build the Launchpad23 site.

Each file in _src/pages/ is a page body with a few header lines on top:

    title: Page title
    description: One-line summary for search engines
    robots: noindex          (optional, keeps unlisted pages out of search)
    scripts: <script ...>    (optional, extra scripts for this page)
    ---
    <section>...page HTML...</section>

This script wraps every page in _src/layout.html (shared header, menu and
footer) and writes the finished .html files to the site root. Run it after
any edit:  python3 _src/build.py
"""
import os, re, pathlib

ROOT = pathlib.Path(__file__).resolve().parent.parent
SRC = ROOT / "_src" / "pages"
LAYOUT = (ROOT / "_src" / "layout.html").read_text(encoding="utf-8")

# Old Wix addresses that should forward to their new home
REDIRECTS = {
    "examples": "4fun",
    "giftedfamilies": "gifted",
    "homeschool": "homeschoolers",
    "the-great-debate": "challenges/great-debate",
    "portmeridian": "challenges/port-meridian",
    "secret23": "archive/secret23",
    "mystery": "archive/midsummer-mystery",
    "disclaimer": "privacy#disclaimers",
}


def build_page(path):
    raw = path.read_text(encoding="utf-8")
    head, body = raw.split("\n---\n", 1)
    meta = {}
    for line in head.splitlines():
        if ":" in line:
            k, v = line.split(":", 1)
            meta[k.strip()] = v.strip()
    rel = path.relative_to(SRC)
    depth = len(rel.parts) - 1
    root = "../" * depth
    if rel.as_posix() == "404.html":
        root = "/"  # 404 is served at any address, so it needs site-absolute paths
    slug = rel.with_suffix("").as_posix().replace("/", "-")
    html = (LAYOUT
            .replace("{{title}}", meta.get("title", "Launchpad23"))
            .replace("{{description}}", meta.get("description", ""))
            .replace("{{robots}}", '<meta name="robots" content="noindex">' if meta.get("robots") == "noindex" else "")
            .replace("{{scripts}}", meta.get("scripts", ""))
            .replace("{{slug}}", "home" if slug == "index" else slug)
            .replace("{{root}}", root if root else "./")
            .replace("{{content}}", body.strip()))
    out = ROOT / rel
    out.parent.mkdir(parents=True, exist_ok=True)
    out.write_text(html, encoding="utf-8")
    return rel.as_posix()


def build_redirects():
    for old, new in REDIRECTS.items():
        target = new
        page = f"""<!DOCTYPE html><html lang="en"><head><meta charset="utf-8">
<title>Launchpad23</title><meta name="robots" content="noindex">
<meta http-equiv="refresh" content="0; url={target}">
<link rel="canonical" href="{target}"></head>
<body><p>This page has moved: <a href="{target}">continue</a>.</p></body></html>
"""
        (ROOT / f"{old}.html").write_text(page, encoding="utf-8")


if __name__ == "__main__":
    built = [build_page(p) for p in sorted(SRC.rglob("*.html"))]
    build_redirects()
    print(f"Built {len(built)} pages and {len(REDIRECTS)} redirects.")
