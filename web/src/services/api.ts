const API_BASE = '/api/v1';

class ApiService {
  private getToken(): string | null {
    return localStorage.getItem('anonymepro_token');
  }

  setToken(token: string) {
    localStorage.setItem('anonymepro_token', token);
  }

  clearToken() {
    localStorage.removeItem('anonymepro_token');
  }

  async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const token = this.getToken();
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>),
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const res = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      headers,
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({ message: res.statusText }));
      throw new Error(err.message || 'Une erreur est survenue');
    }

    return res.json();
  }

  // Auth
  register(data: any) {
    return this.request<{ user: any; accessToken: string }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  login(data: any) {
    return this.request<{ user: any; accessToken: string }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  getMe() {
    return this.request<any>('/auth/me');
  }

  // Profile
  getMyProfile() {
    return this.request<any>('/profile/me');
  }

  updateProfile(data: any) {
    return this.request<any>('/profile/me', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  addPhoto(url: string, isMain = false) {
    return this.request<any>('/profile/photos', {
      method: 'POST',
      body: JSON.stringify({ url, isMain }),
    });
  }

  deletePhoto(photoId: string) {
    return this.request<any>(`/profile/photos/${photoId}`, {
      method: 'DELETE',
    });
  }

  // Discovery & Interactions
  getDiscovery(params?: Record<string, any>) {
    const query = new URLSearchParams(params).toString();
    return this.request<any[]>(`/interaction/discover${query ? `?${query}` : ''}`);
  }

  likeUser(targetUserId: string) {
    return this.request<any>('/interaction/like', {
      method: 'POST',
      body: JSON.stringify({ targetUserId }),
    });
  }

  passUser(targetUserId: string) {
    return this.request<any>('/interaction/pass', {
      method: 'POST',
      body: JSON.stringify({ targetUserId }),
    });
  }

  rewindUser(targetUserId: string) {
    return this.request<any>('/interaction/rewind', {
      method: 'POST',
      body: JSON.stringify({ targetUserId }),
    });
  }

  getMatches() {
    return this.request<any[]>('/interaction/matches');
  }

  // Chat
  getMessages(conversationId: string, page = 1) {
    return this.request<{ messages: any[]; total: number }>(
      `/chat/conversation/${conversationId}/messages?page=${page}`,
    );
  }

  sendMessage(conversationId: string, content?: string, attachments?: any[]) {
    return this.request<any>('/chat/message', {
      method: 'POST',
      body: JSON.stringify({ conversationId, content, attachments }),
    });
  }

  markAsRead(conversationId: string) {
    return this.request<any>(`/chat/conversation/${conversationId}/read`, {
      method: 'POST',
    });
  }

  // Verification
  getVerificationInstructions() {
    return this.request<any>('/verification/instructions');
  }

  submitVerification(data: any) {
    return this.request<any>('/verification/submit', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  getVerificationStatus() {
    return this.request<any>('/verification/status');
  }

  // Payments (NabooPay)
  createNabooCheckout(phoneNumber?: string) {
    return this.request<any>('/payment/checkout/naboopay', {
      method: 'POST',
      body: JSON.stringify({ phoneNumber, paymentMethods: ['wave', 'orange_money'] }),
    });
  }

  // Admin & Moderation
  getAdminAnalytics() {
    return this.request<any>('/admin/analytics');
  }

  getPendingVerifications(page = 1) {
    return this.request<any>(`/verification/admin/pending?page=${page}`);
  }

  reviewVerification(id: string, status: string, rejectionReason?: string) {
    return this.request<any>(`/verification/admin/${id}/review`, {
      method: 'POST',
      body: JSON.stringify({ status, rejectionReason }),
    });
  }

  getAdminReports(status?: string, page = 1) {
    return this.request<any>(`/admin/reports?page=${page}${status ? `&status=${status}` : ''}`);
  }

  actionReport(id: string, status: string, banUser = false, actionNotes?: string) {
    return this.request<any>(`/admin/reports/${id}/action`, {
      method: 'POST',
      body: JSON.stringify({ status, banUser, actionNotes }),
    });
  }

  getAdminAuditLogs(page = 1) {
    return this.request<any>(`/admin/audit-logs?page=${page}`);
  }

  // Storage / Uploads
  async uploadFile(file: File | Blob, folder: 'profiles' | 'verification' | 'chat' = 'profiles') {
    const token = this.getToken();
    const formData = new FormData();
    formData.append('file', file);
    const headers: Record<string, string> = {};
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    const res = await fetch(`${API_BASE}/storage/upload?folder=${folder}`, {
      method: 'POST',
      headers,
      body: formData,
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ message: res.statusText }));
      throw new Error(err.message || 'Échec du téléversement');
    }
    return res.json() as Promise<{ key: string; fileUrl: string; size: number; mimetype: string }>;
  }
}

export const api = new ApiService();
