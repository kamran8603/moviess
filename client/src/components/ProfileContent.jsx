import React, { useState } from 'react';
import { Eye, EyeOff, Lock, Check } from 'lucide-react';

const ProfileContent = ({ username, setUsername, email, setEmail }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [showPasswordChange, setShowPasswordChange] = useState(false);
    const [passwordData, setPasswordData] = useState({
        current: '',
        new: '',
        confirm: ''
    });
    const [showPassword, setShowPassword] = useState({
        current: false,
        new: false,
        confirm: false
    });

    const handlePasswordChange = (field, value) => {
        setPasswordData(prev => ({ ...prev, [field]: value }));
    };

    const togglePasswordVisibility = (field) => {
        setShowPassword(prev => ({ ...prev, [field]: !prev[field] }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Here you would typically send the data to your backend
        if (showPasswordChange) {
            console.log('Password change submitted:', passwordData);
            setShowPasswordChange(false);
            setPasswordData({ current: '', new: '', confirm: '' });
        } else {
            console.log('Profile updated:', { username, email });
            setIsEditing(false);
        }
    };

    return (
        <div>
            <h2 className="text-xl font-semibold mb-4">My Profile</h2>

            <form onSubmit={handleSubmit}>
                <div className="space-y-6">
                    {/* Username Field */}
                    <div>
                        <label htmlFor="username" className="block text-sm font-medium mb-1">
                            Username
                        </label>
                        <div className="flex items-center">
                            <input
                                type="text"
                                id="username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                disabled={!isEditing}
                                className="w-full rounded-md bg-background border border-input px-4 py-2"
                            />
                            {!showPasswordChange && (
                                <button
                                    type="button"
                                    className="ml-2 p-2 text-primary hover:text-primary/80"
                                    onClick={() => setIsEditing(!isEditing)}
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="16"
                                        height="16"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    >
                                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                                    </svg>
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Email Field */}
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium mb-1">
                            Email
                        </label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            disabled={!isEditing}
                            className="w-full rounded-md bg-background border border-input px-4 py-2"
                        />
                    </div>

                    {/* Password Change Section */}
                    {!showPasswordChange ? (
                        <div>
                            <button
                                type="button"
                                onClick={() => setShowPasswordChange(true)}
                                className="flex items-center text-sm font-medium text-[#f3d100] dark:text-moviebuster-red hover:underline mt-4"
                            >
                                <Lock className="h-4 w-4 mr-2" /> Change Password
                            </button>
                        </div>
                    ) : (
                        <div className="space-y-4 border-t border-border pt-4 mt-4">
                            <h3 className="flex items-center text-lg font-medium">
                                <Lock className="h-5 w-5 mr-2" /> Change Password
                            </h3>

                            {/* Current Password */}
                            <div>
                                <label htmlFor="currentPassword" className="block text-sm font-medium mb-1">
                                    Current Password
                                </label>
                                <div className="relative">
                                    <input
                                        type={showPassword.current ? "text" : "password"}
                                        id="currentPassword"
                                        value={passwordData.current}
                                        onChange={(e) => handlePasswordChange('current', e.target.value)}
                                        className="w-full rounded-md bg-background border border-input pr-10 px-4 py-2"
                                        placeholder="••••••••"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => togglePasswordVisibility('current')}
                                        className="absolute inset-y-0 right-0 flex items-center px-3 text-muted-foreground"
                                    >
                                        {showPassword.current ? (
                                            <EyeOff className="h-4 w-4" />
                                        ) : (
                                            <Eye className="h-4 w-4" />
                                        )}
                                    </button>
                                </div>
                            </div>

                            {/* New Password */}
                            <div>
                                <label htmlFor="newPassword" className="block text-sm font-medium mb-1">
                                    New Password
                                </label>
                                <div className="relative">
                                    <input
                                        type={showPassword.new ? "text" : "password"}
                                        id="newPassword"
                                        value={passwordData.new}
                                        onChange={(e) => handlePasswordChange('new', e.target.value)}
                                        className="w-full rounded-md bg-background border border-input pr-10 px-4 py-2"
                                        placeholder="Enter new password"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => togglePasswordVisibility('new')}
                                        className="absolute inset-y-0 right-0 flex items-center px-3 text-muted-foreground"
                                    >
                                        {showPassword.new ? (
                                            <EyeOff className="h-4 w-4" />
                                        ) : (
                                            <Eye className="h-4 w-4" />
                                        )}
                                    </button>
                                </div>
                            </div>

                            {/* Confirm New Password */}
                            <div>
                                <label htmlFor="confirmPassword" className="block text-sm font-medium mb-1">
                                    Confirm New Password
                                </label>
                                <div className="relative">
                                    <input
                                        type={showPassword.confirm ? "text" : "password"}
                                        id="confirmPassword"
                                        value={passwordData.confirm}
                                        onChange={(e) => handlePasswordChange('confirm', e.target.value)}
                                        className="w-full rounded-md bg-background border border-input pr-10 px-4 py-2"
                                        placeholder="Confirm new password"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => togglePasswordVisibility('confirm')}
                                        className="absolute inset-y-0 right-0 flex items-center px-3 text-muted-foreground"
                                    >
                                        {showPassword.confirm ? (
                                            <EyeOff className="h-4 w-4" />
                                        ) : (
                                            <Eye className="h-4 w-4" />
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Submit Button */}
                    <div className="pt-4">
                        <button
                            type="submit"
                            className="w-full bg-[#f3d100] dark:bg-moviebuster-red/70 text-[#000e3d] dark:text-white hover:bg-[#f3d100]/90 dark:hover:bg-white dark:hover:text-moviebuster-red font-medium py-2 px-4 rounded-md transition-colors"
                        >
                            <Check className="h-4 w-4 mr-2 inline" /> Save Changes
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default ProfileContent;