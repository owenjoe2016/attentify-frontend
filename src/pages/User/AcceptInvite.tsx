import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";

interface InvitationDetails {
  email: string;
  company_id: string;
  role: string;
  expires_at: string;
}

const AcceptInvitePage: React.FC = () => {
  const [invitation, setInvitation] = useState<InvitationDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [accepting, setAccepting] = useState(false);
  const [success, setSuccess] = useState(false);

  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      setError("Invitation token is missing.");
      setLoading(false);
      return;
    }

    const fetchInvitation = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/invitations/invitation-status/${token}`
        );
        setInvitation(res.data);
      } catch (err: any) {
        setError(err.response?.data?.detail || "Failed to load invitation.");
      } finally {
        setLoading(false);
      }
    };

    fetchInvitation();
  }, [token]);

  const handleAccept = async () => {
    if (!token) return;
    setAccepting(true);
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/invitations/accept-invitation-token`,
        { token: token },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setSuccess(true);
      setTimeout(() => navigate(res.data.redirect_url), 1500);
    } catch (err: any) {
      setError(err.response?.data?.detail || "Failed to accept invitation.");
    } finally {
      setAccepting(false);
    }
  };

  if (loading) return <div className="p-6 text-center">Loading...</div>;
  if (error) return <div className="p-6 text-red-500 text-center">{error}</div>;

  return (
    <div className="max-w-md mx-auto mt-20 p-6 border rounded shadow">
      <h1 className="text-xl font-bold mb-4">Invitation</h1>
      {invitation && (
        <>
          <p>
            <span className="font-semibold">Email:</span> {invitation.email}
          </p>
          <p>
            <span className="font-semibold">Role:</span> {invitation.role}
          </p>
          <button
            onClick={handleAccept}
            disabled={accepting || success}
            className={`mt-6 w-full py-2 px-4 rounded ${accepting || success
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700 text-white"
              }`}
          >
            {accepting ? "Accepting..." : success ? "Accepted!" : "Accept Invitation"}
          </button>
        </>
      )}
    </div>
  );
};

export default AcceptInvitePage;
