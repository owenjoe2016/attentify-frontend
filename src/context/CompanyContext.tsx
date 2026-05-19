import { createContext, useContext, useState, useEffect } from "react";
import React from "react";

interface Company {
  id: string;
  name: string;
}

interface CompanyContextType {
  companies: Company[];
  currentCompanyId: string;
  setCompanies: (companies: Company[]) => void;
  setCurrentCompanyId: (id: string) => void;
}

const CompanyContext = createContext<CompanyContextType | undefined>(undefined);

export const useCompany = () => {
  const context = useContext(CompanyContext);
  if (!context) throw new Error("useCompany must be used within CompanyProvider");
  return context;
};

interface CompanyProviderProps {
  children: React.ReactNode;
}

export const CompanyProvider = ({ children }: CompanyProviderProps) => {
  // Load initial state from localStorage or defaults
  const [companies, setCompanies] = useState<Company[]>(() => {
    const stored = localStorage.getItem("companies");
    return stored ? JSON.parse(stored) : [];
  });

  const [currentCompanyId, setCurrentCompanyId] = useState<string>(() => {
    return localStorage.getItem("currentCompanyId") || "";
  });

  // Sync companies to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("companies", JSON.stringify(companies));
  }, [companies]);

  // Sync currentCompanyId to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("currentCompanyId", currentCompanyId);
  }, [currentCompanyId]);

  return (
    <CompanyContext.Provider
      value={{ companies, currentCompanyId, setCurrentCompanyId, setCompanies }}
    >
      {children}
    </CompanyContext.Provider>
  );
};
