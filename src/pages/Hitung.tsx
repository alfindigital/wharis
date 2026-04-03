import { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, ArrowRight, Check, Plus, Minus, RotateCcw, Info, FileDown, Image, Copy } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import PageShell from '@/components/PageShell';
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

export default function Hitung() {
  const { toast } = useToast();
  const resultRef = useRef<HTMLDivElement>(null);
  const [totalHarta, setTotalHarta] = useState('');
  const [hutang, setHutang] = useState('');
  const [wasiat, setWasiat] = useState('');
  const [selectedHeirs, setSelectedHeirs] = useState<Map<HeirType, number>>(new Map());
  const [result, setResult] = useState<CalculationResult | null>(null);

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
    setStep(4);
  };

  const handleReset = () => {
    setStep(1);
    setTotalHarta('');
    setHutang('');
    setWasiat('');
    setSelectedHeirs(new Map());
    setResult(null);
  };

  const canProceedStep1 = Number(totalHarta) > 0;
  const canProceedStep2 = selectedHeirs.size > 0;

  return (
    <PageShell title="Kalkulator Waris" subtitle={`Langkah ${Math.min(step, 4)} dari 4`}>
      {/* Progress */}
      <div className="flex gap-1 mb-4">
        {[1, 2, 3, 4].map(s => (
          <div
            key={s}
            className={cn(
              'h-1.5 rounded-full flex-1 transition-colors',
              s <= step ? 'bg-primary' : 'bg-muted'
            )}
          />
        ))}
      </div>

      {/* Step 1: Input Harta */}
      {step === 1 && (
        <div className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Harta Peninggalan</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="harta">Total Harta (Rp) *</Label>
                <Input
                  id="harta"
                  type="number"
                  placeholder="Contoh: 1000000000"
                  value={totalHarta}
                  onChange={e => setTotalHarta(e.target.value)}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="hutang">Hutang (Rp)</Label>
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
                <Label htmlFor="wasiat">Wasiat (Rp, maks 1/3)</Label>
                <Input
                  id="wasiat"
                  type="number"
                  placeholder="0"
                  value={wasiat}
                  onChange={e => setWasiat(e.target.value)}
                  className="mt-1"
                />
              </div>
            </CardContent>
          </Card>
          <Button className="w-full" disabled={!canProceedStep1} onClick={() => setStep(2)}>
            Lanjut <ArrowRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      )}

      {/* Step 2: Pilih Ahli Waris */}
      {step === 2 && (
        <div className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Pilih Ahli Waris</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {HEIR_CATEGORIES.map(cat => (
                <div key={cat.label}>
                  <p className="text-xs font-semibold text-muted-foreground mb-1.5">{cat.label}</p>
                  <div className="flex flex-wrap gap-2">
                    {cat.heirs.map(type => (
                      <button
                        key={type}
                        onClick={() => toggleHeir(type)}
                        className={cn(
                          'px-3 py-1.5 rounded-full text-xs font-medium border transition-colors',
                          selectedHeirs.has(type)
                            ? 'bg-primary text-primary-foreground border-primary'
                            : 'bg-card text-foreground border-border hover:border-primary/50'
                        )}
                      >
                        {HEIR_LABELS[type]}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
          <div className="flex gap-2">
            <Button variant="outline" className="flex-1" onClick={() => setStep(1)}>
              <ArrowLeft className="h-4 w-4 mr-1" /> Kembali
            </Button>
            <Button className="flex-1" disabled={!canProceedStep2} onClick={() => setStep(3)}>
              Lanjut <ArrowRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </div>
      )}

      {/* Step 3: Jumlah Ahli Waris */}
      {step === 3 && (
        <div className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Jumlah Ahli Waris</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {Array.from(selectedHeirs.entries()).map(([type, count]) => (
                <div key={type} className="flex items-center justify-between">
                  <span className="text-sm">{HEIR_LABELS[type]}</span>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => updateHeirCount(type, -1)}
                      disabled={count <= 1}
                    >
                      <Minus className="h-3 w-3" />
                    </Button>
                    <span className="w-8 text-center font-semibold text-sm">{count}</span>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => updateHeirCount(type, 1)}
                    >
                      <Plus className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Summary */}
          <Card className="bg-muted/50">
            <CardContent className="p-4">
              <p className="text-xs text-muted-foreground">Ringkasan</p>
              <p className="text-sm">
                Harta: {formatCurrency(Number(totalHarta) || 0)}
                {Number(hutang) > 0 && <> · Hutang: {formatCurrency(Number(hutang))}</>}
                {Number(wasiat) > 0 && <> · Wasiat: {formatCurrency(Number(wasiat))}</>}
              </p>
              <p className="text-sm font-semibold text-primary">
                Harta Bersih: {formatCurrency(Math.max(0, (Number(totalHarta) || 0) - (Number(hutang) || 0) - (Number(wasiat) || 0)))}
              </p>
            </CardContent>
          </Card>

          <div className="flex gap-2">
            <Button variant="outline" className="flex-1" onClick={() => setStep(2)}>
              <ArrowLeft className="h-4 w-4 mr-1" /> Kembali
            </Button>
            <Button className="flex-1" onClick={handleCalculate}>
              <Check className="h-4 w-4 mr-1" /> Hitung
            </Button>
          </div>
        </div>
      )}

      {/* Step 4: Hasil */}
      {step === 4 && result && (
        <div className="space-y-4">
          {/* Info badges */}
          <div className="flex gap-2 flex-wrap">
            <Badge variant="secondary">
              Harta Bersih: {formatCurrency(result.netHarta)}
            </Badge>
            {result.isAul && (
              <Badge variant="destructive">
                <Info className="h-3 w-3 mr-1" /> Aul (penyesuaian)
              </Badge>
            )}
            {result.isRadd && (
              <Badge className="bg-primary/10 text-primary border-primary/20">
                Radd (pengembalian sisa)
              </Badge>
            )}
          </div>

          {/* Results */}
          {result.results.filter(r => !r.blocked).map(r => (
            <Card key={r.type}>
              <CardContent className="p-4">
                <div className="flex justify-between items-start mb-1">
                  <div>
                    <p className="font-semibold text-sm">{r.label}</p>
                    <p className="text-xs text-muted-foreground">
                      {r.count} orang · Bagian: {r.fraction} ({r.percentage.toFixed(1)}%)
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
                <p className="text-xs text-muted-foreground italic">📖 {r.dalil}</p>
              </CardContent>
            </Card>
          ))}

          {/* Blocked heirs */}
          {result.results.filter(r => r.blocked).length > 0 && (
            <div>
              <p className="text-xs font-semibold text-muted-foreground mb-2">Terhijab (Tidak Mendapat Bagian)</p>
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
                <p className="text-sm font-semibold">Sisa Harta: {formatCurrency(result.sisaHarta)}</p>
                <p className="text-xs text-muted-foreground">Diserahkan ke Baitul Mal</p>
              </CardContent>
            </Card>
          )}

          <Button className="w-full" onClick={handleReset}>
            <RotateCcw className="h-4 w-4 mr-1" /> Hitung Ulang
          </Button>
        </div>
      )}
    </PageShell>
  );
}
