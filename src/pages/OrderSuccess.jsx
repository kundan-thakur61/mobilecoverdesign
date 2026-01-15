import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import orderAPI from '../api/orderAPI';

const OrderSuccess = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [paymentStatus, setPaymentStatus] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Fetch payment status
  const fetchPaymentStatus = async () => {
    if (!orderId) return;
    
    try {
      setIsRefreshing(true);
      const response = await orderAPI.getOrderById(orderId);
      const orderData = response.data?.data || response.data;
      
      setOrder(orderData);
      setPaymentStatus(orderData.paymentStatus || 'pending');
    } catch (err) {
      console.error('Failed to fetch order:', err);
      toast.error('Failed to load order details');
    } finally {
      setIsRefreshing(false);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPaymentStatus();
    
    // Poll for payment status updates
    const interval = setInterval(() => {
      if (paymentStatus === 'pending') {
        fetchPaymentStatus();
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [orderId, paymentStatus]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Loading order details...</p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">❌</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Order Not Found</h2>
          <p className="text-gray-600 mb-6">We couldn't find the order you're looking for.</p>
          <button
            onClick={() => navigate('/')}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  const isSuccess = paymentStatus === 'paid' || paymentStatus === 'completed';
  const isPending = paymentStatus === 'pending' || paymentStatus === 'processing';

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <div className={`rounded-2xl p-8 text-center ${
          isSuccess ? 'bg-green-50 border border-green-200' : 
          isPending ? 'bg-yellow-50 border border-yellow-200' : 
          'bg-red-50 border border-red-200'
        }`}>
          <div className="text-8xl mb-6">
            {isSuccess ? '🎉' : isPending ? '⏳' : '❌'}
          </div>
          
          <h1 className={`text-3xl font-bold mb-4 ${
            isSuccess ? 'text-green-800' : 
            isPending ? 'text-yellow-800' : 
            'text-red-800'
          }`}>
            {isSuccess ? 'Order Successful!' : 
             isPending ? 'Payment Processing' : 
             'Order Failed'}
          </h1>
          
          <p className={`text-lg mb-2 ${
            isSuccess ? 'text-green-700' : 
            isPending ? 'text-yellow-700' : 
            'text-red-700'
          }`}>
            Order #{order._id}
          </p>
          
          <p className={`mb-8 ${
            isSuccess ? 'text-green-600' : 
            isPending ? 'text-yellow-600' : 
            'text-red-600'
          }`}>
            {isSuccess ? 'Thank you for your purchase! Your order has been confirmed.' :
             isPending ? 'Your payment is being processed. This usually takes a few minutes.' :
             'Unfortunately, your order could not be processed. Please contact support.'}
          </p>

          {isPending && (
            <div className="mb-8">
              <button
                onClick={fetchPaymentStatus}
                disabled={isRefreshing}
                className="bg-yellow-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-yellow-700 disabled:opacity-50 transition flex items-center gap-2 mx-auto"
              >
                {isRefreshing ? (
                  <>
                    <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                    Checking...
                  </>
                ) : 'Refresh Status'}
              </button>
            </div>
          )}

          <div className="bg-white rounded-xl p-6 max-w-2xl mx-auto text-left">
            <h2 className="text-xl font-semibold mb-4 text-gray-900">Order Details</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <h3 className="font-medium text-gray-700 mb-2">Shipping Address</h3>
                <p className="text-gray-900">{order.shippingAddress?.name}</p>
                <p className="text-gray-600">
                  {order.shippingAddress?.address1}<br/>
                  {order.shippingAddress?.city}, {order.shippingAddress?.state} {order.shippingAddress?.postalCode}
                </p>
                <p className="text-gray-600">Phone: {order.shippingAddress?.phone}</p>
              </div>
              
              <div>
                <h3 className="font-medium text-gray-700 mb-2">Order Summary</h3>
                <p className="text-gray-900">Total Amount: <span className="font-semibold">₹{order.total}</span></p>
                <p className="text-gray-900">Payment Method: <span className="capitalize">{order.paymentMethod}</span></p>
                <p className="text-gray-900">Status: 
                  <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${
                    isSuccess ? 'bg-green-100 text-green-800' :
                    isPending ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {paymentStatus}
                  </span>
                </p>
              </div>
            </div>

            <div>
              <h3 className="font-medium text-gray-700 mb-3">Items Ordered</h3>
              <div className="space-y-3">
                {order.items?.map((item, index) => (
                  <div key={index} className="flex gap-4 p-3 bg-gray-50 rounded-lg">
                    {item.image && (
                      <img 
                        src={item.image} 
                        alt={item.title}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                    )}
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">{item.title}</h4>
                      <p className="text-sm text-gray-600">
                        {item.brand} {item.model} - {item.material}
                      </p>
                      <p className="text-sm text-gray-600">
                        Qty: {item.quantity} × ₹{item.price} = ₹{item.quantity * item.price}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
            <button
              onClick={() => navigate('/')}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
            >
              Continue Shopping
            </button>
            
            <button
              onClick={() => navigate('/orders')}
              className="bg-gray-200 text-gray-800 px-6 py-3 rounded-lg font-semibold hover:bg-gray-300 transition"
            >
              View My Orders
            </button>
          </div>
        </div>

        {isSuccess && (
          <div className="mt-8 bg-white rounded-xl p-6 text-center">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Next Steps</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-4">
                <div className="text-3xl mb-2">📦</div>
                <h4 className="font-medium text-gray-900 mb-1">Order Processing</h4>
                <p className="text-sm text-gray-600">We're preparing your order for shipment</p>
              </div>
              <div className="p-4">
                <div className="text-3xl mb-2">🚚</div>
                <h4 className="font-medium text-gray-900 mb-1">Shipment</h4>
                <p className="text-sm text-gray-600">Your order will be shipped soon</p>
              </div>
              <div className="p-4">
                <div className="text-3xl mb-2">🏠</div>
                <h4 className="font-medium text-gray-900 mb-1">Delivery</h4>
                <p className="text-sm text-gray-600">Expected delivery in 2-5 business days</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderSuccess;