import { ReactNode } from 'react';
import BrandLogo from './BrandLogo';
import ThemeToggle from './ThemeToggle';

interface Props {
  title: string;
  children: ReactNode;
  subtitle?: string;
  headingSr?: string;
}

export default function PageShell({ title, subtitle, headingSr, children }: Props) {
  const accessibleHeading = headingSr || (subtitle ? `${title} — ${subtitle}` : title);
  return (
    <div className="min-h-screen pb-20 bg-background">
      <header className="sticky top-0 z-40 border-b border-primary/30 bg-primary text-primary-foreground backdrop-blur-xl animate-fade-in shadow-sm">
        <div className="max-w-lg mx-auto px-4 py-3 flex items-center gap-3">
          <BrandLogo className="size-8 shrink-0" />
          <div className="flex-1 min-w-0">
            <h1 className="brand-wordmark text-xl leading-none text-primary-foreground tracking-tight">
              <span aria-hidden="true">{title}</span>
              <span className="sr-only">{accessibleHeading}</span>
            </h1>
            {subtitle && (
              <p className="text-[11px] text-primary-foreground/75 mt-0.5 font-sans tracking-wide uppercase" aria-hidden="true">
                {subtitle}
              </p>
            )}
          </div>
          <ThemeToggle />
        </div>
      </header>
      <main className="max-w-lg mx-auto px-4 py-5 animate-fade-in" style={{ animationDelay: '0.05s', animationFillMode: 'both' }}>
        {children}
      </main>
    </div>
  );
}

