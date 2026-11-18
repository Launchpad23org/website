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
`ghana/index.html` (Tuesday public speaking) and `connect/index.html` (Wednesday Connect) are the same file: the page shows the right sessions based on its folder name, so after changing one, copy it over the other. `ghana/index.html` is a stand-alone page for the Ghana program (not in the menu, not indexed). It reads the Google Sheet **"Launchpad23 Weekly Pages – Website Content"** (Launchpad23 › Ghana Program Page in Drive) on every visit: quotes for the spinner, this week's club details, games and archives. Pictures go in `ghana/images/`. It does not use `_src/` or the build script.

## Wednesday page (This Week at Launchpad23)
`connect/` shows, top to bottom: the title card, **Convene** (10x10 warm-up card and Announcements), **Consider** (this week's topics, 16:9 pictures), **Connect** (the clubs), and the **Launch Debrief** (one exit ticket button per topic, plus a final thought from Emerson). The 10x10 board is at `connect/#/10x10`.
Everything comes from the sheet **"Launchpad23 Weekly Pages – Website Content"** (it used to be called the Ghana Program Page sheet; the page finds it by its ID, so the name can change). Wednesday tabs: Wednesday Settings, Announcements, Wednesday Topics, 10x10 This Week, 10x10 Topic Bank, 10x10 Log, 10x10 Facts. The sheet's time zone is Eastern.
The two forms (10x10 fact form, exit ticket) were built once by an Apps Script in Drive › Launchpad23 › Wednesday Page: 10x10 and Exit Ticket. The page fills in the topic and team with pre-filled links, so the forms never need weekly edits. Exit ticket answers go to a separate private sheet in that folder. Original images live in its "Wednesday Page Images (upload here)" subfolder; web copies are in `ghana/images/`.

## SUMMIT planner
`summit/index.html` is a stand-alone project planner (not in the menu, noindex) at `/summit/`. Everything is in the one file: the eight stages, their questions, example answers, and quotations are in the `STAGES` list near the top of the script. Students' plans save only in their own browser (localStorage), and they can download a `.json` copy to reopen later, or print / save as PDF. The stage pictures are drawn in code (`SKIES` and `strip()`); to use a real image instead, replace a stage's `<svg>` with an `<img>` (4:1). Header: `summit/images/header.jpg` (3:1).
