// import axios from "./../utils/axiosInstance";

// export const signup = (userData) => axios.post(`/register`, userData);
// export const login = (userData) => axios.post(`/login`, userData);

// // logout must send token
// export const logout = async (token) => {
//   return axios.post(`/logout`, {}, {
//     headers: {
//       Authorization: `Bearer ${token}`,
//     },
//   });
// };



import axios from "./../utils/axiosInstance";

// Get token from localStorage
const getAuthHeader = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  return user?.token ? { Authorization: `Bearer ${user.token}` } : {};
};

export const signup = (userData) => axios.post(`/register`, userData);
export const login = (userData) => axios.post(`/login`, userData);
export const logout = () =>
  axios.post(`/logout`, {}, { headers: getAuthHeader() });

