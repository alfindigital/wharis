import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Download, Trash2, Info, Moon, Mail } from 'lucide-react';
import PageShell from '@/components/PageShell';
import SEO from '@/components/SEO';
import CacheStatusCard from '@/components/CacheStatusCard';
import { Label } from '@/components/ui/label';
import { clearHistory, getHistory } from '@/lib/storage';
import { useToast } from '@/hooks/use-toast';
import { useTheme } from '@/hooks/use-theme';

export default function Pengaturan() {
  const [darkMode, setDarkMode] = useTheme();
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
    <PageShell title="WHARIS" headingSr="Pengaturan — WHARIS">
      <SEO
        title="Pengaturan — WHARIS"
        description="Atur mode gelap, install aplikasi WHARIS ke perangkat, dan kelola data riwayat perhitungan waris."
        path="/pengaturan"
      />
      <div className="space-y-4">
        {/* Dark Mode */}
        <section aria-labelledby="setting-darkmode">
        <Card>
          <CardHeader className="pb-3">
            <h2 id="setting-darkmode" className="sr-only">Mode Gelap</h2>
            <CardTitle className="text-base flex items-center gap-2">
              <Moon className="h-4 w-4 text-primary" /> Mode Gelap
            </CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-between">
            <Label htmlFor="darkmode-switch" className="text-xs text-muted-foreground font-normal cursor-pointer">Aktifkan tampilan gelap untuk kenyamanan mata.</Label>
            <Switch id="darkmode-switch" checked={darkMode} onCheckedChange={setDarkMode} aria-label="Aktifkan mode gelap" />
          </CardContent>
        </Card>
        </section>

        {/* Install PWA */}
        <section aria-labelledby="setting-install">
        <Card>
          <CardHeader className="pb-3">
            <h2 id="setting-install" className="sr-only">Install Aplikasi</h2>
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
        </section>

        {/* Data */}
        <section aria-labelledby="setting-data">
        <Card>
          <CardHeader className="pb-3">
            <h2 id="setting-data" className="sr-only">Data</h2>
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
        </section>

        <section aria-labelledby="setting-cache">
          <h2 id="setting-cache" className="sr-only">Cache & Service Worker</h2>
          <CacheStatusCard />
        </section>

        <Separator />

        {/* About */}
        <section aria-labelledby="setting-about">
        <Card>
          <CardHeader className="pb-3">
            <h2 id="setting-about" className="sr-only">Tentang</h2>
            <CardTitle className="text-base flex items-center gap-2">
              <Info className="h-4 w-4 text-primary" /> Tentang
            </CardTitle>
          </CardHeader>
          <CardContent className="text-xs text-muted-foreground space-y-1">
            <p><strong className="font-brand text-foreground text-sm">WHARIS</strong> <span className="text-[10px]">v1.0</span></p>
            <p>Kalkulator & panduan pembagian waris sesuai syariat Islam berdasarkan Al-Quran dan Hadits.</p>
            <p className="pt-2">Referensi utama:</p>
            <ul className="list-disc list-inside space-y-0.5">
              <li>QS. An-Nisa: 11, 12, 176</li>
              <li>Hadits-hadits shahih tentang waris</li>
              <li>Ijma' ulama tentang hukum waris</li>
            </ul>
            <p className="pt-2 text-[10px]">
              Aplikasi ini bersifat informatif. Untuk kasus waris yang kompleks, konsultasikan dengan ulama atau ahli fiqih.
            </p>
            <Separator className="my-3" />
            <p className="text-xs font-medium text-foreground">Kritik & Saran</p>
            <a
              href="mailto:gmail@alfindigital.com"
              className="inline-flex items-center gap-1.5 text-xs text-primary hover:underline mt-1"
            >
              <Mail className="h-3.5 w-3.5" />
              gmail@alfindigital.com
            </a>
          </CardContent>
        </Card>
        </section>
      </div>
    </PageShell>
  );
}
