import { UserSession } from './types';

export const PG_URL = 'https://advance-admin.lovable.app';
export const PG_KEY = 'pgk_live_qMS4Y8HdnyYvayl0CNPgu63dabpdipWH';

const SESSION_STORAGE_KEY = 'wingo_user_active_session_v3';
const PG_TOKEN_KEY = 'pg_token';

/**
 * Call PassGate API endpoint
 */
export async function callPassGate(path: string, body: any): Promise<any> {
  const res = await fetch(PG_URL + path, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'x-api-key': PG_KEY,
    },
    body: JSON.stringify(body),
  });
  return res.json();
}

/**
 * Authenticate password/key using PassGate API
 */
export async function authenticateKey(password: string): Promise<{
  valid: boolean;
  message?: string;
  token?: string;
  record?: {
    key: string;
    expiresAt: number;
    durationDays: number;
    activatedAt: number;
  };
}> {
  const clean = password.trim();
  if (!clean) {
    return { valid: false, message: 'Please enter your VIP Password / Key.' };
  }

  try {
    const res = await callPassGate('/api/public/v1/verify', { password: clean });

    if (res && res.valid) {
      if (res.token) {
        try {
          localStorage.setItem(PG_TOKEN_KEY, res.token);
        } catch {}
      }

      const now = Date.now();
      const expiresAt = now + 30 * 86400000;

      return {
        valid: true,
        message: 'Access Granted! Welcome to ADVANCE VIP.',
        token: res.token,
        record: {
          key: clean,
          expiresAt,
          durationDays: 30,
          activatedAt: now,
        },
      };
    }

    if (res?.reason === 'rate_limited') {
      return { valid: false, message: 'Too many attempts. Try later.' };
    }
    if (res?.reason === 'ip_blocked') {
      return { valid: false, message: 'Access from your network is blocked.' };
    }
    if (res?.reason === 'origin_not_allowed') {
      return { valid: false, message: 'This site is not allowed for this key.' };
    }
    if (res?.reason === 'invalid_api_key') {
      return { valid: false, message: 'API key is wrong or revoked.' };
    }

    return { valid: false, message: 'Wrong password' };
  } catch {
    return { valid: false, message: 'Cannot reach the PassGate server. Is the app published?' };
  }
}

/**
 * Session Helpers
 */
export function getActiveSession(): UserSession | null {
  try {
    const pgToken = typeof window !== 'undefined' ? localStorage.getItem(PG_TOKEN_KEY) : null;
    // Strictly require a live PassGate token - NO demo passwords allowed!
    if (!pgToken) {
      clearActiveSession();
      return null;
    }

    const raw = localStorage.getItem(SESSION_STORAGE_KEY);
    if (raw) {
      const session: UserSession = JSON.parse(raw);
      if (isSessionLocallyValid(session)) return session;
    }

    return {
      isAuthenticated: true,
      activeKey: 'PASSGATE_ACTIVE',
      expiresAt: Date.now() + 30 * 86400000,
      durationDays: 30,
      activatedAt: Date.now(),
      isAdmin: false,
    };
  } catch {
    clearActiveSession();
    return null;
  }
}

export function saveActiveSession(session: UserSession): void {
  try {
    localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));
  } catch {}
}

export function clearActiveSession(): void {
  try {
    localStorage.removeItem(SESSION_STORAGE_KEY);
    localStorage.removeItem(PG_TOKEN_KEY);
  } catch {}
}

export function isSessionLocallyValid(session?: UserSession | null): boolean {
  if (!session || !session.isAuthenticated) return false;
  return Date.now() < session.expiresAt;
}

export async function verifyActiveSession(session: UserSession): Promise<{ isValid: boolean; reason?: string }> {
  if (!isSessionLocallyValid(session)) {
    clearActiveSession();
    return { isValid: false, reason: 'Session expired. Please enter your password again.' };
  }

  const token = typeof window !== 'undefined' ? localStorage.getItem(PG_TOKEN_KEY) : null;
  if (token) {
    try {
      const res = await callPassGate('/api/public/v1/session', { token });
      if (res && res.valid) {
        return { isValid: true };
      }
      clearActiveSession();
      return { isValid: false, reason: 'PassGate session expired or revoked.' };
    } catch {
      // If transient network glitch, keep session if valid locally
      return { isValid: true };
    }
  }

  return { isValid: true };
}

export function formatTimeRemaining(ms: number): string {
  const diff = ms - Date.now();
  if (diff <= 0) return 'Expired';
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const days = Math.floor(hours / 24);
  const remHours = hours % 24;
  const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

  if (days > 0) return `${days}d ${remHours}h left`;
  if (remHours > 0) return `${remHours}h ${mins}m left`;
  return `${mins}m left`;
}
