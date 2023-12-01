import axios from "axios";

const UserAPI = {
  getUserByUsername: (username) =>
    axios
      .get(`http://localhost:8080/users/${username}`)
      .then((response) => response.data),
};

export default UserAPI;
