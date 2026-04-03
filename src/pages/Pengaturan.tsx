import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Download, Trash2, Info, Moon } from 'lucide-react';
import PageShell from '@/components/PageShell';
import { clearHistory, getHistory } from '@/lib/storage';
import { useToast } from '@/hooks/use-toast';

export default function Pengaturan() {
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('theme') === 'dark' ||
        (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches);
    }
    return false;
  });

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
    localStorage.setItem('theme', darkMode ? 'dark' : 'light');
  }, [darkMode]);
  const { toast } = useToast();
  const [historyCount, setHistoryCount] = useState(getHistory().length);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  // Listen for PWA install prompt
  if (typeof window !== 'undefined') {
    window.addEventListener('beforeinstallprompt', (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
    });
  }

  const handleInstall = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      await deferredPrompt.userChoice;
      setDeferredPrompt(null);
    } else {
      toast({
        title: 'Install PWA',
        description: 'Buka aplikasi di browser (bukan iframe), lalu gunakan menu browser "Add to Home Screen".',
      });
    }
  };

  const handleClear = () => {
    clearHistory();
    setHistoryCount(0);
    toast({ title: 'Berhasil', description: 'Semua riwayat perhitungan telah dihapus.' });
  };

  return (
    <PageShell title="Pengaturan" subtitle="Kelola aplikasi">
      <div className="space-y-4">
        {/* Dark Mode */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Moon className="h-4 w-4 text-primary" /> Mode Gelap
            </CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-between">
            <p className="text-xs text-muted-foreground">Aktifkan tampilan gelap untuk kenyamanan mata.</p>
            <Switch checked={darkMode} onCheckedChange={setDarkMode} />
          </CardContent>
        </Card>

        {/* Install PWA */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Download className="h-4 w-4 text-primary" /> Install Aplikasi
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground mb-3">
              Install sebagai aplikasi di perangkat Anda untuk akses cepat tanpa browser.
            </p>
            <Button variant="outline" className="w-full" onClick={handleInstall}>
              <Download className="h-4 w-4 mr-2" /> Install ke Perangkat
            </Button>
          </CardContent>
        </Card>

        {/* Data */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Trash2 className="h-4 w-4 text-destructive" /> Data
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground mb-1">
              {historyCount} perhitungan tersimpan di perangkat ini.
            </p>
            <Button variant="destructive" size="sm" className="mt-2" onClick={handleClear} disabled={historyCount === 0}>
              Hapus Semua Riwayat
            </Button>
          </CardContent>
        </Card>

        <Separator />

        {/* About */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Info className="h-4 w-4 text-primary" /> Tentang
            </CardTitle>
          </CardHeader>
          <CardContent className="text-xs text-muted-foreground space-y-1">
            <p><strong>Waris Islam</strong> v1.0</p>
            <p>Kalkulator & panduan pembagian waris sesuai syariat Islam berdasarkan Al-Quran dan Hadits.</p>
            <p className="pt-2">Referensi utama:</p>
            <ul className="list-disc list-inside space-y-0.5">
              <li>QS. An-Nisa: 11, 12, 176</li>
              <li>Hadits-hadits shahih tentang waris</li>
              <li>Ijma' ulama tentang hukum waris</li>
            </ul>
            <p className="pt-2 text-[10px]">
              ⚠️ Aplikasi ini bersifat informatif. Untuk kasus waris yang kompleks, konsultasikan dengan ulama atau ahli fiqih.
            </p>
          </CardContent>
        </Card>
      </div>
    </PageShell>
  );
}
