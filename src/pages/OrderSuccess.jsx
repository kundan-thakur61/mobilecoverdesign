import { useEffect, useState } from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import { FiCheckCircle, FiTruck, FiPackage, FiMapPin, FiCreditCard, FiShoppingBag, FiEye } from 'react-icons/fi';
import { toast } from 'react-toastify';
import orderAPI from '../api/orderAPI';
import SEO from '../components/SEO';
import { formatPrice, formatDate, generateOrderNumber, getProductImage } from '../utils/helpers';

const OrderSuccess = () => {
  const { id } = useParams();
  const location = useLocation();
  const [order, setOrder] = useState(location.state?.order || null);
  const [loading, setLoading] = useState(!order);
  const [error, setError] = useState(null);

  useEffect(() => {
    // If order is not in state, fetch it
    if (!order && id) {
      const fetchOrder = async () => {
        try {
          setLoading(true);
          const response = await orderAPI.getOrder(id);
          setOrder(response.data?.data || response.data);
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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center">
          <div className="relative mb-6">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-primary-200 border-t-primary-600 mx-auto"></div>
            <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-primary-400 animate-spin animation-delay-150"></div>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Loading Order Details</h2>
          <p className="text-gray-600">Please wait while we fetch your order information...</p>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg border border-gray-100 p-8 text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Order Not Found</h2>
          <p className="text-gray-600 mb-6">{error || 'We could not find your order details.'}</p>
          <Link
            to="/products"
            className="inline-block bg-primary-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-700 transition"
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

      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Success Header */}
          <div className="text-center mb-8">
            <div className="w-20 h-20 mx-auto mb-6 bg-green-100 rounded-full flex items-center justify-center">
              <FiCheckCircle className="w-10 h-10 text-green-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Order Confirmed!</h1>
            <p className="text-lg text-gray-600">
              Thank you for your order. We've received your payment and are preparing your items.
            </p>
          </div>

          {/* Order Details Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">Order Number</h3>
                <p className="text-lg font-semibold text-gray-900">{orderNumber}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">Order Date</h3>
                <p className="text-lg font-semibold text-gray-900">{orderDate}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">Total Amount</h3>
                <p className="text-lg font-semibold text-gray-900">{formatPrice(order.total || 0)}</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Order Items */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <FiPackage className="w-5 h-5" />
                Order Items
              </h2>

              <div className="space-y-4">
                {items.map((item, index) => {
                  // Get the best available image for the item
                  const itemImage = item.image || getProductImage(item);

                  return (
                    <div key={item.productId || index} className="flex gap-4 p-4 bg-gray-50 rounded-lg">
                      <div className="w-16 h-16 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
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
                        <h3 className="font-medium text-gray-900 truncate">{item.title || 'Custom Product'}</h3>
                        <p className="text-sm text-gray-500">
                          {item.brand && item.model ? `${item.brand} • ${item.model}` : 'Custom Design'}
                          {item.material && ` • ${item.material}`}
                        </p>
                        {(item.color || item.variant) && (
                          <p className="text-xs text-gray-400 mt-1">
                            Color: {item.color || (item.variant && (item.variant.name || item.variant.color)) || 'Default'}
                          </p>
                        )}
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-sm text-gray-600">Qty: {item.quantity || 1}</span>
                          <span className="font-semibold text-gray-900">
                            {formatPrice((item.price || 0) * (item.quantity || 1))}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="border-t pt-4 mt-4">
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Subtotal</span>
                  <span>{formatPrice(order.subtotal || order.total || 0)}</span>
                </div>
                {(order.shipping || 0) > 0 && (
                  <div className="flex justify-between text-sm text-gray-600 mt-1">
                    <span>Shipping</span>
                    <span>{formatPrice(order.shipping || 0)}</span>
                  </div>
                )}
                <div className="flex justify-between font-semibold text-lg text-gray-900 mt-2 pt-2 border-t">
                  <span>Total</span>
                  <span>{formatPrice(order.total || 0)}</span>
                </div>
              </div>
            </div>

            {/* Shipping & Payment Info */}
            <div className="space-y-6">
              {/* Shipping Address */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <FiMapPin className="w-5 h-5" />
                  Shipping Address
                </h2>

                <div className="text-gray-700">
                  <p className="font-medium">{shippingAddress.name}</p>
                  <p>{shippingAddress.phone}</p>
                  <p className="mt-2">
                    {shippingAddress.address1}
                    {shippingAddress.address2 && `, ${shippingAddress.address2}`}
                  </p>
                  <p>
                    {shippingAddress.city}, {shippingAddress.state} {shippingAddress.postalCode}
                  </p>
                  <p>{shippingAddress.country || 'India'}</p>
                </div>
              </div>

              {/* Payment Info */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <FiCreditCard className="w-5 h-5" />
                  Payment Information
                </h2>

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Payment Method</span>
                    <span className="font-medium capitalize">{paymentMethod}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Payment Status</span>
                    <span className="font-medium text-green-600">Paid</span>
                  </div>
                  {order.paymentId && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Transaction ID</span>
                      <span className="font-mono text-sm text-gray-800">{order.paymentId}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Order Status */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <FiTruck className="w-5 h-5" />
                  Order Status
                </h2>

                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <FiCheckCircle className="w-4 h-4 text-green-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Order Confirmed</p>
                      <p className="text-sm text-gray-600">Your order has been received and confirmed</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <FiPackage className="w-4 h-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Processing</p>
                      <p className="text-sm text-gray-600">We're preparing your custom mobile covers</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 opacity-50">
                    <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                      <FiTruck className="w-4 h-4 text-gray-400" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-500">Shipped</p>
                      <p className="text-sm text-gray-500">Expected within 24-48 hours</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/orders"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 transition"
            >
              <FiEye className="w-5 h-5" />
              View All Orders
            </Link>

            <Link
              to="/products"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white text-gray-900 border border-gray-300 rounded-lg font-semibold hover:bg-gray-50 transition"
            >
              <FiShoppingBag className="w-5 h-5" />
              Continue Shopping
            </Link>
          </div>

          {/* Additional Info */}
          <div className="mt-8 bg-blue-50 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-blue-900 mb-2">What's Next?</h3>
            <ul className="text-blue-800 space-y-1">
              <li>• You'll receive an email confirmation with order details</li>
              <li>• Our design team will start working on your custom covers</li>
              <li>• We'll send you a WhatsApp preview for approval within 24 hours</li>
              <li>• Once approved, your order will be printed and shipped</li>
              <li>• Track your order status in your account dashboard</li>
            </ul>
          </div>

          {/* Support Info */}
          <div className="mt-6 text-center text-gray-600">
            <p>Need help? Contact us at <a href="https://wa.me/7827205492" className="text-primary-600 hover:text-primary-700">WhatsApp</a> or email support@coverghar.in</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default OrderSuccess;
