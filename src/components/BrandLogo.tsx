interface BrandLogoProps {
  className?: string;
}

export default function BrandLogo({ className }: BrandLogoProps) {
  return (
    <svg
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className={className}
    >
      <circle cx="20" cy="20" r="18" stroke="hsl(var(--primary))" strokeWidth="1.5" fill="none" />
      {/* Crescent */}
      <path
        d="M26 13a9 9 0 1 0 0 14 7 7 0 1 1 0-14z"
        fill="hsl(var(--primary))"
      />
      {/* Scale beam */}
      <path
        d="M12 28h16"
        stroke="hsl(var(--primary))"
        strokeWidth="1.5"
        strokeLinecap="round"
        opacity="0.5"
      />
    </svg>
  );
}
