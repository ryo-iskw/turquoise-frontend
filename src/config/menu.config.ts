export type MasterMenuItemType = {
  title: string
  href: string
  icon: string
}

export type MasterMenuType = {
  title: string
  icon: string
  href: string
  subMenu: MasterMenuItemType[]
}

const master_menu: MasterMenuType[] = [
  {
    title: 'ダッシュボード',
    icon: '/images/icon.svg',
    href: '/dashboard',
    subMenu: [],
  },
  {
    title: 'ユーザー',
    icon: '/images/icon.svg',
    href: '/users',
    subMenu: [],
  },
  {
    title: '機能A',
    icon: '/images/icon.svg',
    href: '/func-a',
    subMenu: [
      {
        title: 'ピボット',
        href: '/func-a/pivot',
        icon: '/images/icon.svg',
      },
      {
        title: 'サブメニュー2',
        href: '/func-a/sub-menu-2',
        icon: '/images/icon.svg',
      },
    ],
  },
]

const admin_menu: MasterMenuType[] = [
  {
    title: '組織設定',
    icon: '/images/icon.svg',
    href: '/admin/organizational_settings',
    subMenu: [],
  },
  {
    title: '契約',
    icon: '/images/icon.svg',
    href: '/admin/contracts',
    subMenu: [],
  },
]

// pathnameに対応するメニューを取得する関数
export const getCurrentMenuTitle = (pathname: string, menus: MasterMenuType[]): string => {
  for (const menu of menus) {
    // メインメニューのhrefと比較
    if (menu.href === pathname) {
      return menu.title
    }
    // サブメニューのhrefと比較
    const subMenuMatch = menu.subMenu.find((sub) => pathname === sub.href)
    if (subMenuMatch) {
      return subMenuMatch.title
    }
  }
  // 一致するものがない場合はデフォルトのタイトルを返す
  return 'Title'
}

export { master_menu, admin_menu }
