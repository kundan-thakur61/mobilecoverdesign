import { useEffect, useState } from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import { FiCheckCircle, FiTruck, FiPackage, FiMapPin, FiCreditCard, FiShoppingBag, FiEye, FiClock, FiStar } from 'react-icons/fi';
import { toast } from 'react-toastify';
import orderAPI from '../api/orderAPI';
import SEO from '../components/SEO';
import { formatPrice, formatDate, generateOrderNumber, getProductImage, resolveImageUrl } from '../utils/helpers';

const OrderSuccess = () => {
  const { id } = useParams();
  const location = useLocation();
  const [order, setOrder] = useState(location.state?.order || null);
  const [loading, setLoading] = useState(!order);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    // If order is not in state, fetch it
    if (!order && id) {
      const fetchOrder = async () => {
        try {
          setLoading(true);
          const response = await orderAPI.getOrder(id);
          setOrder(response.data?.data?.order || response.data?.order || response.data);
        } catch (err) {
          console.error('Failed to fetch order:', err);
          setError('Failed to load order details. Please try again.');
          toast.error('Failed to load order details');
        } finally {
          setLoading(false);
        }
      };

      fetchOrder();
    }
  }, [order, id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center px-4">
        <div className="text-center">
          <div className="relative mb-8">
            {/* Outer rotating ring */}
            <div className="absolute inset-0 w-32 h-32 mx-auto">
              <div className="w-full h-full rounded-full border-4 border-transparent border-t-purple-500 border-r-pink-500 animate-spin"></div>
            </div>
            
            {/* Middle rotating ring */}
            <div className="absolute inset-0 w-32 h-32 mx-auto" style={{ animationDelay: '-0.3s' }}>
              <div className="w-24 h-24 m-4 rounded-full border-4 border-transparent border-t-blue-500 border-l-cyan-500 animate-spin animation-reverse"></div>
            </div>
            
            {/* Inner pulsing circle */}
            <div className="relative w-32 h-32 mx-auto flex items-center justify-center">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full animate-pulse shadow-lg flex items-center justify-center">
                <FiPackage className="w-8 h-8 text-white animate-bounce" />
              </div>
            </div>
            
            {/* Orbiting dots */}
            <div className="absolute top-0 left-1/2 -ml-2 w-4 h-4 bg-purple-500 rounded-full animate-orbit"></div>
            <div className="absolute bottom-0 left-1/2 -ml-2 w-4 h-4 bg-pink-500 rounded-full animate-orbit-reverse"></div>
          </div>
          
          <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 mb-2 animate-pulse">
            Loading Order Details
          </h2>
          <p className="text-gray-600">Retrieving your order information...</p>
          
          {/* Progress dots */}
          <div className="flex items-center justify-center gap-2 mt-4">
            <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
            <div className="w-2 h-2 bg-pink-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl border border-gray-100 p-8 text-center transform hover:scale-105 transition-transform duration-300">
          <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-red-100 to-red-200 rounded-full flex items-center justify-center">
            <svg className="w-10 h-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Order Not Found</h2>
          <p className="text-gray-600 mb-6">{error || 'We could not find your order details.'}</p>
          <Link
            to="/products"
            className="inline-block bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-3 rounded-xl font-semibold hover:from-purple-700 hover:to-pink-700 transition-all transform hover:scale-105 shadow-lg"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  const orderNumber = generateOrderNumber(order._id || order.id);
  const orderDate = formatDate(order.createdAt || new Date());
  const paymentMethod = order.paymentMethod || 'razorpay';
  const shippingAddress = order.shippingAddress || {};
  const items = order.items || [];

  return (
    <>
      <SEO
        title={`Order Confirmed - ${orderNumber}`}
        description="Your order has been successfully placed. Track your custom mobile cover delivery."
        url={`/order-success/${order._id || order.id}`}
      />

      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Success Header with Animation */}
          <div className="text-center mb-12 animate-fadeIn">
            <div className="relative inline-block mb-6">
              <div className="w-24 h-24 mx-auto bg-gradient-to-br from-green-400 to-emerald-600 rounded-full flex items-center justify-center shadow-2xl animate-bounce">
                <FiCheckCircle className="w-12 h-12 text-white" />
              </div>
              {/* Decorative rings */}
              <div className="absolute inset-0 rounded-full border-4 border-green-200 animate-ping opacity-75"></div>
              <div className="absolute inset-0 rounded-full border-4 border-green-300 animate-pulse"></div>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 mb-3">
              Order Confirmed! 🎉
            </h1>
            <p className="text-xl text-gray-700 max-w-2xl mx-auto">
              Thank you for your order! We've received your payment and are excited to create your custom mobile covers.
            </p>
          </div>

          {/* Order Summary Card with Gradient */}
          <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-xl border border-gray-200 p-8 mb-8 transform hover:scale-[1.02] transition-all duration-300">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center md:text-left">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl mb-3">
                  <FiPackage className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">Order Number</h3>
                <p className="text-2xl font-bold text-gray-900">{orderNumber}</p>
              </div>
              <div className="text-center md:text-left">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-purple-100 to-purple-200 rounded-xl mb-3">
                  <FiClock className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">Order Date</h3>
                <p className="text-2xl font-bold text-gray-900">{orderDate}</p>
              </div>
              <div className="text-center md:text-left">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-green-100 to-green-200 rounded-xl mb-3">
                  <FiCreditCard className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">Total Amount</h3>
                <p className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-600">
                  {formatPrice(order.total || 0)}
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Order Items with Enhanced Design */}
            <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8 transform hover:shadow-2xl transition-shadow duration-300">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                <div className="p-2 bg-gradient-to-br from-purple-100 to-pink-100 rounded-lg">
                  <FiShoppingBag className="w-6 h-6 text-purple-600" />
                </div>
                Order Items
              </h2>

              <div className="space-y-4 mb-6">
                {items.map((item, index) => {
                  const rawImage = item.image || getProductImage(item);
                  const itemImage = resolveImageUrl(rawImage);

                  return (
                    <div 
                      key={item.productId || index} 
                      className="flex gap-4 p-4 bg-gradient-to-r from-gray-50 to-purple-50 rounded-xl hover:from-purple-50 hover:to-pink-50 transition-all duration-300 transform hover:scale-[1.02]"
                    >
                      <div 
                        className="w-20 h-20 bg-white rounded-xl overflow-hidden flex-shrink-0 shadow-md ring-2 ring-purple-100 cursor-pointer hover:ring-4 hover:ring-purple-300 transition-all"
                        onClick={() => setSelectedImage(itemImage)}
                      >
                        <img
                          src={itemImage}
                          alt={item.title || 'Product'}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.src = '/placeholder-image.svg';
                          }}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-900 truncate">{item.title || 'Custom Product'}</h3>
                        <p className="text-sm text-gray-600">
                          {item.brand && item.model ? `${item.brand} • ${item.model}` : 'Custom Design'}
                          {item.material && ` • ${item.material}`}
                        </p>
                        {(item.color || item.variant) && (
                          <div className="flex items-center gap-2 mt-1">
                            <div className="w-3 h-3 rounded-full bg-gradient-to-br from-purple-400 to-pink-400"></div>
                            <span className="text-xs text-gray-500">
                              {item.color || (item.variant && (item.variant.name || item.variant.color)) || 'Default'}
                            </span>
                          </div>
                        )}
                        <div className="flex items-center justify-between mt-3">
                          <span className="text-sm font-medium text-gray-600 bg-white px-3 py-1 rounded-full">
                            Qty: {item.quantity || 1}
                          </span>
                          <span className="font-bold text-lg text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">
                            {formatPrice((item.price || 0) * (item.quantity || 1))}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Price Breakdown */}
              <div className="border-t-2 border-gray-200 pt-4 space-y-2">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span className="font-semibold">{formatPrice(order.subtotal || order.total || 0)}</span>
                </div>
                {(order.shipping || 0) > 0 && (
                  <div className="flex justify-between text-gray-600">
                    <span>Shipping</span>
                    <span className="font-semibold">{formatPrice(order.shipping || 0)}</span>
                  </div>
                )}
                <div className="flex justify-between font-bold text-xl text-gray-900 pt-3 border-t-2 border-gray-200">
                  <span>Total</span>
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-600">
                    {formatPrice(order.total || 0)}
                  </span>
                </div>
              </div>
            </div>

            {/* Right Column - Shipping, Payment & Status */}
            <div className="space-y-6">
              {/* Shipping Address */}
              <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-6 transform hover:shadow-2xl transition-shadow duration-300">
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                  <div className="p-2 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-lg">
                    <FiMapPin className="w-5 h-5 text-blue-600" />
                  </div>
                  Shipping Address
                </h2>

                <div className="text-gray-700 bg-gradient-to-br from-blue-50 to-cyan-50 p-4 rounded-xl">
                  <p className="font-bold text-lg text-gray-900">{shippingAddress.name}</p>
                  <p className="text-blue-600 font-medium">{shippingAddress.phone}</p>
                  <p className="mt-3 text-gray-700">
                    {shippingAddress.address1}
                    {shippingAddress.address2 && `, ${shippingAddress.address2}`}
                  </p>
                  <p className="text-gray-700">
                    {shippingAddress.city}, {shippingAddress.state} {shippingAddress.postalCode}
                  </p>
                  <p className="font-medium text-gray-900">{shippingAddress.country || 'India'}</p>
                </div>
              </div>

              {/* Payment Info */}
              <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-6 transform hover:shadow-2xl transition-shadow duration-300">
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                  <div className="p-2 bg-gradient-to-br from-green-100 to-emerald-100 rounded-lg">
                    <FiCreditCard className="w-5 h-5 text-green-600" />
                  </div>
                  Payment Information
                </h2>

                <div className="space-y-3 bg-gradient-to-br from-green-50 to-emerald-50 p-4 rounded-xl">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 font-medium">Payment Method</span>
                    <span className="font-bold capitalize text-gray-900 bg-white px-3 py-1 rounded-full">
                      {paymentMethod}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 font-medium">Payment Status</span>
                    <span className="font-bold text-green-600 flex items-center gap-2">
                      <FiCheckCircle className="w-4 h-4" />
                      Paid
                    </span>
                  </div>
                  {order.paymentId && (
                    <div className="flex justify-between items-start">
                      <span className="text-gray-600 font-medium">Transaction ID</span>
                      <span className="font-mono text-xs text-gray-800 bg-white px-2 py-1 rounded max-w-[180px] break-all">
                        {order.paymentId}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Order Status Timeline */}
              <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-6 transform hover:shadow-2xl transition-shadow duration-300">
                <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                  <div className="p-2 bg-gradient-to-br from-orange-100 to-pink-100 rounded-lg">
                    <FiTruck className="w-5 h-5 text-orange-600" />
                  </div>
                  Order Timeline
                </h2>

                <div className="space-y-4">
                  <div className="flex items-start gap-4 relative">
                    <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-emerald-600 rounded-full flex items-center justify-center shadow-lg flex-shrink-0 z-10">
                      <FiCheckCircle className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1 pb-4 border-l-2 border-green-300 ml-5 pl-4 -ml-5">
                      <p className="font-bold text-gray-900">Order Confirmed</p>
                      <p className="text-sm text-gray-600">Your order has been received and payment confirmed</p>
                      <span className="inline-block mt-1 text-xs text-green-600 bg-green-100 px-2 py-1 rounded-full font-semibold">
                        Completed
                      </span>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 relative">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-indigo-600 rounded-full flex items-center justify-center shadow-lg flex-shrink-0 z-10 animate-pulse">
                      <FiPackage className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1 pb-4 border-l-2 border-blue-300 ml-5 pl-4 -ml-5">
                      <p className="font-bold text-gray-900">Processing</p>
                      <p className="text-sm text-gray-600">Our team is preparing your custom mobile covers</p>
                      <span className="inline-block mt-1 text-xs text-blue-600 bg-blue-100 px-2 py-1 rounded-full font-semibold">
                        In Progress
                      </span>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 relative">
                    <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
                      <FiTruck className="w-5 h-5 text-gray-400" />
                    </div>
                    <div className="flex-1">
                      <p className="font-bold text-gray-500">Shipped</p>
                      <p className="text-sm text-gray-400">Expected within 24-48 hours</p>
                      <span className="inline-block mt-1 text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full font-semibold">
                        Pending
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons with Enhanced Design */}
          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/orders"
              className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-bold hover:from-purple-700 hover:to-pink-700 transition-all transform hover:scale-105 shadow-xl hover:shadow-2xl"
            >
              <FiEye className="w-5 h-5" />
              View All Orders
            </Link>

            <Link
              to="/products"
              className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-white text-gray-900 border-2 border-gray-300 rounded-xl font-bold hover:bg-gray-50 hover:border-purple-300 transition-all transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              <FiShoppingBag className="w-5 h-5" />
              Continue Shopping
            </Link>
          </div>

          {/* What's Next Section with Enhanced Design */}
          <div className="mt-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl p-8 shadow-2xl text-white">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-white/20 rounded-lg">
                <FiStar className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-bold">What Happens Next?</h3>
            </div>
            <ul className="space-y-3 text-blue-50">
              <li className="flex items-start gap-3">
                <FiCheckCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
                <span>You'll receive an email confirmation with complete order details</span>
              </li>
              <li className="flex items-start gap-3">
                <FiCheckCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
                <span>Our expert design team will craft your custom covers with precision</span>
              </li>
              <li className="flex items-start gap-3">
                <FiCheckCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
                <span>Receive a WhatsApp preview for approval within 24 hours</span>
              </li>
              <li className="flex items-start gap-3">
                <FiCheckCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
                <span>Once approved, we'll print and ship your order immediately</span>
              </li>
              <li className="flex items-start gap-3">
                <FiCheckCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
                <span>Track your order status anytime in your account dashboard</span>
              </li>
            </ul>
          </div>

          {/* Support Info with Enhanced Design */}
          <div className="mt-8 text-center">
            <div className="inline-block bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
              <p className="text-gray-700 font-medium">
                Need help? We're here for you! 
                <a 
                  href="https://wa.me/7827205492" 
                  className="ml-2 text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 font-bold transition-all"
                >
                  WhatsApp Us
                </a>
                {' '}or email{' '}
                <a 
                  href="mailto:support@coverghar.in" 
                  className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 font-bold transition-all"
                >
                  support@coverghar.in
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Image Modal */}
      {selectedImage && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fadeIn"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-w-4xl max-h-[90vh] w-full">
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute -top-12 right-0 text-white hover:text-gray-300 transition-colors"
              aria-label="Close image"
            >
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <img
              src={selectedImage}
              alt="Product preview"
              className="w-full h-full object-contain rounded-2xl shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </div>
      )}

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.6s ease-out;
        }
        
        @keyframes orbit {
          from {
            transform: rotate(0deg) translateX(64px) rotate(0deg);
          }
          to {
            transform: rotate(360deg) translateX(64px) rotate(-360deg);
          }
        }
        
        @keyframes orbit-reverse {
          from {
            transform: rotate(360deg) translateX(64px) rotate(-360deg);
          }
          to {
            transform: rotate(0deg) translateX(64px) rotate(0deg);
          }
        }
        
        .animate-orbit {
          animation: orbit 3s linear infinite;
        }
        
        .animate-orbit-reverse {
          animation: orbit-reverse 3s linear infinite;
        }
        
        .animation-reverse {
          animation-direction: reverse;
        }
      `}</style>
    </>
  );
};

export default OrderSuccess;