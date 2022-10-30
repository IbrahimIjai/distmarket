import Navbar from "./Nav";
import Footer from "./Footer";
export default function Layout({ children }) {
  return (
    <div>
      <div>
        <Navbar />
      </div>
      {children}
      <Footer />
    </div>
  );
}
