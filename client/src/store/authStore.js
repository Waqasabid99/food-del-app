import axios from "axios";
import { toast } from "react-toastify";
import { create } from "zustand";
import { persist } from "zustand/middleware";

const API_BASE_URL =
  import.meta.env.VITE_BACKEND_BASE_URL || "http://localhost:5000/api";

const useAdminAuthStore = create(
  persist(
    (set, get) => ({
      // State
      admin: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      // Actions
      login: async (credentials) => {
        set({ isLoading: true, error: null });

        try {
          const response = await axios.post(
            `${API_BASE_URL}/api/admin/login`,
            credentials,
            { withCredentials: true }
          );

          const data = response.data;

          if (response.status === 200 || response.status === 201) {
            toast.success(data.message);
          } else {
            toast.error(data.message);
          }

          set({
            admin: data.admin,
            token: data.token,
            isAuthenticated: true,
            isLoading: false,
          });

          return { success: true, message: data.message };
        } catch (error) {
          set({
            admin: null,
            token: null,
            isAuthenticated: false,
            isLoading: false,
            error: error.message,
          });

          return { success: false, message: error.message };
        }
      },

      register: async (adminData) => {
        set({ isLoading: true, error: null });

        try {
          const response = await axios.post(
            `${API_BASE_URL}/api/admin/register`,
            adminData,
            { withCredentials: true }
          );

          const data = response.data;

          if (response.status === 200 || response.status === 201) {
            toast.success(data.message);
          } else {
            toast.error(data.message);
          }

          set({
            admin: data.admin,
            token: data.token,
            isAuthenticated: true,
            isLoading: false,
          });

          return { success: true, message: data.message };
        } catch (error) {
          set({
            admin: null,
            token: null,
            isAuthenticated: false,
            isLoading: false,
            error: error.message,
          });

          return { success: false, message: error.message };
        }
      },

      logout: () => {
        set({
          admin: null,
          token: null,
          isAuthenticated: false,
          isLoading: false,
          error: null,
          showLogin: false,
          showSignup: false,
        });
      },

      clearError: () => set({ error: null }),
    }),
    {
      name: "admin-auth-storage",
      partialize: (state) => ({
        admin: state.admin,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

export default useAdminAuthStore;