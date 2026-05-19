import { useCompany } from "../context/CompanyContext";
import { usePageTitle } from "../context/PageTitleContext";

interface HeaderBarProps {
  onMenuClick: () => void;
  isMobile: boolean;
}

export default function HeaderBar({ onMenuClick, isMobile }: HeaderBarProps) {
  const { companies, currentCompanyId, setCurrentCompanyId } = useCompany();
  const { title } = usePageTitle();

  return (
    <div className="flex items-center justify-between px-5 h-16 border-b border-gray-300 bg-white z-[9999]">
      <div className="flex items-center gap-4">
        {isMobile && (
          <button
            onClick={onMenuClick}
            className="text-gray-700 focus:outline-none"
            aria-label="Toggle sidebar"
          >
            ☰
          </button>
        )}
        <p className="text-md font-semibold">{title}</p>
      </div>

      <div className="flex items-center gap-4">
        <select
          value={currentCompanyId}
          onChange={(e) => setCurrentCompanyId(e.target.value)}
          className="border border-gray-300  px-2 py-1 text-sm focus:outline-none focus:ring focus:border-blue-300"
        >
          {companies.map((company) => (
            <option key={company.id} value={company.id}>
              {company.name}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
