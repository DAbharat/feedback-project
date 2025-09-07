import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="bg-gray-800 text-white p-5 flex items-center relative">
      {/* Logo (optional, left) */}
      <div className="absolute left-4">
        {/* <Link to="/">Logo</Link> */}
      </div>
      {/* Centered links */}
      <div className="flex-1 flex justify-center gap-8 text-lg font-semibold">
        <Link to="/">Home</Link>
        <Link to="/feedback">Feedback</Link>
        <Link to="/form">Form</Link>
      </div>
      {/* Profile icon on right */}
      <div className="absolute right-4">
        <Link to="/profile">
          <i className="fa-solid fa-user text-xl"></i>
        </Link>
      </div>
    </nav>
  );
}

export default Navbar;