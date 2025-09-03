// Security Headers - Güvenlik başlıkları
export function addSecurityHeaders(response) {
  // XSS Protection
  response.headers.set('X-XSS-Protection', '1; mode=block');
  
  // Content Type Options
  response.headers.set('X-Content-Type-Options', 'nosniff');
  
  // Frame Options
  response.headers.set('X-Frame-Options', 'DENY');
  
  // Referrer Policy
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  
  // Content Security Policy
  response.headers.set('Content-Security-Policy', 
    "default-src 'self'; " +
    "script-src 'self' 'unsafe-inline' 'unsafe-eval'; " +
    "style-src 'self' 'unsafe-inline'; " +
    "img-src 'self' data: https:; " +
    "font-src 'self' data:; " +
    "connect-src 'self' https:; " +
    "frame-ancestors 'none';"
  );
  
  // HSTS (HTTP Strict Transport Security)
  response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  
  // Permissions Policy
  response.headers.set('Permissions-Policy', 
    'camera=(), microphone=(), geolocation=(), payment=()'
  );
  
  return response;
}

// IP Whitelist kontrolü
export function checkIPWhitelist(request, allowedIPs = []) {
  const clientIP = getClientIP(request);
  
  if (allowedIPs.length > 0 && !allowedIPs.includes(clientIP)) {
    return false;
  }
  
  return true;
}

// Bot detection
export function detectBot(request) {
  const userAgent = request.headers.get('user-agent') || '';
  const botPatterns = [
    /bot/i, /crawler/i, /spider/i, /scraper/i,
    /curl/i, /wget/i, /python/i, /java/i
  ];
  
  return botPatterns.some(pattern => pattern.test(userAgent));
}

// Request size limit
export function checkRequestSize(request, maxSize = 1024 * 1024) { // 1MB
  const contentLength = request.headers.get('content-length');
  
  if (contentLength && parseInt(contentLength) > maxSize) {
    return false;
  }
  
  return true;
}
