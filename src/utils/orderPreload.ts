import axios from "axios";
import type { OrderInfo, ShopifyOrder } from "../types";

const API_URL = import.meta.env.VITE_API_URL || "";
const ORDER_DETAIL_TTL_MS = 5 * 60 * 1000;
const MAX_ORDER_PRELOADS = 10;

type Cached<T> = {
  value: T;
  storedAt: number;
};

const orderDetailCache = new Map<string, Cached<OrderInfo>>();
const orderDetailInflight = new Map<string, Promise<OrderInfo>>();

function cacheKey(companyId: string, orderId: string) {
  return `${companyId}:${orderId}`;
}

function authHeaders() {
  return { Authorization: `Bearer ${localStorage.getItem("token")}` };
}

function toOrderInfo(order: ShopifyOrder, fallbackOrderId: string): OrderInfo {
  return {
    order_id: String(order.name || order.order_id || fallbackOrderId),
    type: "order",
    status: 1,
    msg: "",
    confirmed: true,
    shopify_order: order,
  };
}

export function getCachedOrderDetail(companyId?: string, orderId?: string): OrderInfo | null {
  if (!companyId || !orderId) return null;
  const entry = orderDetailCache.get(cacheKey(companyId, orderId));
  if (!entry || Date.now() - entry.storedAt >= ORDER_DETAIL_TTL_MS) {
    if (companyId && orderId) orderDetailCache.delete(cacheKey(companyId, orderId));
    return null;
  }
  return entry.value;
}

export function setCachedOrderDetail(companyId: string, orderId: string, orderInfo: OrderInfo) {
  orderDetailCache.set(cacheKey(companyId, orderId), {
    value: orderInfo,
    storedAt: Date.now(),
  });
}

export async function fetchOrderDetailCached(
  companyId: string,
  orderId: string,
  options: { force?: boolean } = {}
): Promise<OrderInfo> {
  const key = cacheKey(companyId, orderId);
  const cached = getCachedOrderDetail(companyId, orderId);
  if (!options.force && cached) return cached;

  const inflight = orderDetailInflight.get(key);
  if (inflight) return inflight;

  const request = axios
    .get(`${API_URL}/shopify/orders`, {
      params: {
        search: orderId,
        page: 1,
        size: 1,
        shop: "",
        company_id: companyId,
        include_actions: true,
      },
      headers: authHeaders(),
    })
    .then((response) => {
      const order = response.data.orders?.[0] as ShopifyOrder | undefined;
      if (!order) {
        throw new Error("Order not found.");
      }
      const orderInfo = toOrderInfo(order, orderId);
      setCachedOrderDetail(companyId, orderId, orderInfo);
      return orderInfo;
    })
    .finally(() => {
      orderDetailInflight.delete(key);
    });

  orderDetailInflight.set(key, request);
  return request;
}

export function preloadOrderPage(
  companyId: string,
  orders: Array<{ name?: string; order_id?: string | number }>
) {
  const candidates = orders.slice(0, MAX_ORDER_PRELOADS);

  window.setTimeout(async () => {
    for (const order of candidates) {
      const orderId = String(order.name || order.order_id || "");
      if (!orderId || getCachedOrderDetail(companyId, orderId)) continue;
      try {
        await fetchOrderDetailCached(companyId, orderId);
      } catch {
        // Preload is best-effort; the detail page still handles failures.
      }
    }
  }, 250);
}
