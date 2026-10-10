/* Sarnıç Tekstil · demo mağaza motoru (vanilla JS, derleme yok)
   Veri: MERT_MARKALAR (marka kimlikleri) + TEMALAR (arayüz) + LOGOLAR + KATALOG (çizgi A ya da B) + KAMPANYALAR
   Yol: #/ · #/k/<kategori> · #/u/<ürün> · #/ara/<sözcük> · #/sepet · #/odeme · #/siparis/<no> · #/takip/<no>
        #/hesabim · #/favoriler · #/s/<sayfa>
   Durum tarayıcıda (localStorage) tutulur; gerçek sipariş ve ödeme yoktur. */
(() => {
  'use strict';
  const K = window.KATALOG;
  const LOGO = window.LOGOLAR;
  const KAMP = window.KAMPANYALAR[K.grup];
  const MARKALAR = window.MERT_MARKALAR.filter((m) => m.grup === K.grup).sort((a, b) => a.no - b.no)
    .map((m) => ({ ...m, t: window.TEMALAR[m.id] }));
  const A = K.grup === 'A';
  const DIGER = A ? 'pijama' : 'ic-giyim';
  const KOK = '../assets/';
  const IMG = (k, kucuk) => `${KOK}img/urun/${k}${kucuk ? 's' : ''}.webp`;
  const URUN = Object.fromEntries(K.urunler.map((u) => [u.id, u]));
  const KAT = Object.fromEntries(K.kategoriler.map((k) => [k.slug, k]));

  // ── Yardımcılar ──────────────────────────────────────────────────────────
  const $ = (q, el = document) => el.querySelector(q);
  const $$ = (q, el = document) => [...el.querySelectorAll(q)];
  const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const yalin = (s) => String(s ?? '').replace(/<br\s*\/?>/g, ' ').replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
  const tl = (n) => `${Math.round(n).toLocaleString('tr-TR')} TL`;
  const indirimYuzde = (u) => (u.eski ? Math.round((1 - u.fiyat / u.eski) * 100) : 0);
  const kucuk = (s) => s.toLocaleLowerCase('tr-TR');
  const stokToplam = (u, renk) => Object.values(u.stok[renk] || {}).reduce((a, b) => a + b, 0);
  const ilkRenk = (u) => u.renkler.find((r) => stokToplam(u, r.ad) > 0)?.ad || u.renkler[0].ad;

  const I = {
    ara: '<path d="M10.5 18a7.5 7.5 0 1 1 0-15 7.5 7.5 0 0 1 0 15zM21 21l-5.2-5.2"/>',
    kalp: '<path d="M12 20.3s-7.6-4.7-7.6-10.7A4.4 4.4 0 0 1 12 6.8a4.4 4.4 0 0 1 7.6 2.8c0 6-7.6 10.7-7.6 10.7z"/>',
    canta: '<path d="M5.2 8.2h13.6l-1 12.3H6.2L5.2 8.2z"/><path d="M8.8 8.2V6.6a3.2 3.2 0 0 1 6.4 0v1.6"/>',
    kisi: '<circle cx="12" cy="8" r="3.8"/><path d="M4.5 20.5c1.3-3.6 4.2-5.4 7.5-5.4s6.2 1.8 7.5 5.4"/>',
    menu: '<path d="M4 7h16M4 12h16M4 17h11"/>',
    x: '<path d="M6 6l12 12M18 6L6 18"/>',
    sag: '<path d="M9 5l7 7-7 7"/>', sol: '<path d="M15 5l-7 7 7 7"/>', asagi: '<path d="M6 9l6 6 6-6"/>',
    ok: '<path d="M5 12h14M13 6l6 6-6 6"/>',
    kamyon: '<path d="M2.5 6.5h11v9.5h-11zM13.5 9.5h4.2l3 3.2v3.3h-7.2"/><circle cx="6.5" cy="17.5" r="1.8"/><circle cx="17" cy="17.5" r="1.8"/>',
    kutu: '<path d="M3.5 7.8L12 4l8.5 3.8L12 11.6 3.5 7.8z"/><path d="M3.5 7.8v8.4L12 20l8.5-3.8V7.8M12 11.6V20"/>',
    hediye: '<rect x="3.8" y="9" width="16.4" height="11" rx="1.5"/><path d="M3 9h18M12 9v11M12 9S10 4.5 7.6 5.6 8.6 9 12 9zM12 9s2-4.5 4.4-3.4S15.4 9 12 9z"/>',
    donus: '<path d="M4 9.5h11a5 5 0 0 1 0 10H8"/><path d="M8 5.5l-4 4 4 4"/>',
    kilit: '<rect x="5" y="10.5" width="14" height="9.5" rx="2"/><path d="M8 10.5V8a4 4 0 0 1 8 0v2.5"/>',
    kart: '<rect x="3" y="5.5" width="18" height="13" rx="2"/><path d="M3 10h18M7 15h4"/>',
    konum: '<path d="M12 21s-6.5-6-6.5-11.2a6.5 6.5 0 0 1 13 0C18.5 15 12 21 12 21z"/><circle cx="12" cy="9.8" r="2.3"/>',
    yaprak: '<path d="M5 19c0-8.6 5.4-13.6 14-14.5-.9 9.1-6 14.5-14 14.5zM5 19l7.5-7.5"/>',
    damla: '<path d="M12 3.2s6.2 6.8 6.2 11.4a6.2 6.2 0 0 1-12.4 0C5.8 10 12 3.2 12 3.2z"/>',
    makas: '<circle cx="6" cy="7" r="2.6"/><circle cx="6" cy="17" r="2.6"/><path d="M8.2 8.4L20 16M8.2 15.6L20 8"/>',
    yildiz: '<path d="M12 3.2l2.6 5.6 6.1.7-4.5 4.2 1.2 6.1L12 16.8l-5.4 3 1.2-6.1-4.5-4.2 6.1-.7z"/>',
    oynat: '<path d="M8 5.5v13l10.5-6.5z"/>',
    tik: '<path d="M5 12.5l4.5 4.5L19 7.5"/>',
    etiket: '<path d="M3.5 12.6V4.5h8.1l8.9 8.9-8.1 8.1-8.9-8.9z"/><circle cx="8" cy="8.5" r="1.4"/>',
    filtre: '<path d="M4 6.5h16M7 12h10M10 17.5h4"/>',
    disari: '<path d="M14 4.5h5.5V10M19.5 4.5L11 13M19 14.5v4.5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1h4.5"/>',
    sohbet: '<path d="M4.5 18.5l1.3-3.6A7.5 7.5 0 1 1 9 18.3l-4.5.2z"/>',
    ayar: '<circle cx="12" cy="12" r="3"/><path d="M12 2.8v2.6M12 18.6v2.6M21.2 12h-2.6M5.4 12H2.8M18.5 5.5l-1.8 1.8M7.3 16.7l-1.8 1.8M18.5 18.5l-1.8-1.8M7.3 7.3L5.5 5.5"/>',
  };
  const ikon = (ad, cls = '') => `<svg class="i ${cls}" viewBox="0 0 24 24" aria-hidden="true">${I[ad]}</svg>`;
  const yildizSvg = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2.8l2.75 5.95 6.5.72-4.8 4.43 1.3 6.42L12 17.1l-5.75 3.22 1.3-6.42-4.8-4.43 6.5-.72z"/></svg>';

  // ── Depo ─────────────────────────────────────────────────────────────────
  const ANAHTAR = `srn-${K.grup}-`;
  const depo = {
    al(k, v) { try { const x = localStorage.getItem(ANAHTAR + k); return x == null ? v : JSON.parse(x); } catch { return v; } },
    yaz(k, v) { try { localStorage.setItem(ANAHTAR + k, JSON.stringify(v)); } catch { /* gizli pencere */ } },
  };
  let sepet = depo.al('sepet', []).filter((s) => URUN[s.id]);
  let favori = depo.al('favori', []).filter((id) => URUN[id]);
  let siparisler = depo.al('siparisler', []);
  let sonBakilan = depo.al('son', []).filter((id) => URUN[id]);
  let kupon = depo.al('kupon', '');
  const kaydet = () => { depo.yaz('sepet', sepet); depo.yaz('favori', favori); depo.yaz('siparisler', siparisler); depo.yaz('son', sonBakilan); depo.yaz('kupon', kupon); };

  // ── Marka teması ─────────────────────────────────────────────────────────
  let M = MARKALAR[0];
  const yuklenenFont = new Set();
  function markaUygula(id, ilk) {
    M = MARKALAR.find((m) => m.id === id) || MARKALAR[0];
    const t = M.t, r = document.documentElement.style;
    for (const [k, v] of Object.entries(t.renk)) r.setProperty(`--${k}`, v);
    r.setProperty('--r', t.r); r.setProperty('--r-buyuk', t.rBuyuk); r.setProperty('--r-dugme', t.rDugme);
    r.setProperty('--f-baslik', t.baslikFont); r.setProperty('--w-baslik', t.baslikAgirlik); r.setProperty('--t-baslik', t.baslikHarf);
    r.setProperty('--hero-ink', t.heroInk); r.setProperty('--yildiz', t.koyu ? '#D6B27E' : '#E09A00');
    r.setProperty('--logo-ink', t.logo.ink); r.setProperty('--logo-a', t.logo.a);
    r.setProperty('--logo-a2', t.logo.a2 || t.logo.a); r.setProperty('--logo-a3', t.logo.a3 || t.logo.a2 || t.logo.a);
    const h = document.documentElement;
    h.dataset.koyu = t.koyu ? '1' : '0'; h.dataset.buyuk = t.baslikBuyuk ? '1' : '0'; h.dataset.dugmeBuyuk = t.dugmeBuyuk ? '1' : '0'; h.dataset.tema = M.id;
    if (t.googleFont && !yuklenenFont.has(t.googleFont)) {
      yuklenenFont.add(t.googleFont);
      const l = document.createElement('link');
      l.rel = 'stylesheet'; l.href = `https://fonts.googleapis.com/css2?family=${t.googleFont}&display=swap`;
      document.head.append(l);
    }
    document.title = `${M.tamAd} · ${M.slogan}`;
    $('meta[name=theme-color]')?.setAttribute('content', t.renk.bg);
    try { localStorage.setItem(`srn-marka-${K.grup}`, M.id); } catch { /* yok */ }
    const u = new URL(location.href); u.searchParams.set('marka', M.id); history.replaceState(null, '', u);
    if (!ilk) { kabukCiz(); yonlendir(true); }
  }

  // ── Kabuk ────────────────────────────────────────────────────────────────
  function kabukKur() {
    document.body.insertAdjacentHTML('afterbegin', `
      <div class="duyuru" id="duyuru"></div>
      <header class="ust" id="ust"></header>
      <main id="sayfa"></main>
      <footer class="alt" id="alt"></footer>
      <div class="perde" id="perde"></div>
      <aside class="cekmece sag" id="c-sepet" aria-label="Sepet" aria-hidden="true"></aside>
      <aside class="cekmece sol" id="c-menu" aria-label="Menü" aria-hidden="true"></aside>
      <aside class="cekmece sol" id="c-filtre" aria-label="Filtreler" aria-hidden="true"></aside>
      <div class="modal" id="modal" role="dialog" aria-modal="true"><div class="modal-kutu" id="modal-kutu"></div></div>
      <div class="bildirim" id="bildirim" role="status"></div>
      <div class="demo-bar" id="demo-bar"></div>`);
  }

  const menuLinkleri = () => [
    ['#/k/yeni', 'Yeni gelenler'],
    ...K.kategoriler.map((k) => [`#/k/${k.slug}`, k.ad]),
    ['#/k/kampanya', 'Kampanyalar', 'kamp'],
  ];

  function kabukCiz() {
    const duyuru = M.duyuru.map((d, i) => `<span class="${i === 0 ? 'aktif' : ''}">${ikon(['kamyon', 'kutu', 'donus'][i % 3])}${esc(d)}</span>`).join('');
    $('#duyuru').innerHTML = `<div class="kap duyuru-in">${duyuru}</div>`;
    $('#ust').innerHTML = `
      <div class="kap ust-in">
        <button class="arac menu-ac" data-ac="menu" aria-label="Menüyü aç">${ikon('menu')}</button>
        <a href="#/" class="logo" aria-label="${esc(M.tamAd)} ana sayfa">${LOGO[M.id]}</a>
        <form class="ara" role="search" data-ara-form>
          ${ikon('ara')}
          <label class="sr" for="ara-girdi">Ürün ara</label>
          <input id="ara-girdi" type="search" autocomplete="off" placeholder="${A ? 'Saten gecelik, dantel takım, gelin seti…' : 'Çizgili pijama, pedli külot, kombin…'}" data-ara-ac>
        </form>
        <nav class="araclar" aria-label="Hesap ve sepet">
          <button class="arac ara-ikon" data-ac="ara" aria-label="Ara">${ikon('ara')}</button>
          <a class="arac" href="#/hesabim" aria-label="Hesabım">${ikon('kisi')}<span class="et">Hesabım</span></a>
          <a class="arac" href="#/favoriler" aria-label="Favoriler">${ikon('kalp')}<span class="sayi" id="fav-sayi"></span><span class="et">Favoriler</span></a>
          <button class="arac" data-ac="sepet" aria-label="Sepet">${ikon('canta')}<span class="sayi" id="sepet-sayi"></span><span class="et">Sepet</span></button>
        </nav>
      </div>
      <nav class="kat-nav" aria-label="Kategoriler"><div class="kap">
        ${menuLinkleri().map(([h, ad, cls]) => {
          const slug = h.split('/')[2];
          const kat = KAT[slug];
          return `<div class="n"><a href="${h}" class="${cls || ''}" data-yol="${h}">${esc(ad)}${kat ? ikon('asagi') : ''}</a>${kat ? megaHTML(kat) : ''}</div>`;
        }).join('')}
        <span class="sag">${ikon('kutu')}${A ? 'Gizli paketleme, her siparişte' : 'İzmir\'de, kendi atölyemizde üretildi'}</span>
      </div></nav>`;
    $('#c-menu').innerHTML = `
      <div class="c-bas"><span class="logo" style="height:40px">${LOGO[M.id]}</span><button class="kapat" data-kapat aria-label="Kapat">${ikon('x')}</button></div>
      <div class="c-govde"><nav class="mnav">
        ${menuLinkleri().map(([h, ad]) => `<a href="${h}">${esc(ad)}${ikon('sag')}</a>`).join('')}
        <hr>
        <a class="kucuk" href="#/hesabim">Hesabım</a><a class="kucuk" href="#/favoriler">Favorilerim</a>
        <a class="kucuk" href="#/s/kargo-iade">Kargo ve iade</a><a class="kucuk" href="#/s/beden-rehberi">Beden rehberi</a>
        <a class="kucuk" href="#/s/hakkimizda">Hakkımızda</a><a class="kucuk" href="#/s/sss">Sıkça sorulanlar</a>
      </nav></div>`;
    $('#alt').innerHTML = altHTML();
    demoBarCiz();
    sayaclar();
    sepetCiz();
  }

  function megaHTML(kat) {
    const urunler = K.urunler.filter((u) => u.kat === kat.slug);
    const etiketler = [...new Set(urunler.flatMap((u) => u.etiketler))].slice(0, 5);
    const one = [...urunler].sort((a, b) => b.satis - a.satis).slice(0, 2);
    return `<div class="mega"><div class="mega-in">
      <div class="mega-linkler">
        <a class="tum" href="#/k/${kat.slug}">Tümünü gör</a>
        ${etiketler.map((e) => `<a href="#/k/${kat.slug}?kumas=${encodeURIComponent(e)}">${esc(e[0].toLocaleUpperCase('tr-TR') + e.slice(1))}</a>`).join('')}
        ${urunler.some((u) => u.eski) ? `<a href="#/k/${kat.slug}?indirim=1">İndirimdekiler</a>` : ''}
      </div>
      <div class="mega-urunler">${one.map((u) => `<a class="mega-urun" href="#/u/${u.id}"><img src="${IMG(u.gorseller[0], true)}" alt="" loading="lazy"><span>${esc(u.ad)}</span><b>${tl(u.fiyat)}</b></a>`).join('')}</div>
    </div></div>`;
  }

  function altHTML() {
    const alan = M.alanAdi;
    return `<div class="kap">
      <div class="alt-izgara">
        <div>
          <a href="#/" class="logo" aria-label="${esc(M.tamAd)}">${LOGO[M.id]}</a>
          <p>${esc(M.slogan)} ${esc(yalin(M.konumlanma).split('.')[0])}.</p>
          <div class="guvence-sira"><span>${ikon('kilit')}3D Secure ile güvenli ödeme</span><span>${ikon('kart')}9 taksit</span><span>${ikon('donus')}14 gün içinde değişim</span></div>
        </div>
        <div><h4>Alışveriş</h4><ul>${menuLinkleri().map(([h, ad]) => `<li><a href="${h}">${esc(ad)}</a></li>`).join('')}</ul></div>
        <div><h4>Yardım</h4><ul>
          <li><a href="#/s/kargo-iade">Kargo ve iade</a></li><li><a href="#/s/beden-rehberi">Beden rehberi</a></li>
          <li><a href="#/hesabim">Sipariş takibi</a></li><li><a href="#/s/sss">Sıkça sorulanlar</a></li><li><a href="#/s/iletisim">İletişim</a></li>
        </ul></div>
        <div><h4>Kurumsal</h4><ul>
          <li><a href="#/s/hakkimizda">Hakkımızda</a></li><li><a href="#/s/kvkk">KVKK aydınlatma metni</a></li>
          <li><a href="#/s/mesafeli">Mesafeli satış sözleşmesi</a></li><li><span>info@${esc(alan)}</span></li>
        </ul></div>
      </div>
      <div class="alt-taban">
        <span>© 2026 ${esc(M.tamAd)} · Tasarım demosudur; gerçek sipariş ve ödeme alınmaz.</span>
        <a class="algow-credit" href="https://algow.net" target="_blank" rel="noopener" aria-label="Algow tarafından tasarlandı ve geliştirildi"><span>Tasarım &amp; Geliştirme</span><img src="${KOK}img/algow-wordmark.webp" alt="Algow" width="58" height="20" loading="lazy" decoding="async"></a>
      </div>
    </div>`;
  }

  function demoBarCiz() {
    const digerMarka = (() => { try { return localStorage.getItem(`srn-marka-${A ? 'B' : 'A'}`) || ''; } catch { return ''; } })();
    const panelUrl = `../panel/?a=${A ? M.id : digerMarka || 'lal'}&b=${A ? digerMarka || 'imbat' : M.id}`;
    const acik = $('#demo-bar').classList.contains('genis');
    $('#demo-bar').innerHTML = `
      <div class="db-liste" role="menu" aria-label="Marka seçenekleri">
        <small>${A ? 'Fantezi iç giyim' : 'Pijama ve pedli seri'} · marka seçenekleri</small>
        ${MARKALAR.map((m) => `<button role="menuitemradio" aria-checked="${m.id === M.id}" data-marka="${m.id}" class="${m.id === M.id ? 'on' : ''}"><i style="background:${m.t.renk.vurgu}"></i><span><b>${m.no}. ${esc(m.ad)}</b><small>${esc(m.slogan)}</small></span></button>`).join('')}
        <a href="../${DIGER}/">${A ? 'Pijama ve pedli seri demosu' : 'Fantezi iç giyim demosu'}${ikon('ok')}</a>
        <a href="../">Tüm demolar${ikon('ok')}</a>
      </div>
      <button class="db-ana" data-demo-ac aria-expanded="${acik}" aria-label="Marka seçeneğini değiştir"><i style="background:${M.t.renk.vurgu}"></i><span>Demo · <b>${M.no}. ${esc(M.ad)}</b></span>${ikon('asagi')}</button>
      <a class="db-panel" href="${panelUrl}" title="Yönetim paneli demosu">${ikon('ayar')}<span>Panel</span></a>`;
  }

  function sayaclar() {
    const n = sepet.reduce((a, s) => a + s.adet, 0);
    const sn = $('#sepet-sayi'); if (sn) sn.textContent = n || '';
    const fn = $('#fav-sayi'); if (fn) fn.textContent = favori.length || '';
  }

  // ── Fiyat, kampanya ve sepet hesabı ──────────────────────────────────────
  function hesapla(liste = sepet, secim = {}) {
    const satirlar = liste.map((s) => ({ ...s, u: URUN[s.id], tutar: URUN[s.id].fiyat * s.adet }));
    const ara = satirlar.reduce((a, s) => a + s.tutar, 0);
    const indirimler = [];
    for (const k of KAMP.kurallar) {
      const birimler = satirlar.filter((s) => s.u.kat === k.kat).flatMap((s) => Array(s.adet).fill(s.u.fiyat)).sort((a, b) => b - a);
      let tutar = 0;
      if (k.tur === 'ucal') for (let i = 2; i < birimler.length; i += 3) tutar += birimler[i];
      if (k.tur === 'ikinci') for (let i = 1; i < birimler.length; i += 2) tutar += Math.round(birimler[i] * k.oran / 100);
      if (tutar > 0) indirimler.push({ ad: k.ad, tutar });
    }
    const kampIndirim = indirimler.reduce((a, x) => a + x.tutar, 0);
    let kuponTutar = 0;
    if (kupon === 'HOSGELDIN10' && ara - kampIndirim > 0) { kuponTutar = Math.round((ara - kampIndirim) * 0.1); indirimler.push({ ad: 'HOSGELDIN10 kuponu (%10)', tutar: kuponTutar }); }
    const net = ara - kampIndirim - kuponTutar;
    const kargo = !satirlar.length ? 0 : secim.kargo === 'hizli' ? K.kargoUcret + 60 : net >= K.kargoLimit ? 0 : K.kargoUcret;
    const kapida = secim.odeme === 'kapida' ? K.kapidaUcret : 0;
    const hediye = !A && secim.hediye ? 39 : 0;
    return { satirlar, ara, indirimler, net, kargo, kapida, hediye, toplam: net + kargo + kapida + hediye, kalan: Math.max(0, K.kargoLimit - net) };
  }

  function sepeteEkle(id, renk, beden, adet = 1) {
    const u = URUN[id];
    if (!u) return;
    renk = renk || ilkRenk(u);
    if (!beden) { bildir('Önce beden seç', null); return false; }
    const varolan = sepet.find((s) => s.id === id && s.renk === renk && s.beden === beden);
    if (varolan) varolan.adet = Math.min(varolan.adet + adet, 9); else sepet.push({ id, renk, beden, adet });
    kaydet(); sayaclar(); sepetCiz();
    bildir(`${u.ad} sepete eklendi`, u, true);
    return true;
  }

  function sepetCiz() {
    const h = hesapla();
    const el = $('#c-sepet');
    if (!el) return;
    if (!h.satirlar.length) {
      el.innerHTML = `<div class="c-bas"><h3>Sepet</h3><button class="kapat" data-kapat aria-label="Kapat">${ikon('x')}</button></div>
        <div class="c-govde"><div class="bos" style="margin-top:8px">${ikon('canta')}<h3 class="b3" style="margin-top:10px">Sepetin boş</h3><p>Sevdiğin ürünü bulman bir dakika sürmez.</p><a class="dugme" href="#/k/yeni" data-kapat>Alışverişe başla</a></div></div>`;
      return;
    }
    el.innerHTML = `<div class="c-bas"><h3>Sepet <span class="ince" style="font-weight:400">(${h.satirlar.reduce((a, s) => a + s.adet, 0)})</span></h3><button class="kapat" data-kapat aria-label="Kapat">${ikon('x')}</button></div>
      <div class="c-govde">
        ${kargoIlerlemeHTML(h)}
        <div class="satirlar">${h.satirlar.map((s, i) => satirHTML(s, i)).join('')}</div>
      </div>
      <div class="c-alt">
        ${toplamHTML(h)}
        <div class="dugmeler"><a class="dugme ikincil" href="#/sepet" data-kapat>Sepete git</a><a class="dugme" href="#/odeme" data-kapat>Ödemeye geç</a></div>
      </div>`;
  }
  const kargoIlerlemeHTML = (h) => `<div class="kargo-ilerleme">${h.kalan > 0 ? `Kargonun bizden olması için <b>${tl(h.kalan)}</b> daha ekle.` : '<b>Kargo bizden.</b> Siparişin 1–3 iş gününde yola çıkar.'}<div class="bar"><span style="width:${Math.min(100, Math.round((h.net / K.kargoLimit) * 100))}%"></span></div></div>`;
  const satirHTML = (s, i) => {
    const kamp = KAMP.kurallar.find((k) => k.kat === s.u.kat);
    return `<div class="satir">
      <a href="#/u/${s.id}" data-kapat><img src="${IMG(s.u.gorseller[0], true)}" alt="${esc(s.u.ad)}"></a>
      <div>
        <a class="ad" href="#/u/${s.id}" data-kapat>${esc(s.u.ad)}</a>
        <div class="ozellik">${esc(s.renk)} · ${esc(s.beden)}</div>
        ${kamp ? `<div class="kamp-not">${esc(kamp.ad)}</div>` : ''}
        <div class="alt-sira">
          <div class="adet"><button data-adet="-1" data-satir="${i}" aria-label="Azalt">−</button><span>${s.adet}</span><button data-adet="1" data-satir="${i}" aria-label="Artır">+</button></div>
          <b>${tl(s.tutar)}</b>
        </div>
        <button class="sil" data-sil="${i}" style="margin-top:8px">Kaldır</button>
      </div>
    </div>`;
  };
  const toplamHTML = (h, ekler = true) => `<div class="toplam">
    <div><span>Ara toplam</span><span>${tl(h.ara)}</span></div>
    ${h.indirimler.map((x) => `<div class="indirim"><span>${esc(x.ad)}</span><span>−${tl(x.tutar)}</span></div>`).join('')}
    <div><span>Kargo</span><span>${h.kargo ? tl(h.kargo) : 'Bizden'}</span></div>
    ${ekler && h.kapida ? `<div><span>Kapıda ödeme hizmeti</span><span>${tl(h.kapida)}</span></div>` : ''}
    ${ekler && h.hediye ? `<div><span>Hediye paketi</span><span>${tl(h.hediye)}</span></div>` : ''}
    <div class="genel"><span>Toplam</span><span>${tl(h.toplam)}</span></div>
  </div>`;

  // ── Ürün kartı ───────────────────────────────────────────────────────────
  function kartHTML(u) {
    const ind = indirimYuzde(u);
    const kamp = KAMP.kurallar.find((k) => k.kat === u.kat);
    const renk = ilkRenk(u);
    const rozet = [
      ind ? `<span class="rozet ind">%${ind} indirim</span>` : '',
      u.etiket && u.etiket !== 'İndirim' ? `<span class="rozet">${esc(u.etiket)}</span>` : '',
      kamp && !u.etiket?.includes('al') ? `<span class="rozet kamp">${esc(kamp.tur === 'ucal' ? '3 al 2 öde' : '2. ürüne %30')}</span>` : '',
    ].join('');
    return `<article class="kart">
      <a class="kart-gorsel" href="#/u/${u.id}" aria-label="${esc(u.ad)}">
        <img src="${IMG(u.gorseller[0], true)}" alt="${esc(u.ad)}" loading="lazy" decoding="async">
        <img class="iki" src="${IMG(u.gorseller[1].replace(/-\d$/, '-2'), true)}" alt="" loading="lazy" decoding="async">
        <span class="rozetler">${rozet}</span>
      </a>
      <button class="fav ${favori.includes(u.id) ? 'on' : ''}" data-fav="${u.id}" aria-label="Favorilere ekle" aria-pressed="${favori.includes(u.id)}">${ikon('kalp')}</button>
      <div class="hizli"><small>Hızlı ekle · ${esc(renk)}</small><div>${u.bedenler.map((b) => `<button data-hizli="${u.id}" data-renk="${esc(renk)}" data-beden="${esc(b)}" ${u.stok[renk][b] ? '' : 'disabled'}>${esc(b)}</button>`).join('')}</div></div>
      <a class="kart-ad" href="#/u/${u.id}">${esc(u.ad)}</a>
      <div class="fiyat"><b>${tl(u.fiyat)}</b>${u.eski ? `<s>${tl(u.eski)}</s><em>%${ind}</em>` : ''}</div>
      <div class="kart-alt">
        <span class="renkler">${u.renkler.map((r) => `<i style="background:${r.hex}" title="${esc(r.ad)}"></i>`).join('')}</span>
        <span class="puan">${yildizSvg}${u.puan.toLocaleString('tr-TR')} (${u.yorum})</span>
      </div>
    </article>`;
  }
  const rayHTML = (baslik, urunler, link, alt) => `<section class="bolum"><div class="kap">
    <div class="bolum-bas"><div><h2 class="baslik b2">${esc(baslik)}</h2>${alt ? `<p>${esc(alt)}</p>` : ''}</div>
      <div style="display:flex;gap:18px;align-items:center">${link ? `<a class="bag" href="${link}">Tümünü gör${ikon('ok')}</a>` : ''}
      <div class="oklar"><button class="ok" data-kaydir="-1" aria-label="Geri">${ikon('sol')}</button><button class="ok" data-kaydir="1" aria-label="İleri">${ikon('sag')}</button></div></div></div>
    <div class="ray">${urunler.map(kartHTML).join('')}</div>
  </div></section>`;

  // ── Sayfalar ─────────────────────────────────────────────────────────────
  function anaSayfa() {
    const cokSatan = [...K.urunler].sort((a, b) => b.satis - a.satis).slice(0, 8);
    const yeni = [...K.urunler].sort((a, b) => (b.etiket === 'Yeni') - (a.etiket === 'Yeni') || b.sira - a.sira).slice(0, 8);
    const h = M.hero;
    const [b1, b2] = KAMP.bloklar;
    return `
      <div class="kap"><section class="hero">
        <img src="${KOK}img/hero/${M.id}.webp" srcset="${KOK}img/hero/${M.id}-m.webp 960w, ${KOK}img/hero/${M.id}.webp 1920w" sizes="(max-width:760px) 100vw, 1360px" alt="" style="object-position:${h.pos}">
        <div class="hero-metin">
          <h1 class="baslik">${esc(M.t.heroBaslik || yalin(h.baslik))}</h1>
          <p>${esc(yalin(h.alt))}</p>
          <div class="dugmeler"><a class="dugme" href="#/k/yeni">Koleksiyonu keşfet</a><a class="dugme ikincil" href="#/k/kampanya">Kampanyalar</a></div>
        </div>
      </section></div>

      <section class="bolum"><div class="kap">
        <div class="bolum-bas"><h2 class="baslik b2">Ne arıyorsun?</h2><a class="bag" href="#/k/yeni">Tüm ürünler${ikon('ok')}</a></div>
        <div class="kat-izgara">${K.kategoriler.map((k) => `<a class="kat-kutu" href="#/k/${k.slug}"><img src="${IMG(`${k.img}-1`, true)}" alt="" loading="lazy"><span class="ad"><span><b>${esc(k.ad)}</b><span>${K.urunler.filter((u) => u.kat === k.slug).length} ürün</span></span>${ikon('ok')}</span></a>`).join('')}</div>
      </div></section>

      <section class="bolum"><div class="kap">${kampanyaBlokHTML(b1)}</div></section>
      ${rayHTML('Çok satanlar', cokSatan, '#/k/yeni?sira=cok', A ? 'Bu hafta en çok sepete eklenenler.' : 'Ailelerin en çok tercih ettikleri.')}
      <section class="bolum"><div class="kap">${kampanyaBlokHTML(b2, true)}</div></section>
      <section class="bolum"><div class="kap"><div class="ikili">${KAMP.ikili.map(ikiliHTML).join('')}</div></div></section>
      <section class="bolum"><div class="kap">${A ? paketBolumu() : pedBolumu()}</div></section>
      ${rayHTML('Yeni gelenler', yeni, '#/k/yeni')}
      ${sonBakilan.length > 1 ? rayHTML('Son baktıkların', sonBakilan.map((id) => URUN[id]).slice(0, 8)) : ''}
      <section class="bolum"><div class="kap">${atolyeHTML()}</div></section>
      <section class="bolum"><div class="kap">
        <div class="bolum-bas"><div><h2 class="baslik b2">Instagram'da @${esc(M.t.ig)}</h2><p>Yeni koleksiyon, kombin önerileri ve kampanyalar önce orada.</p></div><a class="bag" href="#/" onclick="return false">Takip et${ikon('disari')}</a></div>
        <div class="ig">${K.insta.map((k, i) => `<a href="#/u/${(K.urunler.find((u) => u.img === k) || K.urunler[0]).id}"><img src="${IMG(`${k}-${i % 2 ? 2 : 1}`, true)}" alt="" loading="lazy"><span>${ikon(i % 3 === 1 ? 'oynat' : 'kalp')}</span></a>`).join('')}</div>
      </div></section>
      <section class="bolum"><div class="kap"><div class="bulten">
        <div><h2 class="baslik b2">İlk siparişine %10 indirim</h2><p>Yeni koleksiyon ve kampanyalardan ilk sen haberdar ol. Kod: HOSGELDIN10</p></div>
        <div><form data-bulten><label class="sr" for="bulten-e">E-posta</label><input id="bulten-e" type="email" required placeholder="E-posta adresin"><button class="dugme" type="submit">Kaydol</button></form>
        <small>Kaydolarak ticari elektronik ileti almayı kabul edersin; izni dilediğin an geri alabilirsin. KVKK aydınlatma metni geçerlidir.</small></div>
      </div></div></section>`;
  }

  function kampanyaBlokHTML(b, ters) {
    const gorseller = b.urunler.map((id) => URUN[id]).filter(Boolean);
    return `<div class="kblok ${ters ? 'ters' : ''}">
      <div class="kblok-gorsel">${gorseller.map((u, i) => `<a href="#/u/${u.id}"><img src="${IMG(u.gorseller[0], false)}" alt="${esc(u.ad)}" loading="lazy" style="object-position:center ${i ? '40%' : '35%'}"></a>`).join('')}</div>
      <div class="kblok-metin">
        <h2 class="baslik">${esc(b.baslik)}</h2>
        ${b.fiyat ? `<div class="dev-fiyat"><b>${b.fiyat.toLocaleString('tr-TR')}</b><span>${esc(b.ek || 'TL')}</span></div>` : `<div class="dev-yazi">${esc(b.buyuk)}</div>`}
        <p>${esc(b.metin)}</p>
        <a class="dugme ters" href="${b.link}">${esc(b.dugme)}${ikon('ok')}</a>
      </div>
    </div>`;
  }
  const ikiliHTML = (x) => `<a href="${x.link}">
    <div class="m"><h3 class="baslik">${esc(x.baslik)}</h3>
      <div class="orta-fiyat"><b>${x.fiyat.toLocaleString('tr-TR')}</b><span>${esc(x.ek || 'TL')}</span>${x.eski ? `<s>${tl(x.eski)}</s>` : ''}</div>
      <p>${esc(x.metin)}</p><span class="bag">İncele${ikon('ok')}</span></div>
    <img src="${IMG(`${x.img}-1`, true)}" alt="" loading="lazy"></a>`;

  function paketBolumu() {
    const p = K.paket;
    return `<div class="ozel">
      <div class="ozel-gorsel"><img src="${IMG(`${p.img}-1`)}" alt="Hediye kutusunda dantel takım" loading="lazy"></div>
      <div class="ozel-metin">
        <h2 class="baslik b2">${esc(yalin(p.baslik))}</h2>
        <p>${esc(p.metin)}</p>
        <ol class="adimlar">
          <li><span>1</span><div><b>Sade dış kutu</b><small>Kutunun dışında marka ve ürün adı yazmaz.</small></div></li>
          <li><span>2</span><div><b>Kargo etiketinde ürün bilgisi yok</b><small>Gönderici adı da yalnızca atölye kısaltmasıdır.</small></div></li>
          <li><span>3</span><div><b>İçinde hediye kutusu</b><small>Dilersen not kartına mesajını biz yazarız.</small></div></li>
        </ol>
      </div>
    </div>`;
  }

  function pedBolumu() {
    const renk = M.t.renk;
    return `<div class="ped">
      <div class="ped-sol">
        <h2 class="baslik b2">Pedli külot nasıl çalışır?</h2>
        <p>Ped külota sabit dikilidir: kaymaz, katlanmaz, yapışkan kullanmaz. Kullandıktan sonra durula, yıka, tekrar kullan.</p>
        <svg class="katman-cizim" viewBox="0 0 640 210" role="img" aria-label="Pedli külodun dört katmanı">
          <defs>
            <pattern id="orgu" width="10" height="8" patternUnits="userSpaceOnUse"><path d="M0 6 Q2.5 2 5 6 T10 6" fill="none" stroke="#d9cfc4" stroke-width="1.2"/></pattern>
            <pattern id="emici" width="9" height="9" patternUnits="userSpaceOnUse"><circle cx="4.5" cy="4.5" r="1.7" fill="${renk.vurgu}" opacity=".55"/></pattern>
          </defs>
          <path d="M20 46 C140 26, 500 26, 620 46 L620 64 C500 44, 140 44, 20 64 Z" fill="#F4EEE6"/>
          <path d="M20 46 C140 26, 500 26, 620 46 L620 64 C500 44, 140 44, 20 64 Z" fill="url(#orgu)"/>
          <path d="M20 74 C140 54, 500 54, 620 74 L620 132 C500 112, 140 112, 20 132 Z" fill="${renk.yuzey2}"/>
          <path d="M20 74 C140 54, 500 54, 620 74 L620 132 C500 112, 140 112, 20 132 Z" fill="url(#emici)"/>
          <path d="M20 142 C140 122, 500 122, 620 142 L620 154 C500 134, 140 134, 20 154 Z" fill="${renk.ink}"/>
          <path d="M28 168 C150 148, 490 148, 612 168" fill="none" stroke="${renk['vurgu-metin']}" stroke-width="3" stroke-dasharray="10 8" stroke-linecap="round"/>
          <g font-family="Heros, Helvetica, Arial" font-size="15" font-weight="700" fill="${renk.ink}">
            <circle cx="40" cy="22" r="13" fill="${renk.vurgu}"/><text x="40" y="27" text-anchor="middle" fill="${renk['vurgu-ink']}">1</text>
            <circle cx="200" cy="96" r="13" fill="${renk.vurgu}"/><text x="200" y="101" text-anchor="middle" fill="${renk['vurgu-ink']}">2</text>
            <circle cx="360" cy="190" r="13" fill="${renk.vurgu}"/><text x="360" y="195" text-anchor="middle" fill="${renk['vurgu-ink']}">3</text>
            <circle cx="560" cy="190" r="13" fill="${renk.vurgu}"/><text x="560" y="195" text-anchor="middle" fill="${renk['vurgu-ink']}">4</text>
          </g>
        </svg>
        <ul class="katmanlar">${K.katmanlar.map(([b, a], i) => `<li><span style="background:${renk.vurgu};color:${renk['vurgu-ink']}">${i + 1}</span><div><b>${esc(b)}</b><small>${esc(a)}</small></div></li>`).join('')}</ul>
      </div>
      <div class="hesap" data-hesap>
        <h2 class="baslik">Ne kadar tasarruf edersin?</h2>
        <p>Kendi kullanımına göre hesapla.</p>
        <div class="surgu"><label for="h-ped">Ayda kullandığın ped <output id="o-ped">20</output></label><input id="h-ped" type="range" min="5" max="45" value="20" data-h></div>
        <div class="surgu"><label for="h-fiyat">Ped başına fiyat <output id="o-fiyat">6 TL</output></label><input id="h-fiyat" type="range" min="2" max="15" value="6" data-h></div>
        <div class="surgu"><label for="h-kulot">Alacağın pedli külot <output id="o-kulot">6 adet</output></label><input id="h-kulot" type="range" min="3" max="12" value="6" data-h></div>
        <div class="sonuc"><small>İki yılda yaklaşık tasarruf</small><b id="h-sonuc">—</b><p id="h-acik"></p></div>
        <p class="dip">Hesap örnektir. Külot fiyatı 3'lü pakette adet başı ${tl(K.pedBirim)}; kullanım ömrü laboratuvar testiyle netleşecektir.</p>
      </div>
    </div>`;
  }
  function hesapGuncelle() {
    const ped = +$('#h-ped').value, fiyat = +$('#h-fiyat').value, kulot = +$('#h-kulot').value;
    $('#o-ped').textContent = ped; $('#o-fiyat').textContent = `${fiyat} TL`; $('#o-kulot').textContent = `${kulot} adet`;
    const iki = ped * fiyat * 24, maliyet = kulot * K.pedBirim, fark = iki - maliyet;
    $('#h-sonuc').textContent = fark > 0 ? tl(fark) : 'Henüz yok';
    $('#h-acik').textContent = `İki yılda pede ${tl(iki)} ödersin; ${kulot} pedli külot ${tl(maliyet)} tutar.`;
  }

  function atolyeHTML() {
    const a = K.atolye;
    return `<div class="atolye">
      <div class="atolye-gorsel"><img src="${KOK}img/${A ? 'atolye-a' : 'atolye-b'}.webp" alt="Atölye" loading="lazy"></div>
      <div class="atolye-metin">
        <h2 class="baslik b2">${esc(yalin(a.baslik))}</h2>
        <p>${esc(a.metin)}</p>
        <ul class="olgular">${a.maddeler.map((m, i) => `<li>${ikon(['konum', 'makas', 'etiket'][i] || 'tik')}<b>${esc(m)}</b></li>`).join('')}</ul>
        <a class="bag" href="#/s/hakkimizda" style="margin-top:22px">Hikâyemiz${ikon('ok')}</a>
      </div>
    </div>`;
  }

  // Liste
  const SIRALAMA = [['onerilen', 'Önerilen'], ['cok', 'Çok satanlar'], ['yeni', 'En yeniler'], ['artan', 'Fiyat: düşükten yükseğe'], ['azalan', 'Fiyat: yüksekten düşüğe'], ['puan', 'En yüksek puan']];
  const FIYAT_ARALIK = [['0-600', '600 TL altı'], ['600-1000', '600–1.000 TL'], ['1000-99999', '1.000 TL üstü']];
  function listeSayfasi(slug, q) {
    const p = new URLSearchParams(q || '');
    const kat = KAT[slug];
    let urunler = K.urunler.filter((u) => (kat ? u.kat === slug : slug === 'kampanya' ? (u.eski || KAMP.kurallar.some((k) => k.kat === u.kat)) : true));
    const tum = urunler;
    const bedenSec = p.getAll('beden'), renkSec = p.getAll('renk'), kumas = p.getAll('kumas'), fiyat = p.get('fiyat'), indirim = p.get('indirim') === '1';
    const sira = p.get('sira') || 'onerilen';
    urunler = urunler.filter((u) => (!bedenSec.length || u.renkler.some((r) => bedenSec.some((b) => u.stok[r.ad][b] > 0)))
      && (!renkSec.length || u.renkler.some((r) => renkSec.includes(r.ad)))
      && (!kumas.length || kumas.some((k) => u.etiketler.includes(k)))
      && (!fiyat || (() => { const [a, b] = fiyat.split('-').map(Number); return u.fiyat >= a && u.fiyat < b; })())
      && (!indirim || u.eski));
    const sirali = {
      onerilen: (a, b) => (b.vitrin || 0) - (a.vitrin || 0) || b.satis - a.satis, cok: (a, b) => b.satis - a.satis,
      yeni: (a, b) => (b.etiket === 'Yeni') - (a.etiket === 'Yeni') || b.sira - a.sira, artan: (a, b) => a.fiyat - b.fiyat,
      azalan: (a, b) => b.fiyat - a.fiyat, puan: (a, b) => b.puan - a.puan,
    }[sira];
    urunler = [...urunler].sort(sirali);
    const baslik = kat ? kat.ad : slug === 'kampanya' ? 'Kampanyalar' : 'Yeni gelenler ve tüm ürünler';
    const aciklama = kat ? kat.aciklama : slug === 'kampanya' ? KAMP.kurallar.map((k) => k.ad).join(' · ') + '. İndirimler sepette kendiliğinden uygulanır.' : 'Atölyemizden çıkan her parça.';
    const bedenler = [...new Set(tum.flatMap((u) => u.bedenler))];
    const renkler = [...new Map(tum.flatMap((u) => u.renkler).map((r) => [r.ad, r])).values()];
    const kumaslar = [...new Set(tum.flatMap((u) => u.etiketler))];
    const etkin = [...bedenSec.map((b) => ['beden', b, b]), ...renkSec.map((r) => ['renk', r, r]), ...kumas.map((k) => ['kumas', k, k]),
      ...(fiyat ? [['fiyat', fiyat, FIYAT_ARALIK.find(([v]) => v === fiyat)?.[1] || fiyat]] : []), ...(indirim ? [['indirim', '1', 'İndirimli']] : [])];
    const link = (degistir) => { const n = new URLSearchParams(p); degistir(n); const s = n.toString(); return `#/k/${slug}${s ? `?${s}` : ''}`; };
    const tog = (ad, deger) => link((n) => { const v = n.getAll(ad); n.delete(ad); (v.includes(deger) ? v.filter((x) => x !== deger) : [...v, deger]).forEach((x) => n.append(ad, x)); });
    const filtreHTML = `
      <div class="f-grup"><h4>Kategori</h4><div class="f-linkler">
        <a href="#/k/yeni" class="${slug === 'yeni' ? 'on' : ''}">Tüm ürünler<span>${K.urunler.length}</span></a>
        ${K.kategoriler.map((k) => `<a href="#/k/${k.slug}" class="${slug === k.slug ? 'on' : ''}">${esc(k.ad)}<span>${K.urunler.filter((u) => u.kat === k.slug).length}</span></a>`).join('')}
        <a href="#/k/kampanya" class="${slug === 'kampanya' ? 'on' : ''}">Kampanyalar</a>
      </div></div>
      <div class="f-grup"><h4>Beden</h4><div class="cipler">${bedenler.map((b) => `<a class="cip ${bedenSec.includes(b) ? 'on' : ''}" href="${tog('beden', b)}">${esc(b)}</a>`).join('')}</div></div>
      <div class="f-grup"><h4>Renk</h4><div class="renk-sec">${renkler.map((r) => `<a href="${tog('renk', r.ad)}" title="${esc(r.ad)}" aria-label="${esc(r.ad)}"><button tabindex="-1" class="${renkSec.includes(r.ad) ? 'on' : ''}" style="background:${r.hex}"></button></a>`).join('')}</div></div>
      ${kumaslar.length > 1 ? `<div class="f-grup"><h4>Kumaş</h4><div class="cipler">${kumaslar.map((k) => `<a class="cip ${kumas.includes(k) ? 'on' : ''}" href="${tog('kumas', k)}">${esc(k[0].toLocaleUpperCase('tr-TR') + k.slice(1))}</a>`).join('')}</div></div>` : ''}
      <div class="f-grup"><h4>Fiyat</h4><div class="cipler">${FIYAT_ARALIK.map(([v, ad]) => `<a class="cip ${fiyat === v ? 'on' : ''}" href="${link((n) => (fiyat === v ? n.delete('fiyat') : n.set('fiyat', v)))}">${ad}</a>`).join('')}</div></div>
      <div class="f-grup"><a class="anahtar" href="${link((n) => (indirim ? n.delete('indirim') : n.set('indirim', '1')))}">Sadece indirimli ürünler<input type="checkbox" tabindex="-1" ${indirim ? 'checked' : ''} aria-hidden="true"></a></div>`;
    $('#c-filtre').innerHTML = `<div class="c-bas"><h3>Filtrele</h3><button class="kapat" data-kapat aria-label="Kapat">${ikon('x')}</button></div><div class="c-govde" style="display:flex;flex-direction:column;gap:26px">${filtreHTML}</div><div class="c-alt"><button class="dugme tam" data-kapat>${urunler.length} ürünü göster</button></div>`;
    const banner = KAMP.ikili[0];
    const kartlar = urunler.map(kartHTML);
    if (kartlar.length > 4 && !kat) kartlar.splice(3, 0, `<a class="ara-kat" href="${banner.link}"><div class="m"><b>${esc(banner.baslik)} · ${tl(banner.fiyat)}</b><span>${esc(banner.metin)}</span></div><img src="${IMG(`${banner.img}-1`, true)}" alt=""></a>`);
    return `<div class="kap">
      <nav class="kirinti" aria-label="Konum"><a href="#/">Ana sayfa</a><span>/</span><span>${esc(baslik)}</span></nav>
      <div class="liste-bas"><div><h1 class="baslik b1" style="font-size:clamp(34px,3.6vw,52px)">${esc(baslik)}</h1><p>${esc(aciklama)}</p></div></div>
      <div class="liste">
        <aside class="filtreler" aria-label="Filtreler">${filtreHTML}</aside>
        <div>
          <div class="arac-cubugu">
            <div class="sol"><button class="cip filtre-ac" data-ac="filtre">${ikon('filtre')}Filtrele</button><span class="ince">${urunler.length} ürün</span>
              ${etkin.map(([ad, v, et]) => `<a class="etkin" href="${ad === 'fiyat' || ad === 'indirim' ? link((n) => n.delete(ad)) : tog(ad, v)}">${esc(et)}${ikon('x')}</a>`).join('')}
              ${etkin.length ? `<a class="bag" href="#/k/${slug}" style="font-size:14px">Temizle</a>` : ''}</div>
            <label class="sr" for="sirala">Sırala</label>
            <select class="sirala" id="sirala" data-sirala="${slug}">${SIRALAMA.map(([v, ad]) => `<option value="${v}" ${v === sira ? 'selected' : ''}>${ad}</option>`).join('')}</select>
          </div>
          ${urunler.length ? `<div class="izgara">${kartlar.join('')}</div>` : `<div class="bos"><h3 class="b3">Bu filtrelerle ürün bulunamadı</h3><p>Birkaç filtreyi kaldırıp yeniden dene.</p><a class="dugme" href="#/k/${slug}">Filtreleri temizle</a></div>`}
        </div>
      </div>
    </div>`;
  }

  // Ürün
  let secim = { renk: null, beden: null, adet: 1 };
  function urunSayfasi(id) {
    const u = URUN[id];
    if (!u) return bulunamadi();
    sonBakilan = [id, ...sonBakilan.filter((x) => x !== id)].slice(0, 10); kaydet();
    if (secim.id !== id) secim = { id, renk: ilkRenk(u), beden: null, adet: 1 };
    const kat = KAT[u.kat];
    const kamp = KAMP.kurallar.find((k) => k.kat === u.kat);
    const ind = indirimYuzde(u);
    const kombin = K.urunler.filter((x) => x.id !== id && x.kat !== u.kat).sort((a, b) => b.satis - a.satis).slice(0, 4);
    const benzer = K.urunler.filter((x) => x.id !== id && x.kat === u.kat);
    const dagilim = [0.78, 0.15, 0.05, 0.015, 0.005];
    const ornek = A ? [
      ['Elif K.', 5, 'Kumaşı fotoğraftakinden de güzel. Beden tablosuna göre M aldım, tam oldu.'],
      ['Merve T.', 5, 'Kutu sade geldi, içi hediye paketiydi. Not kartı çok hoş bir detay.'],
      ['Seda A.', 4, 'Dantel yumuşak, kaşındırmıyor. Kargo iki günde geldi.'],
    ] : [
      ['Zeynep Y.', 5, 'Penyesi kalın ve yumuşak, yıkamada çekmedi. Kızımla aynı takımı aldık.'],
      ['Gizem D.', 5, 'Pedli külodu ilk ayımda denedim; gece sızdırmadı, yıkaması da kolay.'],
      ['Burcu S.', 4, 'Beden rehberi doğru. Kargo hızlıydı, paketleme özenliydi.'],
    ];
    return `<div class="kap">
      <div class="urun">
        <div class="galeri">
          <div class="kucukler">${u.gorseller.map((g, i) => `<button data-galeri="${i}" class="${i === 0 ? 'on' : ''}" aria-label="Görsel ${i + 1}"><img src="${IMG(g, true)}" alt=""></button>`).join('')}</div>
          <div class="buyuk-gorsel"><div class="kaydir" id="kaydir">${u.gorseller.map((g, i) => `<img src="${IMG(g)}" alt="${i ? '' : esc(u.ad)}" ${i ? 'loading="lazy"' : ''}>`).join('')}</div>
            <span class="rozetler">${ind ? `<span class="rozet ind">%${ind} indirim</span>` : ''}${u.etiket && u.etiket !== 'İndirim' ? `<span class="rozet">${esc(u.etiket)}</span>` : ''}</span>
            <div class="noktalar">${u.gorseller.map((_, i) => `<i class="${i ? '' : 'on'}"></i>`).join('')}</div></div>
        </div>
        <div class="bilgi">
          <nav class="kirinti" aria-label="Konum"><a href="#/">Ana sayfa</a><span>/</span><a href="#/k/${u.kat}">${esc(kat.ad)}</a></nav>
          <h1>${esc(u.ad)}</h1>
          <a class="puan" href="#yorumlar">${yildizSvg}<b>${u.puan.toLocaleString('tr-TR')}</b> · ${u.yorum} değerlendirme</a>
          <div class="fiyat-buyuk"><b>${tl(u.fiyat)}</b>${u.eski ? `<s>${tl(u.eski)}</s><em>%${ind} indirim</em>` : ''}</div>
          <p class="taksit-not">Peşin fiyatına 3 taksit · 9 aya varan taksit seçenekleri</p>
          ${kamp ? `<div class="kamp-serit">${ikon('etiket')}${esc(kamp.ad)} kampanyasına dahil</div>` : ''}
          <p style="margin-top:18px;color:var(--ink2);line-height:1.6">${esc(u.aciklama)}</p>
          <div class="secim"><div class="secim-bas"><span>Renk: <b id="renk-ad">${esc(secim.renk)}</b></span></div>
            <div class="renk-btn">${u.renkler.map((r) => `<button data-renk-sec="${esc(r.ad)}" class="${r.ad === secim.renk ? 'on' : ''}"><i style="background:${r.hex}"></i>${esc(r.ad)}</button>`).join('')}</div></div>
          <div class="secim"><div class="secim-bas"><span>Beden</span><button data-ac="beden">Beden rehberi</button></div>
            <div class="beden-sec" id="beden-sec">${bedenButonlari(u)}</div>
            <div class="stok-not" id="stok-not">${stokNotu(u)}</div></div>
          <div class="al-satir">
            <div class="adet" aria-label="Adet"><button data-u-adet="-1" aria-label="Azalt">−</button><span id="u-adet">${secim.adet}</span><button data-u-adet="1" aria-label="Artır">+</button></div>
            <button class="dugme" data-sepete="${u.id}">${ikon('canta')}Sepete ekle</button>
            <button class="fav ${favori.includes(u.id) ? 'on' : ''}" data-fav="${u.id}" aria-label="Favorilere ekle" aria-pressed="${favori.includes(u.id)}">${ikon('kalp')}</button>
          </div>
          <div class="guven">
            <div>${ikon('kamyon')}<span><b>1–3 iş gününde kargoda.</b> ${tl(K.kargoLimit)} üzeri siparişlerde kargo bizden.</span></div>
            ${A ? `<div>${ikon('kutu')}<span><b>Gizli paketleme.</b> Kutuda marka ve ürün adı yazmaz.</span></div>` : `<div>${ikon('konum')}<span><b>İzmir'de üretildi.</b> Gaziemir'deki kendi atölyemizde.</span></div>`}
            <div>${ikon('donus')}<span><b>14 gün içinde değişim.</b> ${A || u.kat === 'pedli' ? 'Hijyen bandı açılmamış ürünlerde.' : 'Kolay iade.'}</span></div>
          </div>
          <div class="akordiyon">
            <details open><summary>Ürün detayı${ikon('asagi')}</summary><div><p>${esc(u.aciklama)}</p>${u.detay ? `<p>${esc(u.detay)}</p>` : ''}</div></details>
            <details><summary>Kumaş ve bakım${ikon('asagi')}</summary><div><p><b>Kumaş:</b> ${esc(u.kumas)}</p><p><b>Bakım:</b> ${esc(u.bakim)}</p></div></details>
            <details><summary>Kargo ve iade${ikon('asagi')}</summary><div><p>${esc(K.kargoMetni)}</p></div></details>
          </div>
        </div>
      </div>
    </div>
    ${benzer.length >= 2 ? rayHTML(`${kat.ad} kategorisinden`, benzer) : ''}
    ${rayHTML(A ? 'Kombini tamamla' : 'Bunları da sevebilirsin', kombin)}
    <section class="bolum" id="yorumlar"><div class="kap">
      <div class="bolum-bas"><h2 class="baslik b2">Değerlendirmeler</h2><span class="ornek-et">Demo için örnek yorumlar</span></div>
      <div class="yorumlar">
        <div class="yorum-ozet"><div class="dev">${u.puan.toLocaleString('tr-TR')}</div><div class="yildizlar">${yildizSvg.repeat(5)}</div><span class="ince">${u.yorum} değerlendirme</span>
          ${dagilim.map((d, i) => `<div class="cubuk"><span>${5 - i}</span><i><span style="width:${Math.round(d * 100)}%"></span></i><span class="ince">${Math.round(u.yorum * d)}</span></div>`).join('')}</div>
        <div class="yorum-liste">${ornek.map(([ad, p, m]) => `<div class="yorum"><div class="yorum-bas"><b>${ad}</b><span>Aldığı renk: ${esc(secim.renk)}</span></div><div class="yildizlar">${yildizSvg.repeat(p)}</div><p>${esc(m)}</p></div>`).join('')}</div>
      </div>
    </div></section>
    <div class="sabit-al" id="sabit-al"><div class="m"><small>${esc(u.ad)}</small><b>${tl(u.fiyat)}</b></div><button class="dugme" data-sepete="${u.id}">Sepete ekle</button></div>`;
  }
  const bedenButonlari = (u) => u.bedenler.map((b) => {
    const n = u.stok[secim.renk]?.[b] || 0;
    return `<button data-beden-sec="${esc(b)}" class="${secim.beden === b ? 'on' : ''}" ${n ? '' : 'disabled aria-disabled="true"'}>${esc(b)}${n && n <= 3 ? '<span class="az">Az</span>' : ''}</button>`;
  }).join('');
  const stokNotu = (u) => {
    if (!secim.beden) return '';
    const n = u.stok[secim.renk]?.[secim.beden] || 0;
    return n <= 3 ? `Son ${n} ürün; tükenmeden al.` : '';
  };

  // Sepet sayfası
  function sepetSayfasi() {
    const h = hesapla();
    if (!h.satirlar.length) return `<div class="kap"><nav class="kirinti"><a href="#/">Ana sayfa</a><span>/</span><span>Sepet</span></nav><div class="bos" style="margin-top:20px"><h1 class="baslik b2">Sepetin boş</h1><p>Kampanyalara göz at; indirimler sepette kendiliğinden uygulanır.</p><a class="dugme" href="#/k/kampanya">Kampanyalara bak</a></div></div>`;
    return `<div class="kap">
      <nav class="kirinti"><a href="#/">Ana sayfa</a><span>/</span><span>Sepet</span></nav>
      <h1 class="baslik b1" style="font-size:clamp(34px,3.6vw,52px);margin-top:12px">Sepetin</h1>
      <div class="ikisutun">
        <div>
          ${kargoIlerlemeHTML(h)}
          <div class="sepet-satirlar">${h.satirlar.map((s, i) => `<div class="satir">
            <a href="#/u/${s.id}"><img src="${IMG(s.u.gorseller[0], true)}" alt="${esc(s.u.ad)}"></a>
            <div><a class="ad" href="#/u/${s.id}">${esc(s.u.ad)}</a><div class="ozellik">${esc(s.renk)} · ${esc(s.beden)} · ${tl(s.u.fiyat)}</div>
              ${KAMP.kurallar.find((k) => k.kat === s.u.kat) ? `<div class="kamp-not">${esc(KAMP.kurallar.find((k) => k.kat === s.u.kat).ad)}</div>` : ''}
              <div class="alt-sira" style="justify-content:flex-start;gap:16px"><div class="adet"><button data-adet="-1" data-satir="${i}" aria-label="Azalt">−</button><span>${s.adet}</span><button data-adet="1" data-satir="${i}" aria-label="Artır">+</button></div><button class="sil" data-sil="${i}">Kaldır</button></div></div>
            <div class="tutar">${tl(s.tutar)}</div></div>`).join('')}</div>
        </div>
        <aside class="kutu ozet-kutu"><h3>Sipariş özeti</h3>
          <form class="kupon" data-kupon><label class="sr" for="kupon">Kupon</label><input id="kupon" placeholder="Kupon kodu" value="${esc(kupon)}"><button class="dugme koyu kucuk" type="submit">Uygula</button></form>
          ${toplamHTML(h)}
          <a class="dugme tam" href="#/odeme" style="margin-top:18px">Ödemeye geç${ikon('ok')}</a>
          <div class="guvenli">${ikon('kilit')}3D Secure ile güvenli ödeme · 9 taksit</div>
        </aside>
      </div>
    </div>`;
  }

  // Ödeme
  let odeme = { kargo: 'standart', odeme: 'kart', taksit: 1, hediye: false, paket: A };
  function odemeSayfasi() {
    const h = hesapla(sepet, odeme);
    if (!h.satirlar.length) return sepetSayfasi();
    const taksitler = [1, 2, 3, 6, 9].map((n) => {
      const vade = n <= 3 ? 1 : n === 6 ? 1.069 : 1.112;
      return { n, aylik: (h.toplam * vade) / n, toplam: h.toplam * vade };
    });
    return `<div class="kap">
      <nav class="kirinti"><a href="#/">Ana sayfa</a><span>/</span><a href="#/sepet">Sepet</a><span>/</span><span>Ödeme</span></nav>
      <div style="display:flex;justify-content:space-between;align-items:flex-end;gap:16px;flex-wrap:wrap;margin-top:12px">
        <h1 class="baslik b1" style="font-size:clamp(34px,3.6vw,52px)">Ödeme</h1>
        <button class="ornek-doldur" data-ornek-doldur>Demo için örnek bilgilerle doldur</button>
      </div>
      <form class="ikisutun" data-odeme-form novalidate>
        <div>
          <section class="adim-kutu"><div class="adim-bas"><span>1</span><h3>Teslimat bilgileri</h3></div>
            <div class="alanlar">
              <div class="alan"><label for="o-ad">Ad soyad</label><input id="o-ad" name="ad" required autocomplete="name"></div>
              <div class="alan"><label for="o-tel">Cep telefonu</label><input id="o-tel" name="tel" required inputmode="tel" placeholder="05xx xxx xx xx" autocomplete="tel"></div>
              <div class="alan tam"><label for="o-eposta">E-posta</label><input id="o-eposta" name="eposta" type="email" required autocomplete="email"><span class="ipucu">Sipariş onayı ve kargo takip bağlantısı buraya gelir.</span></div>
              <div class="alan"><label for="o-il">İl</label><select id="o-il" name="il" required><option value="">Seç</option>${['Adana', 'Ankara', 'Antalya', 'Bursa', 'Eskişehir', 'Gaziantep', 'İstanbul', 'İzmir', 'Kayseri', 'Kocaeli', 'Konya', 'Mersin', 'Samsun', 'Trabzon'].map((x) => `<option>${x}</option>`).join('')}</select></div>
              <div class="alan"><label for="o-ilce">İlçe</label><input id="o-ilce" name="ilce" required></div>
              <div class="alan tam"><label for="o-adres">Açık adres</label><textarea id="o-adres" name="adres" required autocomplete="street-address"></textarea></div>
            </div>
            <label class="onay-kutu"><input type="checkbox" checked> Fatura adresim teslimat adresimle aynı</label>
          </section>
          <section class="adim-kutu"><div class="adim-bas"><span>2</span><h3>Kargo ve paketleme</h3></div>
            <div class="secenekler">
              <label class="secenek ${odeme.kargo === 'standart' ? 'on' : ''}"><input type="radio" name="kargo" value="standart" ${odeme.kargo === 'standart' ? 'checked' : ''}><div><b>Standart kargo</b><small>1–3 iş gününde kargoda · ${tl(K.kargoLimit)} üzeri bizden</small></div><span class="ucret">${h.net >= K.kargoLimit ? 'Bizden' : tl(K.kargoUcret)}</span></label>
              <label class="secenek ${odeme.kargo === 'hizli' ? 'on' : ''}"><input type="radio" name="kargo" value="hizli" ${odeme.kargo === 'hizli' ? 'checked' : ''}><div><b>Aynı gün kargo</b><small>14.00'e kadar verilen siparişler bugün yola çıkar</small></div><span class="ucret">${tl(K.kargoUcret + 60)}</span></label>
              ${A ? `<label class="secenek on"><input type="checkbox" checked disabled><div><b>Gizli paketleme</b><small>Kutuda ve kargo etiketinde marka ve ürün adı yazmaz</small></div><span class="ucret">Dahil</span></label>
              <label class="secenek ${odeme.paket ? 'on' : ''}"><input type="checkbox" name="paket" ${odeme.paket ? 'checked' : ''}><div><b>Hediye kutusu ve not kartı</b><small>Mesajını aşağıya yaz, biz el yazısıyla ekleyelim</small></div><span class="ucret">Dahil</span></label>`
              : `<label class="secenek ${odeme.hediye ? 'on' : ''}"><input type="checkbox" name="hediye" ${odeme.hediye ? 'checked' : ''}><div><b>Hediye paketi</b><small>Kombinler için önerilir; not kartıyla</small></div><span class="ucret">${tl(39)}</span></label>`}
              <div class="alan"><label for="o-not">Not kartı mesajı (isteğe bağlı)</label><input id="o-not" name="not" maxlength="120" placeholder="Örn. İyi ki varsın"></div>
            </div>
          </section>
          <section class="adim-kutu"><div class="adim-bas"><span>3</span><h3>Ödeme</h3></div>
            <div class="secenekler" style="margin-bottom:18px">
              <label class="secenek ${odeme.odeme === 'kart' ? 'on' : ''}"><input type="radio" name="odeme" value="kart" ${odeme.odeme === 'kart' ? 'checked' : ''}><div><b>Kredi ya da banka kartı</b><small>3D Secure ile güvenli ödeme, 9 aya varan taksit</small></div><span class="ucret">${ikon('kart')}</span></label>
              <label class="secenek ${odeme.odeme === 'kapida' ? 'on' : ''}"><input type="radio" name="odeme" value="kapida" ${odeme.odeme === 'kapida' ? 'checked' : ''}><div><b>Kapıda ödeme</b><small>Nakit ya da kartla, teslimatta</small></div><span class="ucret">+${tl(K.kapidaUcret)}</span></label>
            </div>
            ${odeme.odeme === 'kart' ? `
            <div class="kart-gorunum" aria-hidden="true"><span>${esc(M.tamAd)}</span><span class="no" id="kart-no-g">•••• •••• •••• ••••</span><span class="alt-s"><span id="kart-ad-g">AD SOYAD</span><span id="kart-skt-g">AA/YY</span></span></div>
            <div class="alanlar">
              <div class="alan tam"><label for="o-kart">Kart numarası</label><input id="o-kart" name="kart" inputmode="numeric" maxlength="19" placeholder="0000 0000 0000 0000" autocomplete="off"><span class="ipucu">Demo: gerçek kart bilgisi girmeyin; ödeme alınmaz.</span></div>
              <div class="alan"><label for="o-skt">Son kullanma</label><input id="o-skt" name="skt" maxlength="5" placeholder="AA/YY" inputmode="numeric" autocomplete="off"></div>
              <div class="alan"><label for="o-cvc">Güvenlik kodu</label><input id="o-cvc" name="cvc" maxlength="3" placeholder="•••" inputmode="numeric" autocomplete="off"></div>
            </div>
            <div class="taksitler" role="radiogroup" aria-label="Taksit">${taksitler.map((t) => `<button type="button" data-taksit="${t.n}" class="${odeme.taksit === t.n ? 'on' : ''}"><b>${t.n === 1 ? 'Tek çekim' : `${t.n} taksit`}</b><small>${t.n === 1 ? tl(t.toplam) : `${tl(t.aylik)} × ${t.n}`}</small></button>`).join('')}</div>` : ''}
            <label class="onay-kutu"><input type="checkbox" required name="sozlesme"> <span><a href="#/s/mesafeli" target="_blank">Ön bilgilendirme formunu</a> ve <a href="#/s/mesafeli" target="_blank">mesafeli satış sözleşmesini</a> okudum, onaylıyorum.</span></label>
          </section>
        </div>
        <aside class="kutu ozet-kutu"><h3>Sipariş özeti</h3>
          <div class="satirlar" style="margin-bottom:10px">${h.satirlar.map((s) => `<div class="satir" style="grid-template-columns:64px minmax(0,1fr) auto;padding:8px 0"><img src="${IMG(s.u.gorseller[0], true)}" alt="" style="width:64px"><div><div class="ad" style="font-size:14px">${esc(s.u.ad)}</div><div class="ozellik">${esc(s.renk)} · ${esc(s.beden)} · ${s.adet} adet</div></div><b style="font-size:14px">${tl(s.tutar)}</b></div>`).join('')}</div>
          ${toplamHTML(h)}
          <button class="dugme tam" type="submit" style="margin-top:18px">${ikon('kilit')}Siparişi onayla</button>
          <div class="guvenli">${ikon('kilit')}Bu bir tasarım demosudur; ödeme alınmaz.</div>
        </aside>
      </form>
    </div>`;
  }

  // Sipariş sonrası
  const ADIMLAR = [['Siparişin alındı', 'Ödemen onaylandı, atölyeye iletildi.'], ['Hazırlanıyor', A ? 'Ürünün gizli paketlemeyle hazırlanıyor.' : 'Ürünün atölyede paketleniyor.'],
    ['Kargoya verildi', 'Gönderi kodun SMS ve e-postayla iletildi.'], ['Dağıtımda', 'Kurye bugün adresine gelecek.'], ['Teslim edildi', 'Afiyetle kullan. Yorumunu bekleriz.']];
  function zamanHTML(s) {
    const t0 = new Date(s.tarih);
    const sure = [0, 2, 26, 48, 54];
    return `<ol class="zaman">${ADIMLAR.map(([b, a], i) => {
      const d = new Date(t0.getTime() + sure[i] * 3600e3);
      const cls = i < s.adim ? 'tamam' : i === s.adim ? 'simdi' : '';
      return `<li class="${cls}"><span class="nokta"></span><div><b>${b}</b><small>${a}</small></div><time>${i <= s.adim ? d.toLocaleString('tr-TR', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }) : ''}</time></li>`;
    }).join('')}</ol>`;
  }
  function siparisSayfasi(no) {
    const s = siparisler.find((x) => x.no === no);
    if (!s) return bulunamadi();
    return `<div class="kap"><div class="basari">
      <div class="basari-bas"><div class="onay-ikon">${ikon('tik')}</div><h1 class="baslik b2">Teşekkürler, siparişin alındı</h1>
        <p>Onay e-postası ${esc(s.eposta)} adresine gönderildi. ${A ? 'Paketin sade bir kutuyla, gizli paketlemeyle gelecek.' : 'Siparişin İzmir\'deki atölyemizde hazırlanacak.'}</p>
        <span class="siparis-no">Sipariş no: ${esc(s.no)}</span></div>
      <div class="ikisutun" style="grid-template-columns:minmax(0,1fr) minmax(0,1fr);margin-top:16px">
        <div class="kutu"><h3 class="b3" style="font-weight:700">Sipariş durumu</h3>${zamanHTML(s)}<a class="dugme tam" href="#/takip/${s.no}" style="margin-top:12px">Kargo takibine git</a></div>
        <div class="kutu"><h3 class="b3" style="font-weight:700;margin-bottom:12px">Özet</h3>
          <div class="satirlar">${s.satirlar.map((x) => `<div class="satir" style="grid-template-columns:56px minmax(0,1fr) auto;padding:8px 0"><img src="${IMG(URUN[x.id].gorseller[0], true)}" alt="" style="width:56px"><div><div class="ad" style="font-size:14px">${esc(URUN[x.id].ad)}</div><div class="ozellik">${esc(x.renk)} · ${esc(x.beden)} · ${x.adet} adet</div></div></div>`).join('')}</div>
          <div class="toplam" style="margin-top:10px"><div class="genel"><span>Ödenen</span><span>${tl(s.toplam)}</span></div><div><span>Ödeme</span><span>${s.odeme === 'kapida' ? 'Kapıda ödeme' : s.taksit > 1 ? `Kart · ${s.taksit} taksit` : 'Kart · tek çekim'}</span></div><div><span>Teslimat</span><span>${esc(s.il)}</span></div></div>
        </div>
      </div>
    </div></div>`;
  }
  function takipSayfasi(no) {
    const s = siparisler.find((x) => x.no === no);
    if (!s) return bulunamadi();
    return `<div class="kap"><div class="basari">
      <nav class="kirinti"><a href="#/">Ana sayfa</a><span>/</span><a href="#/hesabim">Siparişlerim</a><span>/</span><span>${esc(s.no)}</span></nav>
      <h1 class="baslik b2" style="margin:12px 0 18px">Kargo takibi</h1>
      <div class="kutu">
        <div style="display:flex;justify-content:space-between;gap:16px;flex-wrap:wrap"><div><b>Sipariş ${esc(s.no)}</b><div class="ince">Gönderi kodu: ${esc(s.kargoKodu)} · Anlaşmalı kargo</div></div>
          <span class="durum"><i></i>${ADIMLAR[s.adim][0]}</span></div>
        ${zamanHTML(s)}
        <div class="dugmeler" style="margin-top:14px">${s.adim < 4 ? `<button class="dugme ikincil" data-ilerlet="${s.no}">Demo: bir sonraki adıma geç</button>` : ''}<a class="dugme" href="#/k/yeni">Alışverişe devam et</a></div>
      </div>
    </div></div>`;
  }

  function hesapSayfasi(sekme = 'siparisler') {
    const sekmeler = [['siparisler', 'Siparişlerim', 'kutu'], ['favoriler', 'Favorilerim', 'kalp'], ['adresler', 'Adreslerim', 'konum'], ['izinler', 'İletişim izinleri', 'sohbet']];
    let icerik = '';
    if (sekme === 'siparisler') icerik = siparisler.length ? siparisler.map((s) => `<div class="siparis-kart"><div><b>Sipariş ${esc(s.no)}</b><div class="ince" style="font-size:14px">${new Date(s.tarih).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })} · ${tl(s.toplam)}</div>
        <div class="resimler">${s.satirlar.map((x) => `<img src="${IMG(URUN[x.id].gorseller[0], true)}" alt="">`).join('')}</div></div>
        <div style="display:grid;gap:10px;justify-items:end"><span class="durum"><i></i>${ADIMLAR[s.adim][0]}</span><a class="dugme kucuk ikincil" href="#/takip/${s.no}">Takip et</a></div></div>`).join('')
      : '<div class="bos"><h3 class="b3">Henüz siparişin yok</h3><p>Demo içinde bir sipariş verirsen burada ve kargo takibinde görürsün.</p><a class="dugme" href="#/k/yeni">Alışverişe başla</a></div>';
    if (sekme === 'favoriler') icerik = favori.length ? `<div class="izgara">${favori.map((id) => kartHTML(URUN[id])).join('')}</div>` : '<div class="bos"><h3 class="b3">Favori listen boş</h3><p>Ürünlerdeki kalbe dokunarak ekleyebilirsin.</p></div>';
    if (sekme === 'adresler') icerik = '<div class="siparis-kart"><div><b>Ev</b><div class="ince" style="font-size:15px;margin-top:4px">Demo adresi · Gaziemir / İzmir</div></div><button class="dugme kucuk ikincil" type="button">Düzenle</button></div>';
    if (sekme === 'izinler') icerik = `<div class="kutu" style="display:grid;gap:18px">${[['E-posta ile kampanya ve yeni koleksiyon', true], ['SMS ile kampanya bildirimi', false], ['Sepetimde ürün kaldığında hatırlatma', true]].map(([a, v]) => `<label class="anahtar">${a}<input type="checkbox" ${v ? 'checked' : ''}></label>`).join('')}<p class="ince" style="font-size:14px">İzinler İleti Yönetim Sistemi (İYS) kaydıyla eşitlenir.</p></div>`;
    return `<div class="kap"><nav class="kirinti"><a href="#/">Ana sayfa</a><span>/</span><span>Hesabım</span></nav>
      <h1 class="baslik b1" style="font-size:clamp(34px,3.6vw,52px);margin-top:12px">Merhaba</h1>
      <div class="hesap-izgara"><nav class="sekmeler">${sekmeler.map(([k, ad, ik]) => `<a href="#/hesabim/${k}" class="${k === sekme ? 'on' : ''}">${ikon(ik)}${ad}</a>`).join('')}</nav><div>${icerik}</div></div></div>`;
  }

  function metinSayfasi(ad) {
    const sayfalar = {
      hakkimizda: [K.hakkimizda.baslik, K.hakkimizda.paragraflar.map((p) => `<p>${esc(p)}</p>`).join('')],
      'kargo-iade': ['Kargo ve iade', `<p>${esc(K.kargoMetni)}</p><h3>Gizlilik</h3><p>${A ? 'Siparişler sade, etiketsiz kutuyla gönderilir; kutunun dışında ve kargo etiketinde marka ya da ürün adı yer almaz.' : 'Siparişler özenli paketlenir; kombinler ve setler hediye kutusunda gelir.'}</p><h3>İade nasıl yapılır?</h3><p>Hesabım > Siparişlerim adımından iade talebi oluşturursun, sana iade kargo kodu gönderilir. Ürün atölyemize ulaştığında ödemen aynı karta iade edilir.</p>`],
      'beden-rehberi': ['Beden rehberi', K.bedenRehberi.replace(/<h3[^>]*>.*?<\/h3>/, '').replace(/style="[^"]*"/g, '').replace(/<p>/g, '<p class="sz-not">')],
      sss: ['Sıkça sorulanlar', `<div class="sss">${(A ? [
        ['Paket nasıl gelir?', 'Sade, etiketsiz bir kutuyla. Kutunun dışında marka ve ürün adı yazmaz; içinde hediye kutusu seni bekler.'],
        ['Hangi bedeni almalıyım?', 'Beden rehberindeki ölçüleri mezurayla al; iki beden arasında kalırsan büyüğü öneririz.'],
        ['İade ve değişim yapabilir miyim?', 'Hijyen bandı açılmamış ürünlerde 14 gün içinde değişim yapabilirsin.'],
        ['Kapıda ödeme var mı?', `Var; kapıda ödeme hizmet bedeli ${tl(K.kapidaUcret)}.`],
      ] : [
        ['Pedli külot kaç kez kullanılır?', 'Yıkanabilir ve tekrar kullanılır; ürün ömrü laboratuvar testiyle netleşecek. Yumuşatıcı kullanma, asarak kurut.'],
        ['Lohusa külodunu ne zaman kullanırım?', 'Doğum sonrası kanamanın azaldığı dönemde. Yoğun ilk günlerde doktorunun önerisine uy.'],
        ['Çocuk bedenini nasıl seçerim?', 'Beden rehberindeki boy ölçüsünü esas al; büyüme payı için bir üst yaşı seçebilirsin.'],
        ['3 al 2 öde nasıl uygulanır?', 'Pedli seriden 3 ürün eklediğinde en uygun fiyatlı olan sepette kendiliğinden düşer.'],
      ]).map(([s, c]) => `<details><summary>${esc(s)}${ikon('asagi')}</summary><p class="ince">${esc(c)}</p></details>`).join('')}</div>`],
      iletisim: ['İletişim', `<p>Sorun için WhatsApp destek hattımıza ya da info@${esc(M.alanAdi)} adresine yazabilirsin. Hafta içi 09.00–18.00 arası yanıt veriyoruz.</p><p class="ince">Demo içinde iletişim bilgileri örnektir.</p>`],
      kvkk: ['KVKK aydınlatma metni', '<p>Bu metin demo içindir. Yayındaki sitede, hukuk danışmanınızın onayladığı aydınlatma metni, açık rıza ve çerez politikası bu sayfada yer alır.</p>'],
      mesafeli: ['Mesafeli satış sözleşmesi', '<p>Bu metin demo içindir. Yayındaki sitede ön bilgilendirme formu ve mesafeli satış sözleşmesi, sipariş anındaki ürün, fiyat ve teslimat bilgileriyle otomatik doldurulur.</p>'],
    };
    const s = sayfalar[ad];
    if (!s) return bulunamadi();
    return `<div class="kap"><div class="metin-sayfa"><nav class="kirinti"><a href="#/">Ana sayfa</a><span>/</span><span>${esc(yalin(s[0]))}</span></nav>
      <h1 class="baslik b1" style="font-size:clamp(34px,3.6vw,52px)">${esc(yalin(s[0]))}</h1>${s[1]}</div></div>`;
  }

  const bulunamadi = () => `<div class="kap"><div class="bos" style="margin-top:30px"><h1 class="baslik b2">Aradığın sayfa bulunamadı</h1><p>Bağlantı değişmiş olabilir.</p><a class="dugme" href="#/">Ana sayfaya dön</a></div></div>`;

  function aramaSonuclari(q) {
    const s = kucuk(q.trim());
    if (!s) return [];
    return K.urunler.filter((u) => kucuk(`${u.ad} ${KAT[u.kat].ad} ${u.etiketler.join(' ')} ${u.renkler.map((r) => r.ad).join(' ')}`).includes(s));
  }
  function aramaSayfasi(q) {
    const sonuc = aramaSonuclari(q);
    return `<div class="kap"><nav class="kirinti"><a href="#/">Ana sayfa</a><span>/</span><span>Arama</span></nav>
      <div class="liste-bas"><div><h1 class="baslik b1" style="font-size:clamp(30px,3.2vw,46px)">"${esc(q)}" için ${sonuc.length} sonuç</h1></div></div>
      ${sonuc.length ? `<div class="izgara dort" style="margin-top:20px">${sonuc.map(kartHTML).join('')}</div>` : `<div class="bos" style="margin-top:20px"><h3 class="b3">Sonuç bulunamadı</h3><p>Farklı bir kelime dene ya da kategorilere göz at.</p><a class="dugme" href="#/k/yeni">Tüm ürünler</a></div>`}</div>`;
  }

  // ── Yönlendirici ─────────────────────────────────────────────────────────
  function yonlendir(marka) {
    const ham = location.hash.slice(1) || '/';
    const [yol, sorgu] = ham.split('?');
    const p = yol.split('/').filter(Boolean).map(decodeURIComponent);
    let html;
    if (!p.length) html = anaSayfa();
    else if (p[0] === 'k') html = listeSayfasi(p[1] || 'yeni', sorgu);
    else if (p[0] === 'u') html = urunSayfasi(p[1]);
    else if (p[0] === 'sepet') html = sepetSayfasi();
    else if (p[0] === 'odeme') html = odemeSayfasi();
    else if (p[0] === 'siparis') html = siparisSayfasi(p[1]);
    else if (p[0] === 'takip') html = takipSayfasi(p[1]);
    else if (p[0] === 'hesabim') html = hesapSayfasi(p[1]);
    else if (p[0] === 'favoriler') html = hesapSayfasi('favoriler');
    else if (p[0] === 'ara') html = aramaSayfasi(p.slice(1).join('/'));
    else if (p[0] === 's') html = metinSayfasi(p[1]);
    else html = bulunamadi();
    const main = $('#sayfa');
    main.innerHTML = html;
    document.body.classList.toggle('sabit-var', p[0] === 'u' && !!URUN[p[1]]);
    $$('.kat-nav a[data-yol]').forEach((a) => a.classList.toggle('aktif', ham.startsWith(a.dataset.yol.slice(1))));
    if (!marka) { window.scrollTo(0, 0); document.body.classList.remove('gecis'); void document.body.offsetWidth; document.body.classList.add('gecis'); }
    cekmeceKapat();
    if ($('[data-hesap]')) hesapGuncelle();
    if (p[0] === 'u') galeriBagla();
  }

  // ── Etkileşim ────────────────────────────────────────────────────────────
  function cekmeceAc(ad) {
    if (ad === 'ara') return aramaAc();
    if (ad === 'beden') return modalAc(`<h2 class="baslik b2">Beden rehberi</h2>${K.bedenRehberi.replace(/<h3[^>]*>.*?<\/h3>/, '').replace(/style="[^"]*"/g, '').replace(/<p>/g, '<p class="sz-not">')}`);
    const el = $(`#c-${ad}`);
    if (!el) return;
    cekmeceKapat();
    el.classList.add('acik'); el.setAttribute('aria-hidden', 'false');
    $('#perde').classList.add('acik'); document.body.classList.add('kilitli');
  }
  function cekmeceKapat() {
    $$('.cekmece.acik').forEach((el) => { el.classList.remove('acik'); el.setAttribute('aria-hidden', 'true'); });
    $('#perde')?.classList.remove('acik');
    $('#modal')?.classList.remove('acik');
    document.body.classList.remove('kilitli');
  }
  function modalAc(html) {
    $('#modal-kutu').innerHTML = `<button class="kapat" data-kapat aria-label="Kapat">${ikon('x')}</button>${html}`;
    $('#modal').classList.add('acik'); document.body.classList.add('kilitli');
  }
  function aramaAc(ilk = '') {
    const populer = A ? ['saten', 'dantel', 'gelin', 'kimono', 'body'] : ['pedli', 'lohusa', 'çocuk', 'kombin', 'çizgili'];
    modalAc(`<form class="ara-modal" data-ara-modal><label class="sr" for="ara-m">Ara</label><input id="ara-m" type="search" placeholder="Ne arıyorsun?" value="${esc(ilk)}" autocomplete="off"></form>
      <div class="ara-sonuc" id="ara-sonuc"></div>
      <div class="ara-onerilen"><h4>Popüler aramalar</h4><div class="cipler">${populer.map((x) => `<button class="cip" data-populer="${x}">${x}</button>`).join('')}</div></div>`);
    const inp = $('#ara-m');
    const ciz = () => {
      const r = aramaSonuclari(inp.value).slice(0, 6);
      $('#ara-sonuc').innerHTML = r.map((u) => `<a href="#/u/${u.id}" data-kapat><img src="${IMG(u.gorseller[0], true)}" alt=""><span><b>${esc(u.ad)}</b><br><span class="ince" style="font-size:13px">${esc(KAT[u.kat].ad)}</span></span><b>${tl(u.fiyat)}</b></a>`).join('') || (inp.value.trim() ? '<p class="ince" style="padding:8px">Sonuç yok; farklı bir kelime dene.</p>' : '');
    };
    inp.addEventListener('input', ciz); ciz();
    setTimeout(() => inp.focus(), 30);
  }

  let bildirimZaman;
  function bildir(metin, u, sepetLink) {
    const el = $('#bildirim');
    el.innerHTML = `${u ? `<img src="${IMG(u.gorseller[0], true)}" alt="">` : ikon('etiket')}<span>${esc(metin)}${sepetLink ? '<a href="#/sepet">Sepete git</a>' : ''}</span>`;
    el.classList.add('acik');
    clearTimeout(bildirimZaman);
    bildirimZaman = setTimeout(() => el.classList.remove('acik'), 3200);
  }

  function galeriBagla() {
    const k = $('#kaydir');
    if (!k) return;
    k.addEventListener('scroll', () => {
      const i = Math.round(k.scrollLeft / k.clientWidth);
      $$('.noktalar i').forEach((n, j) => n.classList.toggle('on', i === j));
      $$('.kucukler button').forEach((n, j) => n.classList.toggle('on', i === j));
    }, { passive: true });
  }

  function siparisOlustur(form) {
    const f = new FormData(form);
    const h = hesapla(sepet, odeme);
    const no = `SRN${String(Date.now()).slice(-7)}`;
    siparisler = [{ no, tarih: new Date().toISOString(), adim: 1, satirlar: sepet.map((s) => ({ ...s })), toplam: Math.round(h.toplam * (odeme.odeme === 'kart' && odeme.taksit >= 6 ? (odeme.taksit === 6 ? 1.069 : 1.112) : 1)),
      eposta: f.get('eposta'), il: f.get('il'), odeme: odeme.odeme, taksit: odeme.taksit, kargoKodu: `${Math.floor(1e9 + Math.random() * 9e9)}` }, ...siparisler].slice(0, 12);
    sepet = []; kupon = ''; kaydet(); sayaclar(); sepetCiz();
    location.hash = `#/siparis/${no}`;
  }

  function olaylar() {
    document.addEventListener('click', (e) => {
      const t = e.target.closest('button[data-marka],[data-ac],[data-kapat],[data-fav],[data-hizli],[data-sepete],[data-adet],[data-sil],[data-renk-sec],[data-beden-sec],[data-u-adet],[data-galeri],[data-kaydir],[data-populer],[data-taksit],[data-ilerlet],[data-ornek-doldur],[data-demo-ac]');
      if (!t) return;
      const d = t.dataset;
      if (d.marka) { $('#demo-bar').classList.remove('genis'); markaUygula(d.marka); return; }
      if (d.demoAc !== undefined) { const b = $('#demo-bar'); b.classList.toggle('genis'); t.setAttribute('aria-expanded', b.classList.contains('genis')); return; }
      if (d.ac) { e.preventDefault(); cekmeceAc(d.ac); return; }
      if (d.kapat !== undefined) { if (t.tagName !== 'A') e.preventDefault(); cekmeceKapat(); return; }
      if (d.fav) {
        e.preventDefault();
        const on = favori.includes(d.fav);
        favori = on ? favori.filter((x) => x !== d.fav) : [d.fav, ...favori];
        kaydet(); sayaclar();
        $$(`[data-fav="${d.fav}"]`).forEach((b) => { b.classList.toggle('on', !on); b.setAttribute('aria-pressed', String(!on)); });
        bildir(on ? 'Favorilerden çıkarıldı' : 'Favorilere eklendi', URUN[d.fav]);
        return;
      }
      if (d.hizli) { e.preventDefault(); sepeteEkle(d.hizli, d.renk, d.beden); return; }
      if (d.sepete) {
        const u = URUN[d.sepete];
        if (!secim.beden) {
          $('#beden-sec')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
          const n = $('#stok-not'); if (n) n.textContent = 'Lütfen bir beden seç.';
          return;
        }
        if (sepeteEkle(u.id, secim.renk, secim.beden, secim.adet)) cekmeceAc('sepet');
        return;
      }
      if (d.adet && d.satir !== undefined) {
        const s = sepet[+d.satir]; if (!s) return;
        s.adet = Math.max(0, Math.min(9, s.adet + +d.adet));
        if (!s.adet) sepet.splice(+d.satir, 1);
        kaydet(); sayaclar(); sepetCiz(); if (/^#\/(sepet|odeme)/.test(location.hash)) yonlendir(true);
        return;
      }
      if (d.sil !== undefined) { sepet.splice(+d.sil, 1); kaydet(); sayaclar(); sepetCiz(); if (/^#\/(sepet|odeme)/.test(location.hash)) yonlendir(true); return; }
      if (d.renkSec) {
        const u = URUN[secim.id]; secim.renk = d.renkSec; secim.beden = null;
        $$('[data-renk-sec]').forEach((b) => b.classList.toggle('on', b.dataset.renkSec === secim.renk));
        $('#renk-ad').textContent = secim.renk; $('#beden-sec').innerHTML = bedenButonlari(u); $('#stok-not').textContent = '';
        return;
      }
      if (d.bedenSec) {
        const u = URUN[secim.id]; secim.beden = d.bedenSec;
        $('#beden-sec').innerHTML = bedenButonlari(u); $('#stok-not').textContent = stokNotu(u);
        return;
      }
      if (d.uAdet) { secim.adet = Math.max(1, Math.min(9, secim.adet + +d.uAdet)); $('#u-adet').textContent = secim.adet; return; }
      if (d.galeri) { const k = $('#kaydir'); k.scrollTo({ left: k.clientWidth * +d.galeri, behavior: 'smooth' }); return; }
      if (d.kaydir) { const r = t.closest('.bolum').querySelector('.ray'); r.scrollBy({ left: r.clientWidth * +d.kaydir * 0.9, behavior: 'smooth' }); return; }
      if (d.populer) { $('#ara-m').value = d.populer; $('#ara-m').dispatchEvent(new Event('input')); return; }
      if (d.taksit) { odeme.taksit = +d.taksit; $$('[data-taksit]').forEach((b) => b.classList.toggle('on', b === t)); return; }
      if (d.ilerlet) { const s = siparisler.find((x) => x.no === d.ilerlet); if (s && s.adim < 4) { s.adim++; kaydet(); yonlendir(true); } return; }
      if (d.ornekDoldur !== undefined) {
        const deger = { 'o-ad': 'Ayşe Yılmaz', 'o-tel': '0532 000 00 00', 'o-eposta': 'ornek@musteri.com', 'o-il': 'İzmir', 'o-ilce': 'Karşıyaka', 'o-adres': 'Örnek Mah. Demo Sok. No: 1 D: 2', 'o-kart': '4111 1111 1111 1111', 'o-skt': '12/29', 'o-cvc': '123' };
        for (const [id, v] of Object.entries(deger)) { const el = $(`#${id}`); if (el) { el.value = v; el.dispatchEvent(new Event('input', { bubbles: true })); } }
        const s = $('[name=sozlesme]'); if (s) s.checked = true;
      }
    });
    document.addEventListener('change', (e) => {
      const t = e.target;
      if (t.matches('[data-sirala]')) { const p = new URLSearchParams(location.hash.split('?')[1] || ''); p.set('sira', t.value); location.hash = `#/k/${t.dataset.sirala}?${p}`; }
      if (t.closest('[data-odeme-form]') && ['kargo', 'odeme', 'hediye', 'paket'].includes(t.name)) {
        const veri = Object.fromEntries([...new FormData(t.form)].filter(([k]) => !['kargo', 'odeme', 'hediye', 'paket'].includes(k)));
        if (t.name === 'kargo' || t.name === 'odeme') odeme[t.name] = t.value; else odeme[t.name] = t.checked;
        yonlendir(true);
        for (const [k, v] of Object.entries(veri)) { const el = $(`[name="${k}"]`); if (el && el.type !== 'checkbox') el.value = v; }
      }
    });
    document.addEventListener('input', (e) => {
      const t = e.target;
      if (t.matches('[data-h]')) hesapGuncelle();
      if (t.id === 'o-kart') { t.value = t.value.replace(/\D/g, '').slice(0, 16).replace(/(\d{4})(?=\d)/g, '$1 '); $('#kart-no-g').textContent = (t.value || '•••• •••• •••• ••••').padEnd(19, '•'); }
      if (t.id === 'o-skt') { t.value = t.value.replace(/\D/g, '').slice(0, 4).replace(/^(\d{2})(\d)/, '$1/$2'); $('#kart-skt-g').textContent = t.value || 'AA/YY'; }
      if (t.id === 'o-ad' && $('#kart-ad-g')) $('#kart-ad-g').textContent = t.value.toLocaleUpperCase('tr-TR') || 'AD SOYAD';
      t.closest('.alan')?.classList.remove('hata');
    });
    document.addEventListener('submit', (e) => {
      const f = e.target;
      e.preventDefault();
      if (f.matches('[data-ara-form]')) { const q = $('#ara-girdi').value.trim(); if (q) location.hash = `#/ara/${encodeURIComponent(q)}`; }
      if (f.matches('[data-ara-modal]')) { const q = $('#ara-m').value.trim(); if (q) { cekmeceKapat(); location.hash = `#/ara/${encodeURIComponent(q)}`; } }
      if (f.matches('[data-bulten]')) { f.reset(); bildir('Teşekkürler; demo olduğu için kayıt alınmadı.'); }
      if (f.matches('[data-kupon]')) {
        const k = $('#kupon').value.trim().toUpperCase().replace(/İ/g, 'I');
        kupon = k === 'HOSGELDIN10' ? k : ''; kaydet(); sepetCiz(); yonlendir(true);
        bildir(kupon ? 'Kupon uygulandı: %10 indirim' : 'Kupon geçersiz. Demo kodu: HOSGELDIN10');
      }
      if (f.matches('[data-odeme-form]')) {
        let ilk = null;
        $$('[required]', f).forEach((el) => {
          const bos = el.type === 'checkbox' ? !el.checked : !el.value.trim();
          el.closest('.alan')?.classList.toggle('hata', bos && el.type !== 'checkbox');
          if (bos && !ilk) ilk = el;
        });
        if (ilk) { ilk.scrollIntoView({ behavior: 'smooth', block: 'center' }); bildir(ilk.type === 'checkbox' ? 'Sözleşmeyi onaylaman gerekiyor' : 'Eksik alanları doldur'); return; }
        siparisOlustur(f);
      }
    });
    document.addEventListener('focusin', (e) => { if (e.target.matches('[data-ara-ac]') && innerWidth < 1025) { e.target.blur(); aramaAc(); } });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') cekmeceKapat();
      if (e.key === '/' && !/INPUT|TEXTAREA|SELECT/.test(document.activeElement.tagName)) { e.preventDefault(); const g = $('#ara-girdi'); if (g && innerWidth > 1024) g.focus(); else aramaAc(); }
    });
    $('#perde').addEventListener('click', cekmeceKapat);
    document.addEventListener('click', (e) => { if (!e.target.closest('#demo-bar')) $('#demo-bar').classList.remove('genis'); });
    $('#modal').addEventListener('click', (e) => { if (e.target.id === 'modal') cekmeceKapat(); });
    addEventListener('hashchange', () => yonlendir());
    const ust = $('#ust');
    addEventListener('scroll', () => ust.classList.toggle('golgeli', scrollY > 40), { passive: true });
    // Duyuru bandı (telefon): mesajlar sırayla
    let d = 0;
    setInterval(() => {
      const s = $$('#duyuru span'); if (!s.length || innerWidth > 760) return;
      s[d % s.length].classList.remove('aktif'); d++; s[d % s.length].classList.add('aktif');
    }, 3800);
  }

  // ── Başlat ───────────────────────────────────────────────────────────────
  kabukKur();
  const istenen = new URL(location.href).searchParams.get('marka');
  let kayitli = ''; try { kayitli = localStorage.getItem(`srn-marka-${K.grup}`) || ''; } catch { /* yok */ }
  markaUygula(MARKALAR.some((m) => m.id === istenen) ? istenen : kayitli, true);
  kabukCiz();
  olaylar();
  yonlendir();
})();
