// Downloads each source site's real favicon and embeds it (base64) in assets/favicons.js,
// so the tool shows real favicons offline. Run on a machine with internet access:
//   node tools/fetch-favicons.js && node tools/build.js
// Tries Google's favicon service (64px) first, then DuckDuckGo. Requires curl.
const fs = require('fs'), path = require('path'), { execFileSync } = require('child_process');
const root = path.join(__dirname, '..');
global.window = {};
const ctx = {}; new Function('ctx', fs.readFileSync(path.join(root, 'assets/data.js'), 'utf8') + '\nctx.TOPICS=TOPICS;ctx.BRANDS=BRANDS;')(ctx);
const doms = new Set(Object.values(ctx.BRANDS).map(b => b.dom));
Object.values(ctx.TOPICS).forEach(T => Object.values(T.pools).forEach(pool => pool.forEach(s => doms.add(s.dom))));
doms.delete('google.com'); doms.add('maps.google.com');
const get = (url) => { try { return execFileSync('curl', ['-sS', '-L', '--max-time', '20', '-w', '\n%{http_code} %{content_type}', url], { maxBuffer: 5e6 }); } catch (e) { return null; } };
const out = {};
for (const d of [...doms].sort()) {
  let got = null;
  for (const url of [`https://t3.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=https://www.${d.replace(/^www\./, '')}&size=64`, `https://icons.duckduckgo.com/ip3/${d}.ico`]) {
    const buf = get(url); if (!buf) continue;
    const nl = buf.lastIndexOf(10), meta = buf.slice(nl + 1).toString().trim().split(' '), body = buf.slice(0, nl);
    if (meta[0] === '200' && /^image\//.test(meta[1]) && body.length > 120) { got = `data:${meta[1].split(';')[0]};base64,${body.toString('base64')}`; break; }
  }
  if (got) out[d === 'maps.google.com' ? 'google.com' : d] = got;
  console.log((got ? 'ok   ' : 'MISS ') + d + (got ? ' (' + Math.round(got.length / 1024) + ' KB)' : ''));
}
const file = path.join(root, 'assets/favicons.js');
let src = fs.readFileSync(file, 'utf8').replace(/\nconst FAV_IMG=[^\n]*\n?/, '\n');
src += 'const FAV_IMG=' + JSON.stringify(out) + ';\n';
fs.writeFileSync(file, src);
console.log(`embedded ${Object.keys(out).length} favicons into assets/favicons.js`);
