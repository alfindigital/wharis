// Islamic Inheritance Calculator Engine
// Based on Al-Quran (An-Nisa: 11, 12, 176) and Hadith

export type HeirType =
  | 'suami' | 'istri'
  | 'anak_laki' | 'anak_perempuan'
  | 'ayah' | 'ibu'
  | 'kakek' | 'nenek'
  | 'saudara_laki_sekandung' | 'saudara_perempuan_sekandung'
  | 'saudara_laki_seayah' | 'saudara_perempuan_seayah'
  | 'saudara_laki_seibu' | 'saudara_perempuan_seibu'
  | 'anak_laki_dari_anak_laki' | 'anak_perempuan_dari_anak_laki';

export interface HeirInput {
  type: HeirType;
  count: number;
}

export interface HeirResult {
  type: HeirType;
  label: string;
  count: number;
  fraction: string;
  percentage: number;
  amount: number;
  amountPerPerson: number;
  dalil: string;
  blocked: boolean;
  blockReason?: string;
}

export interface CalculationInput {
  totalHarta: number;
  hutang: number;
  wasiat: number;
  heirs: HeirInput[];
}

export interface CalculationResult {
  id: string;
  date: string;
  input: CalculationInput;
  netHarta: number;
  results: HeirResult[];
  sisaHarta: number;
  isAul: boolean;
  isRadd: boolean;
}

export const HEIR_LABELS: Record<HeirType, string> = {
  suami: 'Suami',
  istri: 'Istri',
  anak_laki: 'Anak Laki-laki',
  anak_perempuan: 'Anak Perempuan',
  ayah: 'Ayah',
  ibu: 'Ibu',
  kakek: 'Kakek',
  nenek: 'Nenek',
  saudara_laki_sekandung: 'Saudara Laki Sekandung',
  saudara_perempuan_sekandung: 'Saudara Perempuan Sekandung',
  saudara_laki_seayah: 'Saudara Laki Seayah',
  saudara_perempuan_seayah: 'Saudara Perempuan Seayah',
  saudara_laki_seibu: 'Saudara Laki Seibu',
  saudara_perempuan_seibu: 'Saudara Perempuan Seibu',
  anak_laki_dari_anak_laki: 'Cucu Laki dari Anak Laki',
  anak_perempuan_dari_anak_laki: 'Cucu Perempuan dari Anak Laki',
};

export const HEIR_CATEGORIES = [
  {
    label: 'Pasangan',
    heirs: ['suami', 'istri'] as HeirType[],
  },
  {
    label: 'Anak',
    heirs: ['anak_laki', 'anak_perempuan'] as HeirType[],
  },
  {
    label: 'Orang Tua',
    heirs: ['ayah', 'ibu'] as HeirType[],
  },
  {
    label: 'Kakek/Nenek',
    heirs: ['kakek', 'nenek'] as HeirType[],
  },
  {
    label: 'Saudara Sekandung',
    heirs: ['saudara_laki_sekandung', 'saudara_perempuan_sekandung'] as HeirType[],
  },
  {
    label: 'Saudara Seayah',
    heirs: ['saudara_laki_seayah', 'saudara_perempuan_seayah'] as HeirType[],
  },
  {
    label: 'Saudara Seibu',
    heirs: ['saudara_laki_seibu', 'saudara_perempuan_seibu'] as HeirType[],
  },
  {
    label: 'Cucu dari Anak Laki',
    heirs: ['anak_laki_dari_anak_laki', 'anak_perempuan_dari_anak_laki'] as HeirType[],
  },
];

function hasHeir(heirs: HeirInput[], type: HeirType): boolean {
  return heirs.some(h => h.type === type && h.count > 0);
}

function getCount(heirs: HeirInput[], type: HeirType): number {
  return heirs.find(h => h.type === type)?.count || 0;
}

function hasFar(heirs: HeirInput[]): boolean {
  return hasHeir(heirs, 'anak_laki') || hasHeir(heirs, 'anak_perempuan')
    || hasHeir(heirs, 'anak_laki_dari_anak_laki') || hasHeir(heirs, 'anak_perempuan_dari_anak_laki');
}

function hasMaleFar(heirs: HeirInput[]): boolean {
  return hasHeir(heirs, 'anak_laki') || hasHeir(heirs, 'anak_laki_dari_anak_laki');
}

export function calculateInheritance(input: CalculationInput): CalculationResult {
  const netHarta = Math.max(0, input.totalHarta - input.hutang - input.wasiat);
  const { heirs } = input;
  
  const results: HeirResult[] = [];
  
  // Helper: track shares as fractions using a common denominator approach
  // We'll use numerator/denominator pairs
  type Share = { num: number; den: number };
  const shares: Map<HeirType, Share & { label: string; count: number; dalil: string; blocked: boolean; blockReason?: string }> = new Map();

  const addShare = (type: HeirType, num: number, den: number, dalil: string, blocked = false, blockReason?: string) => {
    const count = getCount(heirs, type);
    if (count > 0 || blocked) {
      shares.set(type, {
        num: blocked ? 0 : num,
        den: blocked ? 1 : den,
        label: HEIR_LABELS[type],
        count: blocked ? getCount(heirs, type) : count,
        dalil,
        blocked,
        blockReason,
      });
    }
  };

  // ===== SUAMI =====
  if (hasHeir(heirs, 'suami')) {
    if (hasFar(heirs)) {
      addShare('suami', 1, 4, 'QS. An-Nisa: 12 — Suami mendapat 1/4 jika ada anak/cucu');
    } else {
      addShare('suami', 1, 2, 'QS. An-Nisa: 12 — Suami mendapat 1/2 jika tidak ada anak/cucu');
    }
  }

  // ===== ISTRI =====
  if (hasHeir(heirs, 'istri')) {
    if (hasFar(heirs)) {
      addShare('istri', 1, 8, 'QS. An-Nisa: 12 — Istri mendapat 1/8 jika ada anak/cucu');
    } else {
      addShare('istri', 1, 4, 'QS. An-Nisa: 12 — Istri mendapat 1/4 jika tidak ada anak/cucu');
    }
  }

  // ===== IBU =====
  if (hasHeir(heirs, 'ibu')) {
    const hasMultipleSiblings = (getCount(heirs, 'saudara_laki_sekandung') + getCount(heirs, 'saudara_perempuan_sekandung')
      + getCount(heirs, 'saudara_laki_seayah') + getCount(heirs, 'saudara_perempuan_seayah')
      + getCount(heirs, 'saudara_laki_seibu') + getCount(heirs, 'saudara_perempuan_seibu')) >= 2;
    
    if (hasFar(heirs) || hasMultipleSiblings) {
      addShare('ibu', 1, 6, 'QS. An-Nisa: 11 — Ibu mendapat 1/6 jika ada anak/cucu atau 2+ saudara');
    } else {
      addShare('ibu', 1, 3, 'QS. An-Nisa: 11 — Ibu mendapat 1/3 jika tidak ada anak dan saudara < 2');
    }
  }

  // ===== AYAH =====
  if (hasHeir(heirs, 'ayah')) {
    if (hasMaleFar(heirs)) {
      addShare('ayah', 1, 6, 'QS. An-Nisa: 11 — Ayah mendapat 1/6 jika ada anak laki-laki/cucu laki');
    } else if (hasFar(heirs)) {
      // Has female descendants only — ayah gets 1/6 + asabah (remaining)
      addShare('ayah', 1, 6, 'QS. An-Nisa: 11 — Ayah mendapat 1/6 + sisa (asabah) jika ada anak perempuan saja');
    } else {
      // No descendants — ayah is asabah (gets remaining)
      addShare('ayah', 0, 1, 'QS. An-Nisa: 11 — Ayah sebagai asabah mendapat sisa harta');
    }
  }

  // ===== KAKEK (replaces ayah if ayah not present) =====
  if (hasHeir(heirs, 'kakek')) {
    if (hasHeir(heirs, 'ayah')) {
      addShare('kakek', 0, 1, 'Terhijab oleh Ayah', true, 'Kakek terhijab oleh Ayah');
    } else if (hasMaleFar(heirs)) {
      addShare('kakek', 1, 6, 'Kakek mendapat 1/6 jika ada anak laki-laki (menggantikan posisi Ayah)');
    } else {
      addShare('kakek', 0, 1, 'Kakek sebagai asabah mendapat sisa harta (menggantikan Ayah)');
    }
  }

  // ===== NENEK =====
  if (hasHeir(heirs, 'nenek')) {
    if (hasHeir(heirs, 'ibu')) {
      addShare('nenek', 0, 1, 'Terhijab oleh Ibu', true, 'Nenek terhijab oleh Ibu');
    } else {
      addShare('nenek', 1, 6, 'Hadits — Nenek mendapat 1/6');
    }
  }

  // ===== SAUDARA SEIBU =====
  if (hasHeir(heirs, 'saudara_laki_seibu') || hasHeir(heirs, 'saudara_perempuan_seibu')) {
    if (hasFar(heirs) || hasHeir(heirs, 'ayah') || hasHeir(heirs, 'kakek')) {
      if (hasHeir(heirs, 'saudara_laki_seibu'))
        addShare('saudara_laki_seibu', 0, 1, 'Terhijab', true, 'Terhijab oleh anak/ayah/kakek');
      if (hasHeir(heirs, 'saudara_perempuan_seibu'))
        addShare('saudara_perempuan_seibu', 0, 1, 'Terhijab', true, 'Terhijab oleh anak/ayah/kakek');
    } else {
      const totalSeibu = getCount(heirs, 'saudara_laki_seibu') + getCount(heirs, 'saudara_perempuan_seibu');
      if (totalSeibu === 1) {
        if (hasHeir(heirs, 'saudara_laki_seibu'))
          addShare('saudara_laki_seibu', 1, 6, 'QS. An-Nisa: 12 — Saudara seibu tunggal mendapat 1/6');
        else
          addShare('saudara_perempuan_seibu', 1, 6, 'QS. An-Nisa: 12 — Saudara seibu tunggal mendapat 1/6');
      } else {
        // Share 1/3 equally
        if (hasHeir(heirs, 'saudara_laki_seibu'))
          addShare('saudara_laki_seibu', 1, 3, 'QS. An-Nisa: 12 — Saudara seibu 2+ berbagi 1/3 rata');
        if (hasHeir(heirs, 'saudara_perempuan_seibu'))
          addShare('saudara_perempuan_seibu', 1, 3, 'QS. An-Nisa: 12 — Saudara seibu 2+ berbagi 1/3 rata');
      }
    }
  }

  // ===== SAUDARA SEKANDUNG =====
  if (hasHeir(heirs, 'saudara_laki_sekandung') || hasHeir(heirs, 'saudara_perempuan_sekandung')) {
    if (hasFar(heirs) || hasHeir(heirs, 'ayah')) {
      if (hasHeir(heirs, 'saudara_laki_sekandung'))
        addShare('saudara_laki_sekandung', 0, 1, 'Terhijab', true, 'Terhijab oleh anak laki/ayah');
      if (hasHeir(heirs, 'saudara_perempuan_sekandung'))
        addShare('saudara_perempuan_sekandung', 0, 1, 'Terhijab', true, 'Terhijab oleh anak laki/ayah');
    } else if (hasHeir(heirs, 'saudara_laki_sekandung')) {
      // Asabah
      addShare('saudara_laki_sekandung', 0, 1, 'Saudara laki sekandung sebagai asabah mendapat sisa');
      if (hasHeir(heirs, 'saudara_perempuan_sekandung')) {
        addShare('saudara_perempuan_sekandung', 0, 1, 'Saudara perempuan sekandung menjadi asabah bersama saudara laki (2:1)');
      }
    } else {
      // Only sisters
      const count = getCount(heirs, 'saudara_perempuan_sekandung');
      if (count === 1) {
        addShare('saudara_perempuan_sekandung', 1, 2, 'QS. An-Nisa: 176 — Saudara perempuan sekandung tunggal mendapat 1/2');
      } else {
        addShare('saudara_perempuan_sekandung', 2, 3, 'QS. An-Nisa: 176 — Saudara perempuan sekandung 2+ mendapat 2/3');
      }
    }
  }

  // ===== SAUDARA SEAYAH =====
  if (hasHeir(heirs, 'saudara_laki_seayah') || hasHeir(heirs, 'saudara_perempuan_seayah')) {
    if (hasFar(heirs) || hasHeir(heirs, 'ayah') || hasHeir(heirs, 'saudara_laki_sekandung')) {
      if (hasHeir(heirs, 'saudara_laki_seayah'))
        addShare('saudara_laki_seayah', 0, 1, 'Terhijab', true, 'Terhijab oleh anak/ayah/saudara laki sekandung');
      if (hasHeir(heirs, 'saudara_perempuan_seayah'))
        addShare('saudara_perempuan_seayah', 0, 1, 'Terhijab', true, 'Terhijab oleh anak/ayah/saudara laki sekandung');
    } else if (hasHeir(heirs, 'saudara_laki_seayah')) {
      addShare('saudara_laki_seayah', 0, 1, 'Saudara laki seayah sebagai asabah mendapat sisa');
      if (hasHeir(heirs, 'saudara_perempuan_seayah')) {
        addShare('saudara_perempuan_seayah', 0, 1, 'Saudara perempuan seayah menjadi asabah bersama saudara laki seayah (2:1)');
      }
    } else {
      const count = getCount(heirs, 'saudara_perempuan_seayah');
      if (count === 1) {
        addShare('saudara_perempuan_seayah', 1, 2, 'Saudara perempuan seayah tunggal mendapat 1/2');
      } else {
        addShare('saudara_perempuan_seayah', 2, 3, 'Saudara perempuan seayah 2+ mendapat 2/3');
      }
    }
  }

  // ===== ANAK =====
  // Children are either ashabul furudh (daughters only) or asabah (sons present)
  if (hasHeir(heirs, 'anak_laki')) {
    // Anak laki as asabah — will get remaining
    addShare('anak_laki', 0, 1, 'QS. An-Nisa: 11 — Anak laki-laki sebagai asabah mendapat sisa harta');
    if (hasHeir(heirs, 'anak_perempuan')) {
      addShare('anak_perempuan', 0, 1, 'QS. An-Nisa: 11 — Anak perempuan menjadi asabah bersama anak laki (bagian laki 2x perempuan)');
    }
  } else if (hasHeir(heirs, 'anak_perempuan')) {
    const count = getCount(heirs, 'anak_perempuan');
    if (count === 1) {
      addShare('anak_perempuan', 1, 2, 'QS. An-Nisa: 11 — Anak perempuan tunggal mendapat 1/2');
    } else {
      addShare('anak_perempuan', 2, 3, 'QS. An-Nisa: 11 — Anak perempuan 2+ mendapat 2/3');
    }
  }

  // ===== CUCU dari ANAK LAKI =====
  if (hasHeir(heirs, 'anak_laki_dari_anak_laki') || hasHeir(heirs, 'anak_perempuan_dari_anak_laki')) {
    if (hasHeir(heirs, 'anak_laki')) {
      if (hasHeir(heirs, 'anak_laki_dari_anak_laki'))
        addShare('anak_laki_dari_anak_laki', 0, 1, 'Terhijab', true, 'Terhijab oleh anak laki-laki');
      if (hasHeir(heirs, 'anak_perempuan_dari_anak_laki'))
        addShare('anak_perempuan_dari_anak_laki', 0, 1, 'Terhijab', true, 'Terhijab oleh anak laki-laki');
    } else if (hasHeir(heirs, 'anak_laki_dari_anak_laki')) {
      addShare('anak_laki_dari_anak_laki', 0, 1, 'Cucu laki dari anak laki sebagai asabah');
      if (hasHeir(heirs, 'anak_perempuan_dari_anak_laki'))
        addShare('anak_perempuan_dari_anak_laki', 0, 1, 'Cucu perempuan menjadi asabah bersama cucu laki (2:1)');
    } else {
      const countDaughters = getCount(heirs, 'anak_perempuan');
      if (countDaughters >= 2) {
        addShare('anak_perempuan_dari_anak_laki', 0, 1, 'Terhijab', true, 'Terhijab oleh 2+ anak perempuan (kecuali ada cucu laki)');
      } else if (countDaughters === 1) {
        addShare('anak_perempuan_dari_anak_laki', 1, 6, 'Cucu perempuan dari anak laki mendapat 1/6 sebagai pelengkap 2/3');
      } else {
        const count = getCount(heirs, 'anak_perempuan_dari_anak_laki');
        if (count === 1) {
          addShare('anak_perempuan_dari_anak_laki', 1, 2, 'Cucu perempuan dari anak laki tunggal mendapat 1/2');
        } else {
          addShare('anak_perempuan_dari_anak_laki', 2, 3, 'Cucu perempuan dari anak laki 2+ mendapat 2/3');
        }
      }
    }
  }

  // ===== Calculate amounts =====
  // First sum all fixed shares (furudh)
  let totalFurudhFraction = 0;
  const asabahHeirs: HeirType[] = [];
  
  shares.forEach((share, type) => {
    if (share.blocked) return;
    if (share.num === 0 && share.den === 1) {
      asabahHeirs.push(type);
    } else {
      totalFurudhFraction += share.num / share.den;
    }
  });

  // Handle seibu sharing
  const seibuTypes: HeirType[] = ['saudara_laki_seibu', 'saudara_perempuan_seibu'];
  const seibuShares = seibuTypes.filter(t => shares.has(t) && !shares.get(t)!.blocked && shares.get(t)!.num > 0);
  if (seibuShares.length === 2) {
    // They share 1/3 — only count once
    totalFurudhFraction -= 1/3; // Remove double count
  }

  let remaining = netHarta;
  let isAul = totalFurudhFraction > 1;
  let isRadd = false;
  
  // Calculate furudh amounts
  const furudhResults: HeirResult[] = [];
  
  shares.forEach((share, type) => {
    if (share.blocked) {
      furudhResults.push({
        type,
        label: share.label,
        count: share.count,
        fraction: '-',
        percentage: 0,
        amount: 0,
        amountPerPerson: 0,
        dalil: share.dalil,
        blocked: true,
        blockReason: share.blockReason,
      });
      return;
    }
    
    if (share.num === 0 && share.den === 1) return; // asabah handled later
    
    let amount: number;
    const fraction = `${share.num}/${share.den}`;
    
    if (isAul) {
      // Aul: scale down proportionally
      amount = (share.num / share.den / totalFurudhFraction) * netHarta;
    } else {
      amount = (share.num / share.den) * netHarta;
    }

    // Handle seibu sharing
    if (seibuShares.length === 2 && seibuTypes.includes(type)) {
      const totalSeibu = getCount(heirs, 'saudara_laki_seibu') + getCount(heirs, 'saudara_perempuan_seibu');
      const oneThird = isAul ? (1/3 / totalFurudhFraction) * netHarta : (1/3) * netHarta;
      amount = (share.count / totalSeibu) * oneThird;
    }
    
    remaining -= amount;
    
    furudhResults.push({
      type,
      label: share.label,
      count: share.count,
      fraction,
      percentage: (amount / netHarta) * 100,
      amount: Math.round(amount),
      amountPerPerson: Math.round(amount / share.count),
      dalil: share.dalil,
      blocked: false,
    });
  });

  // Calculate asabah amounts
  if (!isAul && asabahHeirs.length > 0) {
    const asabahRemaining = Math.max(0, remaining);
    
    // Calculate weighted parts for asabah (males get 2x females)
    let totalParts = 0;
    asabahHeirs.forEach(type => {
      const count = getCount(heirs, type);
      const isMale = type.includes('laki') || type === 'ayah' || type === 'kakek';
      totalParts += isMale ? count * 2 : count;
    });
    
    asabahHeirs.forEach(type => {
      const share = shares.get(type)!;
      const count = share.count;
      const isMale = type.includes('laki') || type === 'ayah' || type === 'kakek';
      const parts = isMale ? count * 2 : count;
      const amount = totalParts > 0 ? (parts / totalParts) * asabahRemaining : 0;

      // For ayah with 1/6 + asabah
      let finalAmount = amount;
      let fraction = 'Sisa';
      if (type === 'ayah' && hasFar(heirs) && !hasMaleFar(heirs)) {
        const sixthAmount = (1/6) * netHarta;
        finalAmount = sixthAmount + amount;
        fraction = '1/6 + Sisa';
        // Find and adjust the furudh entry if exists
        const ayahFurudh = furudhResults.find(r => r.type === 'ayah');
        if (ayahFurudh) {
          ayahFurudh.amount = Math.round(finalAmount);
          ayahFurudh.amountPerPerson = Math.round(finalAmount);
          ayahFurudh.percentage = (finalAmount / netHarta) * 100;
          ayahFurudh.fraction = fraction;
          return;
        }
      }
      
      furudhResults.push({
        type,
        label: share.label,
        count,
        fraction,
        percentage: (finalAmount / netHarta) * 100,
        amount: Math.round(finalAmount),
        amountPerPerson: Math.round(finalAmount / count),
        dalil: share.dalil,
        blocked: false,
      });
    });
    remaining = 0;
  } else if (!isAul) {
    remaining = Math.max(0, remaining);
  }

  // Radd — if remaining and no asabah, distribute to furudh holders (except spouse)
  if (!isAul && remaining > 0 && asabahHeirs.length === 0) {
    const raddEligible = furudhResults.filter(r => !r.blocked && r.type !== 'suami' && r.type !== 'istri');
    if (raddEligible.length > 0) {
      isRadd = true;
      const totalRaddFraction = raddEligible.reduce((sum, r) => {
        const s = shares.get(r.type);
        return sum + (s ? s.num / s.den : 0);
      }, 0);
      
      raddEligible.forEach(r => {
        const s = shares.get(r.type)!;
        const raddAmount = ((s.num / s.den) / totalRaddFraction) * remaining;
        r.amount += Math.round(raddAmount);
        r.amountPerPerson = Math.round(r.amount / r.count);
        r.percentage = (r.amount / netHarta) * 100;
      });
      remaining = 0;
    }
  }

  return {
    id: crypto.randomUUID(),
    date: new Date().toISOString(),
    input,
    netHarta,
    results: furudhResults,
    sisaHarta: Math.round(Math.max(0, remaining)),
    isAul,
    isRadd,
  };
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}
