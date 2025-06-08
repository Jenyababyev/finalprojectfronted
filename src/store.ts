import { configureStore } from '@reduxjs/toolkit';
import cartReducer from '../src/features/cart/cartSlice';
import userReducer from '../src/features/user/userSlice';
import ordersReducer from '../src/features/orders/ordersSlice';
import productsReducer from '../src/features/product/productsSlice';

export const store = configureStore({
  reducer: {
    cart: cartReducer,
    user: userReducer,
    orders: ordersReducer ,
    products: productsReducer,
  },
});

// טיפוסי RootState ו-AppDispatch לשימוש ב-typed hooks
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;



