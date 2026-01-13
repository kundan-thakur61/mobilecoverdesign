import axiosClient from './axiosClient';

/**
 * Payment API client for Razorpay integration
 * Provides methods for payment verification and status checking
 */
const paymentAPI = {
  /**
   * Verify payment after Razorpay checkout
   * @param {Object} paymentData - Payment verification data
   * @param {string} paymentData.orderId - Internal order ID
   * @param {string} paymentData.razorpayOrderId - Razorpay order ID
   * @param {string} paymentData.razorpayPaymentId - Razorpay payment ID
   * @param {string} paymentData.razorpaySignature - Razorpay signature
   * @param {string} [paymentData.orderType='regular'] - Order type (regular/custom)
   * @returns {Promise} API response
   */
  verifyPayment: (paymentData) => {
    return axiosClient.post('/payment/verify', paymentData);
  },

  /**
   * Get payment status for an order
   * @param {string} orderId - Order ID
   * @param {string} [orderType='regular'] - Order type (regular/custom)
   * @returns {Promise} API response with payment status
   */
  getPaymentStatus: (orderId, orderType = 'regular') => {
    return axiosClient.get(`/payment/status/${orderId}`, {
      params: { orderType }
    });
  },

  /**
   * Poll payment status until terminal state or timeout
   * @param {string} orderId - Order ID
   * @param {Object} [options] - Polling options
   * @param {string} [options.orderType='regular'] - Order type
   * @param {number} [options.interval=3000] - Polling interval in ms
   * @param {number} [options.timeout=60000] - Max polling duration in ms
   * @param {Function} [options.onStatus] - Callback for each status update
   * @returns {Promise} Final payment status
   */
  pollPaymentStatus: async (orderId, options = {}) => {
    const {
      orderType = 'regular',
      interval = 3000,
      timeout = 60000,
      onStatus = () => {}
    } = options;

    const startTime = Date.now();
    const terminalStates = ['paid', 'failed', 'refunded'];

    return new Promise((resolve, reject) => {
      const poll = async () => {
        try {
          const response = await paymentAPI.getPaymentStatus(orderId, orderType);
          const status = response.data?.data;
          
          onStatus(status);

          if (terminalStates.includes(status?.paymentStatus)) {
            resolve(status);
            return;
          }

          if (Date.now() - startTime >= timeout) {
            resolve(status); // Return last status on timeout
            return;
          }

          setTimeout(poll, interval);
        } catch (error) {
          if (Date.now() - startTime >= timeout) {
            reject(error);
          } else {
            setTimeout(poll, interval);
          }
        }
      };

      poll();
    });
  }
};

export default paymentAPI;
