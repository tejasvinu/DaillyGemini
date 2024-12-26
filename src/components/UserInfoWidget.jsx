import React, { useState, useEffect } from 'react';
import { userInfoService } from '../services/UserInfoService';

const UserInfoWidget = () => {
  const [mounted, setMounted] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    setMounted(true);
    let isMounted = true;

    const fetchUserInfo = async () => {
      try {
        setLoading(true);
        const data = await userInfoService.getUserInfo();
        if (isMounted) {
          setUserInfo(data);
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchUserInfo();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleImageError = () => {
    setImgError(true);
  };

  if (!mounted) {
    return (
      <div className="flex items-center justify-center min-h-[300px] bg-gray-100">
        <div className="w-full max-w-md h-64 rounded-3xl shadow-xl bg-white animate-pulse" />
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[300px] bg-gray-100">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[300px] bg-gray-100">
        <div className="text-red-500">Error: {error}</div>
      </div>
    );
  }

  if (!userInfo?.basic) {
    return (
      <div className="flex items-center justify-center min-h-[300px] bg-gray-100">
        <div className="text-gray-500">No user information available</div>
      </div>
    );
  }

  return (
    <div className={`w-full rounded-3xl shadow-xl relative ${
      darkMode ? 'bg-gray-800' : 'bg-white'
    }`}>
      <div className="absolute inset-0 bg-gradient-to-r from-gray-200 to-gray-300 opacity-75 rounded-3xl" />
      <div className={`absolute inset-[10px] ${
        darkMode ? 'bg-gray-800' : 'bg-white'
      } rounded-2xl`} />
      
      <div className="relative h-full p-8 flex flex-col">
        {/* Header with dark mode toggle */}
        <div className="flex justify-between items-center mb-6">
          <h2 className={`text-lg font-medium ${
            darkMode ? 'text-gray-300' : 'text-gray-700'
          }`}>Profile Information</h2>
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 rounded-full bg-gray-200 text-gray-700 hover:bg-gray-300 transition-colors"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
            </svg>
          </button>
        </div>

        {/* Profile section */}
        <div className="flex items-start space-x-6">
          {/* Profile image */}
          {userInfo.basic.picture && !imgError && (
            <div className="relative">
              <img
                src={userInfo.basic.picture}
                alt="Profile"
                className="w-20 h-20 rounded-2xl object-cover border-2 border-gray-200"
                onError={handleImageError}
              />
              {userInfo.basic.verified_email && (
                <div className="absolute -top-2 -right-2 bg-green-500 text-white p-1 rounded-full">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                    <path d="M20 6L9 17l-5-5" />
                  </svg>
                </div>
              )}
            </div>
          )}

          {/* User details */}
          <div className="flex-1 space-y-4">
            <div>
              <h3 className={`text-xl font-semibold ${
                darkMode ? 'text-white' : 'text-gray-900'
              }`}>
                {userInfo.basic.name}
              </h3>
              <p className={`text-sm ${
                darkMode ? 'text-gray-400' : 'text-gray-600'
              }`}>
                {userInfo.basic.email}
              </p>
            </div>

            <div className={`grid grid-cols-2 gap-4 text-sm ${
              darkMode ? 'text-gray-400' : 'text-gray-600'
            }`}>
              <div>
                <p className="font-medium">Given Name</p>
                <p>{userInfo.basic.given_name}</p>
              </div>
              <div>
                <p className="font-medium">Family Name</p>
                <p>{userInfo.basic.family_name}</p>
              </div>
              {userInfo.detailed?.birthdays && userInfo.detailed.birthdays[0]?.date && (
                <div className="col-span-2">
                  <p className="font-medium">Birthday</p>
                  <p>{`${userInfo.detailed.birthdays[0].date.day}/${
                    userInfo.detailed.birthdays[0].date.month
                  }/${userInfo.detailed.birthdays[0].date.year}`}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserInfoWidget;