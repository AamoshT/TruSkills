import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_SERVER_URL,
    withCredentials: true,
});
let isRefreshing = false;
let  refreshSubscribers: (() => void)[] = [];
//handel logout and prevent infinite loops
const handleLogout = () => {
    if (window.location.pathname !== '/login') {
        window.location.href = '/login';
    }
};
//handel adding a new access token to the queued request
const subscribeTokenRefresh = (callback: () => void) => {
    refreshSubscribers.push(callback);
};

//execute refresh subscribers after a new access token is obtained
const onRefreshSuccess = () => {
    refreshSubscribers.forEach((callback) => callback());
    refreshSubscribers = [];
};

// handel API request
axiosInstance.interceptors.request.use(
    (config) => config,
    (error) => Promise.reject(error)
);

//Handel expired token and refresh token
axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        //prevent infinity loop by checking if the request has already been retried
        if (error.response?.status === 401 && !originalRequest._retry) {
            if (isRefreshing) {
                return new Promise((resolve) => {
                    subscribeTokenRefresh(() => {
                        resolve(axiosInstance(originalRequest));
                    });
                });
            }
        }
        originalRequest._retry = true;
        isRefreshing = true;
        try{
            await axios.post(
                `${process.env.NEXT_PUBLIC_SERVER_URI}/api/auth/refresh-token-user`,
                {},
                { withCredentials: true }
            );
            isRefreshing = false;
            onRefreshSuccess();
            return axiosInstance(originalRequest);
        } catch (error) {
            isRefreshing = false;
           refreshSubscribers = [];
            handleLogout();
            return Promise.reject(error);
        } 
    return Promise.reject(error);
    }
);

export default axiosInstance;