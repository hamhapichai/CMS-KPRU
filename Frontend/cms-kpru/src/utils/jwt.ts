// Utility to decode JWT and extract payload
export function decodeJWT(token: string): any {
  if (!token) return null;
  try {
    const payload = token.split('.')[1];
    const decoded = JSON.parse(atob(payload.replace(/-/g, '+').replace(/_/g, '/')));
    return decoded;
  } catch {
    return null;
  }
}

export function getUserRoleFromJWT(token: string): string | null {
  const payload = decodeJWT(token);
  return payload?.role || null;
}

export function getUserFromJWT(token: string): any {
  return decodeJWT(token);
}
