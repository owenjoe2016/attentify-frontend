import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode"
import { useUser } from "../../context/UserContext";
import { useCompany } from "../../context/CompanyContext"; 

type JwtPayload = {
  sub: string;
  user_id: string;
  name: string,
  email: string,
  company_id?: string,
  role?: string,
  status?: string,
  companies?: any,
  redirect_url: string,
};

const OAuthCallbackRegister = () => {
  const navigate = useNavigate();
  const { setUser } = useUser();
  const { setCompanies, setCurrentCompanyId } = useCompany();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");

    if ( token ) {
      localStorage.setItem("token", token);

      const decoded = jwtDecode<JwtPayload>(token)
      const user = {
        id: decoded.user_id,
        name: decoded.name,
        email: decoded.email
      }

      localStorage.setItem('user', JSON.stringify(user));
      setUser(user);

      if (decoded?.companies?.length) {
        setCompanies(decoded?.companies);
        setCurrentCompanyId(decoded?.company_id || ""); 
      }

      setTimeout(() => {
        navigate(decoded?.redirect_url || "/login");
      }, 1000);
    }
  }, [navigate]);

  return <p>Loading...</p>;
};

export default OAuthCallbackRegister;
