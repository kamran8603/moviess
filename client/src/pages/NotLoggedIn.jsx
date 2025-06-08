import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ThemeToggle from "../components/ThemeToggle";

const NotLoggedIn = () => {
    const [timeLeft, setTimeLeft] = useState(20);
    const navigate = useNavigate();

    useEffect(() => {
        if (timeLeft > 0) {
            const timer = setTimeout(() => {
                setTimeLeft(timeLeft - 1);
            }, 1000);
            return () => clearTimeout(timer);
        } else {
            navigate('/login');
        }
    }, [timeLeft, navigate]);

    return (
        <>
            <Navbar />
            <div className="min-h-screen flex flex-col items-center justify-center bg-light-primary dark:bg-dark-primary text-white p-4 text-center">
                <div className="max-w-md w-full space-y-8 bg-moviebuster-darkblue p-8 rounded-lg shadow-lg border-2 border-white animate-fade-in">
                    <div className="absolute top-4 right-4">
                        <ThemeToggle />
                    </div>
                    <div className="space-y-7">
                        <h1 className="text-4xl font-bold mb-4 text-white">Not Signed In</h1>
                        <p className="text-xl mb-6">
                            Seems like you are not logged in
                        </p>
                        <p className="text-sm text-gray-400">
                            Redirecting to login page in {timeLeft} seconds...
                        </p>
                        <div className="mt-10">
                            <Link 
                                to="/login" 
                                className="px-6 py-3 bg-[#f3d100] dark:bg-moviebuster-red text-[#000e3d] dark:text-white rounded-md hover:bg-[#f3d100]/90 dark:hover:bg-moviebuster-red/90 transition font-medium"
                            >
                                Go to Login
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default NotLoggedIn;