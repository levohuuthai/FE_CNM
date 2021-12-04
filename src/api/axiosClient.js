import axios from "axios";
//let token = localStorage.getItem("token");
const axiosClient = axios.create({
  baseURL: "http://localhost:3000/",
  headers: {
    "Content-Type": "application/json",
    //authorization: `${token}`,
  },
});

axiosClient.interceptors.request.use(
  function (config) {
    config.headers.authorization = localStorage.getItem("token");
    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

axiosClient.interceptors.response.use(
  function (reponse) {
    return reponse;
  },
  function (error) {
    console.log("ERROR REPONSE: ", error.response);
    const { config, status, data } = error.response;
    if (config.url === "/auth/checkPhone" && status === 403) {
      const error = data.error;
      const message = error.message;
      return Promise.reject(message);
    }
    if (config.url === "/auth/signin" && status === 403) {
      const error = data.error;
      return Promise.reject(error);
    }
    if (config.url === "/users/GetUserByPhone" && status === 403) {
      const error = data.error.message;
      return Promise.reject(error);
    }
    if (status === 401) {
      const url = "/auth/refreshToken";
      return axiosClient
        .post(url, { refreshToken: localStorage.getItem("refreshToken") })
        .then((res) => {
          localStorage.setItem("token", res.data.accessToken);
          localStorage.setItem("refreshToken", res.data.refToken);
          console.log("Token đã được refresh");
          return Promise.reject(res);
        });
    }
    if (
      (config.url === "/auth/ChangePassword" && status === 403) ||
      status === 400
    ) {
      const error = data.error.message;
      return Promise.reject(error);
    }
    return Promise.reject(error);
  }
);
export default axiosClient;
