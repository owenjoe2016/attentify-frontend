import { useEffect } from "react";
import Layout from "../../layouts/AdminLayout";
import { usePageTitle } from "../../context/PageTitleContext";

export default function Dashboard() {
  const { setTitle } = usePageTitle();

  useEffect(() => {
    setTitle("Dashboard");
  }, [setTitle]);

  return (
    <Layout>
      <div className="p-6">
        <div className="text-xl text-gray-700 font-semibold"> Admin Dashboard</div>
          <div className="mt-4 text-gray-500">
            <p>This page is under the contruction.</p>
          </div>
      </div>
    </Layout>
  );
}