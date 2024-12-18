import { Link } from "react-router-dom";
import { useAuth } from "../context/userContext";
import { UserIcon, BellIcon } from "@heroicons/react/outline";

interface NavbarProps {
  setCurrentFeed: (feed: string) => void;
}
const Navbar: React.FC<NavbarProps> = ({ setCurrentFeed }) => {
  const { isAuthenticated, user } = useAuth();

  return (
    <header>
      <div className="mx-auto px-4 sm:px-6 lg:px-8">
        <nav className="flex flex-col h-16 space-y-4">
          <div className="flex flex-col space-y-4">
            <h2 className="flex items-center text-gradient px-3 py-2 rounded-md text-lg font-semibold">
              Tech Trends
            </h2>

            {isAuthenticated && (
              <>
                <Link
                  to={`/profile/${user?.id}`}
                  className="flex items-center hover:text-lightblue dark:hover:text-purple px-3 py-2 rounded-md text-lg font-semibold transition-colors duration-200"
                >
                  <UserIcon className="h-5 w-5 mr-1" aria-hidden="true" />
                  Profile
                </Link>

                {/* Notifications */}
                <button
                  className="flex items-center hover:text-lightblue dark:hover:text-purple px-3 py-2 rounded-md text-lg font-semibold transition-colors duration-200"
                  onClick={() => setCurrentFeed("Notifications")}
                >
                  <BellIcon className="h-5 w-5 mr-1" aria-hidden="true" />
                  Notifcations
                </button>
              </>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
