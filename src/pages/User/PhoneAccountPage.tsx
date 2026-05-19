import { useEffect, useState } from "react";
import Layout from "../../layouts/Layout";
import { useNotification } from "../../context/NotificationContext";
import { usePageTitle } from "../../context/PageTitleContext";
import { useUser } from "../../context/UserContext";
import RoleWrapper from "../../components/RoleWrapper";

interface PhoneAccount {
  id: string;
  phone: string;
}

// Demo data for local development or fallback
const phoneNumbers = [
  { id: "1", phone: "+18888179263", status: "connected" },
];

export default function PhoneAccountPage() {
  const [accounts, setAccounts] = useState<PhoneAccount[]>([]);
  const [loading, setLoading] = useState(false);
  const { notify } = useNotification();
  const { setTitle } = usePageTitle();
  const { user } = useUser();

  useEffect(() => {
    setTitle("Accounts/Phone");
  }, [setTitle]);

  useEffect(() => {
    fetchAccounts();
  }, []);

  const fetchAccounts = async () => {
    setLoading(true);
    try {
      // Uncomment for real API call:
      // const res = await axios.get(`${import.meta.env.VITE_API_URL || ""}/phone`);
      // setAccounts(res.data);
      setAccounts(phoneNumbers);
    } catch (err) {
      console.error("Failed to fetch phone accounts", err);
      notify("error", "Failed to fetch phone accounts");
    } finally {
      setLoading(false);
    }
  };

  const handleConnect = () => {
    const connectUrl = `${import.meta.env.VITE_API_URL || ""}/phone/connect`;
    window.location.href = connectUrl;
  };

  const handleRemove = async (id: string) => {
    try {
      // Uncomment for real API call:
      // await axios.delete(`${import.meta.env.VITE_API_URL || ""}/phone/${id}`);
      setAccounts(prev => prev.filter(account => account.id !== id));
    } catch (err) {
      console.error("Failed to remove phone account", err);
      notify("error", "Failed to remove phone account");
    }
  };

  return (
    <Layout>
      <div className="p-3">
        <div className="border border-gray-300  p-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-gray-700">Phone Accounts</h3>
            <RoleWrapper allowedRoles={["company_owner", "store_owner"]} userRole={user?.role || "agent"}>
              <button
                onClick={handleConnect}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2  text-sm font-medium"
              >
                + Connect Phone
              </button>
            </RoleWrapper>
          </div>
          {loading ? (
            <p className="text-gray-500">Loading accounts...</p>
          ) : accounts.length === 0 ? (
            <p className="text-gray-500">No phone accounts connected yet.</p>
          ) : (
            <ul className="divide-y divide-gray-200">
              {accounts.map(account => (
                <li key={account.id} className="py-3 flex items-center justify-between">
                  <div>
                    <p className="text-gray-800 font-medium">{account.phone}</p>
                  </div>
                  <RoleWrapper allowedRoles={["company_owner", "store_owner"]} userRole={user?.role || "agent"}>
                    <button
                      onClick={() => handleRemove(account.id)}
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
      </div>
    </Layout>
  );
}