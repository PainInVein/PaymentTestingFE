export default function PaymentSuccess() {
  return (
    <div style={{ textAlign: "center", padding: "60px 20px" }}>
      <h1 style={{ color: "#28a745" }}>Thanh toán thành công!</h1>
      <p>Cảm ơn bạn đã thanh toán. Gói dịch vụ đã được kích hoạt.</p>
      <p>Chúng tôi đang xử lý và cập nhật trạng thái trong hệ thống.</p>
      <button onClick={() => (window.location.href = "/")}>
        Quay về trang chủ
      </button>
    </div>
  );
}
