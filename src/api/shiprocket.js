import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:4000';

/**
 * Shiprocket API Service
 * Frontend service for interacting with Shiprocket endpoints
 */

// Get auth token from localStorage
const getAuthToken = () => {
  const token = localStorage.getItem('token');
  return token ? `Bearer ${token}` : null;
};

// Create axios instance with auth
const createAuthConfig = () => ({
  headers: {
    Authorization: getAuthToken(),
    'Content-Type': 'application/json'
  }
});

/**
 * Public Endpoints
 */

// Track shipment
export const trackShipment = async (orderId, orderType = 'regular') => {
  const response = await axios.get(
    `${API_BASE_URL}/api/shiprocket/track/${orderId}?orderType=${orderType}`,
    createAuthConfig()
  );
  return response.data;
};

// Check serviceability
export const checkServiceability = async (pickupPincode, deliveryPincode, weight = 0.5, cod = 0) => {
  const response = await axios.get(
    `${API_BASE_URL}/api/shiprocket/check-serviceability`,
    {
      params: { pickupPincode, deliveryPincode, weight, cod }
    }
  );
  return response.data;
};

/**
 * Admin Endpoints
 */

// Create shipment
export const createShipment = async (orderId, orderType = 'regular', options = {}) => {
  const response = await axios.post(
    `${API_BASE_URL}/api/shiprocket/create-shipment`,
    {
      orderId,
      orderType,
      ...options
    },
    createAuthConfig()
  );
  return response.data;
};

// Assign courier
export const assignCourier = async (orderId, orderType = 'regular', courierId = null) => {
  const response = await axios.post(
    `${API_BASE_URL}/api/shiprocket/assign-courier`,
    {
      orderId,
      orderType,
      courierId
    },
    createAuthConfig()
  );
  return response.data;
};

// Get recommended couriers
export const getRecommendedCouriers = async (orderId, orderType = 'regular') => {
  const response = await axios.get(
    `${API_BASE_URL}/api/shiprocket/recommended-couriers/${orderId}?orderType=${orderType}`,
    createAuthConfig()
  );
  return response.data;
};

// Request pickup
export const requestPickup = async (orderId, orderType = 'regular', options = {}) => {
  const response = await axios.post(
    `${API_BASE_URL}/api/shiprocket/request-pickup`,
    {
      orderId,
      orderType,
      pickupDate: options.pickupDate,
      pickupTimeFrom: options.pickupTimeFrom,
      pickupTimeTo: options.pickupTimeTo
    },
    createAuthConfig()
  );
  return response.data;
};

// Cancel shipment
export const cancelShipment = async (orderId, orderType = 'regular') => {
  const response = await axios.post(
    `${API_BASE_URL}/api/shiprocket/cancel-shipment`,
    {
      orderId,
      orderType
    },
    createAuthConfig()
  );
  return response.data;
};

// Generate label
export const generateLabel = async (orderIds, orderType = 'regular') => {
  // Ensure orderIds is an array
  const ids = Array.isArray(orderIds) ? orderIds : [orderIds];
  
  const response = await axios.post(
    `${API_BASE_URL}/api/shiprocket/generate-label`,
    {
      orderIds: ids,
      orderType
    },
    createAuthConfig()
  );
  return response.data;
};

// Get pickup locations
export const getPickupLocations = async () => {
  const response = await axios.get(
    `${API_BASE_URL}/api/shiprocket/pickup-locations`,
    createAuthConfig()
  );
  return response.data;
};

export default {
  trackShipment,
  checkServiceability,
  createShipment,
  assignCourier,
  getRecommendedCouriers,
  requestPickup,
  cancelShipment,
  generateLabel,
  getPickupLocations
};