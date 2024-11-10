import { Link } from "react-router-dom";
import { useAuth } from "../context/userContext";

const Header = () => {
  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav className="flex justify-between h-16 items-center">
          <div className="flex space-x-8">
            <Link
              to="/home"
              className="text-gray-600 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
            >
              Home
            </Link>
            {useAuth().isAuthenticated && (
              <Link
                to="/profile/:username"
                className="text-gray-600 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
              >
                Profile
              </Link>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header;
