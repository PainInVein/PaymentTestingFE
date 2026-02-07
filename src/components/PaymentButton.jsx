// src/components/PaymentButton.jsx
import { useEffect, useState } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const DEFAULT_SUBSCRIPTION_ID = "c9391943-fb94-46c6-8c1c-3dc2752e5073";
const USER_ID = "d42ad28b-533b-4c99-8b49-edd59912eb32";

const api = axios.create({
  headers: {
    common: {
      "ngrok-skip-browser-warning": "true",
    },
  },
});

export default function PaymentButton({
  subscriptionId = DEFAULT_SUBSCRIPTION_ID,
}) {
  const [loading, setLoading] = useState(false);
  const [subscription, setSubscription] = useState(null);
  const [fetchError, setFetchError] = useState(null);

  // Fetch subscription details
  useEffect(() => {
    const fetchSubscription = async () => {
      try {
        const res = await api.get(
          `${BACKEND_URL}/api/Subscription?subscriptionId=${subscriptionId}`,
        );

        if (res.data.isSuccess && res.data.result) {
          setSubscription(res.data.result);
        } else {
          throw new Error(res.data.message || "Không tìm thấy gói1");
        }
      } catch (err) {
        console.error("Failed to fetch subscription:", err);
        setFetchError(
          err.response?.data?.message || "Không thể tải thông tin gói",
        );
        toast.error("Không thể tải thông tin gói đăng ký");
      }
    };

    fetchSubscription();
  }, [subscriptionId]);

  const handlePay = async () => {
    if (!subscription) {
      toast.error("Chưa có thông tin gói. Vui lòng thử lại.");
      return;
    }

    setLoading(true);

    try {
      const res = await api.post(
        `${BACKEND_URL}/api/payment/create-payment-intent`,
        // {
        //   amount: subscription.subscriptionPrice,
        //   description: `${subscription.subscriptionName} - ${subscription.description || "Gói đăng ký"}`,
        // },
        {
          userId: USER_ID,
          subscriptionInfo: {
            subscriptionId: subscription.subscriptionId,
            subscriptionName: subscription.subscriptionName,
            subscriptionPrice: subscription.subscriptionPrice,
            billingPeriod: subscription.billingPeriod,
          },
        },
      );

      // Handle both common response shapes
      const responseData = res.data;

      if (!responseData.isSuccess) {
        throw new Error(responseData.message || "Tạo link thanh toán thất bại");
      }

      const checkoutUrl = responseData.result?.checkoutUrl;

      if (!checkoutUrl) {
        console.error("No checkoutUrl in result:", responseData);
        throw new Error("Không nhận được link thanh toán từ server");
      }

      if (typeof checkoutUrl !== "string" || !checkoutUrl.startsWith("http")) {
        console.error("Invalid checkoutUrl format:", checkoutUrl);
        throw new Error("Link thanh toán không hợp lệ");
      }

      console.log("Redirecting to PayOS:", checkoutUrl);

      // The simplest working method: full redirect
      window.location.href = checkoutUrl;
    } catch (err) {
      console.error("Payment initiation failed:", err);
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        "Lỗi khi khởi tạo thanh toán. Vui lòng thử lại.";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (fetchError) {
    return (
      <div style={{ color: "red", padding: "20px" }}>
        Lỗi: {fetchError}
        <br />
        <button onClick={() => window.location.reload()}>Thử lại</button>
      </div>
    );
  }

  if (!subscription) {
    return <div style={{ padding: "20px" }}>Đang tải thông tin gói...</div>;
  }

  return (
    <>
      <Toaster position="top-center" reverseOrder={false} />
      <div style={{ marginBottom: "16px" }}>
        <h3>{subscription.subscriptionName}</h3>
        <p>{subscription.description}</p>
        <p style={{ fontSize: "20px", fontWeight: "bold", color: "#28a745" }}>
          {subscription.subscriptionPrice.toLocaleString("vi-VN")} VNĐ /{" "}
          {subscription.billingPeriod.toLowerCase()}
        </p>
      </div>

      <button
        onClick={handlePay}
        disabled={loading}
        style={{
          padding: "12px 32px",
          fontSize: "16px",
          background: loading ? "#ccc" : "#0d6efd",
          color: "white",
          border: "none",
          borderRadius: "8px",
          cursor: loading ? "not-allowed" : "pointer",
        }}
      >
        {loading
          ? "Đang xử lý..."
          : `Thanh toán ${subscription.subscriptionPrice.toLocaleString("vi-VN")} VNĐ`}
      </button>
    </>
  );
}
