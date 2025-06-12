import React, { useEffect, useState, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";

interface RawProfile {
  givenName?: string;
  familyName?: string;
  imageUrl?: string;
  email?: string;
  role?: string;
}

interface SanitizedProfile {
  firstName: string;
  lastName: string;
  imageUrl: string;
  email: string;
  role: string;
}

interface ProfileDisplayProps {
  profile: RawProfile | null;
  onLogout: () => void;
}

const ProfileDisplay: React.FC<ProfileDisplayProps> = ({ profile, onLogout }) => {
  const [showMenu, setShowMenu] = useState(false);
  const [userProfile, setUserProfile] = useState<SanitizedProfile | null>(null);
  const navigate = useNavigate();
  const menuRef = useRef<HTMLDivElement | null>(null);

  const defaultProfileImage = "https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y";

  useEffect(() => {
    if (!profile) {
      setUserProfile(null);
      return;
    }

    const sanitized: SanitizedProfile = {
      firstName: profile.givenName || profile.email?.split("@")[0] || "User",
      lastName: profile.familyName || "",
      imageUrl: profile.imageUrl || defaultProfileImage,
      email: profile.email || "No email provided",
      role: profile.role || "user",
    };

    setUserProfile(sanitized);
  }, [profile]);

  const toggleMenu = useCallback(() => {
    setShowMenu((prev) => !prev);
  }, []);

  const goProfilePage = () => {
    navigate("/profile");
    setShowMenu(false);
  };

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && e.target instanceof Node && !menuRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    }

    if (showMenu) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showMenu]);

  if (!userProfile) return null;

  return (
    <div className="relative">
      <button
        onClick={toggleMenu}
        aria-label="Open profile menu"
        className="focus:outline-none"
      >
        <img
          src={userProfile.imageUrl}
          alt="Profile"
          className="h-8 w-8 rounded-full object-cover"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.onerror = null;
            target.src = defaultProfileImage;
          }}
        />
      </button>

      {showMenu && (
        <div
          ref={menuRef}
          className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 z-50"
        >
          <div className="px-4 py-3 flex items-center space-x-3">
            <img
              src={userProfile.imageUrl}
              alt="Profile"
              className="h-10 w-10 rounded-full object-cover"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.onerror = null;
                target.src = defaultProfileImage;
              }}
            />
            <div className="flex flex-col">
              <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                {userProfile.firstName} {userProfile.lastName}
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400">{userProfile.email}</span>
            </div>
          </div>

          <div className="border-t border-gray-200 dark:border-gray-700"></div>

          <button
            onClick={goProfilePage}
            className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            Profile
          </button>

          <div className="border-t border-gray-200 dark:border-gray-700"></div>

          <button
            onClick={onLogout}
            className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-100 dark:hover:bg-red-700"
          >
            Sign Out
          </button>
        </div>
      )}
    </div>
  );
};

export default ProfileDisplay;
