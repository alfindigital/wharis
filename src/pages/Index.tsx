import { useNavigate } from 'react-router-dom';
import { Calculator, BookOpen, ArrowRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import PageShell from '@/components/PageShell';
import { getHistory } from '@/lib/storage';

const tips = [
  'Wasiat maksimal 1/3 dari harta peninggalan (HR. Bukhari & Muslim)',
  'Hutang wajib dilunasi sebelum harta dibagikan kepada ahli waris',
  'Anak laki-laki mendapat bagian 2x anak perempuan (QS. An-Nisa: 11)',
  'Suami mendapat 1/2 jika tidak ada anak, 1/4 jika ada anak',
  'Ibu mendapat 1/6 jika ada anak atau 2+ saudara',
];

export default function Index() {
  const navigate = useNavigate();
  const history = getHistory();
  const tipOfDay = tips[new Date().getDate() % tips.length];

  return (
    <PageShell title="WHARIS" subtitle="Kalkulator & Panduan Waris Syariah">
      {/* Hero CTA */}
      <Card className="bg-primary text-primary-foreground border-0 shadow-lg">
        <CardContent className="p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 rounded-xl bg-primary-foreground/20">
              <Calculator className="h-6 w-6" />
            </div>
            <div>
              <h2 className="font-bold text-lg">Hitung Waris Sekarang</h2>
              <p className="text-sm opacity-90">Pembagian otomatis sesuai Al-Quran & Hadits</p>
            </div>
          </div>
          <Button
            variant="secondary"
            className="w-full mt-1"
            onClick={() => navigate('/hitung')}
          >
            Mulai Hitung <ArrowRight className="h-4 w-4 ml-1" />
          </Button>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 mt-4">
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-primary">{history.length}</p>
            <p className="text-xs text-muted-foreground">Perhitungan Tersimpan</p>
          </CardContent>
        </Card>
        <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => navigate('/panduan')}>
          <CardContent className="p-4 text-center">
            <BookOpen className="h-6 w-6 mx-auto text-primary mb-1" />
            <p className="text-xs text-muted-foreground">Buka Panduan Waris</p>
          </CardContent>
        </Card>
      </div>

      {/* Daily Tip */}
      <Card className="mt-4 border-primary/20 bg-primary/5">
        <CardContent className="p-4">
          <p className="text-xs font-semibold text-primary mb-1">💡 Tips Hukum Waris</p>
          <p className="text-sm text-foreground">{tipOfDay}</p>
        </CardContent>
      </Card>

      {/* Quick Access */}
      {history.length > 0 && (
        <div className="mt-4">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-semibold text-sm">Perhitungan Terakhir</h3>
            <button
              onClick={() => navigate('/riwayat')}
              className="text-xs text-primary font-medium"
            >
              Lihat Semua
            </button>
          </div>
          <Card>
            <CardContent className="p-4">
              <p className="text-sm font-medium">
                {new Date(history[0].date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
              </p>
              <p className="text-xs text-muted-foreground">
                Harta bersih: {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(history[0].netHarta)}
                {' · '}{history[0].results.filter(r => !r.blocked).length} ahli waris
              </p>
            </CardContent>
          </Card>
        </div>
      )}
    </PageShell>
  );
}
