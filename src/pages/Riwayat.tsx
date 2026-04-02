import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Trash2, ChevronDown, ChevronUp } from 'lucide-react';
import PageShell from '@/components/PageShell';
import { getHistory, deleteCalculation } from '@/lib/storage';
import { formatCurrency, HEIR_LABELS, CalculationResult } from '@/lib/inheritance';
import { Separator } from '@/components/ui/separator';

export default function Riwayat() {
  const [history, setHistory] = useState(getHistory);
  const [expanded, setExpanded] = useState<string | null>(null);

  const handleDelete = (id: string) => {
    deleteCalculation(id);
    setHistory(getHistory());
  };

  if (history.length === 0) {
    return (
      <PageShell title="Riwayat" subtitle="Perhitungan tersimpan">
        <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
          <p className="text-sm">Belum ada riwayat perhitungan</p>
          <p className="text-xs mt-1">Mulai hitung waris untuk menyimpan riwayat</p>
        </div>
      </PageShell>
    );
  }

  return (
    <PageShell title="Riwayat" subtitle={`${history.length} perhitungan tersimpan`}>
      <div className="space-y-3">
        {history.map((item: CalculationResult) => (
          <Card key={item.id}>
            <CardContent className="p-4">
              <div className="flex justify-between items-start">
                <div className="flex-1" onClick={() => setExpanded(expanded === item.id ? null : item.id)}>
                  <p className="text-sm font-semibold">
                    {new Date(item.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Harta bersih: {formatCurrency(item.netHarta)} · {item.results.filter(r => !r.blocked).length} ahli waris
                  </p>
                </div>
                <div className="flex gap-1">
                  <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setExpanded(expanded === item.id ? null : item.id)}>
                    {expanded === item.id ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => handleDelete(item.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {expanded === item.id && (
                <div className="mt-3 space-y-2">
                  <Separator />
                  {item.results.filter(r => !r.blocked).map(r => (
                    <div key={r.type} className="flex justify-between text-xs">
                      <span>{HEIR_LABELS[r.type] || r.label} ({r.count})</span>
                      <span className="font-semibold text-primary">{formatCurrency(r.amount)}</span>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </PageShell>
  );
}
