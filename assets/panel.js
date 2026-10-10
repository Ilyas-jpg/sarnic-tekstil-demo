/* Sarnıç Tekstil · yönetim paneli demosu (vanilla JS)
   İki marka (A: fantezi iç giyim, B: pijama + pedli seri) tek panelde. Veriler tohumlu rastgele üretilen ÖRNEK verilerdir.
   Adres: panel/?a=<A markası>&b=<B markası>#/<sayfa> */
(() => {
  'use strict';
  const $ = (q, el = document) => el.querySelector(q);
  const $$ = (q, el = document) => [...el.querySelectorAll(q)];
  const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const tl = (n) => `${Math.round(n).toLocaleString('tr-TR')} TL`;
  const IMG = (k) => `../assets/img/urun/${k}s.webp`;
  const I = {
    gosterge: '<path d="M4 13.5h6.5V4H4zM13.5 20H20v-9.5h-6.5zM4 20h6.5v-3.5H4zM13.5 4v3.5H20V4z"/>',
    siparis: '<path d="M6 3.8h12l1.5 4.2v12.2H4.5V8z"/><path d="M4.5 8h15M9.5 12h5"/>',
    urun: '<path d="M8 3.5l-4.5 3v4l2.5-1V20h12V9.5l2.5 1v-4L16 3.5c-.7 1.6-2.2 2.5-4 2.5S8.7 5.1 8 3.5z"/>',
    kampanya: '<path d="M3.5 12.6V4.5h8.1l8.9 8.9-8.1 8.1-8.9-8.9z"/><circle cx="8" cy="8.5" r="1.4"/>',
    musteri: '<circle cx="9" cy="8" r="3.4"/><path d="M2.8 19.5c.9-3.3 3.3-5 6.2-5s5.3 1.7 6.2 5"/><path d="M15.5 4.8a3.2 3.2 0 0 1 0 6.3M17.5 14.6c1.8.6 3.1 2.2 3.7 4.9"/>',
    iade: '<path d="M4 9.5h11a5 5 0 0 1 0 10H8"/><path d="M8 5.5l-4 4 4 4"/>',
    rapor: '<path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/>',
    entegre: '<path d="M9 7.5V3.5M15 7.5V3.5M6.5 7.5h11v4a5.5 5.5 0 0 1-11 0zM12 17v3.5"/>',
    ara: '<path d="M10.5 18a7.5 7.5 0 1 1 0-15 7.5 7.5 0 0 1 0 15zM21 21l-5.2-5.2"/>',
    x: '<path d="M6 6l12 12M18 6L6 18"/>', menu: '<path d="M4 7h16M4 12h16M4 17h11"/>',
    yazdir: '<path d="M7 8.5V3.5h10v5M7 17H4.5V9.5h15V17H17M7 14h10v6.5H7z"/>',
    kutu: '<path d="M3.5 7.8L12 4l8.5 3.8L12 11.6 3.5 7.8z"/><path d="M3.5 7.8v8.4L12 20l8.5-3.8V7.8M12 11.6V20"/>',
    hediye: '<rect x="3.8" y="9" width="16.4" height="11" rx="1.5"/><path d="M3 9h18M12 9v11M12 9S10 4.5 7.6 5.6 8.6 9 12 9zM12 9s2-4.5 4.4-3.4S15.4 9 12 9z"/>',
    not: '<path d="M5 4.5h14v15H5zM8.5 9h7M8.5 13h7M8.5 17h4"/>',
    kamyon: '<path d="M2.5 6.5h11v9.5h-11zM13.5 9.5h4.2l3 3.2v3.3h-7.2"/><circle cx="6.5" cy="17.5" r="1.8"/><circle cx="17" cy="17.5" r="1.8"/>',
    fatura: '<path d="M6 3.5h12v17l-3-2-3 2-3-2-3 2zM9 8.5h6M9 12h6"/>',
    geri: '<path d="M15 5l-7 7 7 7"/>', disari: '<path d="M14 4.5h5.5V10M19.5 4.5L11 13M19 14.5v4.5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1h4.5"/>',
    arti: '<path d="M12 5v14M5 12h14"/>', tik: '<path d="M5 12.5l4.5 4.5L19 7.5"/>',
  };
  const ikon = (ad) => `<svg class="i" viewBox="0 0 24 24" aria-hidden="true">${I[ad]}</svg>`;

  // ── Markalar ve kataloglar ────────────────────────────────────────────────
  const prm = new URLSearchParams(location.search);
  const marka = (grup, id) => {
    const liste = MERT_MARKALAR.filter((m) => m.grup === grup);
    const m = liste.find((x) => x.id === id) || liste.sort((x, y) => x.no - y.no)[0];
    return { ...m, t: TEMALAR[m.id] };
  };
  const MA = marka('A', prm.get('a')), MB = marka('B', prm.get('b'));
  const KAT = { A: window.KATALOG_A, B: window.KATALOG_B };
  const MRK = { A: MA, B: MB };
  document.documentElement.style.setProperty('--a', MA.t.renk.vurgu === '#100B0D' ? '#B51F3F' : MA.t.renk.vurgu);
  document.documentElement.style.setProperty('--b', MB.t.renk.vurgu);
  const RENK = { A: MA.t.renk.vurgu, B: MB.t.renk.vurgu };
  const URUNLER = [...KAT.A.urunler.map((u) => ({ ...u, g: 'A' })), ...KAT.B.urunler.map((u) => ({ ...u, g: 'B' }))];
  const URUN = Object.fromEntries(URUNLER.map((u) => [u.g + u.id, u]));

  // ── Örnek veri (tohumlu) ─────────────────────────────────────────────────
  let tohum = 20261010;
  const rnd = () => { tohum = (tohum + 0x6d2b79f5) >>> 0; let t = tohum; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
  const sec = (a) => a[Math.floor(rnd() * a.length)];
  const ADLAR = ['Elif', 'Zeynep', 'Merve', 'Ayşe', 'Fatma', 'Esra', 'Büşra', 'Selin', 'Derya', 'Gizem', 'Ece', 'Seda', 'Burcu', 'Tuğba', 'Kübra', 'Melike', 'Hande', 'Nur', 'Ceren', 'Damla', 'Pınar', 'Sevgi', 'Yasemin', 'Ebru', 'Gamze', 'Hatice', 'Emine', 'Özge'];
  const SOYAD = 'AÇDEGKMÖSTUYBNÇ';
  const ILLER = ['İstanbul', 'İstanbul', 'İstanbul', 'İzmir', 'İzmir', 'Ankara', 'Ankara', 'Bursa', 'Antalya', 'Kocaeli', 'Adana', 'Konya', 'Eskişehir', 'Mersin', 'Samsun', 'Kayseri', 'Muğla', 'Denizli', 'Trabzon', 'Gaziantep'];
  const BUGUN = new Date(2026, 9, 10, 16, 40);
  const DURUM = { yeni: ['Yeni', 'd-yeni'], hazir: ['Hazırlanıyor', 'd-hazir'], kargo: ['Kargoda', 'd-kargo'], dagitim: ['Dağıtımda', 'd-dagitim'], teslim: ['Teslim edildi', 'd-teslim'], iade: ['İade talebi', 'd-iade'] };
  const siparisler = [];
  for (let gun = 13; gun >= 0; gun--) {
    const adet = Math.round(4 + rnd() * 5 + (gun < 4 ? 2 : 0));
    for (let k = 0; k < adet; k++) {
      const g = rnd() < 0.56 ? 'A' : 'B';
      const katalog = KAT[g].urunler;
      const kalem = [];
      const n = rnd() < 0.62 ? 1 : rnd() < 0.8 ? 2 : 3;
      for (let j = 0; j < n; j++) {
        const u = sec(katalog);
        const renk = sec(u.renkler).ad;
        kalem.push({ id: u.id, g, renk, beden: sec(u.bedenler), adet: 1 });
      }
      const ara = kalem.reduce((a, x) => a + URUN[g + x.id].fiyat, 0);
      const kargo = ara >= 750 ? 0 : KAT[g].kargoUcret;
      const tarih = gun === 0 ? new Date(BUGUN.getTime() - rnd() * 9 * 36e5) : new Date(BUGUN.getFullYear(), BUGUN.getMonth(), BUGUN.getDate() - gun, 8 + Math.floor(rnd() * 15), Math.floor(rnd() * 60));
      let durum = gun === 0 ? (rnd() < 0.55 ? 'yeni' : 'hazir') : gun === 1 ? (rnd() < 0.5 ? 'hazir' : 'kargo') : gun === 2 ? (rnd() < 0.6 ? 'kargo' : 'dagitim') : 'teslim';
      if (gun > 4 && rnd() < 0.07) durum = 'iade';
      const odeme = rnd() < 0.18 ? 'Kapıda ödeme' : rnd() < 0.55 ? 'Kart · tek çekim' : sec(['Kart · 3 taksit', 'Kart · 6 taksit', 'Kart · 2 taksit']);
      siparisler.push({
        no: `SRN${String(4810000 + Math.floor(rnd() * 89999))}`, g, tarih, durum, kalem, ara, kargo,
        toplam: ara + kargo + (odeme === 'Kapıda ödeme' ? 39 : 0), odeme,
        musteri: `${sec(ADLAR)} ${sec([...SOYAD])}.`, il: sec(ILLER), tel: `05${Math.floor(30 + rnd() * 25)} ••• •• ${String(Math.floor(rnd() * 90 + 10))}`,
        hediye: g === 'A' ? rnd() < 0.45 : rnd() < 0.2, not: rnd() < 0.3 ? sec(['İyi ki varsın', 'Yıldönümümüz kutlu olsun', 'Seni seviyorum', 'Geçmiş olsun anneciğim', 'Hoş geldin bebeğim']) : '',
        kargoKodu: String(Math.floor(1e9 + rnd() * 8.99e9)), kanal: sec(['Instagram', 'Instagram', 'TikTok', 'Google', 'Google', 'Doğrudan', 'TikTok']),
      });
    }
  }
  siparisler.sort((a, b) => b.tarih - a.tarih);
  const STOK = {};
  for (const u of URUNLER) STOK[u.g + u.id] = JSON.parse(JSON.stringify(u.stok));

  // ── Durum ────────────────────────────────────────────────────────────────
  let filtre = 'tum'; // tum | A | B
  let secili = new Set();
  const gorunen = (liste) => (filtre === 'tum' ? liste : liste.filter((x) => x.g === filtre));
  const markaEt = (g) => `<span class="marka-et"><i style="background:${RENK[g]}"></i>${esc(MRK[g].ad)}</span>`;
  const durumEt = (d) => `<span class="durum ${DURUM[d][1]}">${DURUM[d][0]}</span>`;
  const tarihYaz = (d, saat = true) => d.toLocaleString('tr-TR', { day: 'numeric', month: 'short', ...(saat ? { hour: '2-digit', minute: '2-digit' } : {}) });

  // ── Kabuk ────────────────────────────────────────────────────────────────
  const SAYFALAR = [['gosterge', 'Gösterge', 'gosterge'], ['siparisler', 'Siparişler', 'siparis'], ['urunler', 'Ürünler ve stok', 'urun'], ['kampanyalar', 'Kampanyalar', 'kampanya'],
    ['musteriler', 'Müşteriler', 'musteri'], ['iadeler', 'İadeler', 'iade'], ['raporlar', 'Raporlar', 'rapor'], ['entegrasyonlar', 'Entegrasyonlar', 'entegre']];
  function kabuk() {
    const logoStil = (m) => `--logo-ink:${m.t.logo.ink === '#F6EFE7' ? '#100B0D' : m.t.logo.ink};--logo-a:${m.t.logo.a};--logo-a2:${m.t.logo.a2 || m.t.logo.a};--logo-a3:${m.t.logo.a3 || m.t.logo.a2 || m.t.logo.a};--logo-bg:#fff`;
    document.body.innerHTML = `
      <div class="duzen">
        <aside class="yan" id="yan">
          <div class="yan-bas"><b>Yönetim paneli</b><span>Sarnıç atölyesi · iki marka</span></div>
          <div class="markalar"><a href="../ic-giyim/?marka=${MA.id}" title="${esc(MA.ad)} mağazası" style="${logoStil(MA)}">${LOGOLAR[MA.id]}</a><a href="../pijama/?marka=${MB.id}" title="${esc(MB.ad)} mağazası" style="${logoStil(MB)}">${LOGOLAR[MB.id]}</a></div>
          <nav>${SAYFALAR.map(([k, ad, ik]) => `<a href="#/${k}" data-yol="${k}">${ikon(ik)}${ad}${k === 'siparisler' ? `<em id="yeni-sayi">${siparisler.filter((s) => s.durum === 'yeni').length}</em>` : k === 'iadeler' ? `<em>${siparisler.filter((s) => s.durum === 'iade').length}</em>` : ''}</a>`).join('')}</nav>
          <div class="yan-alt">
            <a href="../ic-giyim/?marka=${MA.id}">${ikon('disari')}${esc(MA.ad)} mağazası</a>
            <a href="../pijama/?marka=${MB.id}">${ikon('disari')}${esc(MB.ad)} mağazası</a>
            <a href="../">${ikon('geri')}Tüm demolar</a>
            <a class="algow-credit" href="https://algow.net" target="_blank" rel="noopener"><span>Tasarım &amp; Geliştirme</span><img src="../assets/img/algow-wordmark.webp" alt="Algow" width="58" height="20"></a>
          </div>
        </aside>
        <div>
          <header class="ust">
            <button class="menu-ac" data-menu aria-label="Menü">${ikon('menu')}</button>
            <h1 id="baslik">Gösterge</h1>
            <form class="ara" data-ara><label class="sr" for="p-ara" style="position:absolute;left:-9999px">Ara</label>${ikon('ara')}<input id="p-ara" placeholder="Sipariş no, müşteri ya da ürün ara"></form>
            <div class="filtre-marka" role="group" aria-label="Marka">
              <button data-filtre="tum" class="on">Tümü</button>
              <button data-filtre="A"><i style="background:${RENK.A}"></i><span>${esc(MA.ad)}</span></button>
              <button data-filtre="B"><i style="background:${RENK.B}"></i><span>${esc(MB.ad)}</span></button>
            </div>
            <span class="ornek" title="Bu paneldeki tüm sayılar demo içindir">Örnek veri</span>
            <div class="kisi"><span>AT</span><div><b>Atölye</b><small>Yönetici</small></div></div>
          </header>
          <main class="icerik" id="icerik"></main>
        </div>
      </div>
      <div class="perde" id="perde"></div>
      <aside class="cekmece" id="cekmece" aria-hidden="true"></aside>
      <div class="modal" id="modal"><div class="modal-kutu" id="modal-kutu"></div></div>
      <div class="bildirim" id="bildirim"></div>`;
  }

  // ── Sayfalar ─────────────────────────────────────────────────────────────
  function gosterge() {
    const s = gorunen(siparisler);
    const bugun = s.filter((x) => x.tarih.toDateString() === BUGUN.toDateString());
    const dun = s.filter((x) => x.tarih.toDateString() === new Date(BUGUN.getTime() - 864e5).toDateString() && x.tarih.getHours() * 60 + x.tarih.getMinutes() <= BUGUN.getHours() * 60 + BUGUN.getMinutes()); // dün, aynı saate kadar
    const ciro = bugun.reduce((a, x) => a + x.toplam, 0), ciroDun = dun.reduce((a, x) => a + x.toplam, 0);
    const son14 = s.filter((x) => x.durum !== 'iade');
    const ort = son14.reduce((a, x) => a + x.toplam, 0) / Math.max(1, son14.length);
    const bekleyen = s.filter((x) => x.durum === 'yeni' || x.durum === 'hazir');
    const degisim = ciroDun ? Math.round(((ciro - ciroDun) / ciroDun) * 100) : 0;
    const dusuk = [];
    for (const u of gorunen(URUNLER)) for (const [renk, b] of Object.entries(STOK[u.g + u.id])) for (const [beden, n] of Object.entries(b)) if (n <= 2) dusuk.push({ u, renk, beden, n });
    const satis = {};
    for (const x of son14) for (const k of x.kalem) satis[x.g + k.id] = (satis[x.g + k.id] || 0) + 1;
    const enCok = Object.entries(satis).sort((a, b) => b[1] - a[1]).slice(0, 5);
    const kanal = {};
    for (const x of son14) kanal[x.kanal] = (kanal[x.kanal] || 0) + x.toplam;
    const kanalT = Object.values(kanal).reduce((a, b) => a + b, 0);
    return `
      <div class="sayfa-bas"><div><h2>Günaydın, işte bugün</h2><p>${BUGUN.toLocaleDateString('tr-TR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })} · ${filtre === 'tum' ? 'iki marka birlikte' : esc(MRK[filtre].ad)}</p></div>
        <a class="dugme" href="#/siparisler?durum=yeni">${ikon('kutu')}Hazırlanacak siparişler (${bekleyen.length})</a></div>
      <div class="izgara g4">
        <div class="kart kpi"><small>Bugünkü ciro</small><b>${tl(ciro)}</b><span class="${degisim < 0 ? 'dus' : ''}">${degisim >= 0 ? '+' : '−'}%${Math.abs(degisim)} <em>dün bu saate göre</em></span></div>
        <div class="kart kpi"><small>Bugünkü sipariş</small><b>${bugun.length}</b><span><em>dün bu saate kadar ${dun.length}</em></span></div>
        <div class="kart kpi"><small>Ortalama sepet · 14 gün</small><b>${tl(ort)}</b><span><em>kargo dahil</em></span></div>
        <div class="kart kpi"><small>Kargoya hazırlanacak</small><b>${bekleyen.length}</b><span class="${bekleyen.length > 8 ? 'dus' : ''}">${bekleyen.filter((x) => x.durum === 'yeni').length} yeni <em>· 14.00 kesim saati</em></span></div>
      </div>
      <div class="izgara g21" style="margin-top:16px">
        <div class="kart"><div class="kart-bas"><h3>Son 14 gün satış</h3><div class="lejant">${filtre !== 'B' ? `<span><i style="background:${RENK.A}"></i>${esc(MA.ad)}</span>` : ''}${filtre !== 'A' ? `<span><i style="background:${RENK.B}"></i>${esc(MB.ad)}</span>` : ''}</div></div>${grafik(s)}</div>
        <div class="kart"><div class="kart-bas"><h3>Satış kanalları</h3><span>14 gün · ciro payı</span></div>
          <div class="cubuk-liste">${Object.entries(kanal).sort((a, b) => b[1] - a[1]).map(([k, v]) => `<div><span>${k}</span><i><span style="width:${Math.round((v / kanalT) * 100)}%;background:${k === 'Instagram' ? '#C13584' : k === 'TikTok' ? '#111318' : k === 'Google' ? '#1A73E8' : '#8A909C'}"></span></i><b>%${Math.round((v / kanalT) * 100)}</b></div>`).join('')}</div>
          <p style="font-size:13px;color:var(--ink3);margin-top:16px">Kanal bilgisi Meta Pixel, TikTok Pixel ve Google Analytics 4 etiketlerinden gelir.</p></div>
      </div>
      <div class="izgara g3" style="margin-top:16px">
        <div class="kart"><div class="kart-bas"><h3>Kargoya hazırlanacaklar</h3><a href="#/siparisler?durum=yeni">Tümü</a></div>
          ${bekleyen.slice(0, 5).map((x) => `<div class="liste-satir" data-siparis="${x.no}" style="cursor:pointer"><img src="${IMG(URUN[x.g + x.kalem[0].id].gorseller[0])}" alt=""><div><b>${x.no} · ${esc(x.musteri)}</b><small>${markaEt(x.g)} · ${x.kalem.length} ürün${x.g === 'A' ? ' · gizli paketleme' : ''}</small></div>${durumEt(x.durum)}</div>`).join('') || '<p style="color:var(--ink3)">Bekleyen sipariş yok.</p>'}</div>
        <div class="kart"><div class="kart-bas"><h3>Stok uyarıları</h3><span>2 ve altı</span></div>
          ${dusuk.slice(0, 5).map((d) => `<div class="liste-satir" data-urun="${d.u.g + d.u.id}" style="cursor:pointer"><img src="${IMG(d.u.gorseller[0])}" alt=""><div><b>${esc(d.u.ad)}</b><small>${esc(d.renk)} · ${esc(d.beden)}</small></div><span class="az">${d.n ? `${d.n} adet` : 'Tükendi'}</span></div>`).join('')}</div>
        <div class="kart"><div class="kart-bas"><h3>En çok satanlar</h3><span>14 gün</span></div>
          ${enCok.map(([k, v]) => { const u = URUN[k]; return `<div class="liste-satir" data-urun="${k}" style="cursor:pointer"><img src="${IMG(u.gorseller[0])}" alt=""><div><b>${esc(u.ad)}</b><small>${markaEt(u.g)}</small></div><b>${v} adet</b></div>`; }).join('')}</div>
      </div>`;
  }

  function grafik(s) {
    const gunler = Array.from({ length: 14 }, (_, i) => new Date(BUGUN.getTime() - (13 - i) * 864e5));
    const veri = gunler.map((g) => {
      const o = s.filter((x) => x.tarih.toDateString() === g.toDateString() && x.durum !== 'iade');
      return { g, A: o.filter((x) => x.g === 'A').reduce((a, x) => a + x.toplam, 0), B: o.filter((x) => x.g === 'B').reduce((a, x) => a + x.toplam, 0) };
    });
    const max = Math.max(...veri.map((v) => v.A + v.B)) * 1.12 || 1;
    const W = 720, H = 260, ust = 12, alt = 30, sol = 46, gen = (W - sol) / 14;
    const y = (n) => H - alt - (n / max) * (H - alt - ust);
    const cizgiler = [0.25, 0.5, 0.75, 1].map((r) => `<line x1="${sol}" x2="${W}" y1="${y(max * r / 1.12)}" y2="${y(max * r / 1.12)}" stroke="#EEF0F3" stroke-width="1"/><text x="0" y="${y(max * r / 1.12) + 4}" font-size="11" fill="#A0A5B0">${Math.round(max * r / 1.12 / 1000)} bin</text>`).join('');
    const cubuklar = veri.map((v, i) => {
      const x = sol + i * gen + gen * 0.2, w = gen * 0.6;
      const hA = (v.A / max) * (H - alt - ust), hB = (v.B / max) * (H - alt - ust);
      return `<g data-ipucu="${v.g.toLocaleDateString('tr-TR', { day: 'numeric', month: 'short' })}|${tl(v.A)}|${tl(v.B)}">
        <rect x="${x}" y="${ust}" width="${w}" height="${H - alt - ust}" fill="transparent"/>
        ${v.B ? `<rect x="${x}" y="${y(v.B)}" width="${w}" height="${hB}" rx="4" fill="${RENK.B}"/>` : ''}
        ${v.A ? `<rect x="${x}" y="${y(v.A + v.B)}" width="${w}" height="${hA}" rx="4" fill="${RENK.A}"/>` : ''}
        <text x="${x + w / 2}" y="${H - 10}" text-anchor="middle" font-size="11" fill="#868C99">${v.g.getDate()}</text></g>`;
    }).join('');
    return `<div class="grafik"><svg viewBox="0 0 ${W} ${H}" preserveAspectRatio="none" role="img" aria-label="Son 14 gün satış grafiği">${cizgiler}${cubuklar}</svg><div class="ipucu" id="ipucu"></div></div>`;
  }

  function siparisListesi(q) {
    const durum = new URLSearchParams(q || '').get('durum') || 'tum';
    const ara = (new URLSearchParams(q || '').get('ara') || '').toLocaleLowerCase('tr-TR');
    const tum = gorunen(siparisler);
    let liste = durum === 'tum' ? tum : tum.filter((x) => x.durum === durum);
    if (ara) liste = liste.filter((x) => `${x.no} ${x.musteri} ${x.il} ${x.kalem.map((k) => URUN[x.g + k.id].ad).join(' ')}`.toLocaleLowerCase('tr-TR').includes(ara));
    const say = (d) => (d === 'tum' ? tum.length : tum.filter((x) => x.durum === d).length);
    return `
      <div class="sayfa-bas"><div><h2>Siparişler</h2><p>Gizli paketlemeli siparişlerde etiket üzerinde marka ve ürün adı yazmaz.</p></div>
        <div style="display:flex;gap:8px"><button class="dugme ikincil" data-disari-aktar>${ikon('fatura')}Excel'e aktar</button></div></div>
      <div class="sekmeler">${[['tum', 'Tümü'], ['yeni', 'Yeni'], ['hazir', 'Hazırlanıyor'], ['kargo', 'Kargoda'], ['dagitim', 'Dağıtımda'], ['teslim', 'Teslim edildi'], ['iade', 'İade']].map(([k, ad]) => `<button data-durum="${k}" class="${durum === k ? 'on' : ''}">${ad}<em>${say(k)}</em></button>`).join('')}</div>
      <div id="toplu"></div>
      <div class="kart" style="padding:10px 12px"><div class="tablo-kap"><table class="tablo">
        <thead><tr><th style="width:36px"><input type="checkbox" data-hepsi aria-label="Tümünü seç"></th><th>Sipariş</th><th>Müşteri</th><th class="gizle-m">Marka</th><th>Ürünler</th><th class="gizle-m">Paketleme</th><th class="sag">Tutar</th><th>Durum</th></tr></thead>
        <tbody>${liste.map((x) => `<tr data-siparis="${x.no}">
          <td data-dur><input type="checkbox" data-sec="${x.no}" ${secili.has(x.no) ? 'checked' : ''} aria-label="Seç"></td>
          <td><span class="no">${x.no}</span><small>${tarihYaz(x.tarih)}</small></td>
          <td>${esc(x.musteri)}<small>${esc(x.il)}</small></td>
          <td class="gizle-m">${markaEt(x.g)}</td>
          <td><span class="kucuk-resimler">${x.kalem.map((k) => `<img src="${IMG(URUN[x.g + k.id].gorseller[0])}" alt="">`).join('')}</span></td>
          <td class="gizle-m">${x.g === 'A' ? `<span class="bayrak">${ikon('kutu')}Gizli</span>` : ''}${x.hediye ? `<span class="bayrak">${ikon('hediye')}Hediye</span>` : ''}${x.not ? `<span class="bayrak">${ikon('not')}Not</span>` : ''}</td>
          <td class="sag"><b>${tl(x.toplam)}</b><small>${esc(x.odeme)}</small></td>
          <td>${durumEt(x.durum)}</td></tr>`).join('') || '<tr><td colspan="8" style="padding:30px;text-align:center;color:var(--ink3)">Bu filtrede sipariş yok.</td></tr>'}</tbody>
      </table></div></div>`;
  }

  function topluCiz() {
    const el = $('#toplu');
    if (!el) return;
    el.innerHTML = secili.size ? `<div class="toplu"><span>${secili.size} sipariş seçildi</span><span style="margin-left:auto;display:flex;gap:8px"><button class="dugme kucuk ikincil" data-toplu="hazir">Hazırlanıyor yap</button><button class="dugme kucuk" data-toplu="etiket">${ikon('yazdir')}Etiketleri bas</button></span></div>` : '';
  }

  function siparisDetay(no) {
    const x = siparisler.find((s) => s.no === no);
    if (!x) return;
    const adimlar = [['Sipariş alındı', 0], ['Hazırlanıyor', 2], ['Kargoya verildi', 26], ['Dağıtımda', 48], ['Teslim edildi', 54]];
    const sira = { yeni: 0, hazir: 1, kargo: 2, dagitim: 3, teslim: 4, iade: 4 }[x.durum];
    cekmeceAc(`
      <div class="c-bas"><div><h3>Sipariş ${x.no}</h3><small>${tarihYaz(x.tarih)} · ${markaEt(x.g)} · ${durumEt(x.durum)}</small></div><button class="kapat" data-kapat aria-label="Kapat">${ikon('x')}</button></div>
      <div class="c-govde">
        <div class="blok" style="margin-top:0"><h4>Ürünler</h4>${x.kalem.map((k) => { const u = URUN[x.g + k.id]; return `<div class="liste-satir"><img src="${IMG(u.gorseller[0])}" alt=""><div><b>${esc(u.ad)}</b><small>${esc(k.renk)} · ${esc(k.beden)} · ${k.adet} adet</small></div><b>${tl(u.fiyat)}</b></div>`; }).join('')}
          <div class="satirlar" style="margin-top:10px"><div><span>Ara toplam</span><b>${tl(x.ara)}</b></div><div><span>Kargo</span><b>${x.kargo ? tl(x.kargo) : 'Bizden'}</b></div>${x.odeme === 'Kapıda ödeme' ? '<div><span>Kapıda ödeme hizmeti</span><b>39 TL</b></div>' : ''}<div><span>Toplam</span><b>${tl(x.toplam)}</b></div></div></div>
        <div class="izgara g2" style="gap:12px">
          <div class="blok"><h4>Müşteri</h4><div class="satirlar"><div><span>Ad</span><b>${esc(x.musteri)}</b></div><div><span>Telefon</span><b>${x.tel}</b></div><div><span>Teslimat</span><b>${esc(x.il)}</b></div><div><span>Kanal</span><b>${x.kanal}</b></div></div></div>
          <div class="blok"><h4>Ödeme</h4><div class="satirlar"><div><span>Yöntem</span><b>${esc(x.odeme)}</b></div><div><span>Güvenlik</span><b>${x.odeme.startsWith('Kart') ? '3D Secure' : 'Teslimatta'}</b></div><div><span>Ödeme kuruluşu</span><b>${x.odeme.startsWith('Kart') ? 'Bağlı (örnek)' : '—'}</b></div><div><span>e-Arşiv</span><b>${sira >= 2 ? 'Kesildi' : 'Kargoyla kesilir'}</b></div></div></div>
        </div>
        <div class="blok"><h4>Paketleme</h4>
          ${x.g === 'A' ? `<span class="bayrak">${ikon('kutu')}Gizli paketleme: kutuda ve etikette marka yazmaz</span>` : ''}
          ${x.hediye ? `<span class="bayrak">${ikon('hediye')}${x.g === 'A' ? 'Hediye kutusu' : 'Hediye paketi'}</span>` : ''}
          ${x.not ? `<span class="bayrak">${ikon('not')}Not kartı: "${esc(x.not)}"</span>` : ''}
          ${x.g !== 'A' && !x.hediye && !x.not ? '<span style="color:var(--ink3);font-size:14px">Standart paketleme</span>' : ''}</div>
        <div class="blok"><h4>Süreç</h4><div class="zaman">${adimlar.map(([ad, saat], i) => `<div class="${i <= sira ? 'tamam' : ''}"><i></i><span>${ad}</span><small>${i <= sira ? tarihYaz(new Date(x.tarih.getTime() + saat * 36e5)) : ''}</small></div>`).join('')}</div>
          ${x.durum === 'iade' ? '<p style="margin-top:12px;font-size:14px;color:#B91C1C;font-weight:700">İade talebi: "Beden uymadı" · hijyen bandı kontrolü bekliyor</p>' : ''}</div>
      </div>
      <div class="c-alt">
        ${x.durum === 'yeni' ? `<button class="dugme ikincil" data-durum-yap="${x.no}|hazir">Hazırlanıyor yap</button>` : ''}
        ${x.durum === 'yeni' || x.durum === 'hazir' ? `<button class="dugme" data-etiket="${x.no}">${ikon('yazdir')}Kargo etiketi oluştur</button>` : `<button class="dugme ikincil" data-etiket="${x.no}">${ikon('yazdir')}Etiketi yeniden bas</button>`}
        <button class="dugme ikincil" data-fatura="${x.no}">${ikon('fatura')}e-Arşiv fatura</button>
      </div>`);
  }

  function barkod(kod) {
    let x = 6, svg = '';
    const desen = [...(kod + kod.split('').reverse().join(''))].map(Number);
    for (let i = 0; i < 46; i++) {
      const d = desen[i % desen.length];
      const w = 1 + (d % 3), bosluk = 1 + ((d + i) % 2);
      svg += `<rect x="${x}" y="0" width="${w * 1.6}" height="84" fill="#111"/>`;
      x += (w + bosluk) * 1.6;
    }
    return `<svg viewBox="0 0 ${x + 6} 84" preserveAspectRatio="none" aria-hidden="true">${svg}</svg>`;
  }
  function etiketGoster(nolar) {
    const x = siparisler.find((s) => s.no === nolar[0]);
    modalAc(`<h3 style="font-size:19px">Kargo etiketi${nolar.length > 1 ? `leri (${nolar.length})` : ''}</h3>
      <p style="color:var(--ink2);margin-top:4px;font-size:14px">10 × 15 cm termal etiket. ${x.g === 'A' ? 'Gizli paketleme: gönderici adında marka, açıklamada ürün adı yok.' : 'Kargo firmasına otomatik iletildi.'}</p>
      <div class="etiket10">
        <div class="ust-s"><span>ANLAŞMALI KARGO</span><span>${x.kargo ? 'Gönderici öder' : 'Kargo bizden'}</span></div>
        <div class="bolum"><small>Gönderici</small><b>${x.g === 'A' ? 'S.T. Atölye' : esc(MRK[x.g].tamAd)}</b><span>Gaziemir / İzmir</span></div>
        <div class="bolum"><small>Alıcı</small><b>${esc(x.musteri)}</b><span>${esc(x.il)} · ${x.tel}</span></div>
        <div class="bolum"><small>İçerik</small><b>${x.g === 'A' ? 'Tekstil ürünü' : `${x.kalem.length} parça tekstil`}</b><span>Desi: ${x.kalem.length > 1 ? 2 : 1} · ${x.odeme === 'Kapıda ödeme' ? `Kapıda tahsilat: ${tl(x.toplam)}` : 'Ödemesi alındı'}</span></div>
        <div class="barkod">${barkod(x.kargoKodu)}<span>${x.kargoKodu}</span></div>
        <div class="not">Sipariş ${x.no}${x.g === 'A' ? ' · Gizli paket' : ''}</div>
      </div>
      <div style="display:flex;gap:8px;margin-top:16px;justify-content:flex-end"><button class="dugme ikincil" data-kapat>Kapat</button><button class="dugme" data-yazdir="${nolar.join(',')}">${ikon('yazdir')}Yazdır ve kargoya ver</button></div>`);
  }

  function urunler(q) {
    const liste = gorunen(URUNLER);
    const ara = (new URLSearchParams(q || '').get('ara') || '').toLocaleLowerCase('tr-TR');
    const sonuc = ara ? liste.filter((u) => u.ad.toLocaleLowerCase('tr-TR').includes(ara)) : liste;
    return `
      <div class="sayfa-bas"><div><h2>Ürünler ve stok</h2><p>Stok renk ve beden bazında tutulur; pazaryeri bağlanırsa tek yerden düşer.</p></div><button class="dugme" data-yeni-urun>${ikon('arti')}Yeni ürün</button></div>
      <div class="kart" style="padding:10px 12px"><div class="tablo-kap"><table class="tablo">
        <thead><tr><th>Ürün</th><th class="gizle-m">Marka</th><th class="gizle-m">Kategori</th><th class="sag">Fiyat</th><th class="sag">Stok</th><th>Durum</th></tr></thead>
        <tbody>${sonuc.map((u) => {
          const toplam = Object.values(STOK[u.g + u.id]).reduce((a, b) => a + Object.values(b).reduce((x, y) => x + y, 0), 0);
          const azSay = Object.values(STOK[u.g + u.id]).reduce((a, b) => a + Object.values(b).filter((n) => n <= 2).length, 0);
          const az = azSay >= 3;
          return `<tr data-urun="${u.g + u.id}"><td><div class="liste-satir" style="padding:0"><img src="${IMG(u.gorseller[0])}" alt=""><div><b>${esc(u.ad)}</b><small>${u.renkler.length} renk · ${u.bedenler.length} beden</small></div></div></td>
            <td class="gizle-m">${markaEt(u.g)}</td><td class="gizle-m">${esc(KAT[u.g].kategoriler.find((k) => k.slug === u.kat).ad)}</td>
            <td class="sag"><b>${tl(u.fiyat)}</b>${u.eski ? `<small><s>${tl(u.eski)}</s></small>` : ''}</td><td class="sag"><b>${toplam}</b><small>adet</small></td>
            <td>${toplam === 0 ? '<span class="durum d-iade">Tükendi</span>' : az ? `<span class="durum d-hazir">${azSay} beden azaldı</span>` : `<span class="durum d-teslim">Satışta</span>${azSay ? `<small>${azSay} beden az</small>` : ''}`}</td></tr>`;
        }).join('')}</tbody></table></div></div>`;
  }

  function urunDetay(anahtar) {
    const u = URUN[anahtar];
    if (!u) return;
    const st = STOK[anahtar];
    cekmeceAc(`
      <div class="c-bas"><div><h3>${esc(u.ad)}</h3><small>${markaEt(u.g)} · ${esc(KAT[u.g].kategoriler.find((k) => k.slug === u.kat).ad)}</small></div><button class="kapat" data-kapat aria-label="Kapat">${ikon('x')}</button></div>
      <div class="c-govde">
        <div style="display:grid;grid-template-columns:120px minmax(0,1fr);gap:16px;align-items:start">
          <img src="${IMG(u.gorseller[0])}" alt="" style="width:120px;aspect-ratio:3/4;object-fit:cover;border-radius:12px">
          <div class="blok" style="margin-top:0"><h4>Fiyat</h4><div class="satirlar"><div><span>Satış fiyatı</span><b>${tl(u.fiyat)}</b></div>${u.eski ? `<div><span>Liste fiyatı</span><b><s>${tl(u.eski)}</s></b></div>` : ''}<div><span>Kampanya</span><b>${u.kat === 'pedli' ? '3 al 2 öde' : u.kat === 'takim' ? '2. ürüne %30' : '—'}</b></div><div><span>Puan</span><b>${u.puan.toLocaleString('tr-TR')} · ${u.yorum} yorum</b></div></div></div>
        </div>
        <div class="blok"><h4>Stok · renk × beden</h4>
          <table class="matris"><thead><tr><th></th>${u.bedenler.map((b) => `<th>${esc(b)}</th>`).join('')}</tr></thead>
          <tbody>${u.renkler.map((r) => `<tr><td><i style="background:${r.hex}"></i>${esc(r.ad)}</td>${u.bedenler.map((b) => { const n = st[r.ad][b]; return `<td><input type="number" min="0" value="${n}" class="${n === 0 ? 'yok' : n <= 2 ? 'az' : ''}" data-stok="${anahtar}|${esc(r.ad)}|${esc(b)}" aria-label="${esc(r.ad)} ${esc(b)} stok"></td>`; }).join('')}</tr>`).join('')}</tbody></table>
          <p style="font-size:13px;color:var(--ink3);margin-top:8px">Kırmızı hücreler 2 ve altı; müşteri o bedende "Son 2 ürün" uyarısı görür, 0'da beden kapanır.</p></div>
        <div class="blok"><h4>Ürün metni</h4><p style="font-size:14px;color:var(--ink2);line-height:1.6">${esc(u.aciklama)}</p><p style="font-size:13px;color:var(--ink3);margin-top:8px"><b>Kumaş:</b> ${esc(u.kumas)}</p></div>
      </div>
      <div class="c-alt"><button class="dugme ikincil" data-kapat>Vazgeç</button><button class="dugme" data-urun-kaydet>${ikon('tik')}Kaydet</button></div>`);
  }

  function kampanyalar() {
    const s = siparisler.filter((x) => x.durum !== 'iade');
    const say = (g, kat) => s.filter((x) => x.g === g && x.kalem.some((k) => URUN[g + k.id].kat === kat)).length;
    const k = [
      { g: 'B', ad: 'Pedli seride 3 al 2 öde', acik: 'Pedli seriden 3 ürün alana en uygun fiyatlı ürün bizden.', tarih: '1 Ekim – 31 Aralık', on: true, olcu: [['Kampanyalı ürünlü sipariş', say('B', 'pedli')], ['Sepet ortalaması', '1.640 TL'], ['Dönüşüm etkisi', '+%18']] },
      { g: 'A', ad: 'Dantel takımlarda 2. ürüne %30', acik: 'Dantel takım kategorisinde ikinci ürüne sepette %30 indirim.', tarih: '1 Ekim – 15 Kasım', on: true, olcu: [['Kampanyalı ürünlü sipariş', say('A', 'takim')], ['Sepet ortalaması', '1.520 TL'], ['Dönüşüm etkisi', '+%11']] },
      { g: null, ad: '750 TL üzeri kargo bizden', acik: 'İki markada da geçerli kargo eşiği.', tarih: 'Sürekli', on: true, olcu: [['Eşiği geçen sipariş', `%${Math.round((s.filter((x) => x.ara >= 750).length / s.length) * 100)}`], ['Ortalama sepet', tl(s.reduce((a, x) => a + x.toplam, 0) / s.length)], ['Kargo maliyeti', 'Panelde izlenir']] },
      { g: null, ad: 'HOSGELDIN10 · ilk sipariş kuponu', acik: 'Bülten kaydında verilen %10 kupon; kişi başı bir kez.', tarih: 'Sürekli', on: true, olcu: [['Kullanım', '41'], ['Bültene kayıt', '386'], ['Kupondan ciro', '52.380 TL']] },
      { g: 'A', ad: 'Yılbaşı hediye kutusu', acik: 'Hediye kutusu ve not kartı tüm siparişlerde; yılbaşı görseli.', tarih: '1 – 31 Aralık', on: false, olcu: [['Durum', 'Planlandı'], ['Bütçe', 'Reklamla birlikte'], ['Başlangıç', '1 Aralık']] },
      { g: 'B', ad: 'Anneler Günü kombin kampanyası', acik: 'Anne-çocuk kombinlerde hediye paketi bizden.', tarih: '25 Nisan – 10 Mayıs', on: false, olcu: [['Durum', 'Taslak'], ['Kombin sayısı', '2'], ['Başlangıç', '25 Nisan']] },
    ].filter((x) => filtre === 'tum' || !x.g || x.g === filtre);
    return `<div class="sayfa-bas"><div><h2>Kampanyalar</h2><p>Kurallar sepette kendiliğinden uygulanır; vitrindeki rozetler ve fiyat yazıları buradan beslenir.</p></div><button class="dugme" data-yeni-kampanya>${ikon('arti')}Yeni kampanya</button></div>
      <div class="izgara g2">${k.map((x, i) => `<div class="kart kampanya"><div class="ust-sira"><div><h3>${esc(x.ad)}</h3><p>${x.g ? markaEt(x.g) : '<span class="marka-et">İki marka</span>'} · ${x.tarih}</p></div><input type="checkbox" class="anahtar" ${x.on ? 'checked' : ''} data-kamp="${i}" aria-label="Kampanyayı aç/kapat"></div><p>${esc(x.acik)}</p><div class="olcu">${x.olcu.map(([a, b]) => `<div>${a}<b>${b}</b></div>`).join('')}</div></div>`).join('')}</div>`;
  }

  function musteriler() {
    const harita = new Map();
    for (const x of gorunen(siparisler)) {
      const m = harita.get(x.musteri + x.il) || { ad: x.musteri, il: x.il, n: 0, tutar: 0, son: x.tarih, g: new Set(), eposta: x.tarih.getDate() % 3 !== 0, sms: x.tarih.getDate() % 2 === 0 };
      m.n++; m.tutar += x.toplam; m.g.add(x.g); if (x.tarih > m.son) m.son = x.tarih;
      harita.set(x.musteri + x.il, m);
    }
    const liste = [...harita.values()].sort((a, b) => b.tutar - a.tutar);
    return `<div class="sayfa-bas"><div><h2>Müşteriler</h2><p>${liste.length} müşteri · iletişim izinleri İleti Yönetim Sistemi (İYS) kaydıyla eşitlenir.</p></div></div>
      <div class="kart" style="padding:10px 12px"><div class="tablo-kap"><table class="tablo"><thead><tr><th>Müşteri</th><th class="gizle-m">Marka</th><th class="sag">Sipariş</th><th class="sag">Toplam</th><th class="gizle-m">Son sipariş</th><th>İzinler</th></tr></thead>
      <tbody>${liste.map((m) => `<tr><td><b>${esc(m.ad)}</b><small>${esc(m.il)}</small></td><td class="gizle-m">${[...m.g].map(markaEt).join(' ')}</td><td class="sag">${m.n}</td><td class="sag"><b>${tl(m.tutar)}</b></td><td class="gizle-m">${tarihYaz(m.son, false)}</td><td>${m.eposta ? '<span class="bayrak">E-posta</span>' : ''}${m.sms ? '<span class="bayrak">SMS</span>' : ''}${!m.eposta && !m.sms ? '<span style="color:var(--ink3);font-size:13px">İzin yok</span>' : ''}</td></tr>`).join('')}</tbody></table></div></div>`;
  }

  function iadeler() {
    const liste = gorunen(siparisler).filter((x) => x.durum === 'iade');
    const neden = ['Beden uymadı', 'Renk beklediğim gibi değil', 'Fikrimi değiştirdim', 'Beden uymadı'];
    return `<div class="sayfa-bas"><div><h2>İadeler ve değişim</h2><p>İç giyim ve pedli seride iade, hijyen bandı açılmamış ürünlerde kabul edilir; kural panelde tanımlıdır.</p></div></div>
      <div class="izgara g2">${liste.map((x, i) => `<div class="kart"><div class="kart-bas"><h3>${x.no} · ${esc(x.musteri)}</h3>${durumEt('iade')}</div>
        ${x.kalem.slice(0, 1).map((k) => { const u = URUN[x.g + k.id]; return `<div class="liste-satir"><img src="${IMG(u.gorseller[0])}" alt=""><div><b>${esc(u.ad)}</b><small>${esc(k.renk)} · ${esc(k.beden)} · ${markaEt(x.g)}</small></div><b>${tl(u.fiyat)}</b></div>`; }).join('')}
        <div class="blok"><div class="satirlar"><div><span>Neden</span><b>${neden[i % neden.length]}</b></div><div><span>Talep tarihi</span><b>${tarihYaz(new Date(x.tarih.getTime() + 4 * 864e5), false)}</b></div><div><span>Hijyen bandı</span><b>${x.g === 'A' || URUN[x.g + x.kalem[0].id].kat === 'pedli' ? 'Kontrol edilecek' : 'Gerekmez'}</b></div></div></div>
        <div style="display:flex;gap:8px;margin-top:12px"><button class="dugme kucuk" data-iade="onay">İade kodu gönder</button><button class="dugme kucuk ikincil" data-iade="degisim">Değişime çevir</button></div></div>`).join('') || '<div class="kart">Açık iade talebi yok.</div>'}</div>`;
  }

  function raporlar() {
    const s = gorunen(siparisler).filter((x) => x.durum !== 'iade');
    const ciro = s.reduce((a, x) => a + x.toplam, 0);
    const ziyaret = Math.round(s.length / 0.019);
    return `<div class="sayfa-bas"><div><h2>Raporlar</h2><p>Son 14 gün · reklam verileri Meta, TikTok ve Google hesaplarından çekilir.</p></div><button class="dugme ikincil" data-disari-aktar>${ikon('fatura')}PDF rapor</button></div>
      <div class="izgara g4">
        <div class="kart kpi"><small>Ciro</small><b>${tl(ciro)}</b><span><em>iade hariç</em></span></div>
        <div class="kart kpi"><small>Sipariş</small><b>${s.length}</b><span><em>${(s.length / 14).toFixed(1).replace('.', ',')} / gün</em></span></div>
        <div class="kart kpi"><small>Dönüşüm oranı</small><b>%1,9</b><span><em>${ziyaret.toLocaleString('tr-TR')} ziyaret</em></span></div>
        <div class="kart kpi"><small>Reklam getirisi</small><b>4,2×</b><span><em>harcanan 1 TL'ye ciro</em></span></div>
      </div>
      <div class="izgara g2" style="margin-top:16px">
        <div class="kart"><div class="kart-bas"><h3>Satış hunisi</h3><span>14 gün</span></div>
          <div class="huni">${[['Ziyaret', ziyaret, 100], ['Ürün görüntüleme', Math.round(ziyaret * 0.58), 58], ['Sepete ekleme', Math.round(ziyaret * 0.078), 22], ['Ödeme adımı', Math.round(ziyaret * 0.034), 12], ['Sipariş', s.length, 7]].map(([a, n, w]) => `<div><span>${a}</span><i style="width:${w}%"></i><b>${n.toLocaleString('tr-TR')}</b></div>`).join('')}</div>
          <p style="font-size:13px;color:var(--ink3);margin-top:14px">Sepete ekleyip almayanlara 1 saat sonra hatırlatma gider; geri dönenler ayrıca raporlanır.</p></div>
        <div class="kart"><div class="kart-bas"><h3>Reklam performansı</h3><span>platform bazında</span></div>
          <div class="tablo-kap"><table class="tablo"><thead><tr><th>Platform</th><th class="sag">Harcama</th><th class="sag">Ciro</th><th class="sag">Getiri</th></tr></thead><tbody>
            ${[['Meta (Instagram, Facebook)', 0.46, 3.9], ['TikTok', 0.24, 3.1], ['Google Arama ve Alışveriş', 0.30, 5.6]].map(([p, pay, g]) => { const h = (ciro / 4.2) * pay; return `<tr><td><b>${p}</b></td><td class="sag">${tl(h)}</td><td class="sag">${tl(h * g)}</td><td class="sag"><b>${String(g).replace('.', ',')}×</b></td></tr>`; }).join('')}
          </tbody></table></div></div>
      </div>`;
  }

  function entegrasyonlar() {
    const e = [
      ['ÖK', 'Ödeme kuruluşu', '3D Secure, 9 taksit, iade; iyzico ya da PayTR', true],
      ['K', 'Kargo', 'Gönderi kodu, 10×15 etiket, takip SMS ve e-postası', true],
      ['GA', 'Google Analytics 4', 'Ziyaret, sepet ve satış olayları', true],
      ['M', 'Meta Pixel ve Dönüşüm API', 'Instagram ve Facebook reklam ölçümü, katalog', true],
      ['TT', 'TikTok Pixel', 'TikTok reklam ölçümü', true],
      ['G', 'Google Ads ve Merchant Center', 'Arama ve alışveriş reklamları, ürün akışı', true],
      ['İYS', 'İleti Yönetim Sistemi', 'E-posta ve SMS izinlerinin yasal kaydı', true],
      ['SMS', 'SMS servisi', 'Sipariş, kargo ve sepet hatırlatma mesajları', true],
      ['eF', 'e-Fatura / e-Arşiv', 'Siparişten otomatik fatura · isteğe bağlı', false],
      ['TY', 'Trendyol', 'Ürün, stok ve sipariş eşitleme · isteğe bağlı', false],
      ['HB', 'Hepsiburada', 'Ürün, stok ve sipariş eşitleme · isteğe bağlı', false],
    ];
    return `<div class="sayfa-bas"><div><h2>Entegrasyonlar</h2><p>İki marka aynı bağlantıları kullanır; her markanın alan adı ve reklam hesapları ayrıdır.</p></div></div>
      <div class="izgara g2">${e.map(([k, ad, a, b]) => `<div class="kart entegre"><span class="logo-k">${k}</span><div><b>${ad}</b><small>${a}</small></div>${b ? '<span class="etiket-baglı"><i></i>Bağlı</span>' : '<button class="dugme kucuk ikincil" data-kur>Kur</button>'}</div>`).join('')}</div>`;
  }

  // ── Yönlendirme ve etkileşim ─────────────────────────────────────────────
  function yonlendir() {
    const [yol, q] = (location.hash.slice(2) || 'gosterge').split('?');
    const sayfa = SAYFALAR.find(([k]) => k === yol) ? yol : 'gosterge';
    const f = { gosterge, siparisler: siparisListesi, urunler, kampanyalar, musteriler, iadeler, raporlar, entegrasyonlar }[sayfa];
    $('#icerik').innerHTML = f(q);
    $('#baslik').textContent = SAYFALAR.find(([k]) => k === sayfa)[1];
    $$('.yan nav a').forEach((a) => a.classList.toggle('on', a.dataset.yol === sayfa));
    $('#yan').classList.remove('acik');
    document.title = `${SAYFALAR.find(([k]) => k === sayfa)[1]} · Yönetim paneli · ${MA.ad} ve ${MB.ad}`;
    topluCiz();
    ipucuBagla();
  }
  function ipucuBagla() {
    const ip = $('#ipucu');
    if (!ip) return;
    $$('[data-ipucu]').forEach((g) => {
      g.addEventListener('mouseenter', () => {
        const [t, a, b] = g.dataset.ipucu.split('|');
        ip.innerHTML = `<b>${t}</b>${filtre !== 'B' ? `<br>${esc(MA.ad)}: ${a}` : ''}${filtre !== 'A' ? `<br>${esc(MB.ad)}: ${b}` : ''}`;
        const r = g.getBoundingClientRect(), k = ip.parentElement.getBoundingClientRect();
        ip.style.left = `${r.left - k.left + r.width / 2}px`; ip.style.top = `${r.top - k.top + 30}px`;
        ip.classList.add('acik');
      });
      g.addEventListener('mouseleave', () => ip.classList.remove('acik'));
    });
  }
  function cekmeceAc(html) {
    $('#cekmece').innerHTML = html;
    $('#cekmece').classList.add('acik'); $('#cekmece').setAttribute('aria-hidden', 'false'); $('#perde').classList.add('acik');
  }
  function kapat() {
    $('#cekmece').classList.remove('acik'); $('#cekmece').setAttribute('aria-hidden', 'true');
    $('#perde').classList.remove('acik'); $('#modal').classList.remove('acik'); $('#yan').classList.remove('acik');
  }
  function modalAc(html) {
    $('#modal-kutu').innerHTML = `<button class="kapat" data-kapat aria-label="Kapat">${ikon('x')}</button>${html}`;
    $('#modal').classList.add('acik');
  }
  let bz;
  function bildir(m) { const el = $('#bildirim'); el.innerHTML = `${ikon('tik')}${esc(m)}`; el.classList.add('acik'); clearTimeout(bz); bz = setTimeout(() => el.classList.remove('acik'), 2800); }

  function olaylar() {
    document.addEventListener('click', (e) => {
      const t = e.target.closest('[data-filtre],[data-durum],[data-siparis],[data-urun],[data-kapat],[data-etiket],[data-yazdir],[data-durum-yap],[data-fatura],[data-toplu],[data-menu],[data-urun-kaydet],[data-yeni-urun],[data-yeni-kampanya],[data-disari-aktar],[data-kur],[data-iade],[data-dur]');
      if (!t) return;
      const d = t.dataset;
      if (d.dur !== undefined) return; // seçim kutusu hücresi: satır açılmasın
      if (d.filtre) { filtre = d.filtre; $$('[data-filtre]').forEach((b) => b.classList.toggle('on', b === t)); yonlendir(); return; }
      if (d.durum) { location.hash = `#/siparisler${d.durum === 'tum' ? '' : `?durum=${d.durum}`}`; return; }
      if (d.siparis) { siparisDetay(d.siparis); return; }
      if (d.urun) { urunDetay(d.urun); return; }
      if (d.kapat !== undefined) { kapat(); return; }
      if (d.etiket) { etiketGoster([d.etiket]); return; }
      if (d.yazdir) {
        for (const no of d.yazdir.split(',')) { const x = siparisler.find((s) => s.no === no); if (x && (x.durum === 'yeni' || x.durum === 'hazir')) x.durum = 'kargo'; }
        secili.clear(); kapat(); yonlendir(); bildir('Etiket yazdırıldı, sipariş kargoya verildi; müşteriye takip SMS\'i gitti (demo).');
        $('#yeni-sayi').textContent = siparisler.filter((s) => s.durum === 'yeni').length;
        return;
      }
      if (d.durumYap) { const [no, yeni] = d.durumYap.split('|'); const x = siparisler.find((s) => s.no === no); if (x) x.durum = yeni; siparisDetay(no); yonlendir(); $('#yeni-sayi').textContent = siparisler.filter((s) => s.durum === 'yeni').length; bildir('Sipariş "Hazırlanıyor" olarak işaretlendi'); return; }
      if (d.fatura) { bildir('e-Arşiv fatura oluşturuldu ve müşteriye e-postayla gönderildi (demo)'); return; }
      if (d.toplu === 'etiket') { etiketGoster([...secili]); return; }
      if (d.toplu === 'hazir') { for (const no of secili) { const x = siparisler.find((s) => s.no === no); if (x && x.durum === 'yeni') x.durum = 'hazir'; } secili.clear(); yonlendir(); bildir('Seçilen siparişler "Hazırlanıyor" yapıldı'); return; }
      if (d.menu !== undefined) { $('#yan').classList.toggle('acik'); $('#perde').classList.toggle('acik'); return; }
      if (d.urunKaydet !== undefined) { kapat(); yonlendir(); bildir('Stok kaydedildi; vitrin ve pazaryerleri güncellendi (demo)'); return; }
      if (d.yeniUrun !== undefined || d.yeniKampanya !== undefined || d.kur !== undefined) { bildir('Demo: bu adım yayındaki panelde form olarak açılır'); return; }
      if (d.disariAktar !== undefined) { bildir('Demo: dosya hazırlanır ve indirilir'); return; }
      if (d.iade) { bildir(d.iade === 'onay' ? 'Müşteriye iade kargo kodu SMS ile gönderildi (demo)' : 'Değişim siparişi oluşturuldu (demo)'); }
    });
    document.addEventListener('change', (e) => {
      const t = e.target;
      if (t.matches('[data-sec]')) { t.checked ? secili.add(t.dataset.sec) : secili.delete(t.dataset.sec); topluCiz(); }
      if (t.matches('[data-hepsi]')) { $$('[data-sec]').forEach((c) => { c.checked = t.checked; t.checked ? secili.add(c.dataset.sec) : secili.delete(c.dataset.sec); }); topluCiz(); }
      if (t.matches('[data-stok]')) { const [k, renk, beden] = t.dataset.stok.split('|'); STOK[k][renk][beden] = Math.max(0, +t.value || 0); t.className = STOK[k][renk][beden] === 0 ? 'yok' : STOK[k][renk][beden] <= 2 ? 'az' : ''; }
      if (t.matches('[data-kamp]')) bildir(t.checked ? 'Kampanya yayına alındı (demo)' : 'Kampanya durduruldu (demo)');
    });
    document.addEventListener('submit', (e) => {
      if (!e.target.matches('[data-ara]')) return;
      e.preventDefault();
      const q = $('#p-ara').value.trim();
      const sayfa = (location.hash.slice(2).split('?')[0]) === 'urunler' ? 'urunler' : 'siparisler';
      location.hash = `#/${sayfa}${q ? `?ara=${encodeURIComponent(q)}` : ''}`;
    });
    $('#perde').addEventListener('click', kapat);
    $('#modal').addEventListener('click', (e) => { if (e.target.id === 'modal') kapat(); });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') kapat(); });
    addEventListener('hashchange', yonlendir);
  }

  kabuk();
  olaylar();
  yonlendir();
})();
