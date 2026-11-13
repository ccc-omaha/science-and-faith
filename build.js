// Builds index.html from src/template.html + content/*.json.
// Staff edit content through Pages CMS; Netlify runs this on every deploy.
const fs = require('fs');
const path = require('path');
const read = f => JSON.parse(fs.readFileSync(path.join(__dirname, 'content', f + '.json'), 'utf8'));

const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const tie = s => s.replace(/ (\S{1,14})$/, '&nbsp;$1');   // no orphaned last word
const fmt = s => tie(esc(s)
  .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
  .replace(/\*(.+?)\*/g, '<em>$1</em>')
  .replace(/\[(.+?)\]\((https?:\/\/[^\s)]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>'));
const slug = s => String(s || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const vimeoId = l => (String(l || '').match(/(\d{6,})/) || [])[1] || '';
const ytId = l => { const m = String(l || '').match(/(?:v=|youtu\.be\/|embed\/|shorts\/)([\w-]{11})/); return m ? m[1] : String(l || '').trim(); };
const brand = (c, d) => c || d;

const intro = read('intro'), speakers = read('speakers');
const sessions = read('sessions').map(x => {
  const o = { n: x.label, t: x.title, d: x.description, day: x.day, who: x.speakers || [], slug: x.shareName || slug(x.label + ' ' + x.title), len: x.length || '', c: [brand(x.color1, '#0083E0'), brand(x.color2, '#633498')] };
  if (x.audio) o.a = x.audio; else { o.v = vimeoId(x.video); o.thumb = x.thumbnail || `https://vumbnail.com/${o.v}.jpg`; }
  return o;
});
const messages = read('messages').map(x => {
  const o = { t: x.title, d: x.description, kind: x.kind, who: x.speaker, slug: x.shareName || slug(x.title), y: ytId(x.video), c: [brand(x.color1, '#0083E0'), brand(x.color2, '#633498')] };
  if (x.featured) o.feature = true;
  return o;
});
const books = read('books').map(x => ({ t: x.title, a: x.author, u: x.link, img: x.cover, c: [brand(x.color1, '#0083E0'), brand(x.color2, '#00003D')] }));

const speakerHtml = speakers.map(p => `
        <article class="spk reveal">
          <div class="avatar"><img src="${esc(p.photo)}" alt="${esc(p.name)}" width="112" height="112" loading="lazy"></div>
          <div>
            <h3>${esc(p.name)}</h3>
            <p class="role">${esc(p.role)}</p>
            <p>${fmt(p.bio)}</p>
          </div>
        </article>`).join('');

// JSON inside a <script>: keep it from closing the tag
const js = v => JSON.stringify(v).replace(/</g, '\\u003c');

let html = fs.readFileSync(path.join(__dirname, 'src', 'template.html'), 'utf8');
html = html
  .replace('{{badge}}', esc(intro.badge))
  .replace('{{lede}}', fmt(intro.lede))
  .replace('{{messagesIntro}}', fmt(intro.messagesIntro))
  .replace('{{resourcesIntro}}', fmt(intro.resourcesIntro))
  .replace('{{speakersIntro}}', fmt(intro.speakersIntro))
  .replace('{{speakers}}', speakerHtml)
  .replace('/*@SESSIONS*/[]', js(sessions))
  .replace('/*@MESSAGES*/[]', js(messages))
  .replace('/*@BOOKS*/[]', js(books));
fs.writeFileSync(path.join(__dirname, 'index.html'), html);
console.log(`Built index.html: ${sessions.length} sessions, ${messages.length} messages, ${books.length} books`);
