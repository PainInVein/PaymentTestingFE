import PaymentButton from "./components/PaymentButton";

function App() {
  return (
    <div style={{ padding: "40px", maxWidth: "600px", margin: "0 auto" }}>
      <h1>Thanh toán với payOS</h1>
      <p>Nhấn nút bên dưới để thanh toán gói dịch vụ.</p>
      <PaymentButton />
    </div>
  );
}

export default App;
