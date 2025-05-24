"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

const OrderManagement = () => {
  const [orders, setOrders] = useState([])
  const router = useRouter()

  // Function to load orders from localStorage
  const loadOrders = () => {
    const storedOrders = JSON.parse(localStorage.getItem('orders') || '[]')
    const ordersWithIds = storedOrders.map((order, index) => ({
      ...order,
      id: order.id || `order-${Date.now()}-${index}`,
      total: order.total || 0
    })).reverse()
    setOrders(ordersWithIds)
  }

  useEffect(() => {
    // Check if user is logged in
    const isLoggedIn = localStorage.getItem('isLoggedIn')
    if (!isLoggedIn) {
      router.push('/user/login')
      return
    }

    // Load initial orders
    loadOrders()

    // Add event listener for new orders
    const handleNewOrder = (event) => {
      // If the event has detail (from CustomEvent), use it directly
      if (event.detail) {
        const ordersWithIds = event.detail.map((order, index) => ({
          ...order,
          id: order.id || `order-${Date.now()}-${index}`,
          total: order.total || 0
        })).reverse()
        setOrders(ordersWithIds)
      } else {
        // Otherwise, reload from localStorage
        loadOrders()
      }
    }

    // Add event listener for storage changes
    const handleStorageChange = (e) => {
      if (e.key === 'orders') {
        loadOrders()
      }
    }

    window.addEventListener('newOrder', handleNewOrder)
    window.addEventListener('storage', handleStorageChange)

    // Cleanup
    return () => {
      window.removeEventListener('newOrder', handleNewOrder)
      window.removeEventListener('storage', handleStorageChange)
    }
  }, [router])

  const handleDelivered = (orderId) => {
    // Remove the delivered order
    const updatedOrders = orders.filter(order => order.id !== orderId)
    setOrders(updatedOrders)
    localStorage.setItem('orders', JSON.stringify(updatedOrders))
    
    // Dispatch event to notify other components
    const event = new CustomEvent('newOrder', { detail: updatedOrders })
    window.dispatchEvent(event)
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Order Management</h1>
        
        <div className="space-y-6">
          {orders.map((order, index) => (
            <div 
              key={`${order.id}-${index}`} 
              className="bg-white rounded-lg shadow-xl hover:shadow-2xl transition-shadow duration-300 overflow-hidden"
            >
              <div className="p-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-3">
                    <div className="text-sm text-gray-900">
                      <p className="font-semibold text-base mb-2">Delivery Information:</p>
                      <p className="mb-1">Address: {order.deliveryInfo?.address || 'No address provided'}</p>
                      <p>Phone: {order.deliveryInfo?.phone || 'No phone provided'}</p>
                    </div>
                    <div className="border-t border-gray-200 pt-3">
                      <p className="text-sm text-gray-900">
                        {order.items.map(item => `${item.name} (${item.quantity})`).join(', ')}
                      </p>
                      <p className="text-sm font-medium text-gray-900 mt-2">
                        Total: ${(order.total || 0).toFixed(2)}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDelivered(order.id)}
                    className="ml-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors duration-200"
                  >
                    Delivered
                  </button>
                </div>
              </div>
            </div>
          ))}
          {orders.length === 0 && (
            <div className="bg-white rounded-lg shadow-lg p-6 text-center text-gray-500">
              No orders to display
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default OrderManagement 