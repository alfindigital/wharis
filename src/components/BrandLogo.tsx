interface BrandLogoProps {
  className?: string;
}

/**
 * Brand mark: balance scale (timbangan) — simbol keadilan & pembagian waris.
 * Garis tipis, geometris, mengikuti tone primary.
 */
export default function BrandLogo({ className }: BrandLogoProps) {
  const stroke = "hsl(var(--primary))";
  return (
    <svg
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className={className}
    >
      <circle cx="20" cy="20" r="18" stroke={stroke} strokeWidth="1.5" fill="none" />
      {/* Tiang tengah */}
      <path
        d="M20 10v20"
        stroke={stroke}
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      {/* Balok horizontal */}
      <path
        d="M10 14h20"
        stroke={stroke}
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      {/* Tali ke piring kiri & kanan */}
      <path
        d="M12 14l-2 5M12 14l2 5M28 14l-2 5M28 14l2 5"
        stroke={stroke}
        strokeWidth="1"
        strokeLinecap="round"
        opacity="0.7"
      />
      {/* Piring kiri */}
      <path
        d="M9 19h6a3 3 0 0 1-6 0z"
        fill={stroke}
        opacity="0.85"
      />
      {/* Piring kanan */}
      <path
        d="M25 19h6a3 3 0 0 1-6 0z"
        fill={stroke}
        opacity="0.85"
      />
      {/* Dasar */}
      <path
        d="M16 30h8"
        stroke={stroke}
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}
