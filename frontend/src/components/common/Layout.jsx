import Navbar from "./Navbar";

function Layout({ children }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main >{children}</main>
    </div>
  );
}

export default Layout;