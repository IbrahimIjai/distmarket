import Navbar from "./Nav";
import Footer from "./Footer";
export default function Layout({ children }) {
  return (
    <div>
      <Navbar />
      {children}
      {/* <Footer /> */}
      <h1 style={{ textAlign: "center", margin: "10px 0" }}>Footer</h1>
    </div>
  );
}
