// Custom hook for easier access to auth state and methods
import useAuthStore from '../store/useAuthStore';

const useAuth = () => {
  const {
    user,
    token,
    isAuthenticated,
    isLoading,
    error,
    login,
    register,
    logout,
    refreshUser,
    clearError,
    updateUser,
    isTokenExpired,
  } = useAuthStore();

  return {
    // State
    user,
    token,
    isAuthenticated,
    isLoading,
    error,
    isTokenExpired: isTokenExpired(),
    
    // Actions
    login,
    register,
    logout,
    refreshUser,
    clearError,
    updateUser,
  };
};

export default useAuth;