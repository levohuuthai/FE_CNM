import axiosClient from "./axiosClient";

const adminAPI = {
    getAllUser() {
        const url = "/users/";
        return axiosClient.get(url);
    },
};

export default adminAPI;