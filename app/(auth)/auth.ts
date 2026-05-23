// Stub auth — HaxonChat is frontend-only, no real authentication

export async function signOut(_options?: { redirectTo?: string }) {
  // No-op in frontend-only mode
  if (typeof window !== 'undefined' && _options?.redirectTo) {
    window.location.href = _options.redirectTo;
  }
}

export async function auth() {
  return null;
}
