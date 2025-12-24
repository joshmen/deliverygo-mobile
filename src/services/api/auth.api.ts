/**
 * Authentication API
 * Functions for user authentication
 */

import AsyncStorage from "@react-native-async-storage/async-storage";
import apiClient, { setAuthToken, clearAuthToken } from "./client";
import { ENDPOINTS, STORAGE_KEYS } from "../../config/constants";
import type { LoginRequest, LoginResponse, User } from "../../types";

/**
 * Login user with email and password
 * @param credentials - User email and password
 * @returns Login response with token and user data
 */
export const login = async (
  credentials: LoginRequest
): Promise<LoginResponse> => {
  try {
    const response = await apiClient.post<LoginResponse>(
      ENDPOINTS.auth.login,
      credentials
    );

    // Store token and user data
    await setAuthToken(response.data.accessToken);
    await AsyncStorage.setItem(
      STORAGE_KEYS.USER_DATA,
      JSON.stringify(response.data.user)
    );

    return response.data;
  } catch (error) {
    console.error("[AuthAPI] Login error:", error);
    throw error;
  }
};

/**
 * Logout current user
 * Clears token and user data from storage
 */
export const logout = async (): Promise<void> => {
  try {
    // Call logout endpoint (optional - server can invalidate token)
    try {
      await apiClient.post(ENDPOINTS.auth.logout);
    } catch (error) {
      // Ignore server errors during logout
      console.warn("[AuthAPI] Logout API call failed:", error);
    }

    // Clear local storage
    await clearAuthToken();
    await AsyncStorage.removeItem(STORAGE_KEYS.USER_DATA);
  } catch (error) {
    console.error("[AuthAPI] Logout error:", error);
    throw error;
  }
};

/**
 * Get stored user data from AsyncStorage
 * @returns User object or null if not found
 */
export const getStoredUser = async (): Promise<User | null> => {
  try {
    const userData = await AsyncStorage.getItem(STORAGE_KEYS.USER_DATA);
    return userData ? JSON.parse(userData) : null;
  } catch (error) {
    console.error("[AuthAPI] Error getting stored user:", error);
    return null;
  }
};

/**
 * Refresh authentication token (if supported by backend)
 * @returns New token
 */
export const refreshToken = async (): Promise<string> => {
  try {
    const response = await apiClient.post<{ token: string }>(
      ENDPOINTS.auth.refresh
    );

    // Store new token
    await setAuthToken(response.data.token);

    return response.data.token;
  } catch (error) {
    console.error("[AuthAPI] Token refresh error:", error);
    throw error;
  }
};

/**
 * Verify current token is valid
 * @returns True if token is valid
 */
export const verifyToken = async (): Promise<boolean> => {
  try {
    // This endpoint should return 200 if token is valid, 401 if not
    await apiClient.get("/api/auth/verify");
    return true;
  } catch (error) {
    return false;
  }
};
