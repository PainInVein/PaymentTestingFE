export default function PaymentCancel() {
  return (
    <div style={{ textAlign: "center", padding: "60px 20px" }}>
      <h1 style={{ color: "#dc3545" }}>Thanh toán bị hủy</h1>
      <p>Bạn đã hủy quá trình thanh toán.</p>
      <button onClick={() => (window.location.href = "/")}>Thử lại</button>
    </div>
  );
}
