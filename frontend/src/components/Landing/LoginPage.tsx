import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/userContext";
import Spinner from "../../assets/Spinner";
import WelcomeContent from "./WelcomeContent";
import {
  thrownError,
  customError,
  userIdResponse,
  isCustomError,
  isThrownError,
  createErrorDisplay,
  isUserIdResponse,
} from "../../utils/errors";

const LoginPage: React.FC = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);
  const { loginUser, isAuthenticated, registerUser, updateUser } = useAuth();
  const [customError, setCustomError] = useState<string[]>();
  const [error, setError] = useState<string>();
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkLogin = () => {
      if (isAuthenticated) {
        navigate("/home");
      }
    };
    checkLogin();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    // handle difference between login and register
    e.preventDefault();
    setIsLoading(true);
    if (isRegistering) {
      //REGISTER
      const response: userIdResponse | customError | thrownError | undefined =
        await registerUser(username, password);
      if (isUserIdResponse(response)) {
        // SUCCESS
        const userId: string = response.userId;
        setIsLoading(false);
        updateUser({ id: userId, username: username, friends: [] });
        navigate("/home");
      } else {
        //ERROR
        if (isCustomError(response)) {
          const errorObject: customError = response;
          setIsLoading(false);
          setCustomError(createErrorDisplay(errorObject));
          return;
        }
        if (isThrownError(response)) {
          const errorObject: thrownError = response;
          setIsLoading(false);
          setError(errorObject.error);
          return;
        }
      }
    } else {
      //LOGIN
      const response: userIdResponse | customError | thrownError | undefined =
        await loginUser(username, password);
      if (isUserIdResponse(response)) {
        // SUCCESS
        const userId: string = response.userId;
        setIsLoading(false);
        updateUser({ id: userId, username: username, friends: [] });
        navigate("/home");
      } else {
        // ERROR
        if (isCustomError(response)) {
          const errorObject: customError = response;
          //specific errors
          setIsLoading(false);
          setError("");
          setCustomError(createErrorDisplay(errorObject));
          return;
        }
        if (isThrownError(response)) {
          const errorObject: thrownError = response;
          setIsLoading(false);
          setCustomError([]);
          setError(errorObject.error);
          return;
        }
      }
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left side - Welcome content */}
      <WelcomeContent />

      {/* Right side - Login form */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-20 xl:px-24">
        <div className="max-w-md w-full space-y-8">
          <div>
            <h2 className="mt-6 text-center text-3xl font-extrabold">
              {isRegistering ? "Create an account" : "Login to your account"}
            </h2>
          </div>
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="rounded-md shadow-sm -space-y-px">
              <div>
                <label htmlFor="username" className="sr-only">
                  Username
                </label>
                <input
                  type="text"
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border text-white border-gray placeholder-gray rounded-t-md focus:outline-none focus:ring-lightblue focus:border-lightblue focus:z-10 sm:text-sm"
                  placeholder="Username"
                />
              </div>
              <div>
                <label htmlFor="password" className="sr-only">
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border text-white border-gray placeholder-gray rounded-b-md focus:outline-none focus:ring-lightblue focus:border-lightblue focus:z-10 sm:text-sm"
                  placeholder="Password"
                />
              </div>
            </div>
            {isLoading && <Spinner />}
            {error && <p className="text-red">{error}</p>}
            {customError && customError.length > 0
              ? customError?.map((error, index) => (
                  <p key={index} className="text-red">
                    {error}
                  </p>
                ))
              : null}
            <div className="flex items-center">
              <input
                id="register"
                type="checkbox"
                checked={isRegistering}
                onChange={(e) => setIsRegistering(e.target.checked)}
                className="h-4 w-4 text-lightblue focus:ring-lightblue border-gray rounded"
              />
              <label htmlFor="register" className="ml-2 block text-sm">
                I want to create a new account
              </label>
            </div>

            <div>
              <button
                type="submit"
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-bold rounded-md bg-lightpink text-black dark:text-white hover:bg-lightblue dark:bg-purple dark:hover:bg-green focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-lightblue dark:focus:ring-green"
              >
                {isRegistering ? "Register" : "Sign in"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
