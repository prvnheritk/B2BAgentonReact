import axios from 'axios';
import { getConfig } from './config';

interface CachedToken {
  accessToken: string;
  instanceUrl: string;
  expiresAt: number;
}

// Module-scope cache survives across warm invocations of the same instance.
let cache: CachedToken | null = null;
let inflight: Promise<CachedToken> | null = null;

const SAFETY_MARGIN_MS = 60_000;

async function fetchNewToken(): Promise<CachedToken> {
  const cfg = getConfig();
  const url = `${cfg.SF_ORG_URL}/services/oauth2/token`;
  const body = new URLSearchParams({
    grant_type: 'client_credentials',
    client_id: cfg.SF_CLIENT_ID,
    client_secret: cfg.SF_CLIENT_SECRET,
  });

  const { data } = await axios.post(url, body, {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    timeout: 15_000,
  });

  const ttlMs = data.expires_in ? Number(data.expires_in) * 1000 : 30 * 60 * 1000;

  return {
    accessToken: data.access_token,
    instanceUrl: data.instance_url ?? cfg.SF_ORG_URL,
    expiresAt: Date.now() + ttlMs - SAFETY_MARGIN_MS,
  };
}

export async function getAccessToken(force = false): Promise<CachedToken> {
  const now = Date.now();
  if (!force && cache && cache.expiresAt > now) return cache;
  if (inflight) return inflight;

  inflight = fetchNewToken()
    .then((tok) => {
      cache = tok;
      return tok;
    })
    .catch((err) => {
      cache = null;
      throw err;
    })
    .finally(() => {
      inflight = null;
    });

  return inflight;
}

export function invalidateToken() {
  cache = null;
}
