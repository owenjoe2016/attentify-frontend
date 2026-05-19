import { useEffect } from "react";
import Layout from "../../layouts/Layout";
import { usePageTitle } from "../../context/PageTitleContext";

export default function Dashboard() {
  const { setTitle } = usePageTitle();

  useEffect(() => {
    setTitle("Dashboard");
  }, [setTitle]);

  return (
    <Layout>
        <div className="p-3">
          <div className="mt-2 text-gray-500">
            <p>
                This page is under the contruction.
            </p>
          </div>
        </div>
    </Layout>
  );
}