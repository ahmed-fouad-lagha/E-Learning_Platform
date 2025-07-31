
import { NextRequest, NextResponse } from 'next/server'
import { applyRateLimit, rateLimitConfigs, getClientIP, logSecurityEvent, getSecurityHeaders, sanitizeError } from './security'

interface SecurityConfig {
  rateLimit?: keyof typeof rateLimitConfigs
  requireAuth?: boolean
  allowedRoles?: string[]
  maxBodySize?: number
}

export function withSecurity(
  handler: (request: NextRequest, context?: any) => Promise<NextResponse>,
  config: SecurityConfig = {}
) {
  return async (request: NextRequest, context?: any): Promise<NextResponse> => {
    const clientIP = getClientIP(request)
    const userAgent = request.headers.get('user-agent') || 'unknown'

    try {
      // Apply rate limiting if configured
      if (config.rateLimit) {
        const rateLimitConfig = rateLimitConfigs[config.rateLimit]
        const rateLimit = applyRateLimit(clientIP, rateLimitConfig)
        
        if (!rateLimit.success) {
          logSecurityEvent({
            type: 'RATE_LIMIT',
            ip: clientIP,
            userAgent,
            details: { endpoint: request.nextUrl.pathname }
          })
          
          return NextResponse.json(
            { error: 'Rate limit exceeded' },
            { 
              status: 429,
              headers: {
                'Retry-After': Math.ceil((rateLimit.resetTime - Date.now()) / 1000).toString(),
                ...getSecurityHeaders()
              }
            }
          )
        }
      }

      // Check body size limit
      if (config.maxBodySize && request.headers.get('content-length')) {
        const contentLength = parseInt(request.headers.get('content-length')!, 10)
        if (contentLength > config.maxBodySize) {
          logSecurityEvent({
            type: 'SUSPICIOUS_ACTIVITY',
            ip: clientIP,
            userAgent,
            details: { reason: 'request_too_large', size: contentLength }
          })
          
          return NextResponse.json(
            { error: 'Request too large' },
            { status: 413, headers: getSecurityHeaders() }
          )
        }
      }

      // Call the actual handler
      const response = await handler(request, context)
      
      // Apply security headers to response
      Object.entries(getSecurityHeaders()).forEach(([key, value]) => {
        response.headers.set(key, value)
      })
      
      return response

    } catch (error) {
      logSecurityEvent({
        type: 'SUSPICIOUS_ACTIVITY',
        ip: clientIP,
        userAgent,
        details: { error: error instanceof Error ? error.message : 'Unknown error' }
      })
      
      const sanitizedError = sanitizeError(error)
      return NextResponse.json(
        { error: sanitizedError.message },
        { status: 500, headers: getSecurityHeaders() }
      )
    }
  }
}

// Usage example:
// export const POST = withSecurity(async (request) => {
//   // Your handler logic
// }, {
//   rateLimit: 'auth',
//   requireAuth: true,
//   maxBodySize: 1024 * 1024 // 1MB
// })
