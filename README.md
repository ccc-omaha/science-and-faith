# Science & Faith Conference

Archive site for the 2024 Science & Faith Conference at Christ Community Church, Omaha (scienceandfaithconference.com). Static HTML, deployed on Netlify.

## Structure
- `content/*.json`: all editable content (intro text, sessions, messages, books, speakers). Staff edit these through Pages CMS at https://app.pagescms.org.
- `src/template.html`: the design, styles and scripts.
- `build.js`: combines the two into `index.html`. Netlify runs it on every deploy. Preview locally with `node build.js`.
- `assets/`: logo (vector), speaker photos, book cover, favicon, social share image.
- `assets/audio/session-5-fuz-breakout.mp3`: Session 5 breakout with Fuz Rana (audio only, re-encoded to 64 kbps mono from the Squarespace original).

Videos stream from Vimeo (sessions) and YouTube (messages and podcast).
