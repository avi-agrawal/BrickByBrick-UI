import React, { useState, useRef, useEffect } from 'react';
import { User, Settings, LogOut, ChevronDown } from 'lucide-react';
import { AuthContext } from './AuthContext';
import { getAvatarById, getDefaultAvatar } from '../utils/avatars';

interface ProfileIconProps {
    onSettingsClick: () => void;
}

const ProfileIcon: React.FC<ProfileIconProps> = ({ onSettingsClick }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const { logout, user } = React.useContext(AuthContext);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleLogout = () => {
        logout();
        setIsOpen(false);
    };

    const handleSettings = () => {
        onSettingsClick();
        setIsOpen(false);
    };

    // Get the current avatar or default
    const currentAvatar = user?.avatarId ? getAvatarById(user.avatarId) : getDefaultAvatar();
    const hasCustomImage = user?.profilePicture;

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-3 px-3 py-2 rounded-full text-sm font-medium transition-colors text-gray-600 hover:bg-gray-100 hover:text-gray-700"
            >
                {/* Profile Picture */}
                <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">
                    {hasCustomImage ? (
                        <img
                            src={user.profilePicture}
                            alt="Profile"
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <div className={`w-full h-full ${currentAvatar.color} flex items-center justify-center text-white text-lg`}>
                            {currentAvatar.emoji}
                        </div>
                    )}
                </div>
                <ChevronDown size={14} className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} strokeWidth={2.5} />
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 py-1 z-50">
                    <button
                        onClick={handleSettings}
                        className="flex items-center gap-3 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                    >
                        <Settings size={16} strokeWidth={2.5} />
                        Settings
                    </button>
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                    >
                        <LogOut size={16} strokeWidth={2.5} />
                        Logout
                    </button>
                </div>
            )}
        </div>
    );
};

export default ProfileIcon;
