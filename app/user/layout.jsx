"use client"

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

export default function UserLayout({ children }) {
  const router = useRouter()

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn')
    router.push('/')
  }

  return (
    <div>
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20 items-center">
            <Link href="/" className="flex items-center">
              <Image
                src="/images/logo.jpg"
                alt="Teapot Logo"
                width={80}
                height={80}
                className="rounded-full shadow-md hover:shadow-lg transition-shadow duration-300"
              />
            </Link>
            <button
              onClick={handleLogout}
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gray-800 hover:bg-gray-900"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
      {children}
    </div>
  )
} 