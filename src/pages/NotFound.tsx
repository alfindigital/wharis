import { Link, useLocation } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Home } from "lucide-react";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const location = useLocation();

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <Helmet>
        <title>Halaman tidak ditemukan — WHARIS</title>
        <meta name="robots" content="noindex,nofollow" />
      </Helmet>
      <div className="text-center max-w-sm">
        <p className="text-6xl font-bold text-primary mb-2">404</p>
        <h1 className="text-xl font-semibold mb-2">Halaman tidak ditemukan</h1>
        <p className="text-sm text-muted-foreground mb-6">
          Alamat <code className="font-mono text-xs">{location.pathname}</code> tidak tersedia.
        </p>
        <Button asChild>
          <Link to="/">
            <Home className="h-4 w-4 mr-2" /> Kembali ke Beranda
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
