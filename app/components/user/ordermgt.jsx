"use client"

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

const OrderManagement = () => {
  const router = useRouter()
  const [orders, setOrders] = useState([])
  const baseUrl = process.env.NEXT_PUBLIC_URL || 'https://teapotserver.onrender.com'

  // Function to load orders from server
  const loadOrders = async () => {
    try {
      const response = await fetch(`${baseUrl}/orders`)
      if (!response.ok) {
        throw new Error('Failed to fetch orders')
      }
      const data = await response.json()
      setOrders(data)
    } catch (error) {
      console.error('Error loading orders:', error)
    }
  }

  // Load orders on component mount and set up polling
  useEffect(() => {
    // Initial load
    loadOrders()

    // Set up polling every 3 seconds
    const pollInterval = setInterval(() => {
      loadOrders()
    }, 3000)

    // Cleanup interval on component unmount
    return () => clearInterval(pollInterval)
  }, [])

  const handleSent = async (order) => {
    try {
      const response = await fetch(`${baseUrl}/order/${order.deliveryInfo.phone}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Failed to delete order')
      }

      // Update local state to remove the deleted order
      setOrders(prevOrders => prevOrders.filter(o => o.deliveryInfo.phone !== order.deliveryInfo.phone))
    } catch (error) {
      console.error('Error deleting order:', error)
      alert('Failed to delete order. Please try again.')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Order Management</h1>
          <p className="mt-2 text-gray-600">View and manage all orders</p>
        </div>

        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          <div className="p-6">
            {orders.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No orders found</p>
            ) : (
              <div className="space-y-6">
                {orders.map((order, index) => (
                  <div key={index} className="border-b border-gray-400 pb-6 last:border-b-0">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <p className="text-sm text-gray-500">{order.timestamp}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-semibold text-gray-900">Total: ${order.total.toFixed(2)}</p>
                      </div>
                    </div>

                    <div className="mb-4">
                      <h4 className="text-sm font-medium text-gray-900 mb-2">Delivery Information:</h4>
                      <p className="text-sm text-gray-600">Address: {order.deliveryInfo.address}</p>
                      <p className="text-sm text-gray-600">Phone: {order.deliveryInfo.phone}</p>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-4">
                      <h4 className="text-sm font-medium text-gray-900 mb-2">Order Items:</h4>
                      <div className="space-y-2">
                        {order.items.map((item, itemIndex) => (
                          <div key={itemIndex} className="flex justify-between text-sm">
                            <span className="text-gray-600">{item.name} x {item.quantity}</span>
                            <span className="text-gray-900">${(parseFloat(item.price.replace('$', '')) * item.quantity).toFixed(2)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="mt-4 flex justify-end">
                      <button
                        onClick={() => handleSent(order)}
                        className="px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-900 transition-colors"
                      >
                        Sent
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default OrderManagement 