// Utility to decode JWT and extract payload with proper UTF-8 handling
export function decodeJWT(token: string): Record<string, unknown> | null {
  if (!token) return null;
  try {
    const payload = token.split('.')[1];
    // Add padding if needed
    const paddedPayload = payload + '='.repeat((4 - payload.length % 4) % 4);
    
    // Decode base64 and handle UTF-8 properly
    const binaryString = atob(paddedPayload.replace(/-/g, '+').replace(/_/g, '/'));
    
    // Convert binary string to UTF-8
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    
    // Decode as UTF-8
    const decoded = JSON.parse(new TextDecoder('utf-8').decode(bytes));
    return decoded;
  } catch {
    
    try {
      // Fallback to simple decode
      const payload = token.split('.')[1];
      const decoded = JSON.parse(atob(payload.replace(/-/g, '+').replace(/_/g, '/')));
      return decoded;
    } catch {
      
      return null;
    }
  }
}

export function getUserRoleFromJWT(token: string): string | null {
  const payload = decodeJWT(token);
  return (payload?.role as string) || null;
}

export function getDepartmentNameFromJWT(token: string): string | null {
  const payload = decodeJWT(token);
  return (payload?.departmentName as string) || null;
}

export function getUserFromJWT(token: string): Record<string, unknown> | null {
  return decodeJWT(token);
}
