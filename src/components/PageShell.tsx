import { ReactNode } from 'react';
import BrandLogo from './BrandLogo';

interface Props {
  title: string;
  children: ReactNode;
  subtitle?: string;
}

export default function PageShell({ title, subtitle, children }: Props) {
  return (
    <div className="min-h-screen pb-20">
      <header className="sticky top-0 z-40 border-b bg-card/95 backdrop-blur-lg animate-fade-in">
        <div className="max-w-lg mx-auto px-4 py-3 flex items-center gap-2.5">
          <BrandLogo className="size-9 shrink-0" />
          <div>
            <h1 className="text-lg font-bold text-foreground">{title}</h1>
            {subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}
          </div>
        </div>
      </header>
      <main className="max-w-lg mx-auto px-4 py-4 animate-fade-in" style={{ animationDelay: '0.05s', animationFillMode: 'both' }}>
        {children}
      </main>
    </div>
  );
}
