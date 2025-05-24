"use client"

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

const Order = () => {
  const router = useRouter()
  const [orderItems, setOrderItems] = useState([])
  const [showDeliveryForm, setShowDeliveryForm] = useState(false)
  const [deliveryInfo, setDeliveryInfo] = useState({ address: '', phone: '' })
  const [showSuccess, setShowSuccess] = useState(false)
  const [phoneError, setPhoneError] = useState('')
  const [addressError, setAddressError] = useState('')
  const [successOrderItems, setSuccessOrderItems] = useState([])

  // Load order items from localStorage on component mount
  useEffect(() => {
    const savedOrderItems = localStorage.getItem('orderItems')
    if (savedOrderItems) {
      setOrderItems(JSON.parse(savedOrderItems))
    }
  }, [])

  // Save order items to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('orderItems', JSON.stringify(orderItems))
  }, [orderItems])

  // Add event listener for item additions
  useEffect(() => {
    const handleItemAdded = (event) => {
      addToOrder(event.detail)
    }
    window.addEventListener('itemAdded', handleItemAdded)
    return () => window.removeEventListener('itemAdded', handleItemAdded)
  }, [])

  // Function to add item to order
  const addToOrder = (item) => {
    setOrderItems(prevItems => {
      const existingItem = prevItems.find(i => i.name === item.name)
      if (existingItem) {
        // If item already exists, increase quantity
        return prevItems.map(i => 
          i.name === item.name ? { ...i, quantity: i.quantity + 1 } : i
        )
      } else {
        // If item doesn't exist, add new item with quantity 1
        return [...prevItems, { ...item, quantity: 1 }]
      }
    })
  }

  // Function to remove item from order
  const removeFromOrder = (itemName) => {
    setOrderItems(prevItems => prevItems.filter(item => item.name !== itemName))
  }

  // Function to decrease quantity of an item
  const decreaseQuantity = (itemName) => {
    setOrderItems(prevItems => 
      prevItems.map(item => 
        item.name === itemName 
          ? { ...item, quantity: Math.max(0, item.quantity - 1) }
          : item
      ).filter(item => item.quantity > 0)
    )
  }

  // Function to increase quantity of an item
  const increaseQuantity = (itemName) => {
    setOrderItems(prevItems => 
      prevItems.map(item => 
        item.name === itemName 
          ? { ...item, quantity: item.quantity + 1 }
          : item
      )
    )
  }

  // Calculate total price
  const calculateTotal = (items) => {
    return items.reduce((total, item) => {
      const price = parseFloat(item.price.replace('$', '')) || 0
      const quantity = item.quantity || 0
      return total + (price * quantity)
    }, 0)
  }

  const totalPrice = calculateTotal(orderItems)
  const deliveryFee = 2.99
  const finalTotal = totalPrice + deliveryFee

  const handlePhoneChange = (e) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 10)
    setDeliveryInfo(prev => ({ ...prev, phone: value }))
    
    if (value.length > 0 && value.length !== 10) {
      setPhoneError('Phone number must be exactly 10 digits')
    } else {
      setPhoneError('')
    }
  }

  const handleAddressChange = (e) => {
    const value = e.target.value.trim()
    setDeliveryInfo(prev => ({ ...prev, address: value }))
    
    if (value.length === 0) {
      setAddressError('Address is required')
    } else {
      setAddressError('')
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    // Validate phone number
    if (deliveryInfo.phone.length !== 10) {
      setPhoneError('Phone number must be exactly 10 digits')
      return
    }

    // Validate address
    const trimmedAddress = deliveryInfo.address.trim()
    if (trimmedAddress.length === 0) {
      setAddressError('Address is required')
      return
    }

    confirmOrder()
  }

  // Function to confirm order
  const confirmOrder = () => {
    if (orderItems.length === 0) {
      alert('Please add items to your order first!')
      return
    }

    // Store current order items for success modal
    setSuccessOrderItems([...orderItems])

    // Save current order to localStorage
    const currentOrder = {
      items: [...orderItems],
      timestamp: new Date().toLocaleString(),
      total: finalTotal,
      orderNumber: JSON.parse(localStorage.getItem('orders') || '[]').length + 1,
      deliveryInfo: { ...deliveryInfo }
    }

    // Get existing orders and add new order
    const existingOrders = JSON.parse(localStorage.getItem('orders') || '[]')
    const updatedOrders = [currentOrder, ...existingOrders]
    localStorage.setItem('orders', JSON.stringify(updatedOrders))
    
    // Dispatch event for new order with the updated orders data
    const event = new CustomEvent('newOrder', { detail: updatedOrders })
    window.dispatchEvent(event)
    
    // Clear current order and delivery info
    setOrderItems([])
    localStorage.removeItem('orderItems') // Clear from localStorage
    setDeliveryInfo({ address: '', phone: '' })
    setShowDeliveryForm(false)
    
    // Show success notification
    setShowSuccess(true)
  }

  return (
    <section id="order" className="min-h-screen bg-white min-w-full">
      <div className="container mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold text-center mb-12 text-gray-900">Your Order</h1>

        <div className="space-y-8">
          {/* Current Order */}
          <div>
            <h2 className="text-2xl font-semibold mb-6 text-gray-900">Current Order</h2>
            {orderItems.length === 0 ? (
              <div className="text-center text-gray-600 bg-gray-50 p-8 rounded-lg">
                <p className="mb-4">Your current order is empty</p>
                <p>Please select items from the menu to start ordering.</p>
              </div>
            ) : (
              <div className="space-y-8">
                {/* Order Items */}
                <div className="overflow-x-auto">
                  <table className="w-full table-auto text-left border border-gray-200">
                    <thead className="bg-gray-100 text-gray-700">
                      <tr>
                        <th className="py-2 px-4 border-b">Item</th>
                        <th className="py-2 px-4 border-b">Description</th>
                        <th className="py-2 px-4 border-b">Quantity</th>
                        <th className="py-2 px-4 border-b">Price</th>
                        <th className="py-2 px-4 border-b">Total</th>
                        <th className="py-2 px-4 border-b">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orderItems.map((item, index) => (
                        <tr key={index} className="border-t">
                          <td className="py-2 px-4 font-medium text-gray-900">{item.name}</td>
                          <td className="py-2 px-4 text-sm text-gray-600">{item.description}</td>
                          <td className="py-2 px-4">
                            <div className="flex items-center space-x-2">
                              <button onClick={() => decreaseQuantity(item.name)} className="px-2 py-1 rounded bg-gray-300 text-black hover:bg-gray-400">-</button>
                              <span className="font-medium text-gray-900">{item.quantity}</span>
                              <button onClick={() => increaseQuantity(item.name)} className="px-2 py-1 rounded bg-gray-800 text-white hover:bg-gray-900">+</button>
                            </div>
                          </td>
                          <td className="py-2 px-4">${parseFloat(item.price.replace('$', '')).toFixed(2)}</td>
                          <td className="py-2 px-4 font-medium text-gray-900">${(parseFloat(item.price.replace('$', '')) * item.quantity).toFixed(2)}</td>
                          <td className="py-2 px-4">
                            <button onClick={() => removeFromOrder(item.name)} className="text-red-600 hover:text-red-800">Remove</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Order Summary */}
                <div className="bg-white rounded-lg shadow-lg p-6">
                  <h2 className="text-2xl font-semibold mb-4 text-gray-900">Order Summary</h2>
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-gray-700">Subtotal</span>
                    <span className="font-semibold text-gray-900">${totalPrice.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-gray-700">Delivery Fee</span>
                    <span className="font-semibold text-gray-900">${deliveryFee.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center mb-6">
                    <span className="text-gray-700">Total</span>
                    <span className="font-semibold text-gray-900">${finalTotal.toFixed(2)}</span>
                  </div>
                  <button
                    className={`w-full py-3 rounded-lg transition-colors ${
                      orderItems.length === 0 ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-gray-800 text-white hover:bg-gray-900'
                    }`}
                    onClick={() => setShowDeliveryForm(true)}
                    disabled={orderItems.length === 0}
                  >
                    Proceed to Delivery
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Delivery Information Form */}
        {showDeliveryForm && (
          <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="bg-black/50 backdrop-blur-sm w-full h-full flex items-center justify-center">
              <div className="bg-white p-8 rounded-lg shadow-xl max-w-md w-full">
                <h3 className="text-2xl font-bold mb-6 text-gray-900">Delivery Information</h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                      Delivery Address
                    </label>
                    <textarea
                      id="address"
                      value={deliveryInfo.address}
                      onChange={handleAddressChange}
                      className={`w-full px-4 py-2 border ${addressError ? 'border-red-500' : 'border-gray-300'} rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500 text-gray-900 placeholder-gray-500`}
                      rows="3"
                      placeholder="Enter your complete delivery address"
                      required
                    />
                    {addressError && (
                      <p className="mt-1 text-sm text-red-600">{addressError}</p>
                    )}
                  </div>
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      value={deliveryInfo.phone}
                      onChange={handlePhoneChange}
                      className={`w-full px-4 py-2 border ${phoneError ? 'border-red-500' : 'border-gray-300'} rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500`}
                      placeholder="Enter 10-digit phone number"
                      required
                    />
                    {phoneError && (
                      <p className="mt-1 text-sm text-red-600">{phoneError}</p>
                    )}
                  </div>
                  <div className="flex justify-end space-x-4 mt-6">
                    <button
                      type="button"
                      onClick={() => setShowDeliveryForm(false)}
                      className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 text-sm font-medium text-white bg-gray-800 rounded-md hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                    >
                      Confirm Order
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Success Notification */}
        {showSuccess && (
          <div 
            className="fixed inset-0 flex items-center justify-center z-50"
            onClick={(e) => {
              if (e.target === e.currentTarget) {
                setShowSuccess(false)
              }
            }}
          >
            <div className="bg-black/50 backdrop-blur-sm w-full h-full flex items-center justify-center">
              <div className="bg-white p-8 rounded-lg shadow-xl text-center max-w-md w-full">
                <svg className="w-16 h-16 mx-auto text-green-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                <h3 className="text-2xl font-bold mb-2 text-gray-900">Order Placed Successfully!</h3>
                <p className="text-gray-900 mb-4 font-medium">Your order will be delivered shortly.</p>
                <div className="space-y-2 mb-6">
                  {successOrderItems.map((item, index) => (
                    <div key={index} className="flex justify-between items-center text-sm">
                      <span className="text-gray-900">{item.name} x {item.quantity}</span>
                      <span className="text-gray-900 font-medium">${(parseFloat(item.price.replace('$', '')) * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                  <div className="border-t pt-2 mt-2">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-700">Subtotal</span>
                      <span className="text-gray-900">${calculateTotal(successOrderItems).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-700">Delivery Fee</span>
                      <span className="text-gray-900">${deliveryFee.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center font-semibold text-gray-900">
                      <span>Total</span>
                      <span>${(calculateTotal(successOrderItems) + deliveryFee).toFixed(2)}</span>
                    </div>
                  </div>
                </div>
                <button 
                  className="bg-gray-800 text-white px-6 py-2 rounded-lg hover:bg-gray-900 transition-colors"
                  onClick={() => {
                    setShowSuccess(false)
                    router.push('/#menu')
                  }}
                >
                  Continue Shopping
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}

export default Order
