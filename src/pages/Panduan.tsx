import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import PageShell from '@/components/PageShell';

const guides = [
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
      { heir: 'Kakek', share: 'Sisa (menggantikan ayah)', dalil: 'Ijma\' ulama' },
      { heir: 'Saudara Laki Sekandung', share: 'Sisa harta', dalil: 'QS. An-Nisa: 176' },
      { heir: 'Anak Perempuan + Anak Laki', share: 'Asabah bil ghair (2:1)', dalil: 'QS. An-Nisa: 11' },
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
      { heir: 'Cucu dari Anak Laki', share: 'Terhijab oleh anak laki-laki', dalil: 'Ijma\' ulama' },
    ],
  },
  {
    id: 'aul-radd',
    title: 'Aul & Radd',
    desc: 'Penyesuaian jika total bagian melebihi atau kurang dari harta.',
    content: [
      { heir: 'Aul', share: 'Total furudh > harta → semua bagian dikurangi proporsional', dalil: 'Ijtihad Umar bin Khattab (Ijma\')' },
      { heir: 'Radd', share: 'Sisa harta → dikembalikan ke ashabul furudh (kecuali suami/istri)', dalil: 'Pendapat jumhur ulama' },
    ],
  },
  {
    id: 'dzawil-arham',
    title: 'Dzawil Arham',
    desc: 'Kerabat yang tidak termasuk ashabul furudh maupun asabah.',
    content: [
      { heir: 'Cucu dari Anak Perempuan', share: 'Dzawil arham — mewarisi jika tidak ada ahli waris lain', dalil: 'Pendapat sebagian ulama' },
      { heir: 'Anak Saudara Perempuan', share: 'Dzawil arham', dalil: 'Pendapat sebagian ulama' },
      { heir: 'Paman dari Ibu', share: 'Dzawil arham', dalil: 'Pendapat sebagian ulama' },
      { heir: 'Bibi', share: 'Dzawil arham', dalil: 'Pendapat sebagian ulama' },
    ],
  },
];

export default function Panduan() {
  return (
    <PageShell title="Panduan Waris" subtitle="Dalil & penjelasan hukum waris Islam">
      <Accordion type="single" collapsible className="space-y-2">
        {guides.map(g => (
          <AccordionItem key={g.id} value={g.id} className="border rounded-lg px-4">
            <AccordionTrigger className="text-sm font-semibold hover:no-underline">
              <div className="text-left">
                <p>{g.title}</p>
                <p className="text-xs font-normal text-muted-foreground">{g.desc}</p>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-3 pt-1">
                {g.content.map((item, i) => (
                  <div key={i} className="bg-muted/50 rounded-lg p-3">
                    <p className="text-sm font-medium">{item.heir}</p>
                    <p className="text-xs text-muted-foreground">{item.share}</p>
                    <p className="text-xs text-primary mt-1 italic">📖 {item.dalil}</p>
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
