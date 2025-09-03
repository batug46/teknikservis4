// Rate Limiter - Aynı IP'den çok fazla istek gelirse engelle
const requests = new Map();

export function rateLimit(ip, maxRequests = 10, windowMs = 60000) {
  const now = Date.now();
  const windowStart = now - windowMs;
  
  // Eski istekleri temizle
  if (requests.has(ip)) {
    const userRequests = requests.get(ip).filter(time => time > windowStart);
    requests.set(ip, userRequests);
  } else {
    requests.set(ip, []);
  }
  
  const userRequests = requests.get(ip);
  
  if (userRequests.length >= maxRequests) {
    return false; // Rate limit aşıldı
  }
  
  userRequests.push(now);
  return true; // İstek kabul edildi
}

export function getClientIP(request) {
  const forwarded = request.headers.get('x-forwarded-for');
  const realIP = request.headers.get('x-real-ip');
  const cfConnectingIP = request.headers.get('cf-connecting-ip');
  
  return cfConnectingIP || realIP || forwarded?.split(',')[0] || 'unknown';
}
