MY DAILY LIFE — PWA

CARA MENJALANKAN DI WINDOWS
1. Extract file ZIP ini.
2. Buka VS Code.
3. Pilih File > Open Folder, lalu pilih folder my-daily-life.
4. Cara termudah: pasang extension "Live Server" dari Extensions di VS Code.
5. Klik kanan index.html > Open with Live Server.
6. Browser akan membuka alamat localhost, biasanya http://127.0.0.1:5500.
7. Untuk memasang PWA di Chrome desktop: klik ikon install di address bar atau menu Chrome > Cast, save and share > Install page as app (nama menu bisa berbeda).

FITUR
- Planner berdasarkan tanggal.
- Tambah, centang, filter, dan hapus tugas.
- Checklist self care dengan kategori.
- Tambah langkah routine sendiri.
- Catatan harian tersimpan otomatis.
- Progress harian.
- Service worker untuk cache/offline setelah kunjungan pertama melalui localhost/HTTPS.

PENYIMPANAN
Data versi awal disimpan di localStorage browser pada perangkat ini. Jangan hapus data situs/browser jika ingin mempertahankan data. Data tidak otomatis tersinkron ke HP atau cloud. Untuk penggunaan lintas perangkat, nanti perlu ditambahkan database dan sinkronisasi akun.

CATATAN
- Jalankan melalui Live Server/localhost, jangan double-click index.html, agar fitur PWA/service worker dapat bekerja.
- Aplikasi ini belum punya akun/login atau backup cloud.
