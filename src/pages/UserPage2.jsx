import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import UserAPI from '../apis/UserAPI';
import userIcon from '../assets/usericon.png';
import React from 'react';
import '../pages/css/UserPage2.css'
import TokenManager from '../apis/TokenManager';

const UserPage = () => {
  const { name } = useParams();
  const [user, setUser] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [claims, setClaims] = useState(null);
  const [editedUser, setEditedUser] = useState({});
  const [isEditing, setIsEditing] = useState({
    username: false,
    email: false,
    password: false,
    avatar: false,
    oldPassword: false,
  });
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = TokenManager.getAccessToken();

        if (!token) {
          console.log('Token not found, redirecting to login');
          navigate('/login');
          return;
        }

        const newClaims = TokenManager.getClaims();
        setClaims(newClaims);

        if (name !== newClaims.sub) {
          console.log('Unauthorized access, redirecting to unauthorized page');
          navigate('/unauthorized');
          return;
        }

        const userData = await UserAPI.getUserByUsername(name);
        setUser(userData);
        setEditedUser(userData);
      } catch (error) {
        console.error('Error fetching user data:', error);
        setUser(null);
      }
    };

    fetchUserData();
  }, [name, navigate]);

  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedUser((prevUser) => ({
      ...prevUser,
      [name]: value,
    }));
  };

  const handleUpdateUser = async () => {
    try {
      await UserAPI.updateUser(editedUser);
      const updatedUserData = await UserAPI.getUserByUsername(name);
      setUser(updatedUserData);
    } catch (error) {
      console.error('Error updating user data:', error);
    }
  };

  const handleToggleEdit = (field) => {
    setIsEditing((prevIsEditing) => ({
      ...prevIsEditing,
      [field]: !prevIsEditing[field],
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setEditedUser((prevUser) => ({
      ...prevUser,
      avatar: file,
    }));
  };

  const handlePasswordChange = async () => {
    try {
      // Validate the old password before changing the password
      await UserAPI.validateOldPassword({
        username: user.username,
        oldPassword: editedUser.oldPassword,
      });

      // Update the user password on the server
      await UserAPI.updateUserPassword({
        username: user.username,
        newPassword: editedUser.password,
      });

      // Optionally, you can refetch the updated user data
      const updatedUserData = await UserAPI.getUserByUsername(name);
      setUser(updatedUserData);

      // Close the password change form
      setShowPasswordForm(false);
    } catch (error) {
      console.error('Error changing password:', error);
    }
  };

  return (
    <div className="user-page">
      {user && (
        <>
          <div className="user-profile">
            <img
              src={user.avatar || userIcon}
              alt="Profile"
              onClick={() => handleToggleEdit('avatar')}
            />
            {isEditing.avatar && (
              <div>
                <input
                  type="file"
                  name="avatar"
                  accept="image/*"
                  onChange={handleFileChange}
                />
              </div>
            )}
          </div>
          <div className="user-details">
            <p>
              Username:{' '}
              {isEditing.username ? (
                <input
                  type="text"
                  name="username"
                  value={editedUser.username || ''}
                  onChange={handleInputChange}
                />
              ) : (
                <>
                  {user.username}{' '}
                  <span
                    onClick={() => handleToggleEdit('username')}
                    title="Edit"
                  >
                    ✏️
                  </span>
                </>
              )}
            </p>
            <p>
              Email:{' '}
              {isEditing.email ? (
                <input
                  type="text"
                  name="email"
                  value={editedUser.email || ''}
                  onChange={handleInputChange}
                />
              ) : (
                <>
                  {user.email}{' '}
                  <span onClick={() => handleToggleEdit('email')} title="Edit">
                    ✏️
                  </span>
                </>
              )}
            </p>
            <p>
              Password:{' '}
              {showPassword ? (
                <>
                  {isEditing.password ? (
                    <>
                      <input
                        type="password"
                        name="oldPassword"
                        placeholder="Old Password"
                        onChange={handleInputChange}
                      />
                      <input
                        type="password"
                        name="password"
                        placeholder="New Password"
                        onChange={handleInputChange}
                      />
                      <button onClick={handlePasswordChange}>Change</button>
                    </>
                  ) : (
                    <>
                      {user.password}{' '}
                      <span
                        onClick={() => {
                          handleToggleEdit('password');
                          setShowPasswordForm(true);
                        }}
                        title="Change Password"
                      >
                        ✏️
                      </span>
                    </>
                  )}
                </>
              ) : (
                '*********'
              )}
              {showPassword && (
                <button onClick={handleTogglePassword}>
                  {showPassword ? 'Hide Password' : 'Show Password'}
                </button>
              )}
              {showPasswordForm && (
                <div className="password-form">
                  <input
                    type="password"
                    name="oldPassword"
                    placeholder="Old Password"
                    onChange={handleInputChange}
                  />
                  <input
                    type="password"
                    name="password"
                    placeholder="New Password"
                    onChange={handleInputChange}
                  />
                  <button onClick={handlePasswordChange}>Change</button>
                </div>
              )}
            </p>
            <p>User Type: {user.type}</p>
            <button onClick={handleUpdateUser}>Update Profile</button>
          </div>
        </>
      )}
    </div>
  );
};

export default UserPage;