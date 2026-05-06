export type MarketName = 
  | 'Brunei'
  | 'Hong Kong'
  | 'Malaysia'
  | 'Singapore'
  | 'Philippines'
  | 'Indonesia'
  | 'South Korea'
  | 'Taiwan'
  | 'Thailand'
  | 'Vietnam';

export type Status = 
  | 'Compliance' 
  | 'Non-Compliance' 
  | 'Acceptable' 
  | 'AcceptableCondition1' 
  | 'AcceptableCondition2';

export const MARKETS: MarketName[] = [
  'Brunei', 'Hong Kong', 'Malaysia', 'Singapore', 'Philippines', 
  'Indonesia', 'South Korea', 'Taiwan', 'Thailand', 'Vietnam'
];

export const terminologyRules: Record<MarketName, Record<number, Status>> = {
  'Brunei': { 1: 'Compliance', 2: 'Non-Compliance', 3: 'Compliance', 4: 'Compliance' },
  'Hong Kong': { 1: 'Compliance', 2: 'Non-Compliance', 3: 'Compliance', 4: 'Non-Compliance' },
  'Malaysia': { 1: 'Compliance', 2: 'Non-Compliance', 3: 'Compliance', 4: 'Compliance' },
  'Singapore': { 1: 'Compliance', 2: 'Non-Compliance', 3: 'Compliance', 4: 'Compliance' },
  'Philippines': { 1: 'Non-Compliance', 2: 'Compliance', 3: 'Non-Compliance', 4: 'Compliance' },
  'Indonesia': { 1: 'Acceptable', 2: 'Acceptable', 3: 'Acceptable', 4: 'Acceptable' },
  'South Korea': { 1: 'Acceptable', 2: 'Acceptable', 3: 'Acceptable', 4: 'Acceptable' },
  'Taiwan': { 1: 'Acceptable', 2: 'Acceptable', 3: 'Acceptable', 4: 'Acceptable' },
  'Thailand': { 1: 'Acceptable', 2: 'Acceptable', 3: 'Acceptable', 4: 'Acceptable' },
  'Vietnam': { 1: 'Acceptable', 2: 'Acceptable', 3: 'Acceptable', 4: 'Acceptable' },
};

export const formatRules: Record<MarketName, Record<number, Status>> = {
  'Brunei': { 1: 'Compliance', 2: 'Compliance', 3: 'Compliance' },
  'Hong Kong': { 1: 'Compliance', 2: 'AcceptableCondition1', 3: 'AcceptableCondition1' },
  'Malaysia': { 1: 'Compliance', 2: 'Compliance', 3: 'Compliance' },
  'Singapore': { 1: 'Compliance', 2: 'Compliance', 3: 'Compliance' },
  'Philippines': { 1: 'Non-Compliance', 2: 'Compliance', 3: 'Compliance' },
  'Indonesia': { 1: 'Compliance', 2: 'Non-Compliance', 3: 'Compliance' },
  'South Korea': { 1: 'Compliance', 2: 'AcceptableCondition1', 3: 'AcceptableCondition2' },
  'Taiwan': { 1: 'Compliance', 2: 'AcceptableCondition1', 3: 'AcceptableCondition1' },
  'Thailand': { 1: 'Compliance', 2: 'Non-Compliance', 3: 'Compliance' },
  'Vietnam': { 1: 'Compliance', 2: 'AcceptableCondition1', 3: 'Compliance' },
};

export const TERMS = {
  1: 'BEST BEFORE',
  2: 'USE BY DATE',
  3: 'USE BY',
  4: 'EXPIRY DATE',
} as const;

export const FORMATS = {
  1: 'DD/MM/YYYY',
  2: 'DDMMMYYYY',
  3: 'DD MMM YYYY',
} as const;

export interface EngineResult {
  terminologyRank: number | null;
  terminologyDecision: string;
  formatRank: number | null;
  formatDecision: string;
  isDualLine: boolean;
  conflictingMarkets?: MarketName[];
  patternContent: string[];
  conditions: {
    requiresMonthPanel: boolean;
    requiresNumericReadStmt: boolean;
    requiresHkTranslation: boolean;
  };
}

export function calculateCompliance(selected: MarketName[]): EngineResult | null {
  if (selected.length === 0) return null;

  // 1st Decision: Find highest common Terminology Rank
  let termRank: number | null = null;
  const terminologyConflictsByRank: Record<number, MarketName[]> = {};

  for (let r = 1; r <= 4; r++) {
    const invalidMarkets = selected.filter(m => terminologyRules[m][r] === 'Non-Compliance');
    terminologyConflictsByRank[r] = invalidMarkets;
    if (invalidMarkets.length === 0 && termRank === null) {
      termRank = r;
    }
  }

  // 2nd Decision: Find highest common Format Rank
  let fmtRank: number | null = null;
  for (let r = 1; r <= 3; r++) {
    const isValid = selected.every(m => formatRules[m][r] !== 'Non-Compliance');
    if (isValid) {
      fmtRank = r;
      break;
    }
  }

  // Determine conditions based on chosen format rank Documented Rules
  // ※ Condition 1 = Additional panel with translation of Alphabetical "Month" in local language
  // ** Condition 2 = Addition statement of "Read Numeric - First 6 digits or 8 digits"
  let requiresMonthPanel = false;
  let requiresNumericReadStmt = false;
  
  if (fmtRank !== null) {
    for (const m of selected) {
      if (formatRules[m][fmtRank] === 'AcceptableCondition1') requiresMonthPanel = true;
      if (formatRules[m][fmtRank] === 'AcceptableCondition2') requiresNumericReadStmt = true;
    }
  }

  const isDualLine = termRank === null;
  const requiresHkTranslation = selected.includes('Hong Kong');

  let terminologyDecision = '';
  let patternContent: string[] = [];

  const formatStr = fmtRank ? FORMATS[fmtRank as keyof typeof FORMATS] : '';

  let conflictingMarkets: MarketName[] | undefined = undefined;

  if (isDualLine) {
    terminologyDecision = 'Conflict detected. Pivoted to "Dual Line Mode".';
    conflictingMarkets = terminologyConflictsByRank[1]; // Rank 1 is the default general attempt
    
    // Extract base terminology commonly supported by non-outliers (usually 1 or 3)
    let generalTermRank = 1;
    let outlierTermRank = 2; // Usually Philippines

    const baseTermText = TERMS[generalTermRank as keyof typeof TERMS];
    const outTermText = TERMS[outlierTermRank as keyof typeof TERMS];
    
    let baseLine = `${baseTermText} (${formatStr})`;
    if (requiresHkTranslation) {
      baseLine += ` 此日期前最佳(日月年):`;
    } else {
      baseLine += `:`;
    }

    patternContent.push(baseLine);
    patternContent.push(`${outTermText} (for Philippines market): ${formatStr}`);

  } else {
    const termText = TERMS[termRank as keyof typeof TERMS];
    terminologyDecision = `Rank ${termRank} Selected (${termText})`;
    
    let baseLine = `${termText} (${formatStr})`;
    // Only apply HK translation if Term Rank matches BEST BEFORE (Rank 1).
    if (requiresHkTranslation && termRank === 1) {
      baseLine += ` 此日期前最佳(日月年):`;
    } else {
      baseLine += `:`;
    }
    patternContent.push(baseLine);
  }

  let formatDecision = '';
  if (fmtRank === 1) formatDecision = 'Rank 1 Selected (Numeric)';
  else if (fmtRank === 2) formatDecision = 'Rank 2 Selected (Alphanumeric)';
  else if (fmtRank === 3) formatDecision = 'Rank 3 Selected (Numeric + Alphanumeric)';
  else formatDecision = 'No valid format found.';

  return {
    terminologyRank: termRank,
    terminologyDecision,
    formatRank: fmtRank,
    formatDecision,
    isDualLine,
    conflictingMarkets,
    patternContent,
    conditions: {
      requiresMonthPanel,
      requiresNumericReadStmt,
      requiresHkTranslation
    }
  };
}
