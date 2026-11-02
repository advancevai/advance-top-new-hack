export type OutcomeType = 'WIN' | 'LOSS' | 'JACKPOT';
export type BetSize = 'BIG' | 'SMALL';
export type ColorType = 'GREEN' | 'RED' | 'VIOLET';

export interface WinGoResult {
  issueNumber: string;
  number: number;
  color: string;
  size: BetSize;
}

export interface HistoryRecord {
  id: string;
  issueNumber: string;
  number: number;
  color: string;
  size: BetSize;
  time?: string;
  predictedSize: BetSize;
  predictedDigit?: number;
  conf?: number;
  result: OutcomeType;
}

export interface UserSession {
  isAuthenticated: boolean;
  activeKey: string;
  expiresAt: number;
  durationDays: number;
  activatedAt: number;
  boundDeviceId?: string;
  isAdmin?: boolean;
}

export interface KeyRecord {
  key: string;
  label: string;
  durationDays: number;
  createdAt: number;
  expiresAt: number;
  activatedAt: number | null;
  boundDeviceId: string | null;
  usedCount: number;
  isRevoked: boolean;
}

export interface ModelVote {
  layerId: string;
  layerName: string;
  vote: BetSize;
  weight: number;
  confidence: number;
  evidence: string;
}

export interface TitaniumCombo {
  baseColor: ColorType;
  comboLabel: string;
  hexGradient: string;
  glowColor: string;
  titaniumTone: string;
}

export interface TitaniumComboineSignal {
  active: boolean;
  signalName: string;
  combinationType: string;
  transitionPattern: string;
  predictedColor: ColorType;
  targetNumberCluster: number[];
  primaryJackpotTarget: number;
  clusterConfidence: number;
  correlationRationale: string;
  hexGradient: string;
  glowColor: string;
  titaniumTone: string;
}

export interface PredictionPayload {
  targetIssue: string;
  prediction: BetSize;
  confidence: number;
  digit: number;
  colorType: ColorType;
  signalStrength: number;
  accuracyLevel: number;
  supportingPatterns: string[];
  sureshotMatched: boolean;
  sureshotCode: string | null;
  activeArchetype: string;
  metrics: {
    trend: number;
    pattern: number;
    frequency: number;
    digit: number;
    ensemble: number;
  };
  modelVotes: ModelVote[];
  confluenceScore: number;
  alignedModelsCount: number;
  totalModelsCount: number;
  zigZagAnalysis: any;
  matched500Pattern: any;
  layersScannedCount: number;
  titaniumCombo: TitaniumCombo;
  titaniumComboineSignal: TitaniumComboineSignal;
  top3JackpotNumbers: number[];
  favorNumber: number;
  oppositeNumber: number;
  confirmedPatternName: string;
  recommendedUnit: string;
  v12ZeroLossActive: boolean;
  dragonStreakStatus: string;
  hackActive: boolean;
  hackStatus: string;
  exploitSync: string;
  hackLatencyMs: number;
  quantumResonance: number;
  server1: any;
  server2: any;
  consensus: any;
  details: {
    sureshotSequence: string;
    markovProbability: number;
    majority50: string;
    hotDigits: number[];
    coldDigits: number[];
    historicalMatches1k: number;
  };
}

export interface ToastMessage {
  id: string;
  text: string;
  type: 'info' | 'success' | 'warn' | 'error';
}

export interface AppSettings {
  theme: string;
  glow: boolean;
  scanlines: boolean;
  sound: boolean;
  haptics: boolean;
  autoScan: boolean;
  hdQuality8K: boolean;
}
