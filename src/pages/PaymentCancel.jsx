import { useState, useEffect } from "react";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export default function PaymentCancel() {
  const [paymentInfo] = useState(() => {
    const params = new URLSearchParams(window.location.search);

    return {
      code: params.get("code") || "N/A",
      paymentLinkId: params.get("id") || "N/A",
      cancel: params.get("cancel") || "N/A",
      status: params.get("status") || "N/A",
      orderCode: params.get("orderCode") || "N/A",
    };
  });
  const [notifyStatus, setNotifyStatus] = useState(""); // optional: show feedback

  useEffect(() => {
    // Skip if no valid orderCode (prevents useless calls)
    if (!paymentInfo.orderCode || paymentInfo.orderCode === "N/A") {
      console.warn("No valid orderCode found in URL — skipping backend notify");
      return;
    }

    const notifyBackend = async () => {
      try {
        // Build query string from the same params
        const params = new URLSearchParams({
          Code: paymentInfo.code,
          PaymentLinkId: paymentInfo.paymentLinkId,
          Status: paymentInfo.status,
          OrderCode: paymentInfo.orderCode, // backend expects long → string is fine
          Cancel: paymentInfo.cancel,
        });

        const url = `${BACKEND_URL}/api/SubscriptionPayment/cancel-payment?${params.toString()}`;

        const response = await fetch(url, {
          method: "GET",
          headers: {
            Accept: "application/json",
            // Add Authorization header if your endpoint requires auth
            // "Authorization": `Bearer ${token}`,
            "ngrok-skip-browser-warning": "true",
          },
        });

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(
            `Backend responded with ${response.status}: ${errorText}`,
          );
        }

        const data = await response.json();
        console.log("Backend cancel update success:", data);

        // Optional: show success message in UI
        setNotifyStatus("Đã thông báo hủy thanh toán cho hệ thống.");
      } catch (err) {
        console.error("Failed to notify backend about cancellation:", err);
        // Optional: show error (non-blocking — don't block UI)
        setNotifyStatus(
          "Không thể cập nhật trạng thái hủy (lỗi mạng). Vui lòng liên hệ hỗ trợ nếu cần.",
        );
      }
    };

    notifyBackend();

    // Optional: prevent resending on hot-reload / StrictMode double mount in dev
    // You can add a simple flag or use a ref if needed in production
  }, [paymentInfo]); // only run when paymentInfo changes (practically once)

  return (
    <div
      style={{
        textAlign: "center",
        padding: "60px 20px",
        maxWidth: "600px",
        margin: "0 auto",
      }}
    >
      <h1 style={{ color: "#dc3545", marginBottom: "24px" }}>
        Thanh toán bị hủy
      </h1>

      <p style={{ fontSize: "18px", marginBottom: "32px" }}>
        Bạn đã hủy quá trình thanh toán. Không có khoản phí nào được trừ.
      </p>

      {/* Optional feedback area */}
      {notifyStatus && (
        <p
          style={{
            color: notifyStatus.includes("lỗi") ? "#dc3545" : "#198754",
            marginBottom: "20px",
            fontWeight: "500",
          }}
        >
          {notifyStatus}
        </p>
      )}

      <div
        style={{
          background: "#f8f9fa",
          borderRadius: "8px",
          padding: "24px",
          marginBottom: "32px",
          textAlign: "left",
          border: "1px solid #dee2e6",
        }}
      >
        <h3 style={{ marginTop: 0, color: "#495057" }}>Chi tiết:</h3>
        <p>
          <strong>Mã trạng thái:</strong> {paymentInfo.code}
        </p>
        <p>
          <strong>ID giao dịch (Payment Link ID):</strong>{" "}
          {paymentInfo.paymentLinkId}
        </p>
        <p>
          <strong>Trạng thái:</strong> {paymentInfo.status}
        </p>
        <p>
          <strong>Mã đơn hàng (Order Code):</strong> {paymentInfo.orderCode}
        </p>
        <p>
          <strong>Hủy:</strong> {paymentInfo.cancel}
        </p>
      </div>

      <div style={{ display: "flex", gap: "16px", justifyContent: "center" }}>
        <button
          onClick={() => (window.location.href = "/")} // or "/subscriptions" etc.
          style={{
            padding: "12px 32px",
            fontSize: "16px",
            background: "#0d6efd",
            color: "white",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
          }}
        >
          Quay về trang chủ
        </button>

        <button
          onClick={() =>
            (window.location.href = `/payment?orderCode=${paymentInfo.orderCode}`)
          } // better than reload
          style={{
            padding: "12px 32px",
            fontSize: "16px",
            background: "#6c757d",
            color: "white",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
          }}
        >
          Thử thanh toán lại
        </button>
      </div>
    </div>
  );
}
