# launchpad23.org

The Launchpad23 website, hosted free on GitHub Pages.

## How it's organized
- `_src/pages/` — the content of each page (plain HTML, with a short header for the title and description).
- `_src/layout.html` — the shared menu and footer used by every page.
- `_src/build.py` — wraps each page in the layout. After editing anything in `_src/`, run `python3 _src/build.py` and commit the results.
- `css/`, `js/`, `img/`, `files/` — styles, scripts, images and downloadable PDFs.
- `data/` — saved copies of the Examples Google Sheet, used only if the sheet can't be reached.

## The Examples page
`4fun.html` reads the Google Sheet **"Launchpad23 Website — Examples & Topics"** (in the Launchpad23 › Website folder in Drive) on every visit. Edit the sheet to add or change free resources and weekly topics; the sheet's first tab explains how.

## Unlisted pages
`archive/` pages are kept for reference but are not linked from the menu and ask search engines not to index them.

## Ghana program page and Connect page
`ghana/index.html` (Tuesday public speaking) and `connect/index.html` (Wednesday Connect) are the same file: the page shows the right sessions based on its folder name, so after changing one, copy it over the other. `ghana/index.html` is a stand-alone page for the Ghana program (not in the menu, not indexed). It reads the Google Sheet **"Ghana Program Page – Website Content"** (Launchpad23 › Ghana Program Page in Drive) on every visit: quotes for the spinner, this week's club details, games and archives. Pictures go in `ghana/images/`. It does not use `_src/` or the build script.
