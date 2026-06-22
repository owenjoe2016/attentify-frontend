import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { useUser } from "../../context/UserContext";
import { useCompany } from "../../context/CompanyContext";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api/v1";

type JwtPayload = {
  sub: string;
  user_id: string;
  name: string;
  email: string;
  company_id?: string;
  role?: string;
  companies?: any;
  redirect_url?: string;
  needs_password?: boolean;
};

const OAuthCallbackLogin = () => {
  const navigate = useNavigate();
  const { setUser } = useUser();
  const { setCompanies, setCurrentCompanyId } = useCompany();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get("code");

    const applyUserData = (token: string, userData: any, needsPassword?: boolean) => {
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(userData));
      setUser(userData);
      if (userData.companies?.length) {
        setCompanies(userData.companies);
        setCurrentCompanyId(userData.company_id);
      }
      // If user has no password, redirect to password setup first
      if (needsPassword) {
        navigate("/set-password", { replace: true });
        return;
      }
      const path = userData.role === "admin" ? "/admin/dashboard" : "/dashboard";
      navigate(path, { replace: true });
    };

    const tryCookieAuth = async () => {
      try {
        const response = await axios.get(`${API_URL}/auth/me`, { withCredentials: true });
        const data = response.data;
        if (data.token && data.user) {
          // Decode token to check needs_password since /me response doesn't include it
          const decoded = jwtDecode<JwtPayload>(data.token);
          applyUserData(data.token, data.user, decoded.needs_password);
          return true;
        }
      } catch {
        // Cookie auth failed, will try URL code fallback
      }
      return false;
    };

    const tryCodeFallback = () => {
      if (!code) {
        navigate("/login", { replace: true });
        return;
      }
      try {
        const decoded = jwtDecode<JwtPayload>(code);
        const userData = {
          id: decoded.user_id,
          name: decoded.name,
          email: decoded.email,
          company_id: decoded.company_id || "",
          role: decoded.role || "",
          companies: decoded.companies || [],
        };
        applyUserData(code, userData, decoded.needs_password);
      } catch {
        navigate("/login", { replace: true });
      }
    };

    const authenticate = async () => {
      if (code) {
        tryCodeFallback();
        return;
      }

      const cookieWorked = await tryCookieAuth();
      if (!cookieWorked) {
        navigate("/login?error=google_sign_in_failed", { replace: true });
      }
    };

    authenticate();
  }, [navigate, setUser, setCompanies, setCurrentCompanyId]);

  return <p>Loading...</p>;
};

export default OAuthCallbackLogin;
