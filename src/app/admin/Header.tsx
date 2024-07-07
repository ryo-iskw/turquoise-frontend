import { admin_menu, getCurrentMenuTitle } from '@/config/menu.config'
import { format } from 'date-fns'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useCallback, useEffect, useState } from 'react'

type HeaderMenu = {
  prevHref: string
  title: string
  subtitle?: string
  navItems?: {
    href: string
    name: string
    icon: string
  }[]
  button?: {
    name: string
    href: string
  }
  showClock?: boolean
  showNotification?: boolean
}

export const Header = () => {
  const [headerMenu, setHeaderMenu] = useState<HeaderMenu>({
    prevHref: '/',
    title: 'Title',
    subtitle: 'Subtitle',
    navItems: [
      { href: '/', name: 'Home', icon: 'home' },
      { href: '/about', name: 'About', icon: 'info' },
    ],
    button: {
      name: 'Button',
      href: '/button',
    },
    showClock: true,
    showNotification: true,
  })

  const fetchHeaderMenu = useCallback(async () => {
    // Fetch logic here
  }, [])

  useEffect(() => {
    fetchHeaderMenu()
  }, [])

  const pathname = usePathname()
  const title = getCurrentMenuTitle(pathname, admin_menu)

  return (
    <header className="w-full bg-white shadow-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <div className="text-center">
          <h1 className="font-bold text-xl">{title}</h1>
          <p className="text-gray-500 text-sm">{headerMenu.subtitle}</p>
        </div>
        <div className="flex items-center space-x-4">
          {headerMenu.showClock && <p className="text-sm">{format(new Date(), 'HH:mm')}</p>}
        </div>
      </div>
    </header>
  )
}
