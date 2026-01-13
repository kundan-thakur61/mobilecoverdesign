import { useState } from 'react';
import { checkServiceability } from '../api/shiprocket';
import { toast } from 'react-toastify';

/**
 * Pincode Serviceability Checker
 * Allows users to check if delivery is available to their location
 */
export default function PincodeChecker({ onServiceableCheck }) {
  const [deliveryPincode, setDeliveryPincode] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleCheck = async (e) => {
    e.preventDefault();
    
    if (!deliveryPincode || deliveryPincode.length < 6) {
      toast.error('Please enter a valid 6-digit pincode');
      return;
    }

    try {
      setLoading(true);
      setResult(null);
      
      // Use a default pickup pincode (you can make this configurable)
      const pickupPincode = '400001'; // Mumbai default
      
      const response = await checkServiceability(
        pickupPincode,
        deliveryPincode,
        0.5, // default weight
        0    // prepaid
      );
      
      if (response.success) {
        setResult(response.data);
        
        if (response.data.serviceable) {
          toast.success('Delivery available to your location!');
          if (onServiceableCheck) {
            onServiceableCheck(true, response.data);
          }
        } else {
          toast.warning('Delivery not available to this pincode');
          if (onServiceableCheck) {
            onServiceableCheck(false, response.data);
          }
        }
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to check serviceability');
      console.error('Serviceability check error:', error);
      setResult({ serviceable: false, message: 'Unable to check serviceability' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg border p-4">
      <h4 className="font-semibold mb-3 flex items-center gap-2">
        <span>📍</span>
        Check Delivery Availability
      </h4>
      
      <form onSubmit={handleCheck} className="space-y-3">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Enter Your Pincode
          </label>
          <input
            type="text"
            value={deliveryPincode}
            onChange={(e) => setDeliveryPincode(e.target.value.replace(/\D/g, '').slice(0, 6))}
            placeholder="e.g., 110001"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            maxLength={6}
          />
        </div>
        
        <button
          type="submit"
          disabled={loading || deliveryPincode.length !== 6}
          className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {loading ? '⏳ Checking...' : '✓ Check Availability'}
        </button>
      </form>

      {/* Result */}
      {result && (
        <div className={`mt-4 p-4 rounded-lg ${
          result.serviceable ? 'bg-green-50 border border-green-200' : 'bg-yellow-50 border border-yellow-200'
        }`}>
          <p className={`font-semibold ${
            result.serviceable ? 'text-green-800' : 'text-yellow-800'
          }`}>
            {result.message || (result.serviceable ? '✅ Delivery Available!' : '⚠️ Not Serviceable')}
          </p>
          
          {result.serviceable && result.couriers && result.couriers.length > 0 && (
            <div className="mt-3">
              <p className="text-sm text-gray-600 mb-2">
                {result.couriers.length} courier(s) available
              </p>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {result.couriers.slice(0, 3).map((courier, index) => (
                  <div key={index} className="bg-white p-2 rounded text-sm">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">{courier.courier_name || courier.name}</span>
                      <span className="text-gray-600">
                        ₹{courier.freight_charge || courier.freight} • {courier.estimated_delivery_days || courier.estimatedDeliveryDays}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
