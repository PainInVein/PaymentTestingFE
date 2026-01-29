// src/components/PaymentButton.jsx
import { useEffect, useState } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
// Change to your ngrok/public URL later, e.g. https://abc123.ngrok-free.app

// For demo – you can pass this as prop or get from URL/Redux/context later
const DEFAULT_SUBSCRIPTION_ID = "7e259b3e-b40f-4bbf-b770-a221ad8670f0";

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

  // Load payOS SDK once
  useEffect(() => {
    const script = document.createElement("script");
    script.src =
      "https://cdn.payos.vn/payos-checkout/v1/stable/payos-initialize.js";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

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
          throw new Error(res.data.message || "Không tìm thấy gói");
        }
      } catch (err) {
        console.error(err);
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
        {
          amount: subscription.subscriptionPrice,
          description: `${subscription.subscriptionName} - ${subscription.description || "Gói đăng ký"}`,
        },
      );

      // Adjust according to your actual response shape
      // If using ResponseDTO: res.data.data.checkoutUrl or res.data.checkoutUrl
      const { checkoutUrl } = res.data.data || res.data;

      if (!checkoutUrl) {
        throw new Error("Không nhận được link thanh toán");
      }

      if (!window.PayOS) {
        throw new Error("payOS SDK chưa sẵn sàng. Thử lại sau vài giây.");
      }

      window.PayOS.open({
        checkoutUrl,
        onSuccess: (response) => {
          toast.success(
            `Thanh toán thành công! Mã đơn: ${response.orderCode || "—"}`,
          );
          setTimeout(() => {
            window.location.href = "/payment/success";
          }, 1500);
        },
        onCancel: () => {
          toast.error("Thanh toán đã bị hủy");
        },
        onClose: () => {
          toast("Cửa sổ thanh toán đã đóng", { icon: "⚠️" });
        },
      });
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Lỗi khởi tạo thanh toán");
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
