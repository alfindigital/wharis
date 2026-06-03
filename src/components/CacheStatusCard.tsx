import { useEffect, useState, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RefreshCw, Activity, CheckCircle2, XCircle } from "lucide-react";
import {
  getCacheStatus,
  forceClearCacheAndReload,
  type CacheStatus,
} from "@/lib/cache-utils";
import { useToast } from "@/hooks/use-toast";

export default function CacheStatusCard() {
  const [status, setStatus] = useState<CacheStatus | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      setStatus(await getCacheStatus());
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const handleForceClear = async () => {
    toast({
      title: "Membersihkan cache…",
      description: "Halaman akan dimuat ulang dengan versi terbaru.",
    });
    await forceClearCacheAndReload();
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <Activity className="h-4 w-4 text-primary" /> Status Cache & Service Worker
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 text-xs">
        {!status ? (
          <p className="text-muted-foreground">Memuat status…</p>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-2">
              <StatusRow
                label="Service Worker"
                ok={status.controlled}
                okText="Aktif"
                badText="Tidak aktif"
              />
              <StatusRow
                label="Cache API"
                ok={status.supported}
                okText="Didukung"
                badText="Tidak didukung"
              />
            </div>

            <div className="rounded-md border bg-muted/30 p-2 space-y-1">
              <p className="font-medium text-foreground">Build</p>
              <p className="font-mono text-[10px] text-muted-foreground break-all">
                {status.buildId}
              </p>
            </div>

            <div className="rounded-md border bg-muted/30 p-2 space-y-1">
              <p className="font-medium text-foreground">
                Registrasi SW ({status.registrations.length})
              </p>
              {status.registrations.length === 0 ? (
                <p className="text-muted-foreground">Tidak ada service worker terdaftar.</p>
              ) : (
                status.registrations.map((r, i) => (
                  <div
                    key={i}
                    className="font-mono text-[10px] text-muted-foreground break-all"
                  >
                    [{r.state}] {r.scriptURL}
                  </div>
                ))
              )}
            </div>

            <div className="rounded-md border bg-muted/30 p-2 space-y-1">
              <p className="font-medium text-foreground">
                Nama Cache ({status.cacheNames.length})
              </p>
              {status.cacheNames.length === 0 ? (
                <p className="text-muted-foreground">Tidak ada cache tersimpan.</p>
              ) : (
                <ul className="space-y-0.5">
                  {status.cacheNames.map((n) => (
                    <li
                      key={n}
                      className="font-mono text-[10px] text-muted-foreground break-all"
                    >
                      {n}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {status.lastClearedAt && (
              <p className="text-[10px] text-muted-foreground">
                Terakhir dibersihkan:{" "}
                {new Date(status.lastClearedAt).toLocaleString("id-ID")}
              </p>
            )}
          </>
        )}

        <div className="flex flex-col gap-2 pt-1">
          <Button
            variant="default"
            size="sm"
            onClick={handleForceClear}
            className="w-full"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Paksa Refresh & Bersihkan Cache
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={refresh}
            disabled={loading}
            className="w-full"
          >
            <Activity className="h-4 w-4 mr-2" />
            Muat Ulang Status
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function StatusRow({
  label,
  ok,
  okText,
  badText,
}: {
  label: string;
  ok: boolean;
  okText: string;
  badText: string;
}) {
  return (
    <div className="rounded-md border bg-muted/30 p-2">
      <p className="text-muted-foreground text-[10px] uppercase tracking-wide">
        {label}
      </p>
      <Badge
        variant={ok ? "default" : "secondary"}
        className="mt-1 gap-1 text-[10px]"
      >
        {ok ? (
          <CheckCircle2 className="h-3 w-3" />
        ) : (
          <XCircle className="h-3 w-3" />
        )}
        {ok ? okText : badText}
      </Badge>
    </div>
  );
}
