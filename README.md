# Lingkaran Pantul (Multiplying Bouncing Ball)

Game simulasi berbasis web (HTML5 Canvas & Web Audio API) dengan estetika minimalis, natural, dan bersih (tanpa efek neon/futuristik/cyber).

## Fitur
- **Kontrol Bola Awal**: Tentukan jumlah bola awal di dalam lingkaran.
- **Pengaturan Posisi Lubang**: Geser posisi lubang secara fleksibel (Atas `270°`, Bawah `90°`, atau sudut mana pun).
- **Pengaturan Ukuran Lubang**: Atur lebar atau sempitnya lubang lingkaran.
- **Mekanik Pengganda x2**: Setiap kali bola berhasil lolos keluar dari celah lubang, sistem secara otomatis mengalikan bola menjadi 2 bola baru yang masuk kembali ke lingkaran.
- **Fisika Pantulan**: Pantulan elastis alami pada dinding lingkaran menggunakan vektor refleksi normal.
- **Efek Suara (Web Audio API)**:
  - Suara pantulan bola pada dinding lingkaran.
  - Suara bola ketika keluar dari lubang.
  - Suara nada pengali x2 saat bola diduplikasi.
  - Tanpa dependensi file audio eksternal.

## Cara Menjalankan
Buka file `index.html` di peramban web modern apa pun (Chrome, Firefox, Safari, Edge).
