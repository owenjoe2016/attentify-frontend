import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../context/UserContext";
import { useCompany } from "../../context/CompanyContext";
import { useNotification } from "../../context/NotificationContext"; 

interface InvitationInfo {
	company_name: string;
	role: string;
	invitation_id: string;
}

export default function AskAcceptInvitation() {
	const [invitation, setInvitation] = useState<InvitationInfo | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");
	const navigate = useNavigate();
	const { setUser } = useUser();
	const { setCompanies, setCurrentCompanyId } = useCompany();
	const { notify } = useNotification();

	useEffect(() => {
		async function fetchInvitation() {
			try {
				const res = await axios.get(
					`${import.meta.env.VITE_API_URL}/invitations/invitation-status`,
					{
						headers: {
							Authorization: `Bearer ${localStorage.getItem("token")}`,
						},
					}
				);
				setInvitation(res.data);
			} catch (err: any) {
				setError(
					err.response?.data?.detail || "Failed to fetch invitation details."
				);
			} finally {
				setLoading(false);
			}
		}
		fetchInvitation();
	}, []);

	const handleAccept = async () => {
		try {
			const res = await axios.post(
				`${import.meta.env.VITE_API_URL}/invitations/invitation-accept`,
				{ invitation_id: invitation?.invitation_id },
				{
					headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
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
			notify("error", err.response?.data?.detail || "Failed to accept invitation.");
		}
	};

	const handleCancel = async () => {
		try {
			await axios.post(
				`${import.meta.env.VITE_API_URL}/invitations/invitation-cancel`,
				{ invitation_id: invitation?.invitation_id },
				{
					headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
				}
			);
			navigate("/register-company");
		} catch (err: any) {
			notify("error", err.response?.data?.detail || "Failed to cancel invitation.");
		}
	};

	if (loading) return <p>Loading invitation details...</p>;
	if (error) return <p style={{ color: "red" }}>{error}</p>;

	return (
		<div style={{ maxWidth: 500, margin: "auto", textAlign: "center" }}>
			<h2>You've Been Invited!</h2>
			{invitation && (
				<>
					<p>
						You have been invited to join <b>{invitation.company_name}</b> as a{" "}
						<b>{invitation.role}</b>.
					</p>
					<div style={{ marginTop: 20 }}>
						<button
							onClick={handleAccept}
							style={{
								padding: "10px 20px",
								marginRight: 10,
								background: "green",
								color: "white",
							}}
						>
							Accept
						</button>
						<button
							onClick={handleCancel}
							style={{
								padding: "10px 20px",
								background: "gray",
								color: "white",
							}}
						>
							Cancel
						</button>
					</div>
				</>
			)}
		</div>
	);
}
