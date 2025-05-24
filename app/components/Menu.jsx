"use client"

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const Menu = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('drinks');
  const [addedItems, setAddedItems] = useState(new Set());

  const drinks = [
    {
      name: "Passion juice",
      price: "$5.99",
      description: "Fresh passion fruit blended with ice and honey",
      image: "/images/passion.jpg",
      category: "Smoothies"
    },
    {
      name: "Mango Juice",
      price: "$4.99",
      description: "Creamy mango smoothie with a hint of cardamom",
      image: "/images/mango.jpg",
      category: "Smoothies"
    },
    {
      name: "Orange Juice",
      price: "$3.99",
      description: "Freshly squeezed orange juice with a touch of honey",
      image: "/images/orange.jpg",
      category: "Juices"
    },
    {
      name: "Apple juice",
      price: "$4.99",
      description: "Fresh apple juice with cinnamon and ginger",
      image: "/images/apple.jpg",
      category: "Juices"
    },
    {
      name: "Watermelon Cooler",
      price: "$5.99",
      description: "Refreshing watermelon drink with mint and lime",
      image: "/images/watermelon.jpg",
      category: "Coolers"
    },
    {
      name: "Avocado Smoothie",
      price: "$6.99",
      description: "Creamy avocado with banana and honey",
      image: "/images/avocado.jpg",
      category: "Smoothies"
    }
  ];

  const snacks = [
    {
      name: "Mahamri",
      price: "$2.99",
      description: "Traditional Kenyan sweet bread, perfect with tea",
      image: "/images/mahamri.jpg",
      category: "Breads"
    },
    {
      name: "Samosas",
      price: "$3.99",
      description: "Crispy pastry filled with spiced vegetables",
      image: "/images/samosas.jpg",
      category: "Snacks"
    },
    {
      name: "Bhajia",
      price: "$2.49",
      description: "Crispy battered potato fritters with spices",
      image: "/images/bhajia.jpg",
      category: "Snacks"
    },
    {
      name: "Matobosho",
      price: "$3.99",
      description: "Crispy, spicy potato chips with a hint of chili",
      image: "/images/matobosho.jpg",
      category: "Chips"
    }
  ];

  const handleAddToOrder = (item) => {
    const event = new CustomEvent('itemAdded', { 
      detail: item,
      bubbles: true
    });
    document.dispatchEvent(event);
    setAddedItems(prev => new Set([...prev, item.name]));
    // Reset the "Added" state after 2 seconds
    setTimeout(() => {
      setAddedItems(prev => {
        const newSet = new Set(prev);
        newSet.delete(item.name);
        return newSet;
      });
    }, 2000);
  }

  return (
    <section id="menu" className="min-h-screen bg-white min-w-full">
      <div className="container mx-auto px-4 py-16">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-900">Menu</h2>
          <div className="flex items-center space-x-4">
            <Link href="/#order" className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors duration-200">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
              </svg>
              View Order
            </Link>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-4" aria-label="Tabs">
              <button
                onClick={() => setActiveTab('drinks')}
                className={`px-3 py-2 font-medium text-sm ${
                  activeTab === 'drinks'
                    ? 'text-gray-900 border-b-2 border-gray-800'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Drinks
              </button>
              <button
                onClick={() => setActiveTab('snacks')}
                className={`px-3 py-2 font-medium text-sm ${
                  activeTab === 'snacks'
                    ? 'text-gray-900 border-b-2 border-gray-800'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Snacks
              </button>
            </nav>
          </div>
        </div>

        {/* Menu Items */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {(activeTab === 'drinks' ? drinks : snacks).map((item, index) => (
            <div 
              key={index}
              className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
            >
              <div className="relative h-48">
                <img 
                  src={item.image} 
                  alt={item.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black opacity-20"></div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2 text-gray-900">{item.name}</h3>
                <p className="text-gray-700 mb-4">{item.description}</p>
                <div className="flex justify-between items-center">
                  <span className="text-gray-900 font-semibold">{item.price}</span>
                  <button 
                    onClick={() => handleAddToOrder(item)}
                    className={`px-4 py-2 rounded transition-colors ${
                      addedItems.has(item.name)
                        ? 'bg-green-500 text-white cursor-default'
                        : 'bg-gray-800 text-white hover:bg-gray-900'
                    }`}
                    disabled={addedItems.has(item.name)}
                  >
                    {addedItems.has(item.name) ? 'Added' : 'Add to Order'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Menu