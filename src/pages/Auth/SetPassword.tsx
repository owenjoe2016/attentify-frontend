import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { useUser } from "../../context/UserContext";
import { useCompany } from "../../context/CompanyContext";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api/v1";

type JwtPayload = {
  user_id: string;
  name: string;
  email: string;
  company_id?: string;
  role?: string;
  companies?: any[];
  redirect_url?: string;
};

const SetPassword = () => {
  const navigate = useNavigate();
  const { setUser } = useUser();
  const { setCompanies, setCurrentCompanyId } = useCompany();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const applySession = (token: string, userData?: any, redirectUrl?: string) => {
    const decoded = jwtDecode<JwtPayload>(token);
    const user = userData || {
      id: decoded.user_id,
      name: decoded.name,
      email: decoded.email,
      company_id: decoded.company_id || "",
      role: decoded.role || "",
      companies: decoded.companies || [],
    };

    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));
    setUser(user);

    if (user.companies?.length) {
      setCompanies(user.companies);
      setCurrentCompanyId(user.company_id || user.companies[0]?.id || "");
    } else {
      setCompanies([]);
      setCurrentCompanyId("");
    }

    navigate(redirectUrl || decoded.redirect_url || (user.company_id ? "/dashboard" : "/register-company"), {
      replace: true,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!password || password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(
        `${API_URL}/auth/set-password`,
        { password },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (response.data?.token) {
        applySession(response.data.token, response.data.user, response.data.redirect_url);
        return;
      }
      navigate("/register-company", { replace: true });
    } catch (err: any) {
      setError(err?.response?.data?.detail || "Failed to set password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-2">Set Your Password</h1>
        <p className="text-gray-600 mb-6">
          You signed in with Google. Set a password so you can also log in with your email.
        </p>

        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded mb-4 text-sm">{error}</div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Min. 6 characters"
              minLength={6}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Re-enter password"
            />
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => {
                const storedUser = localStorage.getItem("user");
                const user = storedUser ? JSON.parse(storedUser) : null;
                navigate(user?.company_id ? "/dashboard" : "/register-company", { replace: true });
              }}
              className="flex-1 py-2 px-4 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Skip for now
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? "Saving..." : "Set Password"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SetPassword;
