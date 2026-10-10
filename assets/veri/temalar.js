/* 8 marka teması — yeni demo. Marka adı, logo, slogan ve kimlik metinleri Mert'in markalar.js'inden gelir
   (müşterinin gördüğü öneriler aynen korunur); burada yalnız mağaza arayüzünün renk, köşe ve yazı dili tanımlıdır.
   Zemin beyaz ya da koyu; her markada tek doygun vurgu. Metin/dolgu kontrastları AA'ya göre seçildi. */
window.TEMALAR = {
  // ───────────── A · FANTEZİ İÇ GİYİM ─────────────
  lal: {
    koyu: true,
    renk: { bg: '#100B0D', yuzey: '#1A1316', yuzey2: '#261C21', ink: '#F6EFE7', ink2: '#B9A9AC',
      vurgu: '#B51F3F', 'vurgu-ink': '#FFFFFF', 'vurgu-metin': '#D6B27E', vurgu2: '#D6B27E', kampanya: '#B51F3F', 'kampanya-ink': '#FFFFFF',
      alt: '#0A0708', 'alt-ink': '#F6EFE7', 'alt-ink2': '#A39395' },
    r: '2px', rBuyuk: '2px', rDugme: '2px', baslikFont: "'Bodoni Moda', 'Times New Roman', serif", baslikAgirlik: 500,
    baslikHarf: '0.01em', baslikBuyuk: true, dugmeBuyuk: true, googleFont: 'Bodoni+Moda:opsz,wght@6..96,400..700',
    logo: { ink: '#F6EFE7', a: '#C42647' }, heroInk: '#F6EFE7', heroKoyu: true,
    ig: 'lalintimates',
  },
  cilve: {
    renk: { bg: '#FFFFFF', yuzey: '#FFF0F4', yuzey2: '#FFDDE6', ink: '#3E0A23', ink2: '#7A4B5D',
      vurgu: '#E0173F', 'vurgu-ink': '#FFFFFF', 'vurgu-metin': '#C40F36', vurgu2: '#FFC93A', kampanya: '#E0173F', 'kampanya-ink': '#FFFFFF',
      alt: '#3E0A23', 'alt-ink': '#FFF0F4', 'alt-ink2': '#D9AFC0' },
    r: '20px', rBuyuk: '28px', rDugme: '999px', baslikFont: "'Heros', Helvetica, Arial, sans-serif", baslikAgirlik: 700,
    baslikHarf: '-0.04em', baslikBuyuk: false, dugmeBuyuk: false,
    logo: { ink: '#3E0A23', a: '#E0173F' }, heroInk: '#3E0A23', heroKoyu: false,
    ig: 'cilve.tr',
  },
  gecesefasi: {
    renk: { bg: '#FFFFFF', yuzey: '#FAF2F1', yuzey2: '#F1E1DE', ink: '#3A1B36', ink2: '#755B70',
      vurgu: '#4A2246', 'vurgu-ink': '#FFFFFF', 'vurgu-metin': '#4A2246', vurgu2: '#B0606E', kampanya: '#4A2246', 'kampanya-ink': '#FFFFFF',
      alt: '#2C1429', 'alt-ink': '#FAF2F1', 'alt-ink2': '#CDB5C8' },
    r: '4px', rBuyuk: '6px', rDugme: '4px', baslikFont: "'Cormorant Garamond', Garamond, serif", baslikAgirlik: 600,
    baslikHarf: '-0.005em', baslikBuyuk: false, dugmeBuyuk: true, googleFont: 'Cormorant+Garamond:wght@500;600;700',
    logo: { ink: '#3A1B36', a: '#B0606E' }, heroInk: '#3A1B36', heroKoyu: false,
    ig: 'gecesefasi', heroBaslik: 'Gece açan çiçek.',
  },
  oda: {
    renk: { bg: '#FFFFFF', yuzey: '#F6F0EA', yuzey2: '#ECE0D5', ink: '#2A1C16', ink2: '#715F55',
      vurgu: '#B04E2B', 'vurgu-ink': '#FFFFFF', 'vurgu-metin': '#B04E2B', vurgu2: '#2A1C16', kampanya: '#2A1C16', 'kampanya-ink': '#FFFFFF',
      alt: '#2A1C16', 'alt-ink': '#F6F0EA', 'alt-ink2': '#C9B8AC' },
    r: '14px', rBuyuk: '22px', rDugme: '999px', baslikFont: "'Heros', Helvetica, Arial, sans-serif", baslikAgirlik: 700,
    baslikHarf: '-0.04em', baslikBuyuk: false, dugmeBuyuk: false,
    logo: { ink: '#2A1C16', a: '#B04E2B' }, heroInk: '#2A1C16', heroKoyu: false,
    ig: 'odaintimates',
  },

  // ───────────── B · PİJAMA + PEDLİ SERİ ─────────────
  imbat: {
    renk: { bg: '#FFFFFF', yuzey: '#EDF5F8', yuzey2: '#D8E9F0', ink: '#11314A', ink2: '#506C82',
      vurgu: '#1C5C8A', 'vurgu-ink': '#FFFFFF', 'vurgu-metin': '#1C5C8A', vurgu2: '#D0663A', kampanya: '#1C5C8A', 'kampanya-ink': '#FFFFFF',
      alt: '#0E2A40', 'alt-ink': '#EDF5F8', 'alt-ink2': '#A9C2D3' },
    r: '12px', rBuyuk: '20px', rDugme: '999px', baslikFont: "'Heros', Helvetica, Arial, sans-serif", baslikAgirlik: 700,
    baslikHarf: '-0.04em', baslikBuyuk: false, dugmeBuyuk: false,
    logo: { ink: '#1C5C8A', a: '#D0663A' }, heroInk: '#11314A', heroKoyu: false,
    ig: 'imbathome',
  },
  misil: {
    renk: { bg: '#FFFFFF', yuzey: '#FFF6D9', yuzey2: '#FFEAA8', ink: '#1E2A56', ink2: '#58648C',
      vurgu: '#FF6A3D', 'vurgu-ink': '#1E2A56', 'vurgu-metin': '#C2410C', vurgu2: '#6FBDF0', kampanya: '#1E2A56', 'kampanya-ink': '#FFFFFF',
      alt: '#1E2A56', 'alt-ink': '#FFF6D9', 'alt-ink2': '#B4BEDE' },
    r: '22px', rBuyuk: '30px', rDugme: '999px', baslikFont: "'Nunito', 'Arial Rounded MT Bold', Arial, sans-serif", baslikAgirlik: 900,
    baslikHarf: '-0.025em', baslikBuyuk: false, dugmeBuyuk: false, googleFont: 'Nunito:wght@700;800;900',
    logo: { ink: '#1E2A56', a: '#FF7A50', a2: '#F5C84C' }, heroInk: '#1E2A56', heroKoyu: false,
    ig: 'misilpijama',
  },
  dongu: {
    renk: { bg: '#FFFFFF', yuzey: '#F6F1FA', yuzey2: '#EADFF5', ink: '#231B2A', ink2: '#6C6176',
      vurgu: '#7A2357', 'vurgu-ink': '#FFFFFF', 'vurgu-metin': '#7A2357', vurgu2: '#5F8F5C', kampanya: '#7A2357', 'kampanya-ink': '#FFFFFF',
      alt: '#231B2A', 'alt-ink': '#F6F1FA', 'alt-ink2': '#BDB0C8' },
    r: '16px', rBuyuk: '24px', rDugme: '12px', baslikFont: "'Heros', Helvetica, Arial, sans-serif", baslikAgirlik: 700,
    baslikHarf: '-0.04em', baslikBuyuk: false, dugmeBuyuk: false,
    logo: { ink: '#231B2A', a: '#7A2357', a2: '#B9A2DA', a3: '#8FAE8D' }, heroInk: '#231B2A', heroKoyu: false,
    ig: 'donguwear',
  },
  ikimiz: {
    renk: { bg: '#FFFFFF', yuzey: '#F1F4EC', yuzey2: '#E0E8D8', ink: '#1E2A21', ink2: '#5C6B5F',
      vurgu: '#2C4A33', 'vurgu-ink': '#FFFFFF', 'vurgu-metin': '#2C4A33', vurgu2: '#C15E3C', kampanya: '#2C4A33', 'kampanya-ink': '#FFFFFF',
      alt: '#1E2A21', 'alt-ink': '#F1F4EC', 'alt-ink2': '#AFC0B0' },
    r: '8px', rBuyuk: '12px', rDugme: '8px', baslikFont: "'Heros', Helvetica, Arial, sans-serif", baslikAgirlik: 700,
    baslikHarf: '-0.04em', baslikBuyuk: false, dugmeBuyuk: false,
    logo: { ink: '#1E2A21', a: '#9CAD94', a2: '#C15E3C' }, heroInk: '#1E2A21', heroKoyu: false,
    ig: 'ikimizhome',
  },
};

/* Çizgi bazında vitrin kampanyaları (sepet kuralları magaza.js'te aynı anahtarlarla) */
window.KAMPANYALAR = {
  A: {
    kurallar: [{ kat: 'takim', tur: 'ikinci', oran: 30, ad: 'Dantel takımlarda 2. ürüne %30' }],
    bloklar: [
      { baslik: 'Babydoll ve gecelikler', fiyat: 649, ek: "TL'den", metin: 'Başlayan fiyatlarla saten, tül ve dantel; kısa ya da uzun. Hepsi atölyemizde dikildi.', link: '#/k/babydoll', urunler: ['tul-babydoll', 'uzun-saten-gecelik'], dugme: 'Gecelikleri gör' },
      { baslik: 'Dantel takımlarda', buyuk: '2. ürüne %30', metin: 'Bralet, jartiyer ve body; indirim sepette kendiliğinden uygulanır.', link: '#/k/takim', urunler: ['jartiyerli-takim', 'dantel-bralet-takim'], dugme: 'Takımları gör' },
    ],
    ikili: [
      { baslik: 'Gelin seti', fiyat: 3490, eski: 3990, metin: 'Dört parça, isim nakışlı kutusuyla.', link: '#/u/gelin-ceyiz-seti', img: 'a08' },
      { baslik: 'Hediye kutusunda', fiyat: 1090, metin: 'Not kartı ve ipek kurdeleyle, hediyeye hazır.', link: '#/u/hediye-kutusu-nude', img: 'a12' },
    ],
  },
  B: {
    kurallar: [{ kat: 'pedli', tur: 'ucal', ad: 'Pedli seride 3 al 2 öde' }],
    bloklar: [
      { baslik: 'Pedli seride', buyuk: '3 al 2 öde', metin: 'Günlük, gece, lohusa ve alıştırma külotlarında; en uygun fiyatlı ürün bizden.', link: '#/k/pedli', urunler: ['pedli-gunluk', 'alistirma-kulodu'], dugme: 'Pedli seriyi gör' },
      { baslik: 'Anne-çocuk kombinler', fiyat: 1149, ek: "TL'den", metin: 'Başlayan fiyatlarla, aynı desen, aynı an. Hediye kutusunda gelir.', link: '#/k/kombin', urunler: ['anne-kiz-cicekli', 'aile-cizgili'], dugme: 'Kombinleri gör' },
    ],
    ikili: [
      { baslik: 'Lohusa Seti', fiyat: 1690, eski: 1996, metin: 'Emzirme pijaması ve 3 lohusa külodu; hastane çantasına hazır.', link: '#/u/lohusa-seti', img: 'b05' },
      { baslik: 'Çocuk pijamaları', fiyat: 449, ek: "TL'den", metin: '2–11 yaş, yumuşacık penye ve neşeli desenler.', link: '#/k/cocuk', img: 'b06' },
    ],
  },
};
