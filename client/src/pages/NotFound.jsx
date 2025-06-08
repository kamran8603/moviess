import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ThemeToggle from "../components/ThemeToggle";

const NotFound = () => {
  const [timeLeft, setTimeLeft] = useState(20);
  const navigate = useNavigate();

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else {
      navigate('/');
    }
  }, [timeLeft, navigate]);

  return (
    <div className="bg-light-primary dark:bg-dark-primary min-h-screen">
      <Navbar />
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] text-white p-4 text-center">
        <div className="max-w-md w-full space-y-8 bg-moviebuster-darkblue p-8 rounded-lg shadow-lg border-2 border-white animate-fade-in">
          <div className="absolute top-4 right-4">
            <ThemeToggle />
          </div>
          <div className="space-y-7">
            <h1 className="text-6xl font-bold mb-4 text-white">404</h1>
            <p className="text-xl mb-6">
              Seems like this page does not exists, So either it is in development or you are just dumb
            </p>
            <p className="text-sm text-gray-400">
              Redirecting to home page in {timeLeft} seconds...
            </p>
            <div className="mt-6">
              <Link 
                to="/" 
                className="px-6 py-3 bg-[#f3d100] dark:bg-moviebuster-red text-[#000e3d] dark:text-white rounded-md hover:bg-[#f3d100]/90 dark:hover:bg-moviebuster-red/90 transition font-medium"
              >
                Go to Home
              </Link>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default NotFound;
