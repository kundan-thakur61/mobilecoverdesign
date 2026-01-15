import { useState, useEffect, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { clearCart, loadCart } from '../redux/slices/cartSlice';
import { useAuth } from '../hooks/useAuth';
import orderAPI from '../api/orderAPI';
import paymentAPI from '../api/paymentAPI';
import authAPI from '../api/authAPI';
import SEO from '../components/SEO';
import { Helmet } from 'react-helmet-async';
import { formatPrice, getProductImage } from '../utils/helpers';
import { FiArrowLeft, FiLock, FiAlertCircle, FiCheck } from 'react-icons/fi';

const UPI_APPS = [
  { id: 'google_pay', label: 'Google Pay' },
  { id: 'phonepe', label: 'PhonePe' },
  { id: 'paytm', label: 'Paytm' },
  { id: 'bhim', label: 'BHIM' },
  { id: 'amazon_pay', label: 'Amazon Pay' },
];

const INDIAN_STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
  'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram',
  'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu',
  'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
  'Andaman and Nicobar Islands', 'Chandigarh', 'Dadra and Nagar Haveli and Daman and Diu',
  'Delhi', 'Jammu and Kashmir', 'Ladakh', 'Lakshadweep', 'Puducherry'
];

const Checkout = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useAuth();
  const cartItems = useSelector(state => state.cart.items);
  
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('razorpay');
  const [upiId, setUpiId] = useState('');
  const [selectedUpiApp, setSelectedUpiApp] = useState('');
  const [saveUpi, setSaveUpi] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});
  const [touched, setTouched] = useState({});

  // Shipping form state with empty initial values
  const [shipping, setShipping] = useState({
    name: '',
    phone: '',
    address1: '',
    address2: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'India'
  });

  // Load cart on mount
  useEffect(() => {
    dispatch(loadCart());
  }, [dispatch]);

  // Load saved shipping and UPI info if user is logged in
  useEffect(() => {
    if (user) {
      // Load saved shipping address from user profile or localStorage
      const savedShipping = localStorage.getItem('savedShipping');
      if (savedShipping) {
        try {
          const parsed = JSON.parse(savedShipping);
          setShipping(prev => ({ ...prev, ...parsed }));
        } catch (e) {
          console.debug('Could not parse saved shipping', e);
        }
      }

      // Load saved UPI if available
      const savedUpi = localStorage.getItem('savedUpi');
      const savedUpiApp = localStorage.getItem('savedUpiApp');
      if (savedUpi) setUpiId(savedUpi);
      if (savedUpiApp) setSelectedUpiApp(savedUpiApp);
    }
  }, [user]);

  // Real-time validation
  const validateField = (name, value) => {
    switch (name) {
      case 'name':
        if (!value.trim()) return 'Full name is required';
        if (value.trim().length < 2) return 'Name must be at least 2 characters';
        if (!/^[a-zA-Z\s]+$/.test(value)) return 'Name should only contain letters';
        return '';
      
      case 'phone':
        if (!value.trim()) return 'Phone number is required';
        if (!/^[6-9]\d{9}$/.test(value)) return 'Enter a valid 10-digit Indian mobile number';
        return '';
      
      case 'address1':
        if (!value.trim()) return 'Address is required';
        if (value.trim().length < 10) return 'Please enter a complete address';
        return '';
      
      case 'city':
        if (!value.trim()) return 'City is required';
        if (value.trim().length < 2) return 'Enter a valid city name';
        return '';
      
      case 'state':
        if (!value.trim()) return 'State is required';
        return '';
      
      case 'postalCode':
        if (!value.trim()) return 'Postal code is required';
        if (!/^\d{6}$/.test(value)) return 'Enter a valid 6-digit PIN code';
        return '';
      
      case 'upiId':
        if (paymentMethod === 'upi') {
          if (!value.trim()) return 'UPI ID is required';
          if (!/^[\w.-]+@[\w.-]+$/.test(value)) return 'Enter a valid UPI ID (e.g., name@upi)';
        }
        return '';
      
      default:
        return '';
    }
  };

  // Validate all fields
  const validateAllFields = () => {
    const errors = {};
    const fields = ['name', 'phone', 'address1', 'city', 'state', 'postalCode'];
    
    fields.forEach(field => {
      const error = validateField(field, shipping[field]);
      if (error) errors[field] = error;
    });

    if (paymentMethod === 'upi') {
      const upiError = validateField('upiId', upiId);
      if (upiError) errors.upiId = upiError;
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle input change with validation
  const handleInputChange = (field, value) => {
    setShipping(prev => ({ ...prev, [field]: value }));
    
    if (touched[field]) {
      const error = validateField(field, value);
      setValidationErrors(prev => ({
        ...prev,
        [field]: error
      }));
    }
  };

  // Handle UPI ID change with validation
  const handleUpiChange = (value) => {
    setUpiId(value);
    
    if (touched.upiId) {
      const error = validateField('upiId', value);
      setValidationErrors(prev => ({
        ...prev,
        upiId: error
      }));
    }
  };

  // Mark field as touched
  const handleBlur = (field) => {
    setTouched(prev => ({ ...prev, [field]: true }));
    
    const value = field === 'upiId' ? upiId : shipping[field];
    const error = validateField(field, value);
    
    setValidationErrors(prev => ({
      ...prev,
      [field]: error
    }));
  };

  // Calculate totals
  const { subtotal, shipping: shippingCost, tax, total } = useMemo(() => {
    const subtotal = cartItems?.reduce((sum, item) => {
      const price = Number(item.variant?.price || item.price) || 0;
      const quantity = Number(item.quantity) || 1;
      return sum + (price * quantity);
    }, 0) || 0;
    
    const shippingCost = subtotal > 500 ? 0 : 50; // Free shipping over ₹500
    const tax = 0; // GST calculation if needed
    const total = subtotal + shippingCost + tax;
    
    return { subtotal, shipping: shippingCost, tax, total };
  }, [cartItems]);

  // Extract and normalize cart items
  const normalizeCartItems = () => {
    const pickItemImage = (item) => {
      const sources = [
        item?.product?.design?.imgSrc,
        item?.product?.design?.image,
        item?.product?.images?.[0]?.url || item?.product?.images?.[0],
        item?.variant?.images?.[0]?.url || item?.variant?.images?.[0],
        item?.image,
      ];
      
      for (const s of sources) {
        const url = typeof s === 'string' ? s : null;
        if (url) return url;
      }
      return '';
    };

    return (cartItems || [])
      .map((item) => {
        const rawProductId = item.product && (item.product._id || item.product.id);
        if (!rawProductId) return null;
        
        const productId = String(rawProductId);
        const rawVariantId = item.variant && (item.variant._id || item.variant.id);
        const fallbackVariantId = productId.startsWith('custom_') ? `${productId}_variant` : null;
        const variantId = rawVariantId ? String(rawVariantId) : fallbackVariantId;
        
        if (!variantId) return null;
        
        const quantity = Math.max(1, Number(item.quantity) || 1);
        const price = Number(item.variant?.price ?? item.price ?? 0);
        const image = pickItemImage(item);

        const baseItem = {
          quantity,
          price,
        };

        if (image) {
          baseItem.image = image;
        }

        if (productId.startsWith('custom_')) {
          const designMeta = item.product?.design?.meta || null;
          baseItem.productId = productId;
          baseItem.variantId = variantId;
          baseItem.title = item.product?.title || 'Custom product';
          baseItem.brand = designMeta?.company || item.product?.brand;
          baseItem.model = designMeta?.model || item.product?.model;
          baseItem.material = designMeta?.material || item.variant?.name || item.variant?.color;
          baseItem.designMeta = designMeta;
        } else {
          baseItem.productId = productId;
          baseItem.variantId = variantId;
          baseItem.title = item.product?.title;
          baseItem.brand = item.product?.brand;
          baseItem.model = item.product?.model;
          baseItem.material = item.product?.design?.meta?.material || item.product?.material || item.variant?.name || item.variant?.color;
        }

        return baseItem;
      })
      .filter(Boolean);
  };

  // Load Razorpay script
  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      if (window.Razorpay) {
        resolve(true);
        return;
      }
      
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  // Handle Razorpay payment
  const handleRazorpayPayment = async (order, razorpayOrderId, keyId, amount, currency) => {
    const scriptLoaded = await loadRazorpayScript();
    
    if (!scriptLoaded) {
      toast.error('Failed to load payment gateway. Please refresh and try again.');
      return;
    }

    const options = {
      key: keyId,
      amount: amount,
      currency,
      order_id: razorpayOrderId,
      name: 'CopadMob',
      description: `Order #${order._id}`,
      image: '/logo.png', // Add your logo
      handler: async function (response) {
        try {
          await paymentAPI.verifyPayment({
            orderId: order._id || order.id,
            razorpayOrderId: razorpayOrderId,
            razorpayPaymentId: response.razorpay_payment_id,
            razorpaySignature: response.razorpay_signature,
          });
          
          dispatch(clearCart());
          localStorage.removeItem('savedShipping'); // Clear after successful order
          toast.success('Payment successful! Your order is confirmed.');
          navigate(`/order-success/${order._id}`);
        } catch (err) {
          console.error('Payment verification error:', err);
          
          // Fallback: Check payment status
          try {
            const status = await paymentAPI.getPaymentStatus(order._id);
            if (status.data?.data?.paymentStatus === 'paid') {
              dispatch(clearCart());
              toast.success('Payment verified successfully');
              navigate(`/order-success/${order._id}`);
              return;
            }
          } catch (statusErr) {
            console.debug('Status check failed:', statusErr);
          }
          
          toast.error('Payment verification failed. Please contact support with your order ID.');
        }
      },
      prefill: {
        name: shipping.name,
        contact: shipping.phone,
        ...(paymentMethod === 'upi' && upiId ? { vpa: upiId } : {})
      },
      notes: {
        platform: 'copadmob',
        ...(paymentMethod === 'upi' && selectedUpiApp ? { upiApp: selectedUpiApp } : {}),
      },
      theme: {
        color: '#3399cc'
      },
      modal: {
        ondismiss: function() {
          toast.info('Payment cancelled. Your order is saved and you can retry payment.');
        }
      }
    };

    const rzp = new window.Razorpay(options);
    rzp.on('payment.failed', function (response) {
      console.error('Payment failed:', response.error);
      toast.error(response.error.description || 'Payment failed. Please try again.');
    });
    
    rzp.open();
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate all fields
    if (!validateAllFields()) {
      toast.error('Please fix all errors before proceeding');
      // Mark all fields as touched to show errors
      const allFields = ['name', 'phone', 'address1', 'city', 'state', 'postalCode'];
      if (paymentMethod === 'upi') allFields.push('upiId');
      setTouched(Object.fromEntries(allFields.map(f => [f, true])));
      return;
    }

    if (!cartItems || cartItems.length === 0) {
      return toast.error('Your cart is empty');
    }

    setLoading(true);
    
    try {
      const normalizedItems = normalizeCartItems();

      if (!normalizedItems.length) {
        throw new Error('Cart items could not be processed. Please try again.');
      }

      // Save shipping info for future use
      if (user) {
        try {
          localStorage.setItem('savedShipping', JSON.stringify(shipping));
        } catch (e) {
          console.debug('Could not save shipping', e);
        }
      }

      const orderPayload = {
        items: normalizedItems,
        total,
        paymentMethod,
        shippingAddress: {
          name: shipping.name,
          phone: shipping.phone,
          address1: shipping.address1,
          address2: shipping.address2,
          city: shipping.city,
          state: shipping.state,
          postalCode: shipping.postalCode,
          country: shipping.country || 'India',
        },
      };

      // Add UPI details if applicable
      if (paymentMethod === 'upi') {
        const upiAppLabel = UPI_APPS.find((app) => app.id === selectedUpiApp)?.label;
        orderPayload.paymentDetails = {
          upiId,
          ...(selectedUpiApp ? { upiApp: selectedUpiApp, upiAppLabel } : {}),
        };
      }

      // Save UPI to profile if requested
      if (saveUpi && user && upiId) {
        try {
          await authAPI.updateProfile({ upiId });
          localStorage.setItem('savedUpi', upiId);
          if (selectedUpiApp) {
            localStorage.setItem('savedUpiApp', selectedUpiApp);
          }
        } catch (e) {
          console.debug('Could not save UPI', e);
        }
      } else if (!saveUpi) {
        try {
          localStorage.removeItem('savedUpi');
          localStorage.removeItem('savedUpiApp');
        } catch (e) {
          console.debug('Could not remove savedUpi', e);
        }
      }

      // Create order
      const createResp = await orderAPI.createOrder(orderPayload);
      const created = createResp.data?.data || createResp.data || createResp;
      const order = created.order || created;

      if (paymentMethod === 'razorpay' || paymentMethod === 'upi') {
        // Create Razorpay order
        const payResp = await orderAPI.createPaymentOrder(order._id);
        const payData = payResp.data?.data || payResp.data || payResp;

        const razorpayOrderId = payData.razorpayOrderId || payData.orderId || payData.id;
        const keyId = payData.keyId || payData.key || payData.key_id || import.meta.env.VITE_RAZORPAY_KEY;
        const amount = payData.amount || order.total || Math.round(Number(total || 0) * 100);
        const currency = payData.currency || 'INR';

        await handleRazorpayPayment(order, razorpayOrderId, keyId, amount, currency);
      } else if (paymentMethod === 'cod') {
        // Cash on Delivery - order confirmed immediately
        dispatch(clearCart());
        localStorage.removeItem('savedShipping');
        toast.success('Order placed successfully!');
        navigate(`/order-success/${order._id}`);
      }
    } catch (err) {
      console.error('Checkout error:', err);
      const errorMessage = err.response?.data?.message || err.message || 'Failed to place order. Please try again.';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Handle empty cart
  if (!cartItems || cartItems.length === 0) {
    return (
      <>
        <Helmet>
          <meta name="robots" content="noindex, nofollow" />
        </Helmet>
        <SEO
          title="Checkout | Mobile Covers"
          description="Complete your purchase"
          url="/checkout"
        />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="bg-white p-8 rounded-lg border text-center max-w-md w-full mx-4">
            <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
            <h2 className="text-xl font-bold mb-2">Your Cart is Empty</h2>
            <p className="text-gray-600 mb-6">Add some items to your cart before checking out</p>
            <Link
              to="/products"
              className="inline-block bg-primary-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-700 transition"
            >
              Browse Products
            </Link>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Helmet>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      <SEO
        title="Checkout | Mobile Covers"
        description="Complete your purchase securely"
        url="/checkout"
      />
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-6xl mx-auto px-4">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <Link 
              to="/cart" 
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition"
            >
              <FiArrowLeft className="w-5 h-5" />
              Back to Cart
            </Link>
            
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <FiLock className="w-4 h-4" />
              <span>Secure Checkout</span>
            </div>
          </div>

          <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>
        
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Shipping & Payment Form */}
            <div className="lg:col-span-2 space-y-6">
              {/* Shipping Information */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold">Shipping Information</h2>
                  {!user && (
                    <Link to="/login" className="text-sm text-primary-600 hover:text-primary-700">
                      Have an account? Sign in
                    </Link>
                  )}
                </div>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Name and Phone */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Full Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={shipping.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        onBlur={() => handleBlur('name')}
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition ${
                          validationErrors.name && touched.name ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="John Doe"
                      />
                      {validationErrors.name && touched.name && (
                        <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                          <FiAlertCircle className="w-4 h-4" />
                          {validationErrors.name}
                        </p>
                      )}
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Phone Number <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="tel"
                        value={shipping.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value.replace(/\D/g, '').slice(0, 10))}
                        onBlur={() => handleBlur('phone')}
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition ${
                          validationErrors.phone && touched.phone ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="9876543210"
                        maxLength="10"
                      />
                      {validationErrors.phone && touched.phone && (
                        <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                          <FiAlertCircle className="w-4 h-4" />
                          {validationErrors.phone}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Address Line 1 */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Address Line 1 <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={shipping.address1}
                      onChange={(e) => handleInputChange('address1', e.target.value)}
                      onBlur={() => handleBlur('address1')}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition ${
                        validationErrors.address1 && touched.address1 ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="House/Flat no., Building name, Street"
                    />
                    {validationErrors.address1 && touched.address1 && (
                      <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                        <FiAlertCircle className="w-4 h-4" />
                        {validationErrors.address1}
                      </p>
                    )}
                  </div>

                  {/* Address Line 2 */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Address Line 2 <span className="text-gray-400">(Optional)</span>
                    </label>
                    <input
                      type="text"
                      value={shipping.address2}
                      onChange={(e) => handleInputChange('address2', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                      placeholder="Landmark, Area"
                    />
                  </div>

                  {/* City, State, Postal Code */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        City <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={shipping.city}
                        onChange={(e) => handleInputChange('city', e.target.value)}
                        onBlur={() => handleBlur('city')}
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition ${
                          validationErrors.city && touched.city ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="Mumbai"
                      />
                      {validationErrors.city && touched.city && (
                        <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                          <FiAlertCircle className="w-4 h-4" />
                          {validationErrors.city}
                        </p>
                      )}
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        State <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={shipping.state}
                        onChange={(e) => handleInputChange('state', e.target.value)}
                        onBlur={() => handleBlur('state')}
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition ${
                          validationErrors.state && touched.state ? 'border-red-500' : 'border-gray-300'
                        }`}
                      >
                        <option value="">Select State</option>
                        {INDIAN_STATES.map(state => (
                          <option key={state} value={state}>{state}</option>
                        ))}
                      </select>
                      {validationErrors.state && touched.state && (
                        <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                          <FiAlertCircle className="w-4 h-4" />
                          {validationErrors.state}
                        </p>
                      )}
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        PIN Code <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={shipping.postalCode}
                        onChange={(e) => handleInputChange('postalCode', e.target.value.replace(/\D/g, '').slice(0, 6))}
                        onBlur={() => handleBlur('postalCode')}
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition ${
                          validationErrors.postalCode && touched.postalCode ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="400001"
                        maxLength="6"
                      />
                      {validationErrors.postalCode && touched.postalCode && (
                        <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                          <FiAlertCircle className="w-4 h-4" />
                          {validationErrors.postalCode}
                        </p>
                      )}
                    </div>
                  </div>
                </form>
              </div>

              {/* Payment Method */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-xl font-semibold mb-6">Payment Method</h2>
                
                <div className="space-y-3">
                  {/* Razorpay */}
                  <label className={`flex items-center gap-3 cursor-pointer p-4 border-2 rounded-lg transition ${
                    paymentMethod === 'razorpay' ? 'border-primary-600 bg-primary-50' : 'border-gray-200 hover:bg-gray-50'
                  }`}>
                    <input 
                      type="radio" 
                      name="pm" 
                      checked={paymentMethod === 'razorpay'} 
                      onChange={() => setPaymentMethod('razorpay')}
                      className="w-4 h-4 text-primary-600"
                    />
                    <div className="flex-1">
                      <div className="font-medium">Pay Online (Recommended)</div>
                      <div className="text-sm text-gray-500">Cards, UPI, Wallets, Net Banking</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <img src="/visa.svg" alt="Visa" className="h-6" />
                      <img src="/mastercard.svg" alt="Mastercard" className="h-6" />
                      <img src="/upi.svg" alt="UPI" className="h-6" />
                    </div>
                  </label>
                  
                  {/* UPI Direct */}
                  <label className={`flex items-center gap-3 cursor-pointer p-4 border-2 rounded-lg transition ${
                    paymentMethod === 'upi' ? 'border-primary-600 bg-primary-50' : 'border-gray-200 hover:bg-gray-50'
                  }`}>
                    <input 
                      type="radio" 
                      name="pm" 
                      checked={paymentMethod === 'upi'} 
                      onChange={() => setPaymentMethod('upi')}
                      className="w-4 h-4 text-primary-600"
                    />
                    <div className="flex-1">
                      <div className="font-medium">UPI Payment</div>
                      <div className="text-sm text-gray-500">Pay using your UPI ID</div>
                    </div>
                    <img src="/upi.svg" alt="UPI" className="h-8" />
                  </label>
                  
                  {/* Cash on Delivery */}
                  <label className={`flex items-center gap-3 cursor-pointer p-4 border-2 rounded-lg transition ${
                    paymentMethod === 'cod' ? 'border-primary-600 bg-primary-50' : 'border-gray-200 hover:bg-gray-50'
                  }`}>
                    <input 
                      type="radio" 
                      name="pm" 
                      checked={paymentMethod === 'cod'} 
                      onChange={() => setPaymentMethod('cod')}
                      className="w-4 h-4 text-primary-600"
                    />
                    <div className="flex-1">
                      <div className="font-medium">Cash on Delivery</div>
                      <div className="text-sm text-gray-500">Pay when your order arrives</div>
                    </div>
                    <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">₹50 Fee</span>
                  </label>
                </div>

                {/* UPI Specific Fields */}
                {paymentMethod === 'upi' && (
                  <div className="mt-6 pt-6 border-t space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        UPI ID <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={upiId}
                        onChange={(e) => handleUpiChange(e.target.value)}
                        onBlur={() => handleBlur('upiId')}
                        placeholder="yourname@paytm"
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition ${
                          validationErrors.upiId && touched.upiId ? 'border-red-500' : 'border-gray-300'
                        }`}
                      />
                      {validationErrors.upiId && touched.upiId && (
                        <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                          <FiAlertCircle className="w-4 h-4" />
                          {validationErrors.upiId}
                        </p>
                      )}
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        UPI App <span className="text-gray-400">(Optional)</span>
                      </label>
                      <select
                        value={selectedUpiApp}
                        onChange={(e) => setSelectedUpiApp(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                      >
                        <option value="">Select UPI App</option>
                        {UPI_APPS.map(app => (
                          <option key={app.id} value={app.id}>{app.label}</option>
                        ))}
                      </select>
                    </div>
                    
                    {user && (
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="saveUpi"
                          checked={saveUpi}
                          onChange={(e) => setSaveUpi(e.target.checked)}
                          className="w-4 h-4 text-primary-600 rounded focus:ring-2 focus:ring-primary-500"
                        />
                        <label htmlFor="saveUpi" className="ml-2 text-sm text-gray-700">
                          Save UPI ID for future orders
                        </label>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Place Order Button */}
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="w-full bg-primary-600 text-white py-4 px-6 rounded-lg font-semibold text-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    <span>Processing...</span>
                  </>
                ) : (
                  <>
                    <FiLock className="w-5 h-5" />
                    <span>Place Order • {formatPrice(total)}</span>
                  </>
                )}
              </button>

              {/* Trust Badges */}
              <div className="flex items-center justify-center gap-6 text-xs text-gray-500 pt-4">
                <div className="flex items-center gap-1">
                  <FiLock className="w-4 h-4" />
                  <span>Secure Payment</span>
                </div>
                <div className="flex items-center gap-1">
                  <FiCheck className="w-4 h-4" />
                  <span>Easy Returns</span>
                </div>
                <div className="flex items-center gap-1">
                  <FiCheck className="w-4 h-4" />
                  <span>Fast Delivery</span>
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-sm p-6 sticky top-8">
                <h2 className="text-xl font-semibold mb-6">Order Summary</h2>
                
                <div className="space-y-4 mb-6 max-h-96 overflow-y-auto">
                  {cartItems?.map((item) => (
                    <div key={`${item.product?._id}-${item.variant?._id}`} className="flex gap-3">
                      <div className="relative w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                        <img 
                          src={getProductImage(item.product)}
                          alt={item.product?.title}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute -top-2 -right-2 bg-primary-600 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-semibold">
                          {item.quantity}
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-gray-900 text-sm line-clamp-2">{item.product?.title}</h3>
                        <p className="text-xs text-gray-500 line-clamp-1">
                          {item.product?.brand} • {item.product?.model}
                          {(item.product?.design?.meta?.material || item.product?.material) && ` • ${item.product?.design?.meta?.material || item.product?.material}`}
                        </p>
                        <p className="font-semibold text-sm mt-1">
                          {formatPrice((Number(item.variant?.price || item.price) || 0) * (Number(item.quantity) || 1))}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-t pt-4 space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-medium">{formatPrice(subtotal)}</span>
                  </div>
                  
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Shipping</span>
                    <span className="font-medium">
                      {shippingCost === 0 ? (
                        <span className="text-green-600">FREE</span>
                      ) : (
                        formatPrice(shippingCost)
                      )}
                    </span>
                  </div>
                  
                  {shippingCost > 0 && subtotal < 500 && (
                    <div className="text-xs text-gray-500 bg-yellow-50 p-2 rounded">
                      Add {formatPrice(500 - subtotal)} more for FREE shipping
                    </div>
                  )}
                  
                  {paymentMethod === 'cod' && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">COD Charges</span>
                      <span className="font-medium">{formatPrice(50)}</span>
                    </div>
                  )}
                  
                  <div className="flex justify-between font-bold text-lg pt-3 border-t">
                    <span>Total</span>
                    <span className="text-primary-600">
                      {formatPrice(total + (paymentMethod === 'cod' ? 50 : 0))}
                    </span>
                  </div>
                </div>

                {/* Promo Code Section */}
                <div className="mt-6 pt-6 border-t">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Enter promo code"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition">
                      Apply
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Checkout;