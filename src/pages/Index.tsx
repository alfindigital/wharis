import { useState, useRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Plus, Minus, RotateCcw, FileDown, Image, Copy, Wallet, Users, Calculator, BookOpen, AlertTriangle, RefreshCw, X, ChevronDown, ChevronUp } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import PageShell from '@/components/PageShell';
import SEO from '@/components/SEO';
import {
  calculateInheritance,
  formatCurrency,
  HEIR_CATEGORIES,
  HEIR_LABELS,
  HeirInput,
  HeirType,
  CalculationResult,
} from '@/lib/inheritance';
import { saveCalculation } from '@/lib/storage';
import { cn } from '@/lib/utils';


export default function Index() {
  const { toast } = useToast();
  const resultRef = useRef<HTMLDivElement>(null);
  const topRef = useRef<HTMLDivElement>(null);

  const [totalHarta, setTotalHarta] = useState('');
  const [hutang, setHutang] = useState('');
  const [wasiat, setWasiat] = useState('');
  const [selectedHeirs, setSelectedHeirs] = useState<Map<HeirType, number>>(new Map());
  const [result, setResult] = useState<CalculationResult | null>(null);
  const [showMore, setShowMore] = useState(false);

  const PRIMARY_LABELS = ['Pasangan', 'Anak', 'Orang Tua'];
  const primaryCats = HEIR_CATEGORIES.filter(c => PRIMARY_LABELS.includes(c.label));
  const secondaryCats = HEIR_CATEGORIES.filter(c => !PRIMARY_LABELS.includes(c.label));
  const hasSecondaryActive = secondaryCats.some(c => c.heirs.some(h => selectedHeirs.has(h)));
  const totalPeople = Array.from(selectedHeirs.values()).reduce((a, b) => a + b, 0);




  const netHarta = Math.max(0, (Number(totalHarta) || 0) - (Number(hutang) || 0) - (Number(wasiat) || 0));

  const toggleHeir = (type: HeirType) => {
    const next = new Map(selectedHeirs);
    if (next.has(type)) {
      next.delete(type);
    } else {
      next.set(type, 1);
    }
    setSelectedHeirs(next);
  };

  const updateHeirCount = (type: HeirType, delta: number) => {
    const next = new Map(selectedHeirs);
    const current = next.get(type) || 1;
    const newVal = Math.max(1, Math.min(20, current + delta));
    next.set(type, newVal);
    setSelectedHeirs(next);
  };

  const handleCalculate = () => {
    const heirs: HeirInput[] = Array.from(selectedHeirs.entries()).map(([type, count]) => ({
      type,
      count,
    }));
    const res = calculateInheritance({
      totalHarta: Number(totalHarta) || 0,
      hutang: Number(hutang) || 0,
      wasiat: Number(wasiat) || 0,
      heirs,
    });
    setResult(res);
    saveCalculation(res);
    setTimeout(() => {
      resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  const handleReset = () => {
    setTotalHarta('');
    setHutang('');
    setWasiat('');
    setSelectedHeirs(new Map());
    setResult(null);
    setTimeout(() => {
      topRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const buildResultText = (res: CalculationResult) => {
    let text = `HASIL PERHITUNGAN WARIS\n`;
    text += `${new Date(res.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}\n\n`;
    text += `Harta Bersih: ${formatCurrency(res.netHarta)}\n`;
    if (res.isAul) text += `Aul (penyesuaian bagian)\n`;
    if (res.isRadd) text += `Radd (pengembalian sisa)\n`;
    text += `\n--- Pembagian ---\n`;
    res.results.filter(r => !r.blocked).forEach(r => {
      text += `\n${r.label} (${r.count} orang)\n`;
      text += `   Bagian: ${r.fraction} (${r.percentage.toFixed(1)}%)\n`;
      text += `   Total: ${formatCurrency(r.amount)}\n`;
      if (r.count > 1) text += `   Per orang: ${formatCurrency(r.amountPerPerson)}\n`;
      text += `   Dalil: ${r.dalil}\n`;
    });
    const blocked = res.results.filter(r => r.blocked);
    if (blocked.length > 0) {
      text += `\n--- Terhijab ---\n`;
      blocked.forEach(r => {
        text += `(terhijab) ${r.label}: ${r.blockReason}\n`;
      });
    }
    if (res.sisaHarta > 0) {
      text += `\nSisa Harta: ${formatCurrency(res.sisaHarta)} (Baitul Mal)\n`;
    }
    text += `\n— WHARIS App`;
    return text;
  };

  const handleCopyText = async () => {
    if (!result) return;
    try {
      await navigator.clipboard.writeText(buildResultText(result));
      toast({ title: 'Berhasil', description: 'Hasil perhitungan disalin ke clipboard.' });
    } catch {
      toast({ title: 'Gagal', description: 'Tidak dapat menyalin teks.', variant: 'destructive' });
    }
  };

  const handleSaveImage = async () => {
    if (!resultRef.current) return;
    try {
      const html2canvas = (await import('html2canvas')).default;
      const canvas = await html2canvas(resultRef.current, { backgroundColor: null, scale: 2 });
      const link = document.createElement('a');
      link.download = `waris-${Date.now()}.jpg`;
      link.href = canvas.toDataURL('image/jpeg', 0.9);
      link.click();
      toast({ title: 'Berhasil', description: 'Gambar tersimpan.' });
    } catch {
      toast({ title: 'Gagal', description: 'Tidak dapat menyimpan gambar.', variant: 'destructive' });
    }
  };

  const handleExportPDF = async () => {
    if (!resultRef.current) return;
    try {
      const html2canvas = (await import('html2canvas')).default;
      const { jsPDF } = await import('jspdf');
      const canvas = await html2canvas(resultRef.current, { backgroundColor: '#ffffff', scale: 2 });
      const imgData = canvas.toDataURL('image/jpeg', 0.95);
      const imgWidth = 190;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      const pdf = new jsPDF('p', 'mm', 'a4');
      pdf.addImage(imgData, 'JPEG', 10, 10, imgWidth, imgHeight);
      pdf.save(`waris-${Date.now()}.pdf`);
      toast({ title: 'Berhasil', description: 'PDF tersimpan.' });
    } catch {
      toast({ title: 'Gagal', description: 'Tidak dapat membuat PDF.', variant: 'destructive' });
    }
  };

  const canCalculate = (Number(totalHarta) > 0) && selectedHeirs.size > 0;

  return (
    <PageShell title="WHARIS" subtitle="Kalkulator Waris Syariah" headingSr="WHARIS — Kalkulator Waris Islam sesuai Syariat">
      <SEO
        title="WHARIS — Kalkulator Waris Islam sesuai Syariat"
        description="Hitung pembagian waris (faraidh) otomatis sesuai Al-Quran & Hadits shahih. Masukkan harta, hutang, wasiat, dan ahli waris."
        path="/"
      />
      <div ref={topRef} />

      {/* Section 1: Input Harta */}
      <Card>
        <CardContent className="p-4 space-y-3">
          <h2 className="font-brand text-base font-semibold flex items-center gap-2 text-foreground">
            <Wallet className="h-4 w-4 text-primary" /> Harta Peninggalan
          </h2>
          <div>
            <Label htmlFor="harta" className="text-xs">Total Harta (Rp) *</Label>
            <Input
              id="harta"
              type="number"
              placeholder="0"
              value={totalHarta}
              onChange={e => setTotalHarta(e.target.value)}
              className="mt-1"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="hutang" className="text-xs">Hutang (Rp)</Label>
              <Input
                id="hutang"
                type="number"
                placeholder="0"
                value={hutang}
                onChange={e => setHutang(e.target.value)}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="wasiat" className="text-xs">Wasiat (Rp)</Label>
              <Input
                id="wasiat"
                type="number"
                placeholder="0"
                value={wasiat}
                onChange={e => setWasiat(e.target.value)}
                className="mt-1"
              />
            </div>
          </div>
          {Number(totalHarta) > 0 && (
            <p className="text-xs text-primary font-semibold">
              Harta Bersih: {formatCurrency(netHarta)}
            </p>
          )}
        </CardContent>
      </Card>

      {/* Section 2: Ahli Waris — treemap proporsional */}
      <Card className="mt-3">
        <CardContent className="p-4 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="font-brand text-base font-semibold flex items-center gap-2 text-foreground">
              <Users className="h-4 w-4 text-primary" /> Ahli Waris
            </h2>
            {selectedHeirs.size > 0 && (
              <span className="text-[11px] text-muted-foreground">
                {selectedHeirs.size} jenis · {totalPeople} orang
              </span>
            )}
          </div>

          {[...primaryCats, ...(showMore || hasSecondaryActive ? secondaryCats : [])].map(cat => (
            <div key={cat.label}>
              <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide mb-1.5">{cat.label}</p>
              <div className="flex flex-wrap gap-1.5">
                {cat.heirs.map(type => {
                  const active = selectedHeirs.has(type);
                  const count = selectedHeirs.get(type) || 0;
                  return (
                    <button
                      key={type}
                      type="button"
                      onClick={() => !active && toggleHeir(type)}
                      aria-pressed={active}
                      aria-label={`${HEIR_LABELS[type]}${active ? `, ${count} orang, aktif` : ', non-aktif'}`}
                      className={cn(
                        'relative flex items-center justify-center rounded-lg text-xs font-medium border transition-all duration-200 px-3 py-2.5',
                        active
                          ? 'bg-primary text-primary-foreground border-primary shadow-sm cursor-default'
                          : 'bg-card text-foreground border-border hover:border-primary/50 cursor-pointer'
                      )}
                      style={{
                        flexGrow: active ? 1 + count * 0.4 : 0.6,
                        flexBasis: active ? '120px' : '90px',
                        minHeight: active ? 64 : 44,
                      }}
                    >
                      {active ? (
                        <div className="flex items-center gap-2 w-full">
                          <button
                            type="button"
                            onClick={(e) => { e.stopPropagation(); updateHeirCount(type, -1); }}
                            disabled={count <= 1}
                            aria-label={`Kurangi jumlah ${HEIR_LABELS[type]}`}
                            className="h-6 w-6 rounded-md bg-primary-foreground/15 hover:bg-primary-foreground/25 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center shrink-0"
                          >
                            <Minus className="h-3 w-3" />
                          </button>
                          <div className="flex-1 min-w-0 text-center">
                            <p className="truncate text-[11px] leading-tight opacity-90">{HEIR_LABELS[type]}</p>
                            <p className="font-bold text-base leading-tight">{count}</p>
                          </div>
                          <button
                            type="button"
                            onClick={(e) => { e.stopPropagation(); updateHeirCount(type, 1); }}
                            aria-label={`Tambah jumlah ${HEIR_LABELS[type]}`}
                            className="h-6 w-6 rounded-md bg-primary-foreground/15 hover:bg-primary-foreground/25 flex items-center justify-center shrink-0"
                          >
                            <Plus className="h-3 w-3" />
                          </button>
                          <button
                            type="button"
                            onClick={(e) => { e.stopPropagation(); toggleHeir(type); }}
                            aria-label={`Hapus ${HEIR_LABELS[type]}`}
                            className="absolute -top-1.5 -right-1.5 h-5 w-5 rounded-full bg-background text-foreground border border-border shadow flex items-center justify-center hover:bg-destructive hover:text-destructive-foreground hover:border-destructive"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </div>
                      ) : (
                        <span className="truncate">{HEIR_LABELS[type]}</span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}

          {!hasSecondaryActive && (
            <button
              type="button"
              onClick={() => setShowMore(v => !v)}
              className="w-full text-xs text-muted-foreground hover:text-primary flex items-center justify-center gap-1 py-1.5 border-t border-border/60 mt-2"
            >
              {showMore ? <><ChevronUp className="h-3 w-3" /> Sembunyikan lainnya</> : <><ChevronDown className="h-3 w-3" /> Tampilkan lainnya (Kakek/Nenek, Saudara, Cucu)</>}
            </button>
          )}
        </CardContent>
      </Card>

      {/* Sticky CTA */}
      <div className="sticky bottom-20 z-40 mt-3">
        <Card className={cn("border-primary/40 shadow-xl backdrop-blur-md", canCalculate ? "bg-primary/30 dark:bg-primary/35" : "bg-muted/95 dark:bg-muted/90")}>
          <CardContent className="p-3 space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">Harta Bersih</span>
              <span className="font-semibold text-primary">{formatCurrency(netHarta)}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">Ahli Waris</span>
              <span className="font-semibold">{selectedHeirs.size} dipilih</span>
            </div>
            <Button className="w-full font-semibold" disabled={!canCalculate} onClick={handleCalculate}>
              <Calculator className="h-4 w-4 mr-2" /> Hitung Pembagian
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Results */}
      {result && (
        <div ref={resultRef} className="mt-4 space-y-3">
          <Separator />
          <h2 className="font-brand text-lg font-semibold flex items-center gap-2 text-foreground">
            <BookOpen className="h-4 w-4 text-primary" /> Hasil Pembagian
          </h2>

          {/* Info badges */}
          <div className="flex gap-2 flex-wrap">
            <Badge variant="secondary">
              Harta Bersih: {formatCurrency(result.netHarta)}
            </Badge>
            {result.isAul && (
              <Badge variant="destructive" className="gap-1"><AlertTriangle className="h-3 w-3" /> Aul</Badge>
            )}
            {result.isRadd && (
              <Badge className="bg-primary/10 text-primary border-primary/20 gap-1"><RefreshCw className="h-3 w-3" /> Radd</Badge>
            )}
          </div>

          {/* Heir results */}
          {result.results.filter(r => !r.blocked).map(r => (
            <Card key={r.type}>
              <CardContent className="p-4">
                <div className="flex justify-between items-start mb-1">
                  <div>
                    <p className="font-semibold text-sm">{r.label}</p>
                    <p className="text-xs text-muted-foreground">
                      {r.count} orang · {r.fraction} ({r.percentage.toFixed(1)}%)
                    </p>
                  </div>
                  <p className="font-bold text-primary text-sm">{formatCurrency(r.amount)}</p>
                </div>
                {r.count > 1 && (
                  <p className="text-xs text-muted-foreground">
                    Per orang: {formatCurrency(r.amountPerPerson)}
                  </p>
                )}
                <Separator className="my-2" />
                <p className="text-[11px] text-muted-foreground italic font-serif leading-relaxed">{r.dalil}</p>
              </CardContent>
            </Card>
          ))}

          {/* Blocked heirs */}
          {result.results.filter(r => r.blocked).length > 0 && (
            <div>
              <p className="text-xs font-semibold text-muted-foreground mb-2">Terhijab</p>
              {result.results.filter(r => r.blocked).map(r => (
                <Card key={r.type} className="mb-2 opacity-60">
                  <CardContent className="p-3">
                    <p className="text-sm font-medium">{r.label}</p>
                    <p className="text-xs text-destructive">{r.blockReason}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {result.sisaHarta > 0 && (
            <Card className="border-primary/20">
              <CardContent className="p-4">
                <p className="text-sm font-semibold">Sisa: {formatCurrency(result.sisaHarta)}</p>
                <p className="text-xs text-muted-foreground">Diserahkan ke Baitul Mal</p>
              </CardContent>
            </Card>
          )}

          {/* Export buttons */}
          <div className="grid grid-cols-3 gap-2">
            <Button variant="outline" size="sm" onClick={handleExportPDF}>
              <FileDown className="h-4 w-4 mr-1" /> PDF
            </Button>
            <Button variant="outline" size="sm" onClick={handleSaveImage}>
              <Image className="h-4 w-4 mr-1" /> JPG
            </Button>
            <Button variant="outline" size="sm" onClick={handleCopyText}>
              <Copy className="h-4 w-4 mr-1" /> Salin
            </Button>
          </div>

          <Button variant="outline" className="w-full" onClick={handleReset}>
            <RotateCcw className="h-4 w-4 mr-1" /> Hitung Ulang
          </Button>
        </div>
      )}



      {/* Bottom spacer for nav */}
      <div className="h-4" />
    </PageShell>
  );
}
