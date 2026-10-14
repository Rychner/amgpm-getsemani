/* ==========================================================
   AMGPM — skrip situs ranting
   1) Isi bagian CONFIG di bawah ini dengan data ranting Anda.
   2) Sisanya (menu, filter agenda, form WhatsApp, animasi)
      berjalan otomatis.
   ========================================================== */

const CONFIG = {
  ranting: '[NAMA RANTING]',
  jemaat: '[NAMA JEMAAT]',

  // Warna aksen: 'emas' | 'jingga' | 'tosca'
  // Untuk mencoba cepat, buka index.html?aksen=jingga
  aksen: 'emas',

  // Nomor WhatsApp pengurus, format internasional tanpa + dan spasi.
  // Contoh: '6281234567890'. Kosongkan jika belum ada.
  whatsapp: '',

  ibadah: {
    waktu: '[HARI], [TANGGAL] · [JAM] WIT',
    lokasi: '[LOKASI IBADAH]'
  },

  renungan: {
    judul: '[Judul renungan]',
    ayat: '[Ayat bacaan dan alamatnya]',
    ringkasan: '[Ringkasan renungan dalam dua atau tiga kalimat.]',
    tautan: '#warta' // isi alamat halaman renungan lengkap bila ada
  },

  // kategori dipakai sebagai tombol saring. Tulis konsisten.
  agenda: [
    { tgl: '[TGL]', bln: '[BLN]', judul: 'Ibadah Pemuda',          waktu: '[HARI], [JAM] WIT', lokasi: '[LOKASI]', kategori: 'Ibadah',     tautan: '' },
    { tgl: '[TGL]', bln: '[BLN]', judul: 'Latihan Paduan Suara',   waktu: '[HARI], [JAM] WIT', lokasi: '[LOKASI]', kategori: 'Musik',      tautan: '' },
    { tgl: '[TGL]', bln: '[BLN]', judul: 'Rapat Pengurus Ranting', waktu: '[HARI], [JAM] WIT', lokasi: '[LOKASI]', kategori: 'Organisasi', tautan: '' },
    { tgl: '[TGL]', bln: '[BLN]', judul: 'Aksi Kunjungan Jemaat',  waktu: '[HARI], [JAM] WIT', lokasi: '[LOKASI]', kategori: 'Diakonia',   tautan: '' }
  ],

  warta: [
    { tanggal: '[TANGGAL]', judul: '[Judul warta pertama]', tautan: '' },
    { tanggal: '[TANGGAL]', judul: '[Judul warta kedua]',   tautan: '' },
    { tanggal: '[TANGGAL]', judul: '[Judul warta ketiga]',  tautan: '' }
  ],

  // src: nama file foto, misalnya 'foto/ibadah.jpg'. Kosong = kotak penanda.
  galeri: [
    { judul: '[FOTO KEGIATAN 1]', src: '' },
    { judul: '[FOTO KEGIATAN 2]', src: '' },
    { judul: '[FOTO KEGIATAN 3]', src: '' },
    { judul: '[FOTO KEGIATAN 4]', src: '' },
    { judul: '[FOTO KEGIATAN 5]', src: '' },
    { judul: '[FOTO KEGIATAN 6]', src: '' }
  ],

  dukungan: {
    qris: '', // contoh: 'qris.png'
    rekening: '[NAMA BANK] [NOMOR REKENING]',
    atasNama: 'a.n. [NAMA PEMEGANG REKENING]'
  },

  kontak: {
    alamat: '[ALAMAT SEKRETARIAT]',
    whatsapp: '[NOMOR WHATSAPP]',
    email: '[EMAIL RANTING]',
    instagram: '@[AKUN INSTAGRAM]'
  }
};

(function () {
  'use strict';

  /* ---------- Pembantu ---------- */
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  // Membuat elemen dengan aman (teks lewat textContent, bukan innerHTML).
  function h(tag, attrs = {}, ...kids) {
    const node = document.createElement(tag);
    for (const [k, v] of Object.entries(attrs)) {
      if (v == null || v === false) continue;
      if (k === 'class') node.className = v;
      else if (k === 'text') node.textContent = v;
      else node.setAttribute(k, v === true ? '' : v);
    }
    kids.flat().forEach(function (c) { if (c != null) node.append(c); });
    return node;
  }

  function setText(id, text) {
    const el = document.getElementById(id);
    if (el && text) el.textContent = text;
  }

  function nomorWa() {
    return String(CONFIG.whatsapp || '').replace(/\D/g, '');
  }

  function linkWa(teks) {
    const no = nomorWa();
    const base = no ? 'https://wa.me/' + no : 'https://wa.me/';
    return base + '?text=' + encodeURIComponent(teks);
  }

  /* ---------- Animasi masuk ---------- */
  let pengamat = null;
  function pantau(root) {
    const items = $$('.reveal', root || document);
    if (!('IntersectionObserver' in window)) {
      items.forEach(function (el) { el.classList.add('masuk'); });
      return;
    }
    if (!pengamat) {
      pengamat = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) {
            e.target.classList.add('masuk');
            pengamat.unobserve(e.target);
          }
        });
      }, { threshold: 0.12 });
    }
    items.forEach(function (el) { pengamat.observe(el); });
  }

  /* ---------- Isi data dari CONFIG ---------- */
  function terapkanConfig() {
    $$('[data-isi="ranting"]').forEach(function (el) { el.textContent = CONFIG.ranting; });
    $$('[data-isi="jemaat"]').forEach(function (el) { el.textContent = CONFIG.jemaat; });
    document.title = 'AMGPM Ranting ' + CONFIG.ranting;

    const dariUrl = new URLSearchParams(location.search).get('aksen');
    const aksen = ['emas', 'jingga', 'tosca'].indexOf(dariUrl) > -1 ? dariUrl : CONFIG.aksen;
    document.documentElement.dataset.aksen = aksen;

    setText('ibadah-waktu', CONFIG.ibadah.waktu);
    setText('ibadah-lokasi', CONFIG.ibadah.lokasi);

    setText('renungan-judul', CONFIG.renungan.judul);
    setText('renungan-ayat', CONFIG.renungan.ayat);
    setText('renungan-ringkas', CONFIG.renungan.ringkasan);
    const baca = $('#renungan-baca');
    if (baca && CONFIG.renungan.tautan) baca.setAttribute('href', CONFIG.renungan.tautan);

    setText('rek-nomor', CONFIG.dukungan.rekening);
    setText('rek-nama', CONFIG.dukungan.atasNama);
    const qris = $('#qris');
    if (qris && CONFIG.dukungan.qris) {
      qris.replaceChildren(h('img', { src: CONFIG.dukungan.qris, alt: 'Kode QRIS ranting ' + CONFIG.ranting }));
    }

    setText('kontak-alamat', CONFIG.kontak.alamat);
    setText('kontak-wa', CONFIG.kontak.whatsapp);
    setText('kontak-email', CONFIG.kontak.email);
    setText('kontak-ig', CONFIG.kontak.instagram);
    setText('tahun', String(new Date().getFullYear()));

    const no = nomorWa();
    if (no) {
      const chat = $('#chat-pengurus');
      if (chat) {
        chat.setAttribute('href', linkWa('Shalom, saya ingin bertanya tentang AMGPM Ranting ' + CONFIG.ranting + '.'));
        chat.setAttribute('target', '_blank');
        chat.setAttribute('rel', 'noopener');
      }
      const konf = $('#konfirmasi-persembahan');
      if (konf) {
        konf.setAttribute('href', linkWa('Shalom, saya sudah mengirim persembahan untuk AMGPM Ranting ' + CONFIG.ranting + '.'));
        konf.setAttribute('target', '_blank');
        konf.setAttribute('rel', 'noopener');
      }
    }
  }

  /* ---------- Agenda + saring ---------- */
  function renderAgenda(kategori) {
    const daftar = $('#agenda-daftar');
    if (!daftar) return;
    const data = CONFIG.agenda.filter(function (a) { return kategori === 'Semua' || a.kategori === kategori; });

    if (!data.length) {
      daftar.replaceChildren(h('li', { class: 'kosong', text: 'Belum ada kegiatan untuk kategori ini.' }));
      return;
    }

    daftar.replaceChildren.apply(daftar, data.map(function (a) {
      return h('li', { class: 'agenda-item reveal' },
        h('div', { class: 'tgl' }, h('b', { text: a.tgl }), h('span', { text: a.bln })),
        h('div', { class: 'agenda-info' },
          h('h3', { text: a.judul }),
          h('p', { text: a.waktu + ' · ' + a.lokasi })
        ),
        h('span', { class: 'tag', text: a.kategori }),
        h('a', { class: 'tombol tombol-garis-gelap tombol-kecil', href: a.tautan || '#kontak', text: 'Detail' })
      );
    }));
    pantau(daftar);
  }

  function siapkanFilter() {
    const wadah = $('#agenda-filter');
    if (!wadah) return;
    const kategori = ['Semua'];
    CONFIG.agenda.forEach(function (a) { if (kategori.indexOf(a.kategori) < 0) kategori.push(a.kategori); });

    if (kategori.length <= 2) { wadah.hidden = true; renderAgenda('Semua'); return; }

    wadah.replaceChildren.apply(wadah, kategori.map(function (k, i) {
      return h('button', { class: 'chip', type: 'button', 'aria-pressed': i === 0 ? 'true' : 'false', 'data-k': k, text: k });
    }));

    wadah.addEventListener('click', function (e) {
      const btn = e.target.closest('.chip');
      if (!btn) return;
      $$('.chip', wadah).forEach(function (c) { c.setAttribute('aria-pressed', String(c === btn)); });
      renderAgenda(btn.dataset.k);
    });
    renderAgenda('Semua');
  }

  /* ---------- Warta ---------- */
  function renderWarta() {
    const ul = $('#warta-daftar');
    if (!ul || !CONFIG.warta.length) return;
    ul.replaceChildren.apply(ul, CONFIG.warta.map(function (w) {
      return h('li', {},
        h('span', { class: 'warta-tgl', text: w.tanggal }),
        h('a', { href: w.tautan || '#warta', text: w.judul })
      );
    }));
  }

  /* ---------- Galeri ---------- */
  function renderGaleri() {
    const grid = $('#galeri-grid');
    if (!grid) return;
    grid.replaceChildren.apply(grid, CONFIG.galeri.map(function (g) {
      const fig = h('figure', { class: 'reveal' });
      if (g.src) fig.append(h('img', { src: g.src, alt: g.judul, loading: 'lazy' }));
      else fig.append(h('span', { text: g.judul }));
      return fig;
    }));
    pantau(grid);
  }

  /* ---------- Menu HP ---------- */
  function siapkanMenu() {
    const btn = $('#menu-btn');
    const menu = $('#menu-utama');
    if (!btn || !menu) return;

    function atur(buka) {
      menu.classList.toggle('buka', buka);
      btn.setAttribute('aria-expanded', String(buka));
      btn.setAttribute('aria-label', buka ? 'Tutup menu' : 'Buka menu');
    }

    btn.addEventListener('click', function () { atur(!menu.classList.contains('buka')); });
    menu.addEventListener('click', function (e) { if (e.target.closest('a')) atur(false); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && menu.classList.contains('buka')) { atur(false); btn.focus(); }
    });
    window.matchMedia('(min-width: 961px)').addEventListener('change', function (e) { if (e.matches) atur(false); });
  }

  /* ---------- Penanda menu aktif ---------- */
  function siapkanSpy() {
    if (!('IntersectionObserver' in window)) return;
    const links = $$('.menu a[href^="#"]:not(.tombol)');
    const peta = new Map();
    links.forEach(function (a) {
      const sec = document.getElementById(a.getAttribute('href').slice(1));
      if (sec) peta.set(sec, a);
    });
    const spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        links.forEach(function (a) { a.removeAttribute('aria-current'); });
        const a = peta.get(e.target);
        if (a) a.setAttribute('aria-current', 'true');
      });
    }, { rootMargin: '-40% 0px -55% 0px' });
    peta.forEach(function (_, sec) { spy.observe(sec); });
  }

  /* ---------- Bagikan renungan ---------- */
  function siapkanBagikan() {
    const btn = $('#renungan-bagi');
    if (!btn) return;
    btn.addEventListener('click', function () {
      const r = CONFIG.renungan;
      const teks = 'Renungan AMGPM Ranting ' + CONFIG.ranting + '\n\n' + r.judul + '\n' + r.ayat + '\n\n' + r.ringkasan + '\n\n' + location.href.split('#')[0];
      const url = 'https://wa.me/?text=' + encodeURIComponent(teks);
      window.open(url, '_blank', 'noopener');
    });
  }

  /* ---------- Form gabung -> WhatsApp ---------- */
  function siapkanGabung() {
    const dlg = $('#dlg-gabung');
    const buka = $('#buka-gabung');
    const form = $('#form-gabung');
    const galat = $('#f-galat');
    if (!dlg || !buka || !form) return;

    function tutup() {
      if (typeof dlg.close === 'function') dlg.close(); else dlg.removeAttribute('open');
    }

    buka.addEventListener('click', function () {
      galat.hidden = true;
      if (typeof dlg.showModal === 'function') dlg.showModal(); else dlg.setAttribute('open', '');
      $('#f-nama').focus();
    });

    $$('[data-tutup]', dlg).forEach(function (b) { b.addEventListener('click', tutup); });

    // klik di luar kotak = tutup
    dlg.addEventListener('click', function (e) {
      if (e.target !== dlg) return;
      const r = dlg.getBoundingClientRect();
      const di_luar = e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom;
      if (di_luar) tutup();
    });

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      const nama = $('#f-nama');
      const wa = $('#f-wa');
      const pesan = $('#f-pesan').value.trim();

      [nama, wa].forEach(function (i) { i.removeAttribute('aria-invalid'); });
      const digit = wa.value.replace(/\D/g, '');
      const salah = [];
      if (!nama.value.trim()) { nama.setAttribute('aria-invalid', 'true'); salah.push('nama'); }
      if (digit.length < 9) { wa.setAttribute('aria-invalid', 'true'); salah.push('nomor WhatsApp'); }

      if (salah.length) {
        galat.textContent = 'Mohon isi ' + salah.join(' dan ') + ' dengan benar.';
        galat.hidden = false;
        (salah[0] === 'nama' ? nama : wa).focus();
        return;
      }
      galat.hidden = true;

      const teks = [
        'Shalom, saya ingin bergabung dengan AMGPM Ranting ' + CONFIG.ranting + '.',
        '',
        'Nama: ' + nama.value.trim(),
        'WhatsApp: ' + wa.value.trim(),
        'Bidang yang diminati: ' + $('#f-bidang').value,
        pesan ? 'Pesan: ' + pesan : ''
      ].filter(function (b, i) { return b !== '' || i === 1; }).join('\n');

      window.open(linkWa(teks), '_blank', 'noopener');
      form.reset();
      tutup();
    });
  }

  /* ---------- Mulai ---------- */
  function mulai() {
    terapkanConfig();
    siapkanFilter();
    renderWarta();
    renderGaleri();
    siapkanMenu();
    siapkanSpy();
    siapkanBagikan();
    siapkanGabung();
    pantau(document);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', mulai);
  else mulai();
})();
