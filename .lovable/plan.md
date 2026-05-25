## Tujuan

Mengganti list chip + counter pada section "Ahli Waris" di `src/pages/Index.tsx` dengan **treemap blok proporsional** yang lebih visual, ringkas, dan interaktif — semua kategori terlihat sekaligus tanpa scroll panjang.

## Konsep Visual

```text
┌─────────────────────────────────────────────┐
│  Ahli Waris               3 dipilih · 5 org │
├──────────────────┬──────────────────────────┤
│                  │   ANAK                   │
│   PASANGAN       │  ┌────────┬─────────┐   │
│  ┌────────────┐  │  │ Anak L │ Anak P  │   │
│  │   Istri    │  │  │  [2]   │   ·     │   │
│  │   [1]      │  │  └────────┴─────────┘   │
│  └────────────┘  │                          │
│   · Suami        │   ORANG TUA              │
│                  │  ┌────────┬─────────┐   │
│                  │  │  Ayah  │  Ibu    │   │
│                  │  │  [1]   │  [1]    │   │
│                  │  └────────┴─────────┘   │
├──────────────────┴──────────────────────────┤
│  KAKEK/NENEK · SAUDARA · CUCU  (collapsed) │
│  [+ Tampilkan lainnya]                      │
└─────────────────────────────────────────────┘
```

- Setiap **kategori** = satu cell besar dengan label kecil di pojok.
- Di dalamnya, setiap **jenis ahli waris** = blok kecil. Blok yang **aktif** terisi `bg-primary` + badge angka jumlah; yang non-aktif transparan dengan border tipis.
- Ukuran blok aktif **membesar proporsional** terhadap jumlah orang (mis. flex-grow `1 + count*0.4`), sehingga "5 anak laki-laki" jelas terlihat lebih dominan daripada "1 istri" — inilah aspek treemap-nya.
- Tap blok = toggle aktif. Saat aktif, muncul tombol **−** dan **+** kecil di dalam blok (tetap pakai stepper +/-) plus angka jumlah.
- Kategori yang jarang dipakai (Kakek/Nenek, Saudara Sekandung/Seayah/Seibu, Cucu) dilipat di balik tombol **"Tampilkan lainnya"** untuk efisiensi vertikal. Otomatis ter-expand jika ada item yang sudah aktif di dalamnya.
- Header section menampilkan ringkasan live: `N dipilih · M orang`.

## Interaksi

- **Tap blok non-aktif** → aktifkan (count = 1), blok membesar dengan transisi.
- **Tap blok aktif (di area label)** → tidak menutup; harus tekan ikon × kecil di pojok untuk menonaktifkan. Mencegah hilang tak sengaja saat mau menambah jumlah.
- **Tombol +/-** di dalam blok aktif: ukuran kecil (h-6 w-6), disabled di batas.
- Animasi: `transition-all duration-200` pada `flex-grow`, ukuran, dan warna.

## Detail Teknis

File yang diubah: **hanya `src/pages/Index.tsx`** (section "Ahli Waris").

- Hapus blok "Inline counters for selected heirs" di bagian bawah card — counter sekarang hidup di dalam blok masing-masing, jadi tidak perlu list terpisah.
- Layout treemap pakai **CSS Flexbox** (bukan library). Tiap kategori = `flex flex-wrap gap-1`, tiap blok = `flex-grow` dinamis dengan `style={{ flexGrow: active ? 1 + count*0.4 : 0.6, flexBasis: '80px' }}` dan `min-height: 56px`.
- Kategori dikelompokkan jadi dua tier:
  - **Primer (selalu tampil)**: Pasangan, Anak, Orang Tua.
  - **Sekunder (di balik toggle)**: sisanya. State lokal `showMore`, auto-true bila ada heir aktif di tier sekunder.
- Tipografi: label kategori `text-[10px] uppercase tracking-wide text-muted-foreground`, label heir `text-xs font-medium`, badge jumlah `text-sm font-bold` di pojok kanan atas blok aktif.
- Warna: aktif `bg-primary text-primary-foreground`, non-aktif `bg-card border border-border text-foreground hover:border-primary/50`. Semua via token semantik — tidak ada warna mentah.
- Tombol kecil (+/− dan ×) pakai `<button>` dengan `e.stopPropagation()` agar tidak men-trigger toggle blok.
- Aksesibilitas: `aria-pressed` pada blok, `aria-label` deskriptif (mis. "Anak Laki-laki, 2 orang, aktif"), tombol stepper tetap punya aria-label seperti sekarang.

## Yang TIDAK berubah

- Logika `selectedHeirs` Map, fungsi `toggleHeir`, `updateHeirCount`, perhitungan, hasil, export — semua tetap.
- Section Harta, Sticky CTA, Hasil Pembagian — tidak disentuh.
- Konstanta `HEIR_CATEGORIES`, `HEIR_LABELS` di `src/lib/inheritance.ts` — tetap, hanya cara render-nya yang berubah.
