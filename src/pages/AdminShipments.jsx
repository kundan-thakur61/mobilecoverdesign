import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import orderAPI from '../api/orderAPI';
import AdminShiprocketManagement from '../components/AdminShiprocketManagement';
import ShipmentTracking from '../components/ShipmentTracking';
import { toast } from 'react-toastify';
import { resolveImageUrl, getProductImage } from '../utils/helpers';

/**
 * Admin Shipments Management Page
 * 
 * Manage Shiprocket shipments for all orders
 */
export default function AdminShipments() {
  const { user } = useSelector((state) => state.auth);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [previewImage, setPreviewImage] = useState(null);
  const [downloadingOrder, setDownloadingOrder] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, [filter]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await orderAPI.getAllOrders({ status: filter !== 'all' ? filter : undefined });
      const ordersData = response.data?.data?.orders || response.data?.orders || [];
      console.log('Orders fetched:', ordersData);
      setOrders(ordersData);
    } catch (error) {
      toast.error('Failed to load orders');
      console.error('Load orders error:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800 border-yellow-300',
      confirmed: 'bg-blue-100 text-blue-800 border-blue-300',
      processing: 'bg-indigo-100 text-indigo-800 border-indigo-300',
      shipped: 'bg-purple-100 text-purple-800 border-purple-300',
      delivered: 'bg-green-100 text-green-800 border-green-300',
      cancelled: 'bg-red-100 text-red-800 border-red-300'
    };
    return colors[status] || 'bg-gray-100 text-gray-800 border-gray-300';
  };

  const getItemImage = (item) => {
    if (!item) return '/placeholder-image.svg';
    let productImage = '';

    if (item.image) {
      productImage = resolveImageUrl(item.image);
    }

    if (!productImage && item.productId && typeof item.productId === 'object') {
      const variants = item.productId.variants || [];
      let targetVariant = variants[0];

      if (item.variantId && variants.length > 1) {
        const found = variants.find(
          (variant) =>
            variant._id === item.variantId ||
            variant._id?.toString?.() === item.variantId?.toString?.()
        );
        if (found) targetVariant = found;
      }

      if (targetVariant?.images?.length) {
        const primaryImage = targetVariant.images.find((img) => img.isPrimary);
        const img = primaryImage || targetVariant.images[0];
        const rawUrl = img?.url || img?.secure_url || img?.path || img?.publicUrl || img?.secureUrl || img;
        productImage = resolveImageUrl(rawUrl);
      }
    }

    if (!productImage) {
      productImage =
        getProductImage(item.product || item) ||
        getProductImage({ variants: item.variants ? [{ images: item.images }] : [] });
    }

    return productImage || '/placeholder-image.svg';
  };

  const downloadOrderDetails = async (order) => {
    setDownloadingOrder(order._id);
    try {
      const orderDetails = `
ORDER DETAILS
═══════════════════════════════════════════════════════

Order ID: ${order._id}
Order Number: #${order._id.slice(-8).toUpperCase()}
Date: ${new Date(order.createdAt).toLocaleString()}
Status: ${order.status.toUpperCase()}

CUSTOMER INFORMATION
─────────────────────────────────────────────────────
Name: ${order.shippingAddress?.name}
Email: ${order.user?.email || 'N/A'}
Phone: ${order.shippingAddress?.phone}

SHIPPING ADDRESS
─────────────────────────────────────────────────────
${order.shippingAddress?.address1}
${order.shippingAddress?.address2 || ''}
${order.shippingAddress?.city}, ${order.shippingAddress?.state} - ${order.shippingAddress?.postalCode}
${order.shippingAddress?.country || 'India'}

ORDER ITEMS
─────────────────────────────────────────────────────
${order.items?.map((item, idx) => `
${idx + 1}. ${item.title}
   Brand: ${item.brand}
   Model: ${item.model}
   ${item.material ? `Material: ${item.material}` : ''}
   Price: ₹${item.price} × ${item.quantity} = ₹${(item.price * item.quantity).toFixed(2)}
`).join('\n')}

PAYMENT SUMMARY
─────────────────────────────────────────────────────
Subtotal: ₹${order.subtotal || order.total}
${order.discount ? `Discount: -₹${order.discount}` : ''}
${order.shippingCost ? `Shipping: ₹${order.shippingCost}` : ''}
─────────────────────────────────────────────────────
Total: ₹${order.total}
Payment Status: ${order.payment?.status || 'N/A'}
Payment Method: ${order.payment?.method || 'N/A'}

${order.shiprocket?.shipmentId ? `
SHIPMENT DETAILS
─────────────────────────────────────────────────────
Shipment ID: ${order.shiprocket.shipmentId}
AWB Code: ${order.shiprocket.awbCode || 'N/A'}
Courier: ${order.shiprocket.courierName || 'N/A'}
Status: ${order.shiprocket.status || 'N/A'}
` : ''}

═══════════════════════════════════════════════════════
Generated on: ${new Date().toLocaleString()}
      `.trim();

      const blob = new Blob([orderDetails], { type: 'text/plain' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `order-${order._id.slice(-8).toUpperCase()}-${Date.now()}.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      
      toast.success('Order details downloaded');
    } catch (error) {
      toast.error('Failed to download order details');
      console.error('Download error:', error);
    } finally {
      setDownloadingOrder(null);
    }
  };

  const filteredOrders = orders.filter(order => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      order._id.toLowerCase().includes(query) ||
      order.shippingAddress?.name?.toLowerCase().includes(query) ||
      order.shippingAddress?.phone?.includes(query) ||
      order.shiprocket?.awbCode?.toLowerCase().includes(query)
    );
  });

  if (user?.role !== 'admin') {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-red-50 border-2 border-red-200 rounded-xl p-8 text-center">
          <div className="text-6xl mb-4">🔒</div>
          <h2 className="text-2xl font-bold text-red-900 mb-2">Access Denied</h2>
          <p className="text-red-700">Admin privileges required to access this page</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <div className="text-5xl">🚚</div>
            <div>
              <h1 className="text-4xl font-bold text-gray-900">Shipment Management</h1>
              <p className="text-gray-600 mt-1">Manage and track all Shiprocket shipments</p>
            </div>
          </div>
          
          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
              <div className="text-2xl mb-1">📦</div>
              <div className="text-2xl font-bold text-gray-900">{orders.length}</div>
              <div className="text-sm text-gray-600">Total Orders</div>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
              <div className="text-2xl mb-1">🕐</div>
              <div className="text-2xl font-bold text-yellow-600">
                {orders.filter(o => o.status === 'pending').length}
              </div>
              <div className="text-sm text-gray-600">Pending</div>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
              <div className="text-2xl mb-1">🚀</div>
              <div className="text-2xl font-bold text-purple-600">
                {orders.filter(o => o.status === 'shipped').length}
              </div>
              <div className="text-sm text-gray-600">Shipped</div>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
              <div className="text-2xl mb-1">✅</div>
              <div className="text-2xl font-bold text-green-600">
                {orders.filter(o => o.status === 'delivered').length}
              </div>
              <div className="text-sm text-gray-600">Delivered</div>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          {/* Search Bar */}
          <div className="mb-4">
            <div className="relative">
              <input
                type="text"
                placeholder="🔍 Search by Order ID, Customer Name, Phone, or AWB Code..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-3 pl-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                🔍
              </div>
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          {/* Status Filters */}
          <div className="flex flex-wrap gap-2">
            {[
              { value: 'all', label: 'All Orders', icon: '📋' },
              { value: 'pending', label: 'Pending', icon: '🕐' },
              { value: 'confirmed', label: 'Confirmed', icon: '✓' },
              { value: 'processing', label: 'Processing', icon: '⚙️' },
              { value: 'shipped', label: 'Shipped', icon: '🚀' },
              { value: 'delivered', label: 'Delivered', icon: '✅' }
            ].map((status) => (
              <button
                key={status.value}
                onClick={() => setFilter(status.value)}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  filter === status.value
                    ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-md scale-105'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:shadow'
                }`}
              >
                <span className="mr-2">{status.icon}</span>
                {status.label}
              </button>
            ))}
          </div>
        </div>

        {/* Orders List */}
        {loading ? (
          <div className="text-center py-16">
            <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-gray-200 border-t-blue-600"></div>
            <p className="mt-4 text-gray-600 text-lg">Loading shipments...</p>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-16 text-center">
            <div className="text-6xl mb-4">📭</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">No Orders Found</h3>
            <p className="text-gray-600">
              {searchQuery ? 'Try adjusting your search query' : 'No orders match the selected filter'}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredOrders.map((order) => (
              <div
                key={order._id}
                className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
              >
                {/* Order Header */}
                <div
                  className="p-6 cursor-pointer hover:bg-gray-50 transition-colors"
                  onClick={() => setSelectedOrder(selectedOrder?._id === order._id ? null : order)}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-bold text-xl text-gray-900">
                          #{order._id.slice(-8).toUpperCase()}
                        </h3>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(order.status)}`}>
                          {order.status.toUpperCase()}
                        </span>
                      </div>
                      
                      <div className="grid md:grid-cols-3 gap-4 mt-3">
                        <div>
                          <p className="text-sm text-gray-500">Customer</p>
                          <p className="font-semibold text-gray-900">{order.shippingAddress?.name}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Order Value</p>
                          <p className="font-semibold text-gray-900">₹{order.total}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Items</p>
                          <p className="font-semibold text-gray-900">{order.items?.length || 0} item(s)</p>
                        </div>
                      </div>

                      {order.shiprocket?.awbCode && (
                        <div className="mt-3 flex items-center gap-2 text-sm">
                          <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-lg font-mono">
                            AWB: {order.shiprocket.awbCode}
                          </span>
                          {order.shiprocket.courierName && (
                            <span className="px-3 py-1 bg-purple-50 text-purple-700 rounded-lg">
                              {order.shiprocket.courierName}
                            </span>
                          )}
                        </div>
                      )}
                    </div>

                    <div className="flex flex-col gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          downloadOrderDetails(order);
                        }}
                        disabled={downloadingOrder === order._id}
                        className="px-4 py-2 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg hover:from-green-700 hover:to-green-800 transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                      >
                        {downloadingOrder === order._id ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                            <span>Downloading...</span>
                          </>
                        ) : (
                          <>
                            <span>📥</span>
                            <span>Download</span>
                          </>
                        )}
                      </button>
                      
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedOrder(selectedOrder?._id === order._id ? null : order);
                        }}
                        className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                      >
                        {selectedOrder?._id === order._id ? '▲ Collapse' : '▼ Expand'}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Expanded Details */}
                {selectedOrder?._id === order._id && (
                  <div className="border-t border-gray-200 p-6 space-y-6 bg-gradient-to-br from-gray-50 to-white">
                    {/* Shipping Address */}
                    <div className="bg-white rounded-lg p-5 shadow-sm border border-gray-200">
                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-2xl">📍</span>
                        <h4 className="font-bold text-lg text-gray-900">Shipping Address</h4>
                      </div>
                      <div className="pl-8 space-y-1 text-gray-700">
                        <p className="font-semibold">{order.shippingAddress?.name}</p>
                        <p>{order.shippingAddress?.address1}</p>
                        {order.shippingAddress?.address2 && <p>{order.shippingAddress.address2}</p>}
                        <p>
                          {order.shippingAddress?.city}, {order.shippingAddress?.state} - {order.shippingAddress?.postalCode}
                        </p>
                        <p>{order.shippingAddress?.country || 'India'}</p>
                        <p className="mt-2 flex items-center gap-2">
                          <span>📞</span>
                          <span className="font-semibold">{order.shippingAddress?.phone}</span>
                        </p>
                      </div>
                    </div>

                    {/* Order Items */}
                    <div className="bg-white rounded-lg p-5 shadow-sm border border-gray-200">
                      <div className="flex items-center gap-2 mb-4">
                        <span className="text-2xl">📦</span>
                        <h4 className="font-bold text-lg text-gray-900">Order Items</h4>
                      </div>
                      <div className="space-y-4">
                        {order.items && order.items.length > 0 ? (
                          order.items.map((item, index) => (
                            <div
                              key={index}
                              className="flex gap-4 p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
                            >
                              {/* Product Image with Preview */}
                              <div className="flex-shrink-0">
                                <img
                                  src={getItemImage(item)}
                                  alt={item.title || 'Product'}
                                  className="w-24 h-24 object-cover rounded-lg bg-gray-100 cursor-pointer hover:scale-105 transition-transform shadow-sm"
                                  onClick={() => setPreviewImage(getItemImage(item))}
                                  onError={(e) => {
                                    e.target.src = '/placeholder-image.svg';
                                  }}
                                />
                              </div>

                              {/* Product Details */}
                              <div className="flex-1">
                                <h5 className="font-semibold text-gray-900 text-lg">{item.title}</h5>
                                <div className="flex flex-wrap gap-2 mt-2">
                                  <span className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded">
                                    {item.brand}
                                  </span>
                                  <span className="px-2 py-1 bg-purple-50 text-purple-700 text-xs rounded">
                                    {item.model}
                                  </span>
                                  {item.material && (
                                    <span className="px-2 py-1 bg-green-50 text-green-700 text-xs rounded">
                                      {item.material}
                                    </span>
                                  )}
                                </div>
                                <div className="flex justify-between items-center mt-3">
                                  <p className="text-sm font-medium text-gray-700">
                                    ₹{item.price} × {item.quantity}
                                  </p>
                                  <p className="text-lg font-bold text-blue-600">
                                    ₹{(item.price * item.quantity).toFixed(2)}
                                  </p>
                                </div>
                              </div>
                            </div>
                          ))
                        ) : (
                          <p className="text-gray-500 text-center py-4">No items in this order</p>
                        )}
                      </div>
                    </div>

                    {/* Payment Summary */}
                    <div className="bg-white rounded-lg p-5 shadow-sm border border-gray-200">
                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-2xl">💳</span>
                        <h4 className="font-bold text-lg text-gray-900">Payment Summary</h4>
                      </div>
                      <div className="space-y-2 pl-8">
                        <div className="flex justify-between text-gray-700">
                          <span>Subtotal:</span>
                          <span className="font-semibold">₹{order.subtotal || order.total}</span>
                        </div>
                        {order.discount > 0 && (
                          <div className="flex justify-between text-green-600">
                            <span>Discount:</span>
                            <span className="font-semibold">-₹{order.discount}</span>
                          </div>
                        )}
                        {order.shippingCost > 0 && (
                          <div className="flex justify-between text-gray-700">
                            <span>Shipping:</span>
                            <span className="font-semibold">₹{order.shippingCost}</span>
                          </div>
                        )}
                        <div className="border-t pt-2 flex justify-between text-lg font-bold text-gray-900">
                          <span>Total:</span>
                          <span>₹{order.total}</span>
                        </div>
                        <div className="flex gap-2 mt-3">
                          <span className={`px-3 py-1 rounded-lg text-sm font-semibold ${
                            order.payment?.status === 'paid'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {order.payment?.status || 'pending'}
                          </span>
                          {order.payment?.method && (
                            <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-lg text-sm font-semibold">
                              {order.payment.method}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Shiprocket Details */}
                    {order.shiprocket?.shipmentId && (
                      <div className="bg-white rounded-lg p-5 shadow-sm border border-gray-200">
                        <div className="flex items-center gap-2 mb-3">
                          <span className="text-2xl">🚚</span>
                          <h4 className="font-bold text-lg text-gray-900">Shiprocket Details</h4>
                        </div>
                        <div className="grid md:grid-cols-2 gap-4 pl-8">
                          <div>
                            <p className="text-sm text-gray-500">Shipment ID</p>
                            <p className="font-semibold text-gray-900 font-mono">{order.shiprocket.shipmentId}</p>
                          </div>
                          {order.shiprocket.awbCode && (
                            <div>
                              <p className="text-sm text-gray-500">AWB Code</p>
                              <p className="font-semibold text-gray-900 font-mono">{order.shiprocket.awbCode}</p>
                            </div>
                          )}
                          {order.shiprocket.courierName && (
                            <div>
                              <p className="text-sm text-gray-500">Courier Partner</p>
                              <p className="font-semibold text-gray-900">{order.shiprocket.courierName}</p>
                            </div>
                          )}
                          {order.shiprocket.status && (
                            <div>
                              <p className="text-sm text-gray-500">Shipment Status</p>
                              <p className="font-semibold text-gray-900 capitalize">{order.shiprocket.status}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Tracking */}
                    {order.shiprocket?.awbCode && (
                      <ShipmentTracking
                        orderId={order._id}
                        orderType="regular"
                        awbCode={order.shiprocket.awbCode}
                        courierName={order.shiprocket.courierName}
                      />
                    )}

                    {/* Shiprocket Management */}
                    {order.payment?.status === 'paid' && (
                      <AdminShiprocketManagement
                        key={order._id}
                        orderId={order._id}
                        orderType="regular"
                        order={order}
                        onUpdate={fetchOrders}
                      />
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Image Preview Modal */}
      {previewImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4"
          onClick={() => setPreviewImage(null)}
        >
          <div className="relative max-w-4xl max-h-[90vh]">
            <button
              onClick={() => setPreviewImage(null)}
              className="absolute -top-12 right-0 text-white text-4xl hover:text-gray-300 transition-colors"
            >
              ✕
            </button>
            <img
              src={previewImage}
              alt="Product Preview"
              className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            />
            <div className="absolute bottom-4 right-4 flex gap-2">
              <a
                href={previewImage}
                download
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-lg"
                onClick={(e) => e.stopPropagation()}
              >
                📥 Download Image
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}