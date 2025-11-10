'use client'

import React, { useEffect } from 'react'
import { ErrorState } from '@/components/shared'
import clientLogger from '@/lib/logging/client'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    clientLogger.error('Client-side error occurred', {
      message: error.message,
      stack: error.stack,
      digest: error.digest,
      name: error.name,
      authType: 'general'
    })
  }, [error])

  const refetchRef = { current: reset }

  return <ErrorState title="ページでエラーが発生しました" refetchRef={refetchRef} />
}
