import { useEffect, useState } from "react";
import axios from "axios";
import Layout from "../../layouts/Layout";
import { useCompany } from "../../context/CompanyContext";
import { useUser } from "../../context/UserContext";
import { useNotification } from "../../context/NotificationContext";
import { usePageTitle } from "../../context/PageTitleContext";
import RoleWrapper from "../../components/RoleWrapper";

interface ShopifyShop {
  _id: string;
  user_id: string;
  shop: string;
  status: "connected" | "disconnected";
}

export default function ShopifyPage() {
  const [shops, setShops] = useState<ShopifyShop[]>([]);
  const [loading, setLoading] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [shopDomain, setShopDomain] = useState("");
  const [connecting, setConnecting] = useState(false);
  const { user } = useUser();
  const { notify } = useNotification();
  const { setTitle } = usePageTitle();
  const { currentCompanyId } = useCompany();

  useEffect(() => {
    setTitle("Shopify");
  }, [setTitle]);

  useEffect(() => {
    fetchShops();
  }, [currentCompanyId]);

  const fetchShops = async () => {
    if (!currentCompanyId) return;

    setLoading(true);
    try {
      const baseUrl = import.meta.env.VITE_API_URL || "";
      const url = `${baseUrl}/shopify/company?company_id=${encodeURIComponent(currentCompanyId)}`;

      const res = await axios.get(url, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });

      setShops(res.data);
    } catch (err) {
      console.error("Failed to fetch Shopify shops", err);
      notify("error", "Failed to fetch Shopify shops");
    } finally {
      setLoading(false);
    }
  };

  const handleConnect = () => {
    const domain = shopDomain.trim().replace(/^https?:\/\//, "").replace(/\/$/, "");
    if (!domain) {
      notify("error", "Please enter your Shopify store domain.");
      return;
    }

    const user_id = user?.id || "";
    const company_id = currentCompanyId || user?.company_id || "";
    const baseUrl = import.meta.env.VITE_API_URL || "";

    if (!user_id || !company_id) {
      notify("error", "Please select a company before connecting Shopify.");
      return;
    }
    
    setConnecting(true);
    const oauthUrl = `${baseUrl}/shopify/auth?user_id=${encodeURIComponent(user_id)}&company_id=${encodeURIComponent(company_id)}&shop=${encodeURIComponent(domain)}`;
    window.location.href = oauthUrl;
  };

  const handleRemove = async (id: string) => {
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL || ""}/shopify/${id}`);
      setShops(prev => prev.filter(shop => shop._id !== id));
    } catch (err) {
      console.error("Failed to remove Shopify shop", err);
      notify("error", "Failed to remove Shopify shop");
    }
  };

  return (
    <Layout>
      <div className="p-4">
        <div className="border border-gray-300  p-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-gray-700">Shopify Stores</h3>
            <RoleWrapper allowedRoles={["company_owner", "store_owner"]} userRole={user?.role || "agent"}>
              <button
                onClick={() => { setShowAddForm(true); setShopDomain(""); }}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 text-sm font-medium"
              >
                + Add Store
              </button>
            </RoleWrapper>
          </div>

          {loading ? (
            <p className="text-gray-500">Loading Shopify stores...</p>
          ) : shops.length === 0 ? (
            <p className="text-gray-500">No Shopify stores connected yet.</p>
          ) : (
            <ul className="divide-y divide-gray-200">
              {shops.map(shop => (
                <li key={shop._id} className="py-3 flex items-center justify-between">
                  <div>
                    <p className="text-gray-800 font-medium">{shop.shop}</p>
                    <p className={`text-sm ${shop.status === "connected" ? "text-green-600" : "text-red-500"}`}>
                      {shop.status === "connected" ? "Connected" : "Disconnected"}
                    </p>
                  </div>
                  <RoleWrapper allowedRoles={["company_owner", "store_owner"]} userRole={user?.role || "agent"}>
                    <button
                      onClick={() => handleRemove(shop._id)}
                      className="text-sm text-red-500 hover:underline"
                    >
                      Remove
                    </button>
                  </RoleWrapper>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Add Store Modal */}
        {showAddForm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={() => { setShowAddForm(false); setShopDomain(""); }}>
            <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md mx-4" onClick={(e) => e.stopPropagation()}>
              <h4 className="text-lg font-semibold text-gray-800 mb-1">Connect Shopify Store</h4>
              <p className="text-sm text-gray-500 mb-4">
                Enter your store's <code className="bg-gray-100 px-1 rounded">.myshopify.com</code> domain.
                You'll be redirected to Shopify to authorize the connection.
              </p>
              <label className="block text-sm font-medium text-gray-700 mb-1">Store Domain</label>
              <input
                type="text"
                value={shopDomain}
                onChange={(e) => setShopDomain(e.target.value)}
                placeholder="mystore.myshopify.com"
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm mb-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                onKeyDown={(e) => e.key === "Enter" && handleConnect()}
                autoFocus
              />
              <p className="text-xs text-gray-400 mb-5">
                Find it in your Shopify Admin under <strong>Settings → Domains</strong>.
              </p>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => { setShowAddForm(false); setShopDomain(""); }}
                  className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 border border-gray-300 rounded"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConnect}
                  disabled={connecting || !shopDomain.trim()}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 text-sm font-medium rounded disabled:opacity-50"
                >
                  {connecting ? "Connecting..." : "Connect"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
