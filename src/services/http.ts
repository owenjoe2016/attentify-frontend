import axios from "axios";

const authRoutes = [
  "/login",
  "/signup",
  "/forget-password",
  "/reset-password",
  "/oauth/callback/login",
  "/oauth/callback/register",
  "/accept-invite",
];

export function setupHttpInterceptors() {
  axios.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error?.response?.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        localStorage.removeItem("currentCompanyId");

        const currentPath = window.location.pathname;
        const isAuthRoute = authRoutes.some((route) => currentPath.startsWith(route));

        if (!isAuthRoute) {
          window.location.href = "/login";
        }
      }

      return Promise.reject(error);
    }
  );
}
