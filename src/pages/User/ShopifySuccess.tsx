import React from "react";

const getShopFromUrl = (): string | null => {
  const params = new URLSearchParams(window.location.search);
  return params.get("shop");
};

const Success: React.FC = () => {
  const shop = getShopFromUrl();

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-green-100 to-blue-100">
      <div className="bg-white shadow-xl  p-8 max-w-md w-full text-center">
        <svg
          className="mx-auto mb-4 h-16 w-16 text-green-500"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M9 12l2 2l4-4"
          />
        </svg>
        <h1 className="text-3xl font-bold mb-2 text-green-700">Connected!</h1>
        <p className="mb-4 text-gray-700">
          Your Shopify store{shop ? ` (${shop})` : ""} has been successfully connected.
        </p>
        <a
          href="/shopify"
          className="inline-block px-6 py-2 bg-blue-600 text-white  hover:bg-blue-700 transition"
        >
          Go Back
        </a>
      </div>
    </div>
  );
};

export default Success;