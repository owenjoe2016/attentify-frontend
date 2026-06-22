import { useCallback, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import Layout from "../../layouts/Layout";
import OrderInfoCard from "../../components/OrderInfoCard";
import type { OrderInfo } from "../../types";
import { useCompany } from "../../context/CompanyContext";
import { useNotification } from "../../context/NotificationContext";
import { usePageTitle } from "../../context/PageTitleContext";
import {
  fetchOrderDetailCached,
  getCachedOrderDetail,
} from "../../utils/orderPreload";

export default function OrderDetailPage() {
  const { orderId } = useParams<{ orderId: string }>();
  const { currentCompanyId } = useCompany();
  const { notify } = useNotification();
  const { setTitle } = usePageTitle();
  const cachedOrderInfo = getCachedOrderDetail(currentCompanyId, orderId);
  const [orderInfo, setOrderInfo] = useState<OrderInfo | null>(cachedOrderInfo);
  const [loading, setLoading] = useState(!cachedOrderInfo);
  const [error, setError] = useState<string | null>(null);

  const fetchOrder = useCallback(async (options: { force?: boolean } = {}) => {
    if (!orderId || !currentCompanyId) return;

    const nextCachedOrderInfo = getCachedOrderDetail(currentCompanyId, orderId);
    if (!options.force && nextCachedOrderInfo) {
      setOrderInfo(nextCachedOrderInfo);
      setTitle(`Order ${nextCachedOrderInfo.order_id || orderId}`);
      setLoading(false);
      return;
    }

    setLoading(!orderInfo);
    setError(null);
    try {
      const nextOrderInfo = await fetchOrderDetailCached(currentCompanyId, orderId, options);
      setTitle(`Order ${nextOrderInfo.order_id || orderId}`);
      setOrderInfo(nextOrderInfo);
    } catch (err) {
      console.error("Failed to fetch order", err);
      setError("Failed to fetch order.");
      notify("error", "Failed to fetch order");
    } finally {
      setLoading(false);
    }
  }, [currentCompanyId, notify, orderId, orderInfo, setTitle]);

  useEffect(() => {
    setTitle("Order Detail");
  }, [setTitle]);

  useEffect(() => {
    fetchOrder();
  }, [fetchOrder]);

  const orderOptions = orderInfo?.shopify_order
    ? [{ value: orderInfo.shopify_order.name, label: orderInfo.shopify_order.name }]
    : [];

  return (
    <Layout>
      <div className="flex h-[calc(100vh-5rem)] flex-col overflow-hidden p-4">
        <div className="mb-4 shrink-0">
          <Link
            to="/order"
            className="inline-flex items-center gap-2 border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            <ArrowLeftIcon className="h-4 w-4" />
            Back to Orders
          </Link>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto">
          <div className="grid max-w-6xl grid-cols-1 gap-6 xl:grid-cols-[420px_1fr]">
            <OrderInfoCard
              order={orderInfo}
              loading={loading}
              error={error}
              orderOptions={orderOptions}
              readOnlyOrderSelection
              layout="detail"
              onOrderNameChanged={() => {}}
              showConfirmButton={false}
              isOrderConfirmed={false}
              onConfirm={() => {}}
              onActionCompleted={() => fetchOrder({ force: true })}
            />
          </div>
        </div>
      </div>
    </Layout>
  );
}
