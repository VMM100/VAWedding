# Ayushi & Vandan — Wedding Invite Site

## Versions

- **Main site (current design)** — the files at the top level of the repo. Live at `https://vmm100.github.io/VAWedding/`.
- **Same design at /v2/** — the `v2` folder is a copy of the main site, kept because the printed QR code opens `https://vmm100.github.io/VAWedding/v2/`. **Do not delete or rename the `v2` folder or the repo.** When you change the site, make the same change in both places (in `v2`, image paths start with `../images/`).
- **Original design (version 1)** — saved on the `v1-original` branch, so it can always be restored exactly.

Both live copies include the offline PDF (`Ayushi-Vandan-Wedding-Invite.pdf`), the dress-code pop-up pages (`events/`), calendar files (`calendar/`), link-preview picture (`share.jpg`) and tab icon (`icon.png`).

## Original (version 1) setup notes

Three files make up the whole site (plus the `images` folder, which must be uploaded too):

- `index.html` — the page content
- `style.css` — colors, fonts, layout
- `script.js` — the scroll animations (fade-ups, the countdown, the progress bar)

## Upload to the repo you made

1. Open your repository on github.com.
2. Click **Add file → Upload files**.
3. Drag in all three files (`index.html`, `style.css`, `script.js`) — keep them at the top level of the repo, not inside a subfolder.
4. Scroll down and click **Commit changes**.

## Turn on GitHub Pages

1. In the repo, go to **Settings → Pages** (left sidebar).
2. Under "Build and deployment", set **Source** to "Deploy from a branch".
3. Set **Branch** to `main` and the folder to `/ (root)`, then **Save**.
4. Wait about a minute, then refresh the page — GitHub will show your live link, something like `https://yourusername.github.io/your-repo-name/`.

## Editing later

- Event timings: open `index.html`, search for `[Timings to be announced]`, and replace each with the real time — no coding knowledge needed, it's just text.
- Colors: open `style.css`, the four colors at the very top (`--maroon`, `--gold`, `--paper`, `--ink`) control the whole palette.

Any edit you commit on GitHub updates the live site automatically within a minute or two.
