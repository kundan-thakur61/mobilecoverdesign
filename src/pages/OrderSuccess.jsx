import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import orderAPI from '../api/orderAPI';

const OrderSuccess = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [order, setOrder] = useState(location.state?.order || null);
  const [loading, setLoading] = useState(!location.state?.order);
  const [paymentStatus, setPaymentStatus] = useState(
    location.state?.order?.payment?.status || null
  );
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Fetch payment status
  const fetchPaymentStatus = useCallback(async (isInitialFetch = false) => {
    if (!orderId) return;

    if (isInitialFetch) {
      setLoading(true);
    } else {
      setIsRefreshing(true);
    }

    try {
      const response = await orderAPI.getOrderById(orderId);
      const orderData = response.data?.data || response.data;

      setOrder(orderData);
      const newStatus = orderData.payment?.status || 'pending';
      
      if (paymentStatus !== 'paid' && newStatus === 'paid') {
        toast.success('Payment confirmed successfully!');
      }
      
      setPaymentStatus(newStatus);
    } catch (err) {
      console.error('Failed to fetch order:', err);
      if (isInitialFetch) {
        toast.error('Failed to load order details');
      }
    } finally {
      if (isInitialFetch) {
        setLoading(false);
      }
      setIsRefreshing(false);
    }
  }, [orderId, paymentStatus]);

  useEffect(() => {
    if (!order) {
      fetchPaymentStatus(true);
    }
  }, [orderId, order, fetchPaymentStatus]);

  useEffect(() => {
    if (paymentStatus === 'pending' || paymentStatus === 'processing') {
      const interval = setInterval(() => {
        fetchPaymentStatus(false);
      }, 5000);

      return () => clearInterval(interval);
    }
  }, [paymentStatus, fetchPaymentStatus]);

  const copyOrderId = () => {
    if (order?._id) {
      navigator.clipboard.writeText(order._id);
      toast.success('Order ID copied!');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your order...</p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 max-w-md text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Order Not Found</h2>
          <p className="text-gray-600 mb-6">We couldn't find this order. Please check your order history.</p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={() => navigate('/')}
              className="px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Go Home
            </button>
            <button
              onClick={() => navigate('/orders')}
              className="px-5 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
            >
              My Orders
            </button>
          </div>
        </div>
      </div>
    );
  }

  const isSuccess = paymentStatus === 'paid';
  const isPending = paymentStatus === 'pending' || paymentStatus === 'processing';

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        
        {/* Success/Status Header */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mb-6">
          <div className="text-center">
            {/* Icon */}
            {isSuccess && (
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            )}
            
            {isPending && (
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-yellow-600 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </div>
            )}

            {!isSuccess && !isPending && (
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
            )}
            
            {/* Title */}
            <h1 className="text-2xl font-semibold text-gray-900 mb-2">
              {isSuccess ? 'Order Placed Successfully!' : 
               isPending ? 'Payment Being Processed' : 
               'Payment Failed'}
            </h1>
            
            {/* Message */}
            <p className="text-gray-600 mb-4">
              {isSuccess ? 'Thank you for your order. We\'ll send you shipping updates via email.' :
               isPending ? 'Please wait while we confirm your payment. This usually takes a few moments.' :
               'Your payment could not be processed. Please try again or contact support.'}
            </p>

            {/* Order ID */}
            <div className="inline-flex items-center gap-2 bg-gray-50 px-4 py-2 rounded-lg">
              <span className="text-sm text-gray-600">Order ID:</span>
              <span className="text-sm font-mono font-semibold text-gray-900">{order._id}</span>
              <button
                onClick={copyOrderId}
                className="text-gray-400 hover:text-gray-600 transition-colors"
                title="Copy Order ID"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </button>
            </div>

            {/* Refresh Button for Pending */}
            {isPending && (
              <div className="mt-4">
                <button
                  onClick={() => fetchPaymentStatus(false)}
                  disabled={isRefreshing}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
                >
                  {isRefreshing ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Checking...
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                      Refresh Status
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Order Details */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h2>
          
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            {/* Shipping Address */}
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-3">Shipping Address</h3>
              <div className="text-sm text-gray-900 space-y-1">
                <p className="font-medium">{order.shippingAddress?.name}</p>
                <p className="text-gray-600">{order.shippingAddress?.address1}</p>
                {order.shippingAddress?.address2 && (
                  <p className="text-gray-600">{order.shippingAddress.address2}</p>
                )}
                <p className="text-gray-600">
                  {order.shippingAddress?.city}, {order.shippingAddress?.state} {order.shippingAddress?.postalCode}
                </p>
                <p className="text-gray-600">Phone: {order.shippingAddress?.phone}</p>
              </div>
            </div>

            {/* Payment Info */}
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-3">Payment Details</h3>
              <div className="text-sm space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Payment Method:</span>
                  <span className="text-gray-900 font-medium capitalize">{order.paymentMethod}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Status:</span>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                    isSuccess ? 'bg-green-100 text-green-700' :
                    isPending ? 'bg-yellow-100 text-yellow-700' :
                    'bg-red-100 text-red-700'
                  }`}>
                    {paymentStatus}
                  </span>
                </div>
                <div className="pt-2 border-t">
                  <div className="flex justify-between text-base">
                    <span className="font-medium text-gray-900">Total Amount:</span>
                    <span className="font-semibold text-gray-900">₹{order.total?.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Items */}
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-3">Order Items</h3>
            <div className="space-y-3">
              {order.items?.map((item, index) => (
                <div key={index} className="flex gap-4 p-3 bg-gray-50 rounded-lg">
                  {item.image && (
                    <img 
                      src={item.image} 
                      alt={item.title}
                      className="w-16 h-16 object-cover rounded-md"
                    />
                  )}
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-gray-900 text-sm mb-1 truncate">{item.title}</h4>
                    <p className="text-xs text-gray-600 mb-1">
                      {item.brand && <span>{item.brand}</span>}
                      {item.model && <span> • {item.model}</span>}
                      {item.material && <span> • {item.material}</span>}
                    </p>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-600">Qty: {item.quantity}</span>
                      <span className="text-sm font-medium text-gray-900">₹{(item.quantity * item.price).toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Next Steps (Success Only) */}
        {isSuccess && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">What's Next?</h2>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="text-center p-4">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                  </svg>
                </div>
                <h3 className="font-medium text-gray-900 mb-1 text-sm">Processing</h3>
                <p className="text-xs text-gray-600">We're preparing your order</p>
              </div>
              
              <div className="text-center p-4">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
                  </svg>
                </div>
                <h3 className="font-medium text-gray-900 mb-1 text-sm">Shipping</h3>
                <p className="text-xs text-gray-600">Track your shipment</p>
              </div>
              
              <div className="text-center p-4">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                </div>
                <h3 className="font-medium text-gray-900 mb-1 text-sm">Delivery</h3>
                <p className="text-xs text-gray-600">2-5 business days</p>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={() => navigate('/')}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Continue Shopping
          </button>
         
        </div>

        {/* Help Text */}
        <p className="text-center text-sm text-gray-500 mt-6">
          Need help? <a href="mailto:support@example.com" className="text-blue-600 hover:text-blue-700">Contact Support</a>
        </p>
      </div>
    </div>
  );
};

export default OrderSuccess;