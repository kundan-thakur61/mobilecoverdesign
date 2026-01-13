import React, { useCallback, useEffect, useMemo, useState } from "react";
import PropTypes from "prop-types";
import { Helmet } from "react-helmet-async";
import { formatPrice } from "../utils/helpers";
import { io } from "socket.io-client";

/* ---------------------------
   Small presentational pieces
   --------------------------- */
const ProductItem = ({ item }) => {
  const [imageSrc, setImageSrc] = useState(item.image || "/placeholder-image.svg");

  const handleImageError = () => {
    setImageSrc("/placeholder-image.svg");
  };

  // Generate descriptive alt text
  const altText = `${item.title || 'Product'} - ${item.brand || 'Mobile'} ${item.model || 'Cover'}`;

  return (
    <div className="flex flex-col sm:flex-row sm:items-center space-y-3 sm:space-y-0 sm:space-x-4 border-b pb-4 last:border-b-0">
      <img
        src={imageSrc}
        alt={altText}
        className="w-20 h-20 sm:w-16 sm:h-16 object-cover rounded mx-auto sm:mx-0"
        loading="lazy"
        width="80"
        height="80"
        onError={handleImageError}
      />
      <div className="flex-1 text-center sm:text-left">
        <h4 className="font-medium text-gray-900">{item.title}</h4>
        <p className="text-sm text-gray-600 mt-1">
          <span className="inline-flex items-center gap-1">
            <span className="font-medium">Size:</span> {item.model || "Standard"}
          </span>
          {" • "}
          <span className="inline-flex items-center gap-1">
            <span className="font-medium">Color:</span> {item.color || "Default"}
          </span>
          {item.brand && (
            <>
              {" • "}
              <span className="inline-flex items-center gap-1">
                <span className="font-medium">Brand:</span> {item.brand}
              </span>
            </>
          )}
        </p>
        <p className="text-sm font-semibold text-gray-900 mt-2">
          {formatPrice(item.price)} × {item.quantity} = {formatPrice(item.price * item.quantity)}
        </p>
      </div>
    </div>
  );
};

ProductItem.propTypes = {
  item: PropTypes.shape({
    id: PropTypes.string,
    title: PropTypes.string,
    image: PropTypes.string,
    model: PropTypes.string,
    color: PropTypes.string,
    brand: PropTypes.string,
    price: PropTypes.number,
    quantity: PropTypes.number,
  }).isRequired,
};

const TimelineStep = ({ index, step, isCompleted, isCurrent, formatDate }) => (
  <div className="flex items-start space-x-4">
    <div className="flex flex-col items-center">
      <div
        className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
          isCompleted ? "bg-green-500 text-white shadow-lg" : "bg-gray-200 text-gray-500"
        } ${isCurrent ? "ring-4 ring-green-200 scale-110" : ""}`}
        role="img"
        aria-label={`${isCompleted ? 'Completed: ' : ''}${step.label}`}
      >
        {isCompleted ? (
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
            <path
              fillRule="evenodd"
              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
              clipRule="evenodd"
            />
          </svg>
        ) : (
          <span className="text-sm font-medium">{index + 1}</span>
        )}
      </div>

      {index < 3 && (
        <div 
          className={`w-0.5 h-8 mt-2 transition-all duration-300 ${
            isCompleted ? "bg-green-500" : "bg-gray-200"
          }`}
          aria-hidden="true"
        />
      )}
    </div>

    <div className="flex-1 pb-8">
      <div className="flex items-center gap-2 mb-1">
        <p className={`font-semibold ${isCompleted ? "text-green-600" : "text-gray-500"}`}>
          {step.label}
        </p>
        {isCurrent && (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 animate-pulse">
            Current Status
          </span>
        )}
      </div>

      <p className="text-sm text-gray-600 mt-1">{step.description}</p>
      {step.date && (
        <p className="text-sm text-gray-500 mt-2 flex items-center gap-1">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {formatDate(step.date)}
        </p>
      )}
    </div>
  </div>
);

TimelineStep.propTypes = {
  index: PropTypes.number.isRequired,
  step: PropTypes.object.isRequired,
  isCompleted: PropTypes.bool.isRequired,
  isCurrent: PropTypes.bool.isRequired,
  formatDate: PropTypes.func.isRequired,
};

/* ---------------------------
   Main component
   --------------------------- */
function OrderTracking({ order, onCancel, onChat }) {
  // local state
  const [trackingData, setTrackingData] = useState(order);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // keep local tracking data in sync when prop changes
  useEffect(() => {
    setTrackingData(order);
  }, [order]);

  // Real-time updates via socket.io
  useEffect(() => {
    if (!order?._id) return;
    
    const sock = io(import.meta.env.VITE_BACKEND_URL || 'http://localhost:4000', {
      transports: ['websocket', 'polling'],
    });

    sock.emit('joinOrderRoom', order._id);
    
    sock.on('orderStatusUpdate', (data) => {
      if (data.orderId === order._id) {
        setTrackingData((prev) => ({ 
          ...prev, 
          status: data.status, 
          trackingNumber: data.trackingNumber, 
          notes: data.notes,
          lastUpdated: new Date().toISOString()
        }));
      }
    });

    sock.on('connect_error', () => {
      console.warn('Socket connection failed, falling back to polling');
    });

    return () => {
      sock.emit('leaveOrderRoom', order._id);
      sock.disconnect();
    };
  }, [order?._id]);

  // derived timeline steps
  const steps = useMemo(
    () => [
      {
        label: "Order Confirmed",
        date: trackingData?.createdAt,
        status: "confirmed",
        description: "Your order has been confirmed and payment is verified. We're preparing your custom mobile cover.",
      },
      {
        label: "Shipped",
        date: trackingData?.shippedAt,
        status: "shipped",
        description: "Your order has been shipped and is on its way to your delivery address.",
      },
      {
        label: "Out For Delivery",
        date: trackingData?.outForDeliveryAt,
        status: "out_for_delivery",
        description: "Your order is out for delivery and will arrive at your doorstep soon.",
      },
      {
        label: "Delivered",
        date: trackingData?.deliveredAt || trackingData?.estimatedDelivery,
        status: "delivered",
        description: "Your order has been successfully delivered. Enjoy your new mobile cover!",
      },
    ],
    [trackingData]
  );

  // map status to index
  const getCurrentStepIndex = useCallback(() => {
    const s = trackingData?.status?.toLowerCase();
    switch (s) {
      case "confirmed":
      case "pending":
        return 0;
      case "processing":
      case "shipped":
        return 1;
      case "out_for_delivery":
        return 2;
      case "delivered":
        return 3;
      case "cancelled":
        return -1; // Special case
      default:
        return 0;
    }
  }, [trackingData?.status]);

  const currentStepIndex = getCurrentStepIndex();

  // safe date formatter
  const formatDate = useCallback((dateString) => {
    if (!dateString) return null;
    try {
      const d = new Date(dateString);
      if (isNaN(d.getTime())) return null;
      return d.toLocaleString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return null;
    }
  }, []);

  // refresh tracking data (simulated). Replace with real API call.
  const refreshTrackingData = useCallback(async () => {
    if (!trackingData?.id && !trackingData?._id) return;
    setIsRefreshing(true);
    setError(null);

    try {
      // Example: real API call would go here
      // const orderId = trackingData._id || trackingData.id;
      // const res = await fetch(`/api/orders/${orderId}/tracking`);
      // if (!res.ok) throw new Error('Failed to fetch tracking data');
      // const updated = await res.json();
      // setTrackingData(updated);

      // simulated update for demo
      await new Promise((r) => setTimeout(r, 1000));
      setTrackingData((prev) => ({ 
        ...prev, 
        lastUpdated: new Date().toISOString() 
      }));
    } catch (err) {
      setError("Failed to refresh tracking data. Please try again.");
      console.error('Tracking refresh error:', err);
    } finally {
      setIsRefreshing(false);
    }
  }, [trackingData?.id, trackingData?._id]);

  // auto-refresh for active orders
  useEffect(() => {
    if (!trackingData) return;
    const status = trackingData.status?.toLowerCase();
    if (["delivered", "cancelled"].includes(status)) return;

    const id = setInterval(refreshTrackingData, 30000); // Refresh every 30 seconds
    return () => clearInterval(id);
  }, [trackingData, refreshTrackingData]);

  // cancel handler
  const handleCancel = useCallback(async () => {
    const orderId = trackingData?._id || trackingData?.id;
    if (!orderId) return;
    
    const status = trackingData.status?.toLowerCase();
    if (status === "delivered" || status === "cancelled") return;

    const confirmCancel = window.confirm(
      "Are you sure you want to cancel this order? This action cannot be undone."
    );
    if (!confirmCancel) return;

    setIsLoading(true);
    setError(null);

    try {
      // If you have an API: 
      // await fetch(`/api/orders/${orderId}/cancel`, { method: 'POST' })
      await onCancel?.(orderId);
      
      // optimistic update
      setTrackingData((prev) => ({ 
        ...prev, 
        status: "cancelled",
        cancelledAt: new Date().toISOString()
      }));
    } catch (err) {
      setError("Failed to cancel order. Please try again or contact support.");
      console.error('Cancel order error:', err);
    } finally {
      setIsLoading(false);
    }
  }, [trackingData, onCancel]);

  const handleChat = useCallback(() => {
    const orderId = trackingData?._id || trackingData?.id;
    onChat?.(orderId);
  }, [trackingData, onChat]);

  // Calculate total
  const orderTotal = useMemo(() => {
    if (!trackingData?.items) return 0;
    return trackingData.items.reduce((sum, item) => 
      sum + (item.price * item.quantity), 0
    );
  }, [trackingData?.items]);

  // UI when no order
  if (!trackingData) {
    return (
      <>
        <Helmet>
          <meta name="robots" content="noindex, nofollow" />
        </Helmet>
        <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-sm border">
          <div className="text-center py-12">
            <svg className="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <p className="text-gray-500 text-lg">No order data available</p>
            <p className="text-gray-400 text-sm mt-2">The order information could not be found.</p>
          </div>
        </div>
      </>
    );
  }

  const orderId = trackingData._id || trackingData.id || "N/A";
  const isCancelled = trackingData.status?.toLowerCase() === "cancelled";

  return (
    <>
      {/* Block from search engines - private order page */}
      <Helmet>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <div className="max-w-4xl mx-auto p-4 sm:p-6 bg-white rounded-lg shadow-sm border">
        {/* Error Alert */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg animate-fade-in" role="alert">
            <div className="flex items-start">
              <svg className="w-5 h-5 text-red-400 mr-3 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
              <div className="flex-1">
                <p className="text-sm font-medium text-red-800">{error}</p>
              </div>
              <button 
                onClick={() => setError(null)} 
                className="ml-auto text-red-400 hover:text-red-600 transition-colors" 
                aria-label="Dismiss error"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>
          </div>
        )}

        {/* Cancelled Order Banner */}
        {isCancelled && (
          <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-r-lg">
            <div className="flex items-center">
              <svg className="w-6 h-6 text-red-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <div>
                <p className="font-semibold text-red-900">Order Cancelled</p>
                <p className="text-sm text-red-700">This order has been cancelled. If you have any questions, please contact support.</p>
              </div>
            </div>
          </div>
        )}

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 pb-6 border-b">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-1">
              Order #{orderId.slice(-8).toUpperCase()}
            </h1>
            <p className="text-sm text-gray-600">
              Track your mobile cover order status in real-time
            </p>
          </div>

          <button
            onClick={refreshTrackingData}
            disabled={isRefreshing}
            className="mt-3 sm:mt-0 flex items-center px-4 py-2 text-sm font-medium text-primary-600 hover:text-primary-700 hover:bg-primary-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Refresh tracking information"
          >
            <svg 
              className={`w-4 h-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`} 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            {isRefreshing ? "Refreshing..." : "Refresh Status"}
          </button>
        </div>

        {/* Order Details */}
        <section className="mb-8" aria-labelledby="order-details-heading">
          <h2 id="order-details-heading" className="text-lg font-semibold mb-4 flex items-center gap-2">
            <svg className="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            Order Items
          </h2>

          <div className="space-y-4 bg-gray-50 rounded-lg p-4">
            {(trackingData.items || []).map((itm, idx) => (
              <ProductItem key={itm.id || `item-${idx}`} item={itm} />
            ))}

            {/* Order Total */}
            <div className="pt-4 border-t border-gray-200 flex justify-between items-center">
              <span className="font-semibold text-gray-900">Order Total:</span>
              <span className="text-xl font-bold text-primary-600">
                {formatPrice(orderTotal)}
              </span>
            </div>
          </div>
        </section>

        {/* Timeline - only show if not cancelled */}
        {!isCancelled && (
          <section className="mb-8" aria-labelledby="tracking-heading">
            <h2 id="tracking-heading" className="text-lg font-semibold mb-6 flex items-center gap-2">
              <svg className="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
              </svg>
              Delivery Timeline
            </h2>

            <div className="space-y-6 pl-2">
              {steps.map((step, idx) => {
                const isCompleted = idx <= currentStepIndex;
                const isCurrent = idx === currentStepIndex;
                return (
                  <TimelineStep
                    key={step.status}
                    index={idx}
                    step={step}
                    isCompleted={isCompleted}
                    isCurrent={isCurrent}
                    formatDate={formatDate}
                  />
                );
              })}
            </div>
          </section>
        )}

        {/* Tracking Number */}
        {trackingData.trackingNumber && (
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-900">Tracking Number</p>
                <p className="text-lg font-mono font-bold text-blue-700 mt-1">
                  {trackingData.trackingNumber}
                </p>
              </div>
              <button
                onClick={() => navigator.clipboard.writeText(trackingData.trackingNumber)}
                className="px-3 py-2 text-sm text-blue-600 hover:text-blue-700 hover:bg-blue-100 rounded-lg transition-colors"
                aria-label="Copy tracking number"
              >
                Copy
              </button>
            </div>
          </div>
        )}

        {/* Delivery Info Note */}
        {currentStepIndex < 2 && !isCancelled && (
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-start">
              <svg className="w-5 h-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                  clipRule="evenodd"
                />
              </svg>
              <div>
                <p className="text-sm font-medium text-blue-900">Delivery Information</p>
                <p className="text-sm text-blue-700 mt-1">
                  Delivery executive details will be available once your order is out for delivery. You'll receive SMS and email notifications with updates.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
          {!isCancelled && trackingData.status?.toLowerCase() !== "delivered" && (
            <button
              onClick={handleCancel}
              disabled={isLoading}
              className="flex-1 sm:flex-none inline-flex items-center justify-center bg-red-500 text-white px-6 py-3 rounded-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium shadow-sm"
              aria-label="Cancel this order"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Cancelling...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  Cancel Order
                </>
              )}
            </button>
          )}

          <button
            onClick={handleChat}
            className="flex-1 sm:flex-none inline-flex items-center justify-center bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-all duration-200 font-medium shadow-sm"
            aria-label="Chat with customer support"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            Chat with Support
          </button>
        </div>

        {/* Last Updated Footer */}
        {trackingData.lastUpdated && (
          <div className="mt-6 pt-6 border-t border-gray-200 text-center">
            <p className="text-xs text-gray-500 flex items-center justify-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Last updated: {formatDate(trackingData.lastUpdated)}
            </p>
          </div>
        )}
      </div>
    </>
  );
}

OrderTracking.propTypes = {
  order: PropTypes.shape({
    _id: PropTypes.string,
    id: PropTypes.string,
    status: PropTypes.string,
    items: PropTypes.arrayOf(PropTypes.object),
    createdAt: PropTypes.string,
    shippedAt: PropTypes.string,
    deliveredAt: PropTypes.string,
    outForDeliveryAt: PropTypes.string,
    estimatedDelivery: PropTypes.string,
    trackingNumber: PropTypes.string,
    lastUpdated: PropTypes.string,
  }),
  onCancel: PropTypes.func,
  onChat: PropTypes.func,
};

export default React.memo(OrderTracking);