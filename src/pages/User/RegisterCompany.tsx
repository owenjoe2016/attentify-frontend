import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useUser } from "../../context/UserContext";
import { useCompany } from "../../context/CompanyContext"; 

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api/v1";

export default function RegisterCompany() {
  const navigate = useNavigate();
  const { setUser } = useUser();
  const { setCompanies, setCurrentCompanyId } = useCompany();

  const [companyName, setCompanyName] = useState("");
  const [siteUrl, setSiteUrl] = useState("");
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const newErrors: { [key: string]: string } = {};

    if (!companyName.trim()) newErrors.companyName = "Company name is required.";

    // Simple URL validation
    const urlPattern = /^(https?:\/\/)?([\w.-]+)+(:\d+)?(\/([\w/_.]*)?)?$/i;
    if (!siteUrl.trim()) newErrors.siteUrl = "Site URL is required.";
    else if (!urlPattern.test(siteUrl)) newErrors.siteUrl = "Enter a valid URL.";

    // Simple email validation
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim()) newErrors.email = "Email is required.";
    else if (!emailPattern.test(email)) newErrors.email = "Enter a valid email.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);

    try {
        const token = localStorage.getItem("token");
        const res = await axios.post(
            `${API_URL}/company/create`,
            {
                name: companyName,
                site_url: siteUrl,
                email: email,
            },
            {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        const data = res.data;
        localStorage.setItem("token", data?.token);
        localStorage.setItem('user', JSON.stringify(data?.user));
        setUser(data?.user);

        if (data?.user.companies?.length) {
            setCompanies(data?.user.companies);
            setCurrentCompanyId(data?.user.company_id); // default company from login
        }
        
        setTimeout(() => {
            navigate(data?.redirect_url || "/login");
        }, 1000);
    } catch (err: any) {
      const message =
        err.response?.data?.detail || err.message || "Failed to register company";
      setErrors({ form: message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto mt-24 px-4">
      <h2 className="text-2xl font-semibold mb-4 text-center">Register Your Company</h2>

      {errors.form && <div className="text-red-600 text-sm text-center mb-3">{errors.form}</div>}

      <form onSubmit={handleSubmit} className="bg-white shadow-md px-8 pt-6 pb-8 mb-4">
        {/* Company Name */}
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Company Name</label>
          {errors.companyName && <p className="text-red-600 text-sm mb-1">{errors.companyName}</p>}
          <input
            type="text"
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            className="shadow appearance-none border w-full py-2 px-3 text-gray-700 focus:outline-none focus:shadow-outline"
            placeholder="Acme Inc."
          />
        </div>

        {/* Site URL */}
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Site URL</label>
          {errors.siteUrl && <p className="text-red-600 text-sm mb-1">{errors.siteUrl}</p>}
          <input
            type="text"
            value={siteUrl}
            onChange={(e) => setSiteUrl(e.target.value)}
            className="shadow appearance-none border w-full py-2 px-3 text-gray-700 focus:outline-none focus:shadow-outline"
            placeholder="https://acme.com"
          />
        </div>

        {/* Email */}
        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2">Email</label>
          {errors.email && <p className="text-red-600 text-sm mb-1">{errors.email}</p>}
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="shadow appearance-none border w-full py-2 px-3 text-gray-700 focus:outline-none focus:shadow-outline"
            placeholder="contact@acme.com"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-2 disabled:opacity-50"
        >
          {loading ? "Submitting..." : "Create Company"}
        </button>
      </form>
    </div>
  );
}
