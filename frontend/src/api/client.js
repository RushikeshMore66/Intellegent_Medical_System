import axios from "axios";
import { toast } from "react-toastify";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
});

api.interceptors.request.use((config) => {

    const token = localStorage.getItem("token");

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});


api.interceptors.response.use(

    (response) => response,

    (error) => {

        if (error.response) {

            const status = error.response.status;

            const message =
                error.response.data?.detail ||
                "Something went wrong";

            if (status === 401) {

                toast.error("Session expired. Please login again");

                localStorage.removeItem("token");

                window.location.href = "/";

            } else if (status === 403) {

                toast.error("You do not have permission");

            } else if (status === 404) {

                toast.error("Resource not found");

            } else if (status === 500) {

                toast.error("Server error");

            } else {

                toast.error(message);

            }

        } else {

            toast.error("Network error");

        }

        return Promise.reject(error);

    }

);

export default api;