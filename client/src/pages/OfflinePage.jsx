import React from 'react';

const OfflinePage = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen text-center p-5 bg-black text-white">
            <img 
                src="/logo.png" 
                alt="MovieBuster Logo" 
                className="w-[120px] mb-6" 
            />
            <h1>You're Offline</h1>
            <p>It seems you don't have an internet connection right now.</p>
            <p>Don't worry! You can still access previously viewed movies and content.</p>
            <button
                onClick={() => window.location.href = '/'}
                className="mt-6 px-6 py-3 bg-[#E50914] text-white border-none rounded cursor-pointer font-bold hover:bg-[#b8070f] transition-colors"
            >
                Try Again
            </button>
        </div>
    );
};

export default OfflinePage;