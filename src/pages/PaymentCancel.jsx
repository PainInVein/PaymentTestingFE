import { useState } from "react";

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
          onClick={() => (window.location.href = "/")} // or "/subscriptions" / dashboard
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
          onClick={() => window.location.reload()} // or navigate to payment page again
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
