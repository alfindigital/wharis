import { useEffect, useState, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RefreshCw, Activity, CheckCircle2, XCircle, Clock, ArchiveX } from "lucide-react";
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
              <p className="font-medium text-foreground">Build ID terdeteksi</p>
              <p className="font-mono text-[10px] text-muted-foreground break-all">
                {status.buildId}
              </p>
            </div>

            <div className="rounded-md border bg-muted/30 p-2 space-y-2">
              <div className="flex items-center justify-between gap-2">
                <p className="font-medium text-foreground">Log pembersihan terakhir</p>
                <Badge variant={status.lastClearEvent ? "default" : "secondary"} className="gap-1 text-[10px]">
                  <Clock className="h-3 w-3" />
                  {status.lastClearEvent ? "Tercatat" : "Belum ada"}
                </Badge>
              </div>
              {status.lastClearEvent ? (
                <div className="space-y-1.5">
                  <InfoLine label="Waktu" value={formatDate(status.lastClearEvent.clearedAt)} />
                  <InfoLine label="Alasan" value={status.lastClearEvent.reason} />
                  <InfoLine label="Build saat clear" value={status.lastClearEvent.buildId} mono />
                  {status.lastClearEvent.previousBuildId && (
                    <InfoLine label="Build sebelumnya" value={status.lastClearEvent.previousBuildId} mono />
                  )}
                  <div>
                    <p className="text-muted-foreground text-[10px] uppercase tracking-wide">
                      Cache yang dihapus ({status.lastClearEvent.deletedCacheNames.length})
                    </p>
                    <NameList
                      names={status.lastClearEvent.deletedCacheNames}
                      empty="Tidak ada cache tersimpan saat pembersihan."
                    />
                  </div>
                  {status.lastClearEvent.failedCacheNames.length > 0 && (
                    <div>
                      <p className="text-muted-foreground text-[10px] uppercase tracking-wide">
                        Cache gagal dihapus ({status.lastClearEvent.failedCacheNames.length})
                      </p>
                      <NameList names={status.lastClearEvent.failedCacheNames} />
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-muted-foreground">Belum ada riwayat pembersihan cache di perangkat ini.</p>
              )}
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

            <div className="rounded-md border bg-muted/30 p-2 space-y-2">
              <p className="font-medium text-foreground">
                Riwayat clear cache ({status.clearHistory.length})
              </p>
              {status.clearHistory.length === 0 ? (
                <p className="text-muted-foreground">Belum ada riwayat.</p>
              ) : (
                <div className="space-y-2">
                  {status.clearHistory.slice(0, 5).map((event) => (
                    <div key={event.id} className="border-t pt-2 first:border-t-0 first:pt-0">
                      <p className="text-foreground">{formatDate(event.clearedAt)}</p>
                      <p className="text-muted-foreground">{event.reason}</p>
                      <p className="font-mono text-[10px] text-muted-foreground break-all">
                        Build: {event.buildId}
                      </p>
                      <div className="mt-1 flex items-center gap-1 text-[10px] text-muted-foreground">
                        <ArchiveX className="h-3 w-3" />
                        {event.deletedCacheNames.length} cache dihapus
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
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
