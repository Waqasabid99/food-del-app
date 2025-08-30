// stores/authStore.js
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const API_BASE_URL = import.meta.env.VITE_BACKEND_BASE_URL || 'http://localhost:5000/api';

const useAuthStore = create(
  persist(
    (set, get) => ({
      // State
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      // Actions
      login: async (credentials) => {
        set({ isLoading: true, error: null });
        
        try {
          const response = await fetch(`${API_BASE_URL}/user/login`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(credentials),
          });

          const data = await response.json();

          if (!response.ok) {
            throw new Error(data.message || 'Login failed');
          }

          // Store user data and token
          set({
            user: data.user,
            token: data.token,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });

          return { success: true, message: data.message };
        } catch (error) {
          set({
            user: null,
            token: null,
            isAuthenticated: false,
            isLoading: false,
            error: error.message,
          });
          
          return { success: false, message: error.message };
        }
      },

      register: async (userData) => {
        set({ isLoading: true, error: null });
        
        try {
          const response = await fetch(`${API_BASE_URL}/user/register`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData),
          });

          const data = await response.json();

          if (!response.ok) {
            throw new Error(data.message || 'Registration failed');
          }

          // Store user data and token after successful registration
          set({
            user: data.user,
            token: data.token,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });

          return { success: true, message: data.message };
        } catch (error) {
          set({
            user: null,
            token: null,
            isAuthenticated: false,
            isLoading: false,
            error: error.message,
          });
          
          return { success: false, message: error.message };
        }
      },

      logout: async () => {
        set({ isLoading: true, error: null });
        
        try {
          // Call logout endpoint (optional since JWT is stateless)
          const { token } = get();
          if (token) {
            await fetch(`${API_BASE_URL}/user/logout`, {
              method: 'POST',
              headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
              },
            });
          }
        } catch (error) {
          console.warn('Logout endpoint failed:', error.message);
        }

        // Clear all auth data
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          isLoading: false,
          error: null,
        });
      },

      // Refresh user data
      refreshUser: async () => {
        const { token, user } = get();
        
        if (!token || !user?._id) {
          return { success: false, message: 'No valid session' };
        }

        set({ isLoading: true, error: null });
        
        try {
          const response = await fetch(`${API_BASE_URL}/user/getuser/${user._id}`, {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          });

          const data = await response.json();

          if (!response.ok) {
            throw new Error(data.message || 'Failed to refresh user data');
          }

          set({
            user: data.user,
            isLoading: false,
            error: null,
          });

          return { success: true, user: data.user };
        } catch (error) {
          set({
            isLoading: false,
            error: error.message,
          });
          
          // If token is invalid, logout
          if (error.message.includes('unauthorized') || error.message.includes('invalid')) {
            get().logout();
          }
          
          return { success: false, message: error.message };
        }
      },

      // Update user profile
      updateProfile: async (userData) => {
        const { token, user } = get();
        
        if (!token || !user?._id) {
          return { success: false, message: 'No valid session' };
        }

        set({ isLoading: true, error: null });
        
        try {
          const response = await fetch(`${API_BASE_URL}/user/update/${user._id}`, {
            method: 'PUT',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData),
          });

          const data = await response.json();

          if (!response.ok) {
            throw new Error(data.message || 'Failed to update profile');
          }

          set({
            user: data.user,
            isLoading: false,
            error: null,
          });

          return { success: true, message: data.message, user: data.user };
        } catch (error) {
          set({
            isLoading: false,
            error: error.message,
          });
          
          return { success: false, message: error.message };
        }
      },

      // Place order
      placeOrder: async (orderData) => {
        const { token } = get();
        
        if (!token) {
          return { success: false, message: 'Authentication required' };
        }

        set({ isLoading: true, error: null });
        
        try {
          const response = await fetch(`${API_BASE_URL}/orders/create`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(orderData),
          });

          const data = await response.json();

          if (!response.ok) {
            throw new Error(data.message || 'Failed to place order');
          }

          set({
            isLoading: false,
            error: null,
          });

          return { success: true, message: data.message, order: data.order, orderNumber: data.orderNumber };
        } catch (error) {
          set({
            isLoading: false,
            error: error.message,
          });
          
          return { success: false, message: error.message };
        }
      },

      // Get user orders
      getUserOrders: async (page = 1, limit = 10) => {
        const { token } = get();
        
        if (!token) {
          return { success: false, message: 'Authentication required' };
        }

        set({ isLoading: true, error: null });
        
        try {
          const response = await fetch(`${API_BASE_URL}/orders/user-orders?page=${page}&limit=${limit}`, {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          });

          const data = await response.json();

          if (!response.ok) {
            throw new Error(data.message || 'Failed to fetch orders');
          }

          set({
            isLoading: false,
            error: null,
          });

          return { success: true, orders: data.orders, pagination: data.pagination };
        } catch (error) {
          set({
            isLoading: false,
            error: error.message,
          });
          
          return { success: false, message: error.message };
        }
      },

      // Check if token is expired
      isTokenExpired: () => {
        const { token } = get();
        if (!token) return true;

        try {
          const payload = JSON.parse(atob(token.split('.')[1]));
          const currentTime = Date.now() / 1000;
          return payload.exp < currentTime;
        } catch (error) {
          return true;
        }
      },

      // Initialize auth state (call on app start)
      initializeAuth: async () => {
        const { token, isTokenExpired, refreshUser, logout } = get();
        
        if (!token || isTokenExpired()) {
          logout();
          return;
        }

        // Token exists and is valid, try to refresh user data
        await refreshUser();
      },

      // Clear error
      clearError: () => set({ error: null }),

      // Update user data (for profile updates)
      updateUser: (userData) => {
        set((state) => ({
          user: { ...state.user, ...userData },
        }));
      },
    }),
    {
      name: 'auth-storage', // name of the item in localStorage
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

export default useAuthStore;