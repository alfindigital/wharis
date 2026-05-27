import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import PageShell from '@/components/PageShell';
import SEO from '@/components/SEO';


const guides = [
  {
    id: 'dasar',
    title: 'Dasar Aturan Waris',
    desc: 'Prinsip dan urutan pembagian harta peninggalan.',
    content: [
      { heir: 'Sumber Hukum', share: 'Al-Quran (QS. An-Nisa: 11, 12, 176), Hadits shahih, dan Ijma\' ulama', dalil: 'QS. An-Nisa: 11–12, 176' },
      { heir: 'Urutan Pembagian', share: '1) Biaya pengurusan jenazah  2) Pelunasan hutang  3) Pelaksanaan wasiat (maks. 1/3)  4) Sisa baru dibagi ke ahli waris', dalil: 'QS. An-Nisa: 11 — "sesudah (dipenuhi) wasiat... dan sesudah dibayar hutangnya"' },
      { heir: 'Kategori Ahli Waris', share: 'Ashabul Furudh (bagian tetap), Asabah (sisa), Dzawil Arham (kerabat jauh)', dalil: 'Ijma\' ulama berdasarkan QS. An-Nisa: 11–12' },
    ],
  },
  {
    id: 'furudh',
    title: 'Ashabul Furudh',
    desc: 'Ahli waris yang bagiannya sudah ditentukan dalam Al-Quran.',
    content: [
      { heir: 'Suami', share: '1/2 (tanpa anak) atau 1/4 (ada anak)', dalil: 'QS. An-Nisa: 12' },
      { heir: 'Istri', share: '1/4 (tanpa anak) atau 1/8 (ada anak)', dalil: 'QS. An-Nisa: 12' },
      { heir: 'Anak Perempuan', share: '1/2 (tunggal) atau 2/3 (2+)', dalil: 'QS. An-Nisa: 11' },
      { heir: 'Ayah', share: '1/6 (ada anak laki)', dalil: 'QS. An-Nisa: 11' },
      { heir: 'Ibu', share: '1/6 (ada anak/2+ saudara) atau 1/3', dalil: 'QS. An-Nisa: 11' },
      { heir: 'Nenek', share: '1/6', dalil: 'HR. At-Tirmidzi no. 2101 (hasan shahih), Abu Dawud no. 2894' },
      { heir: 'Saudara Seibu', share: '1/6 (tunggal) atau 1/3 (2+)', dalil: 'QS. An-Nisa: 12' },
      { heir: 'Saudara Perempuan Sekandung', share: '1/2 (tunggal) atau 2/3 (2+)', dalil: 'QS. An-Nisa: 176' },
    ],
  },
  {
    id: 'asabah',
    title: 'Asabah',
    desc: 'Ahli waris yang mendapat sisa harta setelah ashabul furudh.',
    content: [
      { heir: 'Anak Laki-laki', share: 'Sisa harta (asabah binafsih)', dalil: 'QS. An-Nisa: 11' },
      { heir: 'Ayah', share: 'Sisa (jika tidak ada anak laki)', dalil: 'QS. An-Nisa: 11' },
      { heir: 'Kakek', share: 'Sisa (menggantikan ayah)', dalil: 'Ijma\' ulama berdasarkan qiyas pada QS. An-Nisa: 11' },
      { heir: 'Saudara Laki Sekandung', share: 'Sisa harta', dalil: 'QS. An-Nisa: 176' },
      { heir: 'Anak Perempuan + Anak Laki', share: 'Asabah bil ghair (2:1)', dalil: 'QS. An-Nisa: 11' },
    ],
  },
  {
    id: 'wasiat-hutang',
    title: 'Wasiat & Hutang',
    desc: 'Kewajiban yang harus diselesaikan sebelum harta dibagi.',
    content: [
      { heir: 'Hutang', share: 'Wajib dilunasi lebih dulu dari seluruh harta peninggalan, tanpa batas jumlah', dalil: 'QS. An-Nisa: 11 — "sesudah dibayar hutangnya"' },
      { heir: 'Wasiat', share: 'Maksimal 1/3 dari sisa setelah hutang. Tidak boleh untuk ahli waris yang sudah dapat bagian', dalil: 'HR. Al-Bukhari no. 2742, Muslim no. 1628 (Sa\'ad bin Abi Waqqash)' },
      { heir: 'Catatan', share: 'Jika wasiat > 1/3 → kelebihan butuh persetujuan seluruh ahli waris. Wasiat untuk ahli waris → batal kecuali disetujui semua', dalil: 'HR. Ad-Daraquthni, dishahihkan Al-Albani' },
    ],
  },
  {
    id: 'hijab',
    title: 'Hijab (Penghalang)',
    desc: 'Ahli waris yang terhalang oleh ahli waris lain.',
    content: [
      { heir: 'Kakek', share: 'Terhijab oleh Ayah', dalil: 'Ijma\' ulama' },
      { heir: 'Nenek', share: 'Terhijab oleh Ibu', dalil: 'Ijma\' ulama' },
      { heir: 'Saudara Seibu', share: 'Terhijab oleh anak/ayah/kakek', dalil: 'QS. An-Nisa: 12' },
      { heir: 'Saudara Seayah', share: 'Terhijab oleh saudara laki sekandung', dalil: 'Ijma\' ulama' },
      { heir: 'Cucu dari Anak Laki', share: 'Terhijab oleh anak laki-laki', dalil: 'HR. Al-Bukhari no. 6732' },
    ],
  },
  {
    id: 'aul-radd',
    title: 'Aul & Radd',
    desc: 'Penyesuaian jika total bagian melebihi atau kurang dari harta.',
    content: [
      { heir: 'Aul', share: 'Total furudh > harta → semua bagian dikurangi proporsional', dalil: 'Ijtihad Umar bin Khattab radhiyallahu \'anhu (Ijma\' Sahabat)' },
      { heir: 'Radd', share: 'Sisa harta → dikembalikan ke ashabul furudh (kecuali suami/istri)', dalil: 'Pendapat Umar, Ali, dan jumhur ulama' },
    ],
  },
  {
    id: 'dzawil-arham',
    title: 'Dzawil Arham',
    desc: 'Kerabat yang tidak termasuk ashabul furudh maupun asabah.',
    content: [
      { heir: 'Cucu dari Anak Perempuan', share: 'Dzawil arham — mewarisi jika tidak ada ahli waris lain', dalil: 'Pendapat Abu Hanifah, Ahmad bin Hanbal (bukan ashabul furudh/asabah)' },
      { heir: 'Anak Saudara Perempuan', share: 'Dzawil arham', dalil: 'Pendapat Hanafiyyah dan Hanabilah' },
      { heir: 'Paman dari Ibu', share: 'Dzawil arham', dalil: 'Pendapat Hanafiyyah dan Hanabilah' },
      { heir: 'Bibi', share: 'Dzawil arham', dalil: 'Pendapat Hanafiyyah dan Hanabilah' },
    ],
  },
];

const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: guides.flatMap(g =>
    g.content.map(item => ({
      '@type': 'Question',
      name: `${g.title}: ${item.heir}`,
      acceptedAnswer: {
        '@type': 'Answer',
        text: `${item.share}. Dalil: ${item.dalil}`,
      },
    }))
  ),
};

export default function Panduan() {
  return (
    <PageShell title="WHARIS" headingSr="Panduan Waris Islam — WHARIS">
      <SEO
        title="Panduan Waris Islam — Ashabul Furudh, Asabah & Hijab | WHARIS"
        description="Panduan lengkap pembagian waris menurut syariat Islam: ashabul furudh, asabah, hijab, aul & radd, serta dzawil arham beserta dalilnya."
        path="/panduan"
        jsonLd={faqJsonLd}
      />
      <Accordion type="single" collapsible defaultValue="dasar" className="space-y-2">
        {guides.map(g => (
          <AccordionItem key={g.id} value={g.id} className="border rounded-lg px-4">
            <AccordionTrigger className="hover:no-underline py-3">
              <div className="text-left">
                <h2 className="font-brand text-base font-semibold text-foreground">{g.title}</h2>
                <p className="text-xs font-normal text-muted-foreground mt-0.5">{g.desc}</p>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-3 pt-1">
                {g.content.map((item, i) => (
                  <div key={i} className="bg-muted/50 rounded-lg p-3">
                    <p className="text-sm font-medium">{item.heir}</p>
                    <p className="text-xs text-muted-foreground">{item.share}</p>
                    <p className="text-[11px] text-muted-foreground mt-1 italic">{item.dalil}</p>
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </PageShell>
  );
}
