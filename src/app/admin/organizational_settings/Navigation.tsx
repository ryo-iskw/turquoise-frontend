import Link from 'next/link'
import { usePathname } from 'next/navigation'

export const Navigation = () => {
  const currentPath = usePathname()
  return (
    <div className="tab mx-auto flex items-center justify-between gap-4 px-6 py-4">
      <nav className="flex space-x-8">
        <Link
          href="/admin/organizational_settings"
          className={`${currentPath === '/admin/organizational_settings' ? 'border-primary border-b-2 text-primary' : 'text-gray-500'}`}
        >
          General Information
        </Link>
        <Link
          href="/admin/organizational_settings/user-groups"
          className={`${currentPath === '/admin/organizational_settings/user-groups' ? 'border-primary border-b-2 text-primary' : 'text-gray-500'}`}
        >
          User Groups
        </Link>
        <Link
          href="/admin/organizational_settings/partners"
          className={`${currentPath === '/admin/organizational_settings/partners' ? 'border-primary border-b-2 text-primary' : 'text-gray-500'}`}
        >
          Partners
        </Link>
        <Link
          href="/admin/organizational_settings/roles"
          className={`${currentPath === '/admin/organizational_settings/roles' ? 'border-primary border-b-2 text-primary' : 'text-gray-500'}`}
        >
          Roles
        </Link>
      </nav>
    </div>
  )
}