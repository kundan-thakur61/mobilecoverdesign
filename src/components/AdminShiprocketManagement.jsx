import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import * as shiprocketAPI from '../api/shiprocket';

/**
 * Admin Shiprocket Management Component
 * Manage shipments for orders
 */
export default function AdminShiprocketManagement({ orderId, orderType = 'regular', order, onUpdate }) {
  const [loading, setLoading] = useState(false);
  const [shipmentData, setShipmentData] = useState(order?.shiprocket || null);
  const [couriers, setCouriers] = useState([]);
  const [selectedCourier, setSelectedCourier] = useState(null);
  const [showCourierSelection, setShowCourierSelection] = useState(false);

  // Update shipmentData when order prop changes
  useEffect(() => {
    setShipmentData(order?.shiprocket || null);
  }, [order?.shiprocket]);

  // Get recommended couriers
  const handleGetCouriers = async (skipShipmentCreation = false) => {
    if (loading && !skipShipmentCreation) return;

    try {
      setLoading(true);
      const result = await shiprocketAPI.getRecommendedCouriers(orderId, orderType);

      if (result.success && result.data.couriers) {
        setCouriers(result.data.couriers);
        setShipmentData(prev => ({ ...prev, shipmentId: result.data.shipmentId }));
        setShowCourierSelection(true);
        toast.success(`Found ${result.data.couriers.length} available couriers`);
      }
    } catch (error) {
      if (error.response?.status === 400 && error.response?.data?.message === 'Shipment not created yet' && !skipShipmentCreation) {
        toast.error('Please create shipment first using "Create Shipment" button');
      } else {
        toast.error(error.response?.data?.message || 'Failed to fetch couriers');
        console.error('Get couriers error:', error);
      }
    } finally {
      setLoading(false);
    }
  };

  // Create shipment
  const handleCreateShipment = async () => {
    if (loading) return;
    
    if (shipmentData?.shipmentId) {
      toast.info('Shipment already created for this order');
      return;
    }

    try {
      setLoading(true);
      const result = await shiprocketAPI.createShipment(orderId, orderType, {
        pickupLocationId: 19334183,
        dimensions: { length: 17, breadth: 4, height: 2 },
        weight: 0.15
      });

      if (result.success) {
        setShipmentData(result.data);
        toast.success('Shipment created successfully!');

        toast.info('Fetching available couriers...');
        await new Promise(resolve => setTimeout(resolve, 3000));
        await handleGetCouriers(true);

        if (onUpdate) onUpdate();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create shipment');
      console.error('Create shipment error:', error);
    } finally {
      setLoading(false);
    }
  };

  // Assign courier
  const handleAssignCourier = async (courierId = null) => {
    if (loading) return;
    
    // If no courierId is provided, auto-select the cheapest courier
    let finalCourierId = courierId;
    if (!finalCourierId && couriers.length > 0) {
      // Sort couriers by freight cost and select the cheapest
      const cheapestCourier = [...couriers].sort((a, b) => a.freight - b.freight)[0];
      finalCourierId = cheapestCourier.id;
      toast.info(`Auto-selected cheapest courier: ${cheapestCourier.name} (₹${cheapestCourier.freight})`);
    }
    
    if (!finalCourierId) {
      toast.error('No courier selected. Please get available couriers first.');
      return;
    }
    
    try {
      setLoading(true);
      const result = await shiprocketAPI.assignCourier(orderId, orderType, finalCourierId);

      if (result.success) {
        toast.success(`Courier assigned! AWB: ${result.data.awbCode}`);
        setShowCourierSelection(false);
        if (onUpdate) onUpdate();
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to assign courier';
      toast.error(message);
      console.error('Assign courier error:', error);
    } finally {
      setLoading(false);
    }
  };

  // Request pickup
  const handleRequestPickup = async () => {
    if (loading) return;
    
    try {
      setLoading(true);
      const result = await shiprocketAPI.requestPickup(orderId, orderType);

      if (result.success) {
        toast.success('Pickup requested successfully!');
        if (onUpdate) onUpdate();
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to request pickup';
      toast.error(message);
      console.error('Request pickup error:', error);
    } finally {
      setLoading(false);
    }
  };

  // Generate label
  const handleGenerateLabel = async () => {
    if (loading) return;
    
    try {
      setLoading(true);
      const result = await shiprocketAPI.generateLabel(orderId, orderType);

      if (result.success && result.data.labelUrl) {
        window.open(result.data.labelUrl, '_blank');
        toast.success('Label generated! Opening in new tab...');
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to generate label';
      toast.error(message);
      console.error('Generate label error:', error);
    } finally {
      setLoading(false);
    }
  };

  // Cancel shipment
  const handleCancelShipment = async () => {
    if (!confirm('Are you sure you want to cancel this shipment?')) return;

    try {
      setLoading(true);
      const result = await shiprocketAPI.cancelShipment(orderId, orderType);

      if (result.success) {
        toast.success('Shipment cancelled successfully');
        setShipmentData(null); // Clear shipment data on cancel
        if (onUpdate) onUpdate();
      }
    } catch (error) {
      // For cancel shipment, if shipment not created, just show the error
      // (doesn't make sense to create shipment just to cancel it)
      toast.error(error.response?.data?.message || 'Failed to cancel shipment');
      console.error('Cancel shipment error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6 mt-4">
      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <span className="text-2xl">🚚</span>
        <span>Shiprocket Management</span>
      </h3>

      {/* Existing Shipment Status */}
      {shipmentData?.shipmentId && (
        <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-green-600">✅</span>
            <span className="font-semibold text-green-800">Shipment Created</span>
          </div>
          <div className="text-sm text-green-700">
            <p><strong>ID:</strong> {shipmentData.shipmentId}</p>
            {shipmentData.awbCode && <p><strong>AWB:</strong> {shipmentData.awbCode}</p>}
            {shipmentData.courierName && <p><strong>Courier:</strong> {shipmentData.courierName}</p>}
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {!shipmentData?.shipmentId && (
          <button
            onClick={handleCreateShipment}
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition flex items-center justify-center gap-2"
          >
            {loading ? (
              <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
            ) : '📦'}
            Create Shipment
          </button>
        )}

        {shipmentData?.shipmentId && !shipmentData?.awbCode && (
          <button
            onClick={() => handleAssignCourier()}
            disabled={loading}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition flex items-center justify-center gap-2"
          >
            {loading ? (
              <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
            ) : '🚚'}
            Auto-Assign Courier
          </button>
        )}

        {shipmentData?.shipmentId && (
          <>
            <button
              onClick={handleGenerateLabel}
              disabled={loading}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 transition flex items-center justify-center gap-2"
            >
              {loading ? (
                <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
              ) : '🏷️'}
              Generate Label
            </button>

            <button
              onClick={handleRequestPickup}
              disabled={loading}
              className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:opacity-50 transition flex items-center justify-center gap-2"
            >
              {loading ? (
                <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
              ) : '🚛'}
              Request Pickup
            </button>

            <button
              onClick={handleCancelShipment}
              disabled={loading}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 transition flex items-center justify-center gap-2 col-span-1 sm:col-span-2"
            >
              {loading ? (
                <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
              ) : '❌'}
              Cancel Shipment
            </button>
          </>
        )}
      </div>

      {/* Workflow Instructions */}
      <div className="mt-6 p-4 bg-gray-50 rounded-lg text-sm text-gray-600">
        <p className="font-semibold mb-2">Workflow:</p>
        <ol className="list-decimal list-inside space-y-1">
          <li className={shipmentData?.shipmentId ? 'line-through text-green-600' : ''}>
            Create Shipment in Shiprocket
          </li>
          <li className={!shipmentData?.shipmentId ? 'text-gray-400' : shipmentData?.awbCode ? 'line-through text-green-600' : ''}>
            Auto-assign cheapest courier OR select manually
          </li>
          <li className={!shipmentData?.shipmentId ? 'text-gray-400' : ''}>
            Generate shipping label (optional)
          </li>
          <li className={!shipmentData?.shipmentId ? 'text-gray-400' : ''}>
            Request pickup from courier
          </li>
        </ol>
        {shipmentData?.shipmentId && (
          <p className="mt-2 text-green-600 font-medium">
            ✅ Shipment is ready for processing!
          </p>
        )}
      </div>
    </div>
  );
}