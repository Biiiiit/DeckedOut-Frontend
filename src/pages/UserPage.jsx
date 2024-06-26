import React, { useEffect, useState, } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import UserAPI from '../apis/UserAPI';
import '../pages/css/UserPage.css';
import TokenManager from '../apis/TokenManager';
import 'bootstrap/dist/css/bootstrap.min.css';
import userIcon from '../assets/usericon.png';

const UserPage = () => {
  const { name } = useParams();
  const [user, setUser] = useState(null);
  const [claims, setClaims] = useState(null);
  const [editedUser, setEditedUser] = useState({ password: '', avatar: new Uint8Array() });
  const [avatarSrc, setAvatarSrc] = useState(userIcon);
  const [avatarFile, setAvatarFile] = useState(null); // New state for the avatar file

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

        // Set initial state for editedUser
        setEditedUser({
          id: userData.id || '',
          username: userData.username || '',
          email: userData.email || '',
          password: '', // Set the password to an empty string
          newPassword: '',
          type: userData.type || '',
          avatar: userData.avatar || '',
        });

        if (userData.avatar && typeof userData.avatar === 'string') {
          handleFileChange({
            target: {
              files: [userData.avatar],
            },
          });
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        setUser(null);
      }
    };

    fetchUserData();
  }, [name, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedUser((prevUser) => ({
      ...prevUser,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      // Check if the input is a file path
      if (typeof file === 'string') {
        // If it's a file path, convert it to a File object
        fetch(file)
          .then((res) => res.blob())
          .then((blob) => {
            const convertedFile = new File([blob], 'avatar.jpg', { type: 'image/jpeg' });

            // Set the avatarFile state
            setAvatarFile(convertedFile);

            // Read the file content for displaying
            const reader = new FileReader();
            reader.onloadend = () => {
              setAvatarSrc(reader.result);
            };
            reader.readAsDataURL(convertedFile);

            // Update the editedUser state
            setEditedUser((prevUser) => ({
              ...prevUser,
              avatar: convertedFile,
            }));
          })
          .catch((error) => {
            console.error('Error converting file path to File:', error);
          });
      } else {
        // If it's already a file, proceed as before
        const reader = new FileReader();
        reader.onloadend = () => {
          setAvatarSrc(reader.result);
        };
        reader.readAsDataURL(file);

        // Set the avatarFile state
        setAvatarFile(file);

        // Update the editedUser state
        setEditedUser((prevUser) => ({
          ...prevUser,
          avatar: file,
        }));
      }
    }
  };

  const handleUpdateUser = async () => {
    try {
      console.log('Updating user data:', editedUser);

      // Ensure that the user ID is included in the request payload
      const updatedUserToSend = {
        ...editedUser,
        id: claims.Id,
      };

      delete updatedUserToSend.type;

      // Replace empty/null values in editedUser with corresponding values from user
      const finalUpdatedUser = Object.fromEntries(
        Object.entries(updatedUserToSend).map(([key, value]) => [key, value || user[key]])
      );

      console.log('Final updated user data:', finalUpdatedUser);

      // Call updateUser with avatarFile separated
      await UserAPI.updateUser(finalUpdatedUser.id, finalUpdatedUser, avatarFile, TokenManager.getAccessToken());

      const updatedUserData = await UserAPI.getUserByUsername(name);
      setUser(updatedUserData);

      // Set initial state for editedUser after update
      setEditedUser({
        username: updatedUserData.username || '',
        email: updatedUserData.email || '',
        password: '',
        newPassword: '',
        type: editedUser.type || '',
        avatar: updatedUserData.avatar || '',
      });

      // Clear the avatarFile state
      setAvatarFile(null);

      console.log('User data updated successfully.');
    } catch (error) {
      console.error('Error updating user data:', error);
    }
  };

  return (
    <div className="container">
      <div className="row gutters">
        <div className="col-xl-3 col-lg-3 col-md-12 col-sm-12 col-12">
          <div className="card h-100">
            <div className="card-body">
              <div className="account-settings">
                <div className="user-profile">
                  <div className="user-avatar">
                    <label htmlFor="fileInput" className="file-input-label">
                      <img
                        className="avatar"
                        src={avatarSrc}
                        alt="User Avatar"
                      />
                    </label>
                    <form encType='multipart/form-data'>
                      <input
                        type="file"
                        id="fileInput"
                        accept="image/*"
                        onChange={handleFileChange}
                        style={{ display: 'none' }}
                      />
                    </form>
                  </div>
                  <h5 className="user-name">{editedUser.username}</h5>
                  <h6 className="user-email">{editedUser.email}</h6>
                </div>
                <div className="about">
                  <h5>About</h5>
                  {editedUser.type === 'admin' ? (
                    <p>
                      Type of account: Developer. This account is for making games for
                      players to enjoy.
                    </p>
                  ) : editedUser.type === 'normal' ? (
                    <p>
                      Type of account: Player. This account is for playing games that
                      others have made.
                    </p>
                  ) : (
                    <p>
                      Type of account: Unknown. Please update your account type for more
                      details.
                    </p>
                  )}
                </div>
                {editedUser.type === 'admin' && (
                  <div className="text-center mt-3">
                    <Link className='btn btn-primary' to="/viewGames">
                      View Games
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="col-xl-9 col-lg-9 col-md-12 col-sm-12 col-12">
          <div className="card h-100">
            <div className="card-body">
              <div className="row gutters">
                <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12">
                  <h6 className="personal mb-2">Personal Details</h6>
                </div>
                <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12">
                  <div className="form-group">
                    <label htmlFor="fullName">Username</label>
                    <input
                      type="text"
                      className="form-control"
                      id="fullName"
                      placeholder="Enter full name"
                      name="username"
                      value={editedUser.username || ''}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
                <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12">
                  <div className="form-group">
                    <label htmlFor="eMail">Email</label>
                    <input
                      type="text"
                      className="form-control"
                      id="eMail"
                      placeholder="Enter email ID"
                      name="email"
                      value={editedUser.email || ''}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
                <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12">
                  <div className="form-group">
                    <label htmlFor="password">Old Password</label>
                    <input
                      type="password"
                      className="form-control"
                      id="password"
                      placeholder="Enter old password"
                      name="password"
                      value={editedUser.password || ''}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
                <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12">
                  <div className="form-group">
                    <label htmlFor="newPassword">New Password</label>
                    <input
                      type="password"
                      className="form-control"
                      id="newPassword"
                      placeholder="Enter new password"
                      name="newPassword"
                      value={editedUser.newPassword || ''}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
                <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12">
                  <div className="text-right">
                    <button
                      type="button"
                      id="submit"
                      name="submit"
                      className="btn btn-secondary"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      id="submit"
                      name="submit"
                      className="btn btn-primary"
                      onClick={handleUpdateUser}
                    >
                      Update
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserPage;