import React, { useState, useEffect } from 'react';
import { userInfoService } from '../services/UserInfoService';

const UserInfoWidget = () => {
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    let isMounted = true; // Flag to prevent state updates after unmount

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
      isMounted = false; // Cleanup function to set the flag to false on unmount
    };
  }, []);

  const handleImageError = () => {
    setImgError(true);
  };

  if (loading) return <div>Loading user info...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!userInfo) return <div>No user information available</div>;

  return (
    <div className="space-y-4 p-4 bg-gray-800 rounded-lg">
      <h2 className="text-2xl font-semibold text-white">Profile Information</h2>
      {userInfo.basic && (
        <div className="flex items-center space-x-4">
          {userInfo.basic.picture && !imgError && (
            <img
              src={userInfo.basic.picture}
              alt="Profile"
              className="w-20 h-20 rounded-full border-2 border-blue-500"
              onError={handleImageError}
            />
          )}
          <div className="space-y-1">
            <p className="font-medium text-white text-lg">
              {userInfo.basic.name}
              {userInfo.basic.verified_email && (
                <span className="ml-2 text-green-400 text-sm">✓ Verified</span>
              )}
            </p>
            <p className="text-gray-300">{userInfo.basic.email}</p>
            {userInfo.detailed?.birthdays &&
              userInfo.detailed.birthdays[0]?.date && (
                <p className="text-gray-300">
                  Birthday: {userInfo.detailed.birthdays[0].date.day}/
                  {userInfo.detailed.birthdays[0].date.month}/
                  {userInfo.detailed.birthdays[0].date.year}
                </p>
              )}
            <div className="text-gray-300 text-sm mt-2">
              <p>Given Name: {userInfo.basic.given_name}</p>
              <p>Family Name: {userInfo.basic.family_name}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserInfoWidget;