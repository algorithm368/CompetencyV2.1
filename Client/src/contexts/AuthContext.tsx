// import React, { createContext, useState, ReactNode, useContext, useEffect, useMemo } from "react";
// import { useNavigate } from "react-router-dom";
// import api from "@Services/api";
// import toast from "react-hot-toast";

// interface User {
//   userId: string;
//   username: string;
//   full_name: string;
//   email: string;
//   role: string;
//   permissions: string[];
// }

// export interface AuthContextType {
//   user: User | null;
//   loading: boolean;
//   login: (email: string, password: string) => Promise<void>;
//   sendOtp: (email: string, username: string) => Promise<void>;
//   confirmRegister: (username: string, email: string, password: string, otp: string) => Promise<void>;
//   verifyOTP: (email: string, otp: string) => Promise<void>;
//   resendOTP: (email: string) => Promise<void>;
//   logout: () => Promise<void>;
// }

// export const AuthContext = createContext<AuthContextType | undefined>(undefined);
// export const useAuth = (): AuthContextType => {
//   const ctx = useContext(AuthContext);
//   if (!ctx) throw new Error("useAuth must be used within AuthProvider");
//   return ctx;
// };

// export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
//   const navigate = useNavigate();
//   const [user, setUser] = useState<User | null>(null);
//   const [loading, setLoading] = useState(true);

//   // Load current user on mount or page refresh
//   useEffect(() => {
//     let isMounted = true;
//     api
//       .get("/auth/me")
//       .then((res) => {
//         if (isMounted) setUser(res.data.user);
//       })
//       .catch((err) => {
//         // If unauthorized or error, clear state
//         if (isMounted) setUser(null);
//       })
//       .finally(() => {
//         if (isMounted) setLoading(false);
//       });

//     return () => {
//       isMounted = false;
//     };
//   }, []);

//   const login = async (email: string, password: string) => {
//     try {
//       const res = await api.post("/auth/login", { email, password });
//       const meRes = await api.get("/auth/me");
//       setUser(meRes.data.user);
//       navigate("/", { replace: true });
//     } catch (err: any) {
//       const msg = err.response?.data?.message || "Login failed";
//       toast.error(msg);
//       throw new Error(msg);
//     }
//   };

//   const sendOtp = async (email: string, username: string) => {
//     try {
//       await api.post("/auth/send-otp", { email, username });
//       toast.success("OTP sent to your email");
//     } catch (err: any) {
//       toast.error(err.response?.data?.message || "Failed to send OTP");
//       throw err;
//     }
//   };

//   const confirmRegister = async (username: string, email: string, password: string, otp: string) => {
//     try {
//       await api.post("/auth/register", { username, email, password, otp });
//       toast.success("Registration complete, please login");
//     } catch (err: any) {
//       toast.error(err.response?.data?.message || "Registration failed");
//       throw err;
//     }
//   };

//   const verifyOTP = async (email: string, otp: string) => {
//     try {
//       const res = await api.post("/auth/verify-otp", { email, otp });
//       setUser(res.data.user);
//       navigate("/", { replace: true });
//     } catch (err: any) {
//       toast.error(err.response?.data?.message || "OTP verification failed");
//       throw err;
//     }
//   };

//   const resendOTP = async (email: string) => {
//     try {
//       await api.post("/auth/resend-otp", { email });
//       toast.success("OTP resent");
//     } catch (err: any) {
//       toast.error(err.response?.data?.message || "Failed to resend OTP");
//       throw err;
//     }
//   };

//   const logout = async () => {
//     try {
//       await api.post("/auth/logout");
//     } catch (err: any) {
//       console.error("Logout failed:", err);
//     } finally {
//       setUser(null);
//       navigate("/login", { replace: true });
//     }
//   };

//   const authValue = useMemo(
//     () => ({
//       user,
//       loading,
//       login,
//       sendOtp,
//       confirmRegister,
//       verifyOTP,
//       resendOTP,
//       logout,
//     }),
//     [user, loading]
//   );

//   return <AuthContext.Provider value={authValue}>{children}</AuthContext.Provider>;
// };
