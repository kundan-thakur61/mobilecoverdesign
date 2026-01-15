import { useState } from 'react';
import { FiPackage, FiSearch, FiTruck } from 'react-icons/fi';
import OrderTracking from '../components/OrderTracking';
import SEO from '../components/SEO';
import orderAPI from '../api/orderAPI';

const TrackOrder = () => {
  const [trackingId, setTrackingId] = useState('');
  const [searchType, setSearchType] = useState('orderId');
  const [orderData, setOrderData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searched, setSearched] = useState(false);

  const handleTrack = async (e) => {
    e.preventDefault();
    if (!trackingId.trim()) {
      setError('Please enter a tracking ID');
      return;
    }

    setLoading(true);
    setError(null);
    setOrderData(null);
    setSearched(true);

    try {
      const response = await orderAPI.trackOrder({
        type: searchType,
        id: trackingId.trim()
      });

      if (response.data.success) {
        setOrderData(response.data.order);
      } else {
        setError(response.data.message || 'Order not found');
      }
    } catch (err) {
      if (err.response?.status === 404) {
        setError('Order not found. Please check your tracking ID and try again.');
      } else {
        setError(err.response?.data?.message || 'Failed to track order. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setTrackingId('');
    setOrderData(null);
    setError(null);
    setSearched(false);
  };

  return (
    <>
      <SEO 
        title="Track Your Order - CoverGhar"
        description="Track your custom mobile cover order using AWB number, Order ID, or Shipment ID. Get real-time updates on your delivery status."
        keywords="track order, order tracking, delivery status, AWB tracking, shipment tracking"
      />
      
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className="p-4 bg-white rounded-full shadow-lg">
                <FiPackage className="w-12 h-12 text-purple-600" />
              </div>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
              Track Your Order
            </h1>
            <p className="text-gray-600 text-lg">
              Enter your tracking information to see the latest updates
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8 mb-8">
            <form onSubmit={handleTrack} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Tracking Type
                </label>
                <div className="grid grid-cols-3 gap-3">
                  <button
                    type="button"
                    onClick={() => setSearchType('orderId')}
                    className={`px-4 py-3 rounded-lg font-medium transition-all ${
                      searchType === 'orderId'
                        ? 'bg-purple-600 text-white shadow-md'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    Order ID
                  </button>
                  <button
                    type="button"
                    onClick={() => setSearchType('awb')}
                    className={`px-4 py-3 rounded-lg font-medium transition-all ${
                      searchType === 'awb'
                        ? 'bg-purple-600 text-white shadow-md'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    AWB Number
                  </button>
                  <button
                    type="button"
                    onClick={() => setSearchType('shipmentId')}
                    className={`px-4 py-3 rounded-lg font-medium transition-all ${
                      searchType === 'shipmentId'
                        ? 'bg-purple-600 text-white shadow-md'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    Shipment ID
                  </button>
                </div>
              </div>

              <div>
                <label htmlFor="trackingId" className="block text-sm font-medium text-gray-700 mb-2">
                  Enter {searchType === 'orderId' ? 'Order ID' : searchType === 'awb' ? 'AWB Number' : 'Shipment ID'}
                </label>
                <div className="relative">
                  <input
                    type="text"
                    id="trackingId"
                    value={trackingId}
                    onChange={(e) => setTrackingId(e.target.value)}
                    placeholder={`Enter your ${searchType === 'orderId' ? 'order ID' : searchType === 'awb' ? 'AWB number' : 'shipment ID'}`}
                    className="w-full px-4 py-3 pl-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                    disabled={loading}
                  />
                  <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                </div>
              </div>

              {error && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-start">
                  <svg className="w-5 h-5 text-red-400 mr-3 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  <p className="text-sm text-red-800">{error}</p>
                </div>
              )}

              <div className="flex gap-3">
                <button
                  type="submit"
                  disabled={loading || !trackingId.trim()}
                  className="flex-1 bg-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-purple-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Tracking...
                    </>
                  ) : (
                    <>
                      <FiTruck className="w-5 h-5" />
                      Track Order
                    </>
                  )}
                </button>
                {(orderData || searched) && (
                  <button
                    type="button"
                    onClick={handleReset}
                    className="px-6 py-3 border border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50 transition-all"
                  >
                    New Search
                  </button>
                )}
              </div>
            </form>
          </div>

          {orderData && (
            <div className="animate-fade-in">
              <OrderTracking order={orderData} />
            </div>
          )}

          {!orderData && searched && !loading && !error && (
            <div className="bg-white rounded-xl shadow-lg p-8 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiPackage className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No Order Found</h3>
              <p className="text-gray-600">
                We couldn't find an order with the provided tracking information.
                Please check your ID and try again.
              </p>
            </div>
          )}

          <div className="mt-8 bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">How to track your order?</h3>
            <div className="space-y-3 text-sm text-gray-600">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-6 h-6 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center font-semibold">
                  1
                </div>
                <p><strong>Order ID:</strong> You can find this in your order confirmation email or in your account's order history.</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-6 h-6 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center font-semibold">
                  2
                </div>
                <p><strong>AWB Number:</strong> This is the Air Waybill number provided by the courier company, usually sent via SMS or email once shipped.</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-6 h-6 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center font-semibold">
                  3
                </div>
                <p><strong>Shipment ID:</strong> This is the unique shipment identifier from our logistics partner.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default TrackOrder;
