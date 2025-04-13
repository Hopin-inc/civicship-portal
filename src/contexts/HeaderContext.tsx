'use client'

import React, { createContext, useContext, useState, ReactNode, useCallback, useRef } from 'react'

interface SearchParams {
  location?: string
  from?: string
  to?: string
  guests?: string
}

interface HeaderConfig {
  title?: string
  showBackButton?: boolean
  showLogo?: boolean
  showSearchForm?: boolean
  action?: ReactNode
  searchParams?: SearchParams
}

interface HeaderContextType {
  config: HeaderConfig
  updateConfig: (newConfig: Partial<HeaderConfig>) => void
  resetConfig: () => void
}

const HeaderContext = createContext<HeaderContextType | undefined>(undefined)

const defaultConfig: HeaderConfig = {
  showLogo: true,
  showBackButton: false,
  showSearchForm: false,
  searchParams: undefined,
}

export const HeaderProvider = ({ children }: { children: ReactNode }) => {
  const [config, setConfig] = useState<HeaderConfig>(defaultConfig)
  const prevConfigRef = useRef<HeaderConfig>(defaultConfig)

  const updateConfig = useCallback((newConfig: Partial<HeaderConfig>) => {
    setConfig(prev => {
      const merged = { ...prev, ...newConfig }
      
      const isEqual = Object.keys(merged).every(key => {
        const k = key as keyof HeaderConfig
        return prevConfigRef.current[k] === merged[k]
      })

      if (isEqual) {
        return prev
      }

      prevConfigRef.current = merged
      return merged
    })
  }, [])

  const resetConfig = useCallback(() => {
    setConfig(prev => {
      if (prevConfigRef.current === defaultConfig) {
        return prev
      }
      prevConfigRef.current = defaultConfig
      return defaultConfig
    })
  }, [])

  return (
    <HeaderContext.Provider value={{ config, updateConfig, resetConfig }}>
      {children}
    </HeaderContext.Provider>
  )
}

export const useHeader = () => {
  const context = useContext(HeaderContext)
  if (context === undefined) {
    throw new Error('useHeader must be used within a HeaderProvider')
  }
  return context
} 