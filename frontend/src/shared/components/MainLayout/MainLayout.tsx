import { PropsWithChildren } from 'react'
import './MainLayout.scss'
import classNames from 'classnames'

export type MainLayoutProps = PropsWithChildren<{
  className?: string
}>

export default function MainLayout ({ children, className }: MainLayoutProps) {
  return (
    <div className={classNames('main-layout', className)}>
      <header className={'main-header'}>
        <h1 className={'main-header-title'}>Анализатор видео</h1>
      </header>
      <main className={'main-content'}>
        {children}
      </main>
    </div>
  )
}
