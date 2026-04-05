

# Rombak Flow: Gabung Beranda + Kalkulator Jadi Satu Halaman

## Masalah Saat Ini
- Beranda (`/`) hanya berisi welcome card, stats, dan tips — user harus klik lagi ke `/hitung`
- Kalkulator pakai 4 step wizard — terlalu banyak klik
- Flow tidak efisien: buka app → lihat welcome → klik "Mulai Hitung" → step 1 → step 2 → step 3 → step 4

## Solusi: Single-Page Calculator dengan Inline Form

Halaman utama (`/`) langsung menampilkan form kalkulator dalam satu scroll page, tanpa multi-step wizard.

### Layout Baru Halaman Utama (`/`)

```text
┌──────────────────────────┐
│  🏠 WHARIS               │  ← Header tetap
├──────────────────────────┤
│  💰 Input Harta          │  ← Section 1: Total harta, hutang, wasiat
│  [Total Harta  ]         │     (3 input fields, compact)
│  [Hutang] [Wasiat]       │     Hutang & wasiat side-by-side
├──────────────────────────┤
│  👥 Ahli Waris           │  ← Section 2: Chip selector + inline counter
│  [Suami] [Istri] [Anak♂] │     Toggle chip = aktif + muncul counter
│  Anak Laki-laki  [- 2 +] │     Counter langsung muncul di bawah
│  Istri           [- 1 +] │
├──────────────────────────┤
│  📊 Ringkasan            │  ← Sticky summary: harta bersih + jumlah ahli waris
│  [====  HITUNG  ====]    │  ← Tombol CTA besar
├──────────────────────────┤
│  📋 HASIL PEMBAGIAN      │  ← Muncul di bawah setelah hitung
│  (card per ahli waris)   │     Auto-scroll ke hasil
│  [PDF] [JPG] [Salin]     │
├──────────────────────────┤
│  💡 Tips Hukum Waris     │  ← Daily tip di bawah
│  📋 Perhitungan Terakhir │  ← Riwayat terakhir (jika ada)
└──────────────────────────┘
│ 🏠  📖  📋  ⚙️          │  ← Bottom nav: 4 menu (Hitung dihapus)
```

### Perubahan Bottom Nav

Dari 5 menu jadi 4 (karena Beranda = Kalkulator):
1. **Beranda** (/) — Kalkulator + ringkasan
2. **Panduan** (/panduan)
3. **Riwayat** (/riwayat)
4. **Setelan** (/pengaturan)

### Detail Teknis

**File yang diubah:**
1. **`src/pages/Index.tsx`** — Rombak total: gabungkan logic dari Hitung.tsx ke sini. Form kalkulator inline (bukan wizard), hasil muncul di bawah form setelah klik "Hitung". Pertahankan tips & riwayat terakhir di bagian bawah.

2. **`src/pages/Hitung.tsx`** — Hapus atau redirect ke `/`

3. **`src/components/BottomNav.tsx`** — Hapus menu "Hitung", sisakan 4 item

4. **`src/App.tsx`** — Hapus route `/hitung` atau redirect ke `/`

**Behavior baru:**
- Saat user klik "Hitung", hasil muncul di bawah form + auto-scroll ke hasil
- Tombol "Hitung Ulang" reset form dan scroll ke atas
- Chip ahli waris: klik toggle aktif → langsung tampilkan counter inline (gabung step 2 & 3)
- Semua dalam satu scroll — tidak ada step/wizard

