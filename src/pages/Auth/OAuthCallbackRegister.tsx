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
  redirect_url: string;
  needs_password?: boolean;
};

const OAuthCallbackRegister = () => {
  const navigate = useNavigate();
  const { setUser } = useUser();
  const { setCompanies, setCurrentCompanyId } = useCompany();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get("code");

    const applyUserData = (token: string, userData: any, redirectUrl: string, needsPassword?: boolean) => {
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(userData));
      setUser(userData);
      if (userData.companies?.length) {
        setCompanies(userData.companies);
        setCurrentCompanyId(userData.company_id || "");
      }
      if (needsPassword) {
        navigate("/set-password", { replace: true });
        return;
      }
      navigate(redirectUrl || "/login", { replace: true });
    };

    const tryCookieAuth = async () => {
      try {
        const response = await axios.get(`${API_URL}/auth/me`, { withCredentials: true });
        const data = response.data;
        if (data.token && data.user) {
          const decoded = jwtDecode<JwtPayload>(data.token);
          applyUserData(data.token, data.user, data.redirect_url, decoded.needs_password);
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
        };
        applyUserData(code, userData, decoded.redirect_url, decoded.needs_password);
      } catch {
        navigate("/login", { replace: true });
      }
    };

    const authenticate = async () => {
      const cookieWorked = await tryCookieAuth();
      if (!cookieWorked) {
        tryCodeFallback();
      }
    };

    authenticate();
  }, [navigate, setUser, setCompanies, setCurrentCompanyId]);

  return <p>Loading...</p>;
};

export default OAuthCallbackRegister;
