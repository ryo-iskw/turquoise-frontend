import { Button } from '@/components'
import { type MasterMenuItemType, type MasterMenuType, admin_menu } from '@/config/menu.config'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'

export const Sidebar = () => {
  const pathname = usePathname()
  const [subMenu, setSubMenu] = useState<MasterMenuItemType[] | undefined>(undefined)

  useEffect(() => {
    const findSubMenu = () => {
      // 現在のパスに一致するメインメニュー項目を探す
      let menu = admin_menu.find((item: MasterMenuType) => item.href === pathname)

      if (!menu) {
        // サブメニュー項目の中で現在のパスに一致するものを探し、その親メニューを見つける
        for (const item of admin_menu) {
          const foundChild = item.subMenu?.find((childItem) => pathname.includes(childItem.href))
          if (foundChild) {
            menu = item
            break
          }
        }
      }

      // 見つかったメニューのサブメニューを設定する
      setSubMenu(menu?.subMenu)
    }

    findSubMenu()
  }, [pathname])

  return (
    <aside className="sticky top-0 h-screen w-[250px] bg-turqb-500 text-white invert sepia filter">
      <div className="flex flex-col self-stretch pb-4">
        <Link href="/dashboard" className="flex items-center justify-center self-stretch px-4 py-6 hover:bg-turqb-800">
          <Image src="/images/logo.jpeg" width={80} height={80} alt="Logo" className="invert filter" />
        </Link>
        {admin_menu.map((item: MasterMenuItemType) => (
          <Link
            key={item.href}
            href={item.href}
            className="flex items-center justify-start self-stretch px-4 py-3 hover:bg-turqb-700"
          >
            <Image src={item.icon} width={24} height={24} alt={item.title} className="sepia filter" />
            <span className="ml-4">{item.title}</span>
          </Link>
        ))}
        {subMenu &&
          subMenu.map((childItem) => (
            <Link
              key={childItem.href}
              href={childItem.href}
              className="flex items-center justify-start self-stretch px-8 py-3 hover:bg-turqb-700"
            >
              <Image src={childItem.icon} width={24} height={24} alt={childItem.title} className="sepia filter" />
              <span className="ml-4">{childItem.title}</span>
            </Link>
          ))}
        <div className="fixed bottom-1 px-4 py-2">
          <Link href="/dashboard" passHref>
            <Button variant="sepia" size="md">
              <span>企業用ページへ</span>
            </Button>
          </Link>
        </div>
      </div>
    </aside>
  )
}
