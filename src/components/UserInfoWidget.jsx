import React, { useState, useEffect } from 'react';
import { userInfoService } from '../services/UserInfoService';
import { LoadingSpinner } from './Spinner';

const UserInfoWidget = () => {
  const [mounted, setMounted] = useState(false);
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
      <div className="flex justify-center items-center p-12">
        <LoadingSpinner label="Getting your info..." />
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
    <div className="w-full rounded-3xl shadow-xl relative bg-gray-800">
      <div className="absolute inset-0 opacity-75 rounded-3xl" />
      <div className="absolute inset-[10px] bg-gray-800 rounded-2xl" />
      
      <div className="relative h-full p-8 flex flex-col">
        {/* Header without dark mode toggle */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-medium text-gray-300">Profile Information</h2>
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
              <h3 className="text-xl font-semibold text-white">
                {userInfo.basic.name}
              </h3>
              <p className="text-sm text-gray-400">
                {userInfo.basic.email}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm text-gray-400">
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