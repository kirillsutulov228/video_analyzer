'use client'

import { AppStore, makeStore } from '@/shared/store/store'
import { ReactNode, useRef } from 'react'
import { Provider as ReduxProvider } from 'react-redux'

export default function StoreProvider ({
  children
}: {
  children: ReactNode
}) {
  const storeRef = useRef<AppStore | null>(null)
  if (!storeRef.current) {
    storeRef.current = makeStore()
  }

  return <ReduxProvider store={storeRef.current}>{children}</ReduxProvider>
}
