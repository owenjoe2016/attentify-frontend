export type User = {
    _id: string;
    email: string,
    first_name: string;
    last_name: string;
    role: "admin" | "company_owner" | "store_owner" | "agent" | "readonly";
    status: "active" | "invited" | "suspended";
    team_id?: string;
    created_at?: string;
    updated_at?: string;
    last_login?: string;
}