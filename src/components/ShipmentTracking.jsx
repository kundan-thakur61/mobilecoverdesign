import { useEffect, useMemo, useState } from 'react';
import { trackShipment } from '../api/shiprocket';


const STATUS_STEPS = [
  { key: 'placed', label: 'Order Placed' },
  { key: 'confirmed', label: 'Confirmed' },
  { key: 'processing', label: 'Processing' },
  { key: 'shipped', label: 'Shipped' },
  { key: 'delivered', label: 'Delivered' }
];

const formatDate = (value) => {
  if (!value) return null;
  try {
    return new Date(value).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch (err) {
    return null;
  }
};

const deriveStepIndex = (statusText) => {
  const text = statusText?.toLowerCase?.() || '';
  if (text.includes('deliver')) return 4;
  if (text.includes('ship')) return 3;
  if (text.includes('process') || text.includes('pickup') || text.includes('dispatch')) return 2;
  if (text.includes('confirm') || text.includes('accept')) return 1;
  return 0;
};

export default function ShipmentTracking({ orderId, orderType = 'regular', awbCode, courierName }) {
  const [trackingData, setTrackingData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (orderId && awbCode) {
      fetchTracking();
    }
  }, [orderId, awbCode]);

  const fetchTracking = async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await trackShipment(orderId, orderType);
      if (result.success) {
        setTrackingData(result.data);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch tracking data');
    } finally {
      setLoading(false);
    }
  };

  const shipmentEvents = useMemo(() => trackingData?.shipmentTrack || [], [trackingData]);
  const latestUpdate = useMemo(() => {
    if (shipmentEvents[0]?.date) return shipmentEvents[0].date;
    return trackingData?.updatedAt || null;
  }, [shipmentEvents, trackingData?.updatedAt]);
  const currentStatus = trackingData?.currentStatus || trackingData?.status || (awbCode ? 'Fetching latest updates' : '');
  const activeStep = deriveStepIndex(currentStatus);

  if (!awbCode) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <p className="text-yellow-800">📦 Shipment is being prepared. Tracking will be available once the courier is assigned.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border p-6 space-y-4">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-200 rounded w-1/3"></div>
          <div className="h-6 bg-gray-100 rounded"></div>
          <div className="h-32 bg-gray-100 rounded"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <span className="text-red-500" aria-hidden>⚠️</span>
          <div className="flex-1">
            <p className="text-red-800 text-sm">{error}</p>
            <button onClick={fetchTracking} className="mt-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border p-5 space-y-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div>
          <p className="text-sm text-gray-500">Shipment Tracking</p>
          <p className="text-xl font-semibold text-gray-900">{currentStatus || 'Tracking updates'}</p>
          {latestUpdate && <p className="text-xs text-gray-500">Updated {formatDate(latestUpdate)}</p>}
        </div>
        <div className="flex flex-wrap gap-2">
          <button onClick={fetchTracking} className="px-4 py-2 text-sm border rounded-lg hover:bg-gray-50">Refresh</button>
          {awbCode && (
            <a
              href={`https://shiprocket.co/tracking/${awbCode}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Track on Courier
            </a>
          )}
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-3">
        <div className="p-4 rounded-lg bg-gray-50 border">
          <p className="text-xs text-gray-500">AWB Code</p>
          <p className="text-sm font-semibold text-gray-900 mt-1">{awbCode || trackingData?.awbCode || '—'}</p>
        </div>
        <div className="p-4 rounded-lg bg-gray-50 border">
          <p className="text-xs text-gray-500">Courier Partner</p>
          <p className="text-sm font-semibold text-gray-900 mt-1">{courierName || trackingData?.courierName || '—'}</p>
        </div>
        <div className="p-4 rounded-lg bg-gray-50 border">
          <p className="text-xs text-gray-500">Last Update</p>
          <p className="text-sm font-semibold text-gray-900 mt-1">{formatDate(latestUpdate) || 'Pending'}</p>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <p className="text-sm font-semibold text-gray-900">Shipment Progress</p>
          <p className="text-xs text-gray-500 capitalize">Current status: {currentStatus || 'pending'}</p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {STATUS_STEPS.map((step, idx) => {
            const isDone = idx <= activeStep;
            return (
              <div key={step.key} className="text-center">
                <div className={`w-12 h-12 mx-auto rounded-full flex items-center justify-center text-sm font-semibold ${isDone ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-400'}`}>
                  {isDone ? '✓' : idx + 1}
                </div>
                <div className="mt-2 text-sm font-medium text-gray-900">{step.label}</div>
              </div>
            );
          })}
        </div>
      </div>

      {shipmentEvents.length > 0 ? (
        <div className="space-y-4">
          <p className="text-sm font-semibold text-gray-900">Tracking History</p>
          <div className="space-y-4">
            {shipmentEvents.map((track, index) => (
              <div key={`${track.date || index}-${index}`} className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className={`w-4 h-4 rounded-full ${index === 0 ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                  {index < shipmentEvents.length - 1 && <div className="w-0.5 flex-1 bg-gray-300"></div>}
                </div>
                <div className="flex-1">
                  <div className="bg-gray-50 border rounded-lg p-4">
                    <p className="font-semibold text-gray-900">{track.status || track.activity || 'Update'}</p>
                    {track.location && <p className="text-sm text-gray-600 mt-1">📍 {track.location}</p>}
                    {track.date && <p className="text-xs text-gray-500 mt-2">{formatDate(track.date)}</p>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="rounded-lg border border-dashed border-gray-200 p-6 bg-gray-50 text-center">
          <p className="text-gray-700 font-medium">No tracking updates available yet</p>
          <p className="text-sm text-gray-500 mt-1">Please check back later</p>
        </div>
      )}
    </div>
  );
}

