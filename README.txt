NEURAL MORPHOSIS — LABEL layout (v11 GitHub Pages READY)

PUBLIC SITE (GitHub Pages)
- Upload everything to the repo root.
- IMPORTANT: do NOT upload admin.html if you want it private.
- Content source: site-data.json

UPDATE CONTENT (fast)
- Replace site-data.json in your repo -> commit -> Pages updates.

LOCAL ADMIN (private)
- Keep admin.html locally (not in the repo).
- Open admin.html in a browser.
- Export JSON.
- Save exported JSON as site-data.json in your repo.

PAGES / NAV
- Navigation is built from site-data.json -> pages[]
- To hide a page, set visible: false
- About / Merch / Support pages already exist and can be enabled later.

NOTES
- GitHub Pages is static. "Password" protection for admin requires server-side access control.
  For real online protection use Netlify/Cloudflare Pages + Access, or Decap CMS.
