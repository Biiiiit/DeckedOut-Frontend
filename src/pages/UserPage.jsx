import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import UserAPI from '../apis/UserAPI';
import '../pages/css/UserPage.css';
import TokenManager from '../apis/TokenManager';
import 'bootstrap/dist/css/bootstrap.min.css';

const UserPage = () => {
  const { name } = useParams();
  const [user, setUser] = useState(null);
  const [claims, setClaims] = useState(null);
  const [editedUser, setEditedUser] = useState({password: '' });
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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedUser((prevUser) => ({
      ...prevUser,
      [name]: value,
    }));
  };

  const handleUpdateUser = async () => {
    try {
      // Call the API to update the user with editedUser data
      await UserAPI.updateUser(editedUser);

      // Optionally, you can refetch the updated user data
      const updatedUserData = await UserAPI.getUserByUsername(name);
      setUser(updatedUserData);
      setEditedUser(updatedUserData);
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
                    <img
                      src="https://bootdey.com/img/Content/avatar/avatar7.png"
                      alt="Maxwell Admin"
                    />
                  </div>
                  <h5 className="user-name">{editedUser.username}</h5>
                  <h6 className="user-email">{editedUser.email}</h6>
                </div>
                <div className="about">
                  <h5 className="user-name">About</h5>
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
              </div>
            </div>
          </div>
        </div>
        <div className="col-xl-9 col-lg-9 col-md-12 col-sm-12 col-12">
          <div className="card h-100">
            <div className="card-body">
              <div className="row gutters">
                <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12">
                  <h6 className="mb-2 text-primary">Personal Details</h6>
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
                      type="email"
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
                      value={editedUser.password ||''}
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