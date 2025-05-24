"use client"
import { useState } from "react"
import Link from "next/link"
import { useRouter } from 'next/navigation'

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false)
  const router = useRouter()

  return (
    <nav className="bg-white shadow-lg fixed w-full z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <img src="/images/logo.jpg" alt="Cafe Logo" className="h-16 w-auto" />
            </Link>
          </div>
          
          {/* Desktop menu */}
          <div className="hidden md:flex space-x-8">
            <a href="#home" className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">Home</a>
            <a href="#menu" className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">Menu</a>
            <a href="#order" className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">Order</a>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button 
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-gray-500"
            >
              <span className="sr-only">Open main menu</span>
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
              </svg>
            </button>
          </div>

          <div className="flex items-center space-x-4">
            <Link 
              href="/user/login"
              className="text-gray-600 hover:text-gray-900"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </Link>
          </div>
        </div>

        {/* Mobile menu */}
        <div className={`md:hidden ${isOpen ? 'block' : 'hidden'}`}>
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <a href="#home" className="block px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100">Home</a>
            <a href="#menu" className="block px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100">Menu</a>
            <a href="#order" className="block px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100">Order</a>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar