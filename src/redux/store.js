import { configureStore } from '@reduxjs/toolkit';
import productSlice from './slices/productSlice';
import customSlice from './slices/customSlice';
import cartSlice from './slices/cartSlice';
import authSlice from './slices/authSlice';
import wishlistSlice from './slices/wishlistSlice';

// Admin slices are loaded lazily via injectReducer when admin pages are visited
// This saves ~50KB+ of JS from the initial critical path

const staticReducers = {
  products: productSlice,
  custom: customSlice,
  cart: cartSlice,
  auth: authSlice,
  wishlist: wishlistSlice,
};

export const store = configureStore({
  reducer: staticReducers,
});

// Lazy reducer injection for admin slices
store.asyncReducers = {};

export const injectReducer = (key, asyncReducer) => {
  if (!store.asyncReducers[key]) {
    store.asyncReducers[key] = asyncReducer;
    store.replaceReducer({
      ...staticReducers,
      ...store.asyncReducers,
    });
  }
};

// Load admin reducers on demand
export const loadAdminReducers = async () => {
  const [
    { default: adminOrderSlice },
    { default: adminCustomOrderSlice },
    { default: adminUserSlice },
    { default: adminDashboardSlice },
  ] = await Promise.all([
    import('./slices/adminOrderSlice'),
    import('./slices/adminCustomOrderSlice'),
    import('./slices/adminUserSlice'),
    import('./slices/adminDashboardSlice'),
  ]);

  injectReducer('adminOrders', adminOrderSlice);
  injectReducer('adminCustomOrders', adminCustomOrderSlice);
  injectReducer('adminUsers', adminUserSlice);
  injectReducer('adminDashboard', adminDashboardSlice);
};

export default store;
