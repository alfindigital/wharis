

# Aplikasi Waris Islam

Aplikasi kalkulator dan panduan waris sesuai syariat Islam dengan desain modern minimalist, mobile-first, PWA-ready.

## Design
- **Style**: Modern minimalist, clean white background, accent hijau islami (#059669 emerald)
- **Layout**: Mobile-first, sticky bottom navigation
- **Typography**: Clean sans-serif, Arabic-friendly

## Bottom Navigation (5 menu)

1. **🏠 Beranda** — Ringkasan fitur utama, quick access ke kalkulator
2. **🧮 Hitung** — Kalkulator waris: input ahli waris & harta, hasil pembagian otomatis sesuai Al-Quran & Hadits
3. **📖 Panduan** — Dalil & penjelasan hukum waris (ashabul furudh, ashabah, hijab, aul, radd)
4. **📋 Riwayat** — Simpan & lihat kembali perhitungan sebelumnya (localStorage)
5. **⚙️ Pengaturan** — Tema, bahasa, tentang aplikasi, info PWA install

## Halaman Detail

### Beranda
- Hero card "Hitung Waris Sekarang"
- Statistik singkat (total perhitungan tersimpan)
- Tips hukum waris harian

### Kalkulator Waris
- Step 1: Input total harta peninggalan, hutang, wasiat
- Step 2: Pilih ahli waris yang ada (suami/istri, anak laki/perempuan, ayah, ibu, saudara, dll)
- Step 3: Input jumlah masing-masing ahli waris
- Step 4: Hasil pembagian dengan bagian setiap ahli waris (nominal & persentase), beserta dalilnya

### Panduan
- Accordion/list kategori: Ashabul Furudh, Ashabah, Hijab, Aul & Radd, Dzawil Arham
- Setiap kategori berisi penjelasan singkat + dalil Al-Quran/Hadits

### Riwayat
- List card perhitungan tersimpan di localStorage
- Bisa hapus atau lihat detail

### Pengaturan
- Info aplikasi
- Tombol install PWA
- Reset data

## PWA
- Manifest dengan ikon & display standalone
- Service worker via vite-plugin-pwa (production only, dengan iframe guard)
- Installable dari browser

