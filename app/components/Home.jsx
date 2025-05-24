"use client"
import { useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'

const Home = () => {
  useEffect(() => {
    const handleScroll = (e) => {
      if (e.target.hash) {
        e.preventDefault();
        const element = document.querySelector(e.target.hash);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }
    };

    document.addEventListener('click', handleScroll);
    return () => document.removeEventListener('click', handleScroll);
  }, []);

  return (
    <main className="min-h-screen bg-white min-w-full">
      <div className="absolute top-4 right-4 z-20">
        <Link href="/user/login">
          <Image
            src="/images/logo.jpg"
            alt="Teapot Logo"
            width={100}
            height={100}
            className="rounded-full shadow-lg cursor-pointer hover:shadow-xl transition-shadow duration-300"
          />
        </Link>
      </div>
      <section id="home" className="relative h-screen flex items-center min-w-full">
        <div className="absolute inset-0">
          <img 
            src="/images/drinks.jpg" 
            alt="Cafe Drinks" 
            className="w-full h-full object-cover opacity-40"
          />
          <div className="absolute inset-0 bg-black opacity-30"></div>
        </div>
        <div className="relative z-10 px-8 md:px-20">
          <div className="max-w-2xl">
            <h1 className="text-5xl md:text-7xl font-bold text-white/90 mb-6">
              Welcome to Our Cafe
            </h1>
            <p className="text-xl md:text-2xl text-white/80 mb-8">
              Experience the finest coffee and delicious treats in a cozy atmosphere
            </p>
            <a href="#menu" className="inline-flex items-center px-8 py-4 rounded-lg text-lg font-semibold transition-all duration-300 transform hover:scale-105 hover:bg-white/95 hover:shadow-lg hover:text-gray-900 bg-white/90 text-gray-800">
              Explore Menu
            </a>
          </div>
        </div>
      </section>
    </main>
  )
}

export default Home