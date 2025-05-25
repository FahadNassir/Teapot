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
  const [error, setError] = useState('')

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
  const confirmOrder = async () => {
    if (!validateDeliveryInfo()) {
      return
    }

    try {
      const baseUrl = process.env.NEXT_PUBLIC_URL || 'https://teapotserver.onrender.com'
      const finalTotal = calculateTotal(orderItems)

      // Create order object
      const currentOrder = {
        items: [...orderItems],
        timestamp: new Date().toLocaleString(),
        total: finalTotal,
        deliveryInfo: { ...deliveryInfo }
      }

      // Send order to server
      const response = await fetch(`${baseUrl}/order`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(currentOrder),
      }).catch(error => {
        throw new Error('Unable to connect to the server. Please check if the server is running.')
      })

      if (!response.ok) {
        throw new Error('Failed to submit order')
      }

      // Clear order items from localStorage
      localStorage.removeItem('orderItems')
      setOrderItems([])
      setDeliveryInfo({ address: '', phone: '' })
      setError('')
      setShowDeliveryForm(false)
      setShowSuccess(true)
    } catch (error) {
      console.error('Error submitting order:', error)
      setError(error.message || 'Failed to submit order. Please try again.')
      // Keep the delivery form open if there's an error
      setShowDeliveryForm(true)
    }
  }

  const validateDeliveryInfo = () => {
    if (orderItems.length === 0) {
      alert('Please add items to your order first!')
      return false
    }

    // Validate phone number
    if (deliveryInfo.phone.length !== 10) {
      setPhoneError('Phone number must be exactly 10 digits')
      return false
    }

    // Validate address
    const trimmedAddress = deliveryInfo.address.trim()
    if (trimmedAddress.length === 0) {
      setAddressError('Address is required')
      return false
    }

    return true
  }

  return (
    <div id="order" className="min-h-screen min-w-full bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Your Order</h1>
          <p className="mt-2 text-gray-600">Review and confirm your order</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Order Items (Stacked cards for mobile) */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="p-6">
                <h2 className="text-2xl font-semibold mb-4 text-gray-900">Order Items</h2>
                {orderItems.length === 0 ? (
                  <p className="text-gray-500 text-center py-4">No items in your order</p>
                ) : (
                  <div className="block lg:hidden">
                    {orderItems.map((item, index) => (
                      <div key={index} className="bg-gray-100 p-4 mb-4 rounded-lg shadow-sm">
                        <h3 className="text-lg font-semibold text-gray-900">{item.name}</h3>
                        <p className="text-sm text-gray-900">Price: {item.price}</p>
                        <div className="flex items-center space-x-2 mt-2">
                          <button
                            onClick={() => decreaseQuantity(item.name)}
                            className="px-2 py-1 bg-gray-800 text-white rounded-md hover:bg-gray-900"
                          >
                            -
                          </button>
                          <span className="text-sm font-medium text-gray-900">{item.quantity}</span>
                          <button
                            onClick={() => increaseQuantity(item.name)}
                            className="px-2 py-1 bg-gray-800 text-white rounded-md hover:bg-gray-900"
                          >
                            +
                          </button>
                        </div>
                        <p className="text-sm font-semibold mt-2 text-gray-900">Total: ${(parseFloat(item.price.replace('$', '')) * item.quantity).toFixed(2)}</p>
                        <button
                          onClick={() => removeFromOrder(item.name)}
                          className="text-red-600 hover:text-red-900 mt-2"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {/* Table view for larger screens */}
                <div className="hidden lg:block">
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Item</th>
                          <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                          <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                          <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                          <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {orderItems.map((item, index) => (
                          <tr key={index}>
                            <td className="px-4 py-3 text-sm text-gray-900">{item.name}</td>
                            <td className="px-4 py-3 text-sm text-gray-900">{item.price}</td>
                            <td className="px-4 py-3 text-sm text-gray-900">
                              <div className="flex items-center space-x-2">
                                <button
                                  onClick={() => decreaseQuantity(item.name)}
                                  className="px-2 py-1 bg-gray-800 text-white rounded-md hover:bg-gray-900"
                                >
                                  -
                                </button>
                                <span className="font-medium">{item.quantity}</span>
                                <button
                                  onClick={() => increaseQuantity(item.name)}
                                  className="px-2 py-1 bg-gray-800 text-white rounded-md hover:bg-gray-900"
                                >
                                  +
                                </button>
                              </div>
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-900">
                              ${(parseFloat(item.price.replace('$', '')) * item.quantity).toFixed(2)}
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-900">
                              <button
                                onClick={() => removeFromOrder(item.name)}
                                className="text-red-600 hover:text-red-900"
                              >
                                Remove
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-lg p-6 sticky top-4">
              <h2 className="text-2xl font-semibold mb-4 text-gray-900">Order Summary</h2>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">Subtotal</span>
                  <span className="font-semibold text-gray-900">${totalPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">Delivery Fee</span>
                  <span className="font-semibold text-gray-900">${deliveryFee.toFixed(2)}</span>
                </div>
                <div className="border-t pt-4 mt-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700 font-semibold">Total</span>
                    <span className="font-semibold text-gray-900">${finalTotal.toFixed(2)}</span>
                  </div>
                </div>
                <button
                  className={`w-full py-3 rounded-lg transition-colors ${
                    orderItems.length === 0 ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-gray-800 text-white hover:bg-gray-900'
                  }`}
                  onClick={() => setShowDeliveryForm(true)}
                  disabled={orderItems.length === 0}
                >
                  Proceed to Checkout
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Delivery Information Form (Modal) */}
        {showDeliveryForm && (
          <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-lg max-w-sm w-full mx-auto overflow-y-auto max-h-[90vh]">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Enter Delivery Information</h3>
              {error && (
                <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                  {error}
                </div>
              )}
              <form onSubmit={handleSubmit}>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Phone Number</label>
                    <input
                      type="text"
                      id="phone"
                      className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                      value={deliveryInfo.phone}
                      onChange={handlePhoneChange}
                      maxLength="10"
                    />
                    {phoneError && <p className="text-red-500 text-sm">{phoneError}</p>}
                  </div>
                  <div>
                    <label htmlFor="address" className="block text-sm font-medium text-gray-700">Delivery Address</label>
                    <input
                      type="text"
                      id="address"
                      className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                      value={deliveryInfo.address}
                      onChange={handleAddressChange}
                    />
                    {addressError && <p className="text-red-500 text-sm">{addressError}</p>}
                  </div>
                </div>
                <div className="mt-6">
                  <button
                    type="submit"
                    className="w-full py-3 bg-gray-800 hover:bg-gray-900 text-white rounded-lg transition-colors"
                  >
                    Confirm Order
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Success Modal */}
        {showSuccess && (
          <div className="fixed inset-0 flex justify-center items-center text-gray-900 bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-lg max-w-sm w-full mx-auto overflow-y-auto max-h-[90vh]">
              <h3 className="text-xl font-semibold mb-4">Order Confirmed!</h3>
              <p className="text-lg">Thank you for your purchase. Your order is on its way!</p>
              <div className="mt-4 space-y-3">
                <button 
                  className="w-full py-3 bg-gray-800 hover:bg-gray-900 text-white rounded-lg transition-colors"
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
    </div>
  )
}

export default Order
