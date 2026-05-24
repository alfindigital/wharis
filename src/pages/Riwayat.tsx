import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Trash2, ChevronDown, ChevronUp } from 'lucide-react';
import PageShell from '@/components/PageShell';
import SEO from '@/components/SEO';
import { getHistory, deleteCalculation } from '@/lib/storage';
import { formatCurrency, HEIR_LABELS, CalculationResult } from '@/lib/inheritance';
import { Separator } from '@/components/ui/separator';

const seo = (
  <SEO
    title="Riwayat Perhitungan Waris — WHARIS"
    description="Daftar riwayat perhitungan pembagian waris yang tersimpan di perangkat Anda."
    path="/riwayat"
  />
);

export default function Riwayat() {
  const [history, setHistory] = useState(getHistory);
  const [expanded, setExpanded] = useState<string | null>(null);

  const handleDelete = (id: string) => {
    deleteCalculation(id);
    setHistory(getHistory());
  };

  if (history.length === 0) {
    return (
      <PageShell title="WHARIS" subtitle="Riwayat Perhitungan" headingSr="Riwayat Perhitungan Waris — WHARIS">
        {seo}
        <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
          <p className="text-sm">Belum ada riwayat perhitungan</p>
          <p className="text-xs mt-1">Mulai hitung waris untuk menyimpan riwayat</p>
        </div>
      </PageShell>
    );
  }

  return (
    <PageShell title="WHARIS" subtitle={`${history.length} perhitungan tersimpan`} headingSr="Riwayat Perhitungan Waris — WHARIS">
      {seo}
      <h2 className="sr-only">Daftar Riwayat Perhitungan</h2>
      <div className="space-y-3">
        {history.map((item: CalculationResult) => (
          <Card key={item.id}>
            <CardContent className="p-4">
              <div className="flex justify-between items-start">
                <div className="flex-1 cursor-pointer" onClick={() => setExpanded(expanded === item.id ? null : item.id)}>
                  <p className="text-sm font-semibold">
                    {new Date(item.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Harta bersih: {formatCurrency(item.netHarta)} · {item.results.filter(r => !r.blocked).length} ahli waris
                  </p>
                </div>
                <div className="flex gap-1">
                  <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setExpanded(expanded === item.id ? null : item.id)} aria-label={expanded === item.id ? 'Tutup detail' : 'Buka detail perhitungan'}>
                    {expanded === item.id ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => handleDelete(item.id)} aria-label="Hapus riwayat perhitungan">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {expanded === item.id && (
                <div className="mt-3 space-y-3 animate-fade-in">
                  <Separator />

                  {/* Status badges */}
                  <div className="flex gap-2 flex-wrap">
                    <Badge variant="secondary">
                      Harta Bersih: {formatCurrency(item.netHarta)}
                    </Badge>
                    {item.isAul && <Badge variant="destructive">Aul</Badge>}
                    {item.isRadd && <Badge className="bg-primary/10 text-primary border-primary/20">Radd</Badge>}
                  </div>

                  {/* Heir details */}
                  {item.results.filter(r => !r.blocked).map(r => (
                    <div key={r.type} className="rounded-md border p-3 space-y-1">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-sm font-semibold">{HEIR_LABELS[r.type] || r.label}</p>
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
                      <p className="text-[11px] text-muted-foreground italic font-serif">{r.dalil}</p>
                    </div>
                  ))}

                  {/* Blocked heirs */}
                  {item.results.filter(r => r.blocked).length > 0 && (
                    <div>
                      <p className="text-xs font-semibold text-muted-foreground mb-1.5">Terhijab</p>
                      {item.results.filter(r => r.blocked).map(r => (
                        <div key={r.type} className="rounded-md border p-2 mb-1.5 opacity-60">
                          <p className="text-sm font-medium">{HEIR_LABELS[r.type] || r.label}</p>
                          <p className="text-xs text-destructive">{r.blockReason}</p>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Remaining */}
                  {item.sisaHarta > 0 && (
                    <div className="rounded-md border border-primary/20 p-3">
                      <p className="text-sm font-semibold">Sisa: {formatCurrency(item.sisaHarta)}</p>
                      <p className="text-xs text-muted-foreground">Diserahkan ke Baitul Mal</p>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </PageShell>
  );
}
