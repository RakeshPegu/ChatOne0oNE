
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import axios from "axios";
import Swal from "sweetalert2";
import apiRequest from "../lib/apiRequest";

interface User {
  _id: string;
  username: string;
  email: string;
  role: string;
}

interface UserInfo {
  username: string;
  email: string;
  password: string;
}

interface SignInInfo {
  email: string;
  password: string;
}

interface AuthStore {
  user: User | null;
  isAuthenticated: boolean;
  signUp: (data: UserInfo) => Promise<UserInfo | null>;
  signIn: (data: SignInInfo) => Promise<User | null>;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,

      signUp: async (data) => {
        try {
          const res = await apiRequest.post(
            "/auth/register",
            data
          );

          await Swal.fire({
            title: "Created successfully",
            text: "Account created successfully",
            icon: "success",
          });

          return res.data;
        } catch (error) {
          let message = "Something went wrong";

          if (axios.isAxiosError(error)) {
            message =
              error.response?.data?.message ?? message;
          }

          await Swal.fire({
            title: "Oops!",
            text: message,
            icon: "error",
          });

          return null;
        }
      },

      signIn: async (data) => {
        try {
          const res = await apiRequest.post(
            "/auth/login",
            data
          );

          const user: User = res.data.existingUser;

          set({
            user,
            isAuthenticated: true,
          });

          await Swal.fire({
            title: "Signed in",
            text: "Logged in successfully",
            icon: "success",
          });

          return user;
        } catch (error) {
          let message = "Something went wrong";

          if (axios.isAxiosError(error)) {
            message =
              error.response?.data?.message ?? message;
          }

          await Swal.fire({
            title: "Oops!",
            text: message,
            icon: "error",
          });

          return null;
        }
      },

      logout: async () => {
        try {
          await apiRequest.post("/auth/logout");

          set({
            user: null,
            isAuthenticated: false,
          });

          await Swal.fire({
            title: "Signed out",
            text: "Logged out successfully",
            icon: "success",
          });
        } catch (error) {
          let message = "Something went wrong";

          if (axios.isAxiosError(error)) {
            message =
              error.response?.data?.message ?? message;
          }

          await Swal.fire({
            title: "Oops!",
            text: message,
            icon: "error",
          });
        }
      },
    }),
    {
      name: "auth-store",
      storage: createJSONStorage(() => localStorage),

      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);