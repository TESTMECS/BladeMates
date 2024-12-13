import { Link } from "react-router-dom";
import { useAuth } from "../context/userContext";
import { HomeIcon, UserIcon } from "@heroicons/react/outline";
interface NavbarProps {
  setCurrentFeed: (feed: string) => void;
}
const Navbar: React.FC<NavbarProps> = () => {
  const { isAuthenticated, user } = useAuth();

  return (
    <header>
      <div className="mx-auto px-4 sm:px-6 lg:px-8">
        <nav className="flex flex-col h-16 space-y-4">
          <div className="flex flex-col space-y-4">
            <Link
              to="/home"
              className="flex items-center hover:text-lightblue dark:hover:text-purple px-3 py-2 rounded-md text-lg font-semibold transition-colors duration-200"
            >
              LOGO HERE
            </Link>

            {isAuthenticated && (
              <>
                <Link
                  to="/home"
                  className="flex items-center hover:text-lightblue dark:hover:text-purple px-3 py-2 rounded-md text-lg font-semibold transition-colors duration-200"
                >
                  <HomeIcon className="h-5 w-5 mr-1" aria-hidden="true" />
                  Home
                </Link>
                <Link
                  to={`/profile/${user.username}`} // Use dynamic username
                  className="flex items-center hover:text-lightblue dark:hover:text-purple px-3 py-2 rounded-md text-lg font-semibold transition-colors duration-200"
                >
                  <UserIcon className="h-5 w-5 mr-1" aria-hidden="true" />
                  Profile
                </Link>
              </>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
