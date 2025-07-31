
'use client'

import { useEffect, useState } from 'react'

interface CSRFTokenProps {
  onTokenReady?: (token: string) => void
}

export function CSRFToken({ onTokenReady }: CSRFTokenProps) {
  const [token, setToken] = useState<string>('')

  useEffect(() => {
    // Generate CSRF token on component mount
    const generateToken = () => {
      const tokenArray = new Uint8Array(32)
      crypto.getRandomValues(tokenArray)
      const token = Array.from(tokenArray, byte => byte.toString(16).padStart(2, '0')).join('')
      return token
    }

    const csrfToken = generateToken()
    setToken(csrfToken)
    sessionStorage.setItem('csrf_token', csrfToken)
    
    if (onTokenReady) {
      onTokenReady(csrfToken)
    }
  }, [onTokenReady])

  return <input type="hidden" name="csrf_token" value={token} />
}
