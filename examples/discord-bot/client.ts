export interface Plan {
  id: string;
  label: string;
  productId: string;
}

export interface UserProfile {
  // Free Tier
  tier?: string;
  ip?: string;
  daily_limit?: number;
  used_today?: number;
  remaining_today?: number;
  note?: string;

  // Private Tier
  name?: string;
  remaining_quota?: number | string;
  total_created?: number;
  expires_at?: string;
  created_at?: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  error?: string;
  detail?: string;
  data?: T;
}

export class AlightMotionAPI {
  readonly baseUrl: string;
  readonly apiKey: string;
  private timeout: number;

  constructor(baseUrl: string, apiKey: string = '', timeoutMs = 30000) {
    this.baseUrl = baseUrl.replace(/\/+$/, '');
    this.apiKey = apiKey.trim();
    this.timeout = timeoutMs;
  }

  private async request<T>(path: string, init: RequestInit = {}): Promise<ApiResponse<T>> {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), this.timeout);

    try {
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        ...(init.headers as Record<string, string>),
      };
      if (this.apiKey) {
        headers['x-api-key'] = this.apiKey;
      }

      const res = await fetch(`${this.baseUrl}${path}`, {
        ...init,
        headers,
        signal: controller.signal,
      });
      return (await res.json()) as ApiResponse<T>;
    } catch (err: any) {
      return {
        success: false,
        error: err.name === 'AbortError' ? 'Request timeout' : err.message || 'Network error',
      };
    } finally {
      clearTimeout(timer);
    }
  }

  getPlans() {
    return this.request<Plan[]>('/api/plans');
  }

  getQuota() {
    return this.request<UserProfile>('/api/me');
  }

  sendVerificationLink(email: string) {
    return this.request<{ message: string }>('/api/auth/send-link', {
      method: 'POST',
      body: JSON.stringify({ email: email.trim() }),
    });
  }

  upgradeToPro(email: string, linkOrOob: string, plan = '2_bulan') {
    const isUrl = linkOrOob.startsWith('http://') || linkOrOob.startsWith('https://');
    return this.request<{
      email: string;
      plan: string;
      expires_estimated: string;
      remaining_quota: number | string;
    }>('/api/subscription/upgrade', {
      method: 'POST',
      body: JSON.stringify({
        email: email.trim(),
        plan,
        ...(isUrl ? { link: linkOrOob.trim() } : { oobCode: linkOrOob.trim() }),
      }),
    });
  }
}
