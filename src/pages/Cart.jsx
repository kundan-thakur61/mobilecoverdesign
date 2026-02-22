import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { removeFromCart, updateQuantity, loadCart } from '../redux/slices/cartSlice';
import ProductCard from '../components/ProductCard';
import { FiShoppingCart, FiTrash2, FiPlus, FiMinus, FiArrowLeft } from 'react-icons/fi';
import { formatPrice, getProductImage } from '../utils/helpers';
import { toast } from 'react-toastify';
import SEO from '../components/SEO';
import { Helmet } from 'react-helmet-async';

const Cart = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items } = useSelector((state) => state.cart);

  useEffect(() => {
    dispatch(loadCart());
  }, [dispatch]);

  const handleQuantityChange = (productId, variantId, qty) => {
    if (qty < 1) {
      dispatch(removeFromCart({ productId, variantId }));
      toast.info('Item removed from cart');
    } else {
      dispatch(updateQuantity({ productId, variantId, quantity: qty }));
    }
  };

  const handleRemoveItem = (productId, variantId) => {
    dispatch(removeFromCart({ productId, variantId }));
    toast.info('Item removed from cart');
  };

  const subtotal = items.reduce(
    (sum, item) => sum + item.variant.price * item.quantity,
    0
  );

  if (items.length === 0) {
    return (
      <>
        <Helmet>
          <meta name="robots" content="noindex, nofollow" />
        </Helmet>
        <SEO
          title="Shopping Cart | Mobile Covers"
          description="View your shopping cart"
          url="/cart"
        />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
          <div className="bg-white p-6 sm:p-8 rounded-lg border text-center max-w-md w-full">
            <FiShoppingCart className="w-12 h-12 sm:w-14 sm:h-14 mx-auto text-gray-400 mb-4" />
            <h2 className="text-lg sm:text-xl font-bold mb-2">Your Cart is Empty</h2>
            <p className="text-gray-600 text-sm sm:text-base mb-4">Add some products to get started!</p>
            <Link
              to="/products"
              className="inline-flex items-center justify-center bg-primary-600 text-white px-6 py-3 rounded-lg min-h-[44px] w-full sm:w-auto font-semibold"
            >
              Start Shopping
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
        title="Shopping Cart | Mobile Covers"
        description="Review and checkout your selected items"
        url="/cart"
      />
      <div className="min-h-screen bg-gray-50 pb-20 lg:pb-0">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 py-4 sm:py-6">
          <h1 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">Shopping Cart ({items.length} items)</h1>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
            {/* CART ITEMS */}
            <div className="lg:col-span-2 space-y-3 sm:space-y-4">
              {items.map((item) => (
                <div
                  key={`${item.product._id}-${item.variant._id}`}
                  className="bg-white border rounded-lg p-3 sm:p-4"
                >
                  <div className="flex gap-3 sm:gap-4">
                    {/* IMAGE */}
                    <div className="w-16 h-20 sm:w-20 sm:h-24 md:w-[90px] md:h-[120px] bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                      <img
                        src={getProductImage(item.product)}
                        alt={item.product.title}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* DETAILS */}
                    <div className="flex-1 min-w-0">
                      {/* TITLE + PRICE */}
                      <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-3">
                        <div className="min-w-0">
                          <p className="font-semibold text-sm sm:text-base line-clamp-2 sm:line-clamp-1">
                            {item.product.title}
                          </p>
                          <p className="text-xs sm:text-sm text-gray-600 line-clamp-1">
                            {item.product.brand} • {item.product.model}{(item.product.design?.meta?.material || item.product.material) ? ` • ${item.product.design?.meta?.material || item.product.material}` : ''}
                          </p>
                        </div>

                        <div className="sm:text-right flex sm:flex-col justify-between sm:justify-start">
                          <p className="font-bold text-sm sm:text-base">
                            {formatPrice(item.variant.price * item.quantity)}
                          </p>
                          <p className="text-xs text-gray-500">
                            {formatPrice(item.variant.price)} each
                          </p>
                        </div>
                      </div>

                      {/* ACTIONS */}
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 sm:gap-3 mt-2 sm:mt-3">
                        {/* LEFT ACTIONS */}
                        <div className="flex items-center gap-3 sm:gap-4">
                          {String(item.product._id).startsWith('custom_') && (
                            <button
                              type="button"
                              onClick={() => navigate('/customizer')}
                              className="text-xs sm:text-sm text-indigo-600 min-h-[44px] min-w-[44px] flex items-center justify-center"
                            >
                              Edit
                            </button>
                          )}

                          <button
                            type="button"
                            onClick={() =>
                              handleRemoveItem(
                                item.product._id,
                                item.variant._id
                              )
                            }
                            className="inline-flex items-center justify-center p-2 text-red-600 min-h-[44px] min-w-[44px]"
                          >
                            <FiTrash2 className="w-4 h-4 sm:w-5 sm:h-5" />
                          </button>
                        </div>

                        {/* QUANTITY */}
                        <div className="flex items-center border rounded-lg self-start sm:self-auto">
                          <button
                            type="button"
                            onClick={() =>
                              handleQuantityChange(
                                item.product._id,
                                item.variant._id,
                                item.quantity - 1
                              )
                            }
                            className="inline-flex items-center justify-center p-2 sm:p-2 min-h-[44px] min-w-[44px]"
                            disabled={item.quantity <= 1}
                          >
                            <FiMinus className="w-4 h-4" />
                          </button>

                          <span className="px-2 sm:px-3 min-w-[32px] text-center text-sm sm:text-base font-medium">
                            {item.quantity}
                          </span>

                          <button
                            type="button"
                            onClick={() =>
                              handleQuantityChange(
                                item.product._id,
                                item.variant._id,
                                item.quantity + 1
                              )
                            }
                            className="inline-flex items-center justify-center p-2 sm:p-2 min-h-[44px] min-w-[44px]"
                          >
                            <FiPlus className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* ORDER SUMMARY - Desktop */}
            <div className="hidden lg:block">
              <div className="bg-white border rounded-lg p-6 sticky top-20">
                <h2 className="text-lg font-bold mb-4">Order Summary</h2>

                <div className="flex justify-between mb-2 text-sm">
                  <span className="text-gray-600">Subtotal</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>

                <div className="flex justify-between mb-2 text-sm">
                  <span className="text-gray-600">Shipping</span>
                  <span>{subtotal > 500 ? 'Free' : '₹50'}</span>
                </div>

                <div className="border-t pt-3 mt-3 flex justify-between font-bold">
                  <span>Total</span>
                  <span>{formatPrice(subtotal + (subtotal > 500 ? 0 : 50))}</span>
                </div>

                <Link
                  to="/checkout"
                  className="block mt-6 bg-primary-600 text-white text-center py-3 rounded-lg font-semibold min-h-[44px]"
                >
                  Proceed to Pay
                </Link>

                <Link
                  to="/products"
                  className="mt-3 inline-flex items-center gap-2 text-primary-600 text-sm min-h-[44px]"
                >
                  <FiArrowLeft />
                  Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* MOBILE STICKY CHECKOUT BAR */}
        <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg z-40 safe-bottom">
          <div className="px-3 sm:px-4 py-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">Total</span>
              <span className="font-bold text-lg">{formatPrice(subtotal + (subtotal > 500 ? 0 : 50))}</span>
            </div>
            <Link
              to="/checkout"
              className="block bg-primary-600 text-white text-center py-3 rounded-lg font-semibold min-h-[44px]"
            >
              Proceed to Pay
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default Cart;
