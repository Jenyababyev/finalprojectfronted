// src/features/products/productsSlice.ts
import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';

export interface Product {
  _id: string;
  name: string;
  price: number;
  description: string;
}

interface ProductsState {
  products: Product[];
  loading: boolean;
  error: string | null;
}

const initialState: ProductsState = {
  products: [],
  loading: false,
  error: null,
};

// טענת מוצרים מהשרת
export const fetchProducts = createAsyncThunk('products/fetchProducts', async () => {
  const res = await fetch('/api/products', { credentials: 'include' });
  if (!res.ok) throw new Error('Failed to fetch products');
  return (await res.json()) as Product[];
});

// הוספת מוצר חדש
export const addProduct = createAsyncThunk(
  'products/addProduct',
  async (product: Omit<Product, '_id'>) => {
    const res = await fetch('/api/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(product),
    });
    if (!res.ok) throw new Error('Failed to add product');
    return (await res.json()) as Product;
  }
);

// מחיקת מוצר
export const deleteProduct = createAsyncThunk(
  'products/deleteProduct',
  async (id: string) => {
    const res = await fetch(`/api/products/${id}`, {
      method: 'DELETE',
      credentials: 'include',
    });
    if (!res.ok) throw new Error('Failed to delete product');
    return id;
  }
);

const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // fetchProducts
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action: PayloadAction<Product[]>) => {
        state.products = action.payload;
        state.loading = false;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.error = action.error.message || 'Failed to fetch products';
        state.loading = false;
      })
      // addProduct
      .addCase(addProduct.pending, (state) => {
        state.error = null;
      })
      .addCase(addProduct.fulfilled, (state, action: PayloadAction<Product>) => {
        state.products.push(action.payload);
      })
      .addCase(addProduct.rejected, (state, action) => {
        state.error = action.error.message || 'Failed to add product';
      })
      // deleteProduct
      .addCase(deleteProduct.fulfilled, (state, action: PayloadAction<string>) => {
        state.products = state.products.filter(p => p._id !== action.payload);
      })
      .addCase(deleteProduct.rejected, (state, action) => {
        state.error = action.error.message || 'Failed to delete product';
      });
  },
});

export default productsSlice.reducer;
