import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

API.interceptors.response.use(
  (response) => response,
  (error) => {
    // If the error status is 401, don't reject the promise
    // and don't log it as an error in the console.
    if (error.response && error.response.status === 401) {
      return Promise.resolve(error.response); // Return response to handle smoothly
    }
    return Promise.reject(error); // Reject other errors normally
  }
);

export default API;
