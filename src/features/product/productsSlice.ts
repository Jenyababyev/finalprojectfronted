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

// Helper function to get auth headers
const getAuthHeaders = () => {
  const token = localStorage.getItem('token'); 
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` })
  };
};

// טענת מוצרים מהשרת
export const fetchProducts = createAsyncThunk('products/fetchProducts', async () => {
  const res = await fetch('/api/products', { 
    credentials: 'include',
    headers: getAuthHeaders()
  });
  if (!res.ok) throw new Error('Failed to fetch products');
  return (await res.json()) as Product[];
});

// הוספת מוצר חדש
export const addProduct = createAsyncThunk(
  'products/addProduct',
  async (product: Omit<Product, '_id'>) => {
    const res = await fetch('/api/products', {
      method: 'POST',
      headers: getAuthHeaders(),
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
      headers: getAuthHeaders(),
      credentials: 'include',
    });
    if (!res.ok) throw new Error('Failed to delete product');
    return id;
  }
);

// עדכון מוצר
export const updateProduct = createAsyncThunk(
  'products/updateProduct',
  async ({ id, updatedProduct }: { id: string; updatedProduct: Product }, { rejectWithValue }) => {
    try {
      console.log('Updating product:', id, updatedProduct);
      
      const res = await fetch(`/api/products/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        credentials: 'include',
        body: JSON.stringify(updatedProduct),
      });
      
      console.log('Update response status:', res.status);
      
      if (res.status === 401) {
        return rejectWithValue('Authentication expired. Please log in again.');
      }
      
      if (res.status === 403) {
        return rejectWithValue('Access denied. Admin privileges required.');
      }
      
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({ message: 'Unknown error' }));
        return rejectWithValue(errorData.message || 'Failed to update product');
      }
      
      return (await res.json()) as Product;
    } catch (error) {
      console.error('Update product error:', error);
      return rejectWithValue('Network error. Please try again.');
    }
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
      })
      // updateProduct
      .addCase(updateProduct.pending, (state) => {
        state.error = null;
      })
      .addCase(updateProduct.fulfilled, (state, action: PayloadAction<Product>) => {
        const index = state.products.findIndex(p => p._id === action.payload._id);
        if (index !== -1) {
          state.products[index] = action.payload;
        }
      })
      .addCase(updateProduct.rejected, (state, action) => {
        state.error = action.payload as string || 'Failed to update product';
      });
  },
});

export default productsSlice.reducer;