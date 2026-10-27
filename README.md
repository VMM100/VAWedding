# Ayushi & Vandan — Wedding Invite Site

## Two versions

- **Version 1 (original)** — the files at the top level of the repo. Live at `https://vmm100.github.io/VAWedding/`. Also saved as the `v1-original` branch, so it can always be restored exactly.
- **Version 2 (improved)** — everything in the `v2` folder. Live at `https://vmm100.github.io/VAWedding/v2/`. It uses the same `images` folder, plus its own link-preview picture (`share.jpg`), tab icon (`icon.png`) and calendar files (`calendar/`).

To make version 2 the main one later, copy the files in `v2` to the top level and change `../images/` back to `images/` in `index.html` and `style.css` — or just share the `/v2/` link.

What changed in version 2: easier-to-read gold text and bigger small text on phones, no blank screen after the opening, a dress-code line and "Add to calendar" button under each event, a WhatsApp/iMessage link preview, a tab icon, and a countdown to the first day (18 Jan) that changes to a message on the day.

## Version 1 files

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
