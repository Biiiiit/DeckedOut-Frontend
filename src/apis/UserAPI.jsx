import axios from "axios";

const UserAPI = {
  getUserByUsername: (username) =>
    axios
      .get(`http://localhost:8080/users/${username}`)
      .then((response) => response.data),

  updateUser: (id, userData, avatar, accessToken) => {
    const formData = new FormData();

    // Append userData properties to the FormData object
    Object.entries(userData).forEach(([key, value]) => {
      // For non-File values, simply append them with their original key
      formData.append(key, JSON.stringify(value));
    });

    // Append the avatar file to the FormData with key 'avatar'
    formData.append('avatar', avatar);

    return axios.put(`http://localhost:8080/users/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${accessToken}`
      },
    }).then((response) => response.data);
  },
};

export default UserAPI;
