// src/features/orders/ordersSlice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { ReactNode } from 'react';

interface Product {
  _id: string;
  name: string;
  price: number;
}

interface OrderItem {
  name: ReactNode;
  price: ReactNode;
  product: Product;
  quantity: number;
}

interface Order {
  _id: string;
  createdAt: string;
  items: OrderItem[];
  total: number;
}

interface OrdersState {
  orders: Order[];
  loading: boolean;
  error: string | null;
}

const initialState: OrdersState = {
  orders: [],
  loading: false,
  error: null,
};

// Async thunk לשליפת ההזמנות מהשרת
export const fetchOrders = createAsyncThunk(
  'orders/fetchOrders',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch('/api/orders/allOrders', { credentials: 'include' });
      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(errorData.message || 'Failed to fetch orders');
      }
      const data: Order[] = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue('Network error');
    }
  }
);

const ordersSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    clearOrders(state) {
      state.orders = [];
      state.error = null;
      state.loading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.orders = action.payload;
        state.loading = false;
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.error = action.payload as string;
        state.loading = false;
      });
  },
});

export const { clearOrders } = ordersSlice.actions;
export default ordersSlice.reducer;
