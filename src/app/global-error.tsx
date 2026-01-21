'use client'

import React, { useEffect, useState } from 'react'
import { ErrorState } from '@/components/shared'
import clientLogger from '@/lib/logging/client'
import { NextIntlClientProvider } from 'next-intl'
import { nestMessages } from '@/lib/i18n/nestMessages'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  const [messages, setMessages] = useState<any>(null)
  const [locale, setLocale] = useState<string>('ja')

  useEffect(() => {
    clientLogger.error('Global client-side error occurred', {
      message: error.message,
      stack: error.stack,
      digest: error.digest,
      name: error.name,
      authType: 'general'
    })

    // Load translation messages for the error page
    const loadMessages = async () => {
      try {
        // Try to get locale from cookie or default to 'ja'
        const cookieLocale = document.cookie
          .split('; ')
          .find(row => row.startsWith('language='))
          ?.split('=')[1] || 'ja'

        setLocale(cookieLocale)

        // Load common translations needed for ErrorState
        const commonFlat = await import(`@/messages/${cookieLocale}/common.json`)
        const nestedMessages = nestMessages(commonFlat.default)
        setMessages(nestedMessages)
      } catch (err) {
        console.error('Failed to load translations for global error:', err)
        // Use fallback empty messages if loading fails
        setMessages({})
      }
    }

    loadMessages()
  }, [error])

  // Show a minimal error state while loading messages
  if (!messages) {
    return (
      <html>
        <body>
          <div className="min-h-screen flex items-center justify-center p-12">
            <div className="w-full max-w-mobile-l space-y-6 text-center">
              <h1 className="text-left text-display-md font-bold">
                アプリケーションエラーが発生しました
              </h1>
              <p className="text-left text-body-sm text-muted-foreground">
                予期しないエラーが発生しました。ページを再読み込みしてください。
              </p>
            </div>
          </div>
        </body>
      </html>
    )
  }

  return (
    <html lang={locale}>
      <body>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <div className="min-h-screen">
            <ErrorState
              title="アプリケーションエラーが発生しました"
              refetchRef={{ current: reset }}
            />
          </div>
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
