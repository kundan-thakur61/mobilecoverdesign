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
  // const { products, loading } = useSelector((state) => state.products);

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
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg border text-center">
          <FiShoppingCart className="w-14 h-14 mx-auto text-gray-400 mb-4" />
          <h2 className="text-xl font-bold mb-2">Your Cart is Empty</h2>
          <Link
            to="/products"
            className="inline-block mt-4 bg-primary-600 text-white px-6 py-2 rounded-lg"
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
      <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <h1 className="text-2xl font-bold mb-6">Shopping Cart</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* CART ITEMS */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <div
                key={`${item.product._id}-${item.variant._id}`}
                className="bg-white border rounded-lg p-4"
              >
                <div className="flex gap-4">
                  {/* IMAGE */}
                  <div className="w-[90px] h-[120px] bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                    <img
                      src={getProductImage(item.product)}
                      alt={item.product.title}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* DETAILS */}
                  <div className="flex-1 min-w-0">
                    {/* TITLE + PRICE */}
                    <div className="flex justify-between gap-3">
                      <div>
                        <p className="font-semibold line-clamp-1">
                          {item.product.title}
                        </p>
                        <p className="text-sm text-gray-600">
                          {item.product.brand} • {item.product.model}{(item.product.design?.meta?.material || item.product.material) ? ` • ${item.product.design?.meta?.material || item.product.material}` : ''}
                        </p>
                      </div>

                      <div className="text-right">
                        <p className="font-bold">
                          {formatPrice(item.variant.price * item.quantity)}
                        </p>
                        <p className="text-xs text-gray-500">
                          {formatPrice(item.variant.price)} each
                        </p>
                      </div>
                    </div>

                    {/* ACTIONS */}
                    <div className="flex justify-between items-center mt-3">
                      {/* LEFT ACTIONS */}
                      <div className="flex items-center gap-4">
                        {String(item.product._id).startsWith('custom_') && (
                          <button
                            onClick={() => navigate('/customizer')}
                            className="text-sm text-indigo-600"
                          >
                            Edit
                          </button>
                        )}

                        <button
                          onClick={() =>
                            handleRemoveItem(
                              item.product._id,
                              item.variant._id
                            )
                          }
                          className="p-2 text-red-600"
                        >
                          <FiTrash2 className="w-5 h-5" />
                        </button>
                      </div>

                      {/* QUANTITY */}
                      <div className="flex items-center border rounded-lg">
                        <button
                          onClick={() =>
                            handleQuantityChange(
                              item.product._id,
                              item.variant._id,
                              item.quantity - 1
                            )
                          }
                          className="p-2"
                          disabled={item.quantity <= 1}
                        >
                          <FiMinus className="w-4 h-4" />
                        </button>

                        <span className="px-3 min-w-[32px] text-center">
                          {item.quantity}
                        </span>

                        <button
                          onClick={() =>
                            handleQuantityChange(
                              item.product._id,
                              item.variant._id,
                              item.quantity + 1
                            )
                          }
                          className="p-2"
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

          {/* ORDER SUMMARY */}
          <div>
            <div className="bg-white border rounded-lg p-6 sticky top-4">
              <h2 className="text-lg font-bold mb-4">Order Summary</h2>

              <div className="flex justify-between mb-2">
                <span>Subtotal</span>
                <span>{formatPrice(subtotal)}</span>
              </div>

              <div className="border-t pt-3 mt-3 flex justify-between font-bold">
                <span>Total</span>
                <span>{formatPrice(subtotal)}</span>
              </div>

              <Link
                to="/checkout"
                className="block mt-6 bg-primary-600 text-white text-center py-3 rounded-lg font-semibold"
              >
                Proceed to Pay
              </Link>

              <Link
                to="/products"
                className="mt-3 inline-flex items-center gap-2 text-primary-600 text-sm"
              >
                <FiArrowLeft />
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  );
};

export default Cart;
