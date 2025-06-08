import React from 'react';
import { User, Heart, List } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const UserDashboard = ({ activeTab, setActiveTab }) => {
    const navigate = useNavigate();

    const tabs = [
        { id: 'profile', label: 'Profile', icon: <User className="h-5 w-5" />, path: '/profile' },
        { id: 'favorites', label: 'Favorites', icon: <Heart className="h-5 w-5" />, path: '/favorites' },
        { id: 'watchlist', label: 'Watchlist', icon: <List className="h-5 w-5" />, path: '/watchlist' },
    ];

    const handleTabChange = (tab) => {
        setActiveTab(tab.id);
        navigate(tab.path);
    };

    return (
        <div className="flex border-b border-border overflow-x-auto">
            {tabs.map((tab) => (
                <button
                    key={tab.id}
                    onClick={() => handleTabChange(tab)}
                    className={`flex items-center space-x-2 py-3 px-4 border-b-2 transition-colors ${
                        activeTab === tab.id
                            ? 'border-[#f3d100] dark:border-moviebuster-red text-[#f3d100] dark:text-moviebuster-red'
                            : 'border-transparent hover:border-[#f3d100]/50 dark:hover:border-moviebuster-red/50 hover:text-[#f3d100]/80 dark:hover:text-moviebuster-red/80'
                    }`}
                >
                    {tab.icon}
                    <span>{tab.label}</span>
                </button>
            ))}
        </div>
    );
};

export default UserDashboard;
