

import { create } from "apisauce";
import { getAccessToken, setAccessToken, clearAccessToken } from "@/auth/accessToken";

const apiClient = create({
  baseURL: process.env.NEXT_PUBLIC_SERVER,
  withCredentials: true, // this is what sends the httpOnly refreshToken cookie
  headers: { Accept: "application/vnd.github.v3+json" },
});

if (typeof window !== "undefined") {
  apiClient.addAsyncRequestTransform(async (request) => {
    const token = getAccessToken();
    if (!token) return;
    request.headers["x-auth-token"] = token;
  });
}

apiClient.axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    const isAuthRoute =
      originalRequest.url.includes("/user/login") ||
      originalRequest.url.includes("/user/register") ||
      originalRequest.url.includes("/user/auth-google") ||
      originalRequest.url.includes("/user/refresh-tokens");

    if (isAuthRoute) return Promise.reject(error);

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        // Cookie is auto-sent due to withCredentials: true
        const refreshResponse = await apiClient.post("/user/refresh-tokens");
        if (refreshResponse.ok && refreshResponse.data?.accessToken) {
          const newToken = refreshResponse.data.accessToken;
          setAccessToken(newToken);
          originalRequest.headers["x-auth-token"] = newToken;
          return apiClient.axiosInstance(originalRequest);
        }
        throw new Error("Refresh failed");
      } catch (err) {
        console.error("Token refresh failed:", err);
        clearAccessToken();
        window.location.href = "/";
        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  },
);

export default apiClient;