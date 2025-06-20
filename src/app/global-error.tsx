'use client'

import React, { useEffect } from 'react'
import ErrorState from '@/components/shared/ErrorState'
import clientLogger from '@/lib/logging/client'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    clientLogger.error('Global client-side error occurred', {
      message: error.message,
      stack: error.stack,
      digest: error.digest,
      name: error.name,
      authType: 'general'
    })
  }, [error])

  return (
    <html>
      <body>
        <div className="min-h-screen">
          <ErrorState 
            title="アプリケーションエラーが発生しました"
            refetchRef={{ current: reset }}
          />
        </div>
      </body>
    </html>
  )
}
