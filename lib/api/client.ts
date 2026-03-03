import axios from 'axios';

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Agar cookie ishlatilsa
});

// Faqat browser muhitida interceptor qo'shish
if (typeof window !== 'undefined') {
  apiClient.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );
}

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    // Token ni localStorage dan olish
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Xatolikni log qilish
    console.error('API Error:', {
      url: error.config?.url,
      method: error.config?.method,
      status: error.response?.status,
      data: error.response?.data,
      message: error.message
    });
    
    return Promise.reject(error);
  }
);

export default apiClient;
// import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';

// class ApiClient {
//   private client: AxiosInstance;
//   private static instance: ApiClient;

//   private constructor() {
//     this.client = axios.create({
//       baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//     });

//     // Request interceptor
//     this.client.interceptors.request.use(
//       (config) => {
//         const token = localStorage.getItem('accessToken');
//         console.log('Access token:', token);
        
//         if (token) {
//           config.headers.Authorization = `Bearer ${token}`;
//         }
//         return config;
//       },
//       (error) => Promise.reject(error)
//     );

//     // Response interceptor
//     this.client.interceptors.response.use(
//       (response) => response,
//       async (error) => {
//         const originalRequest = error.config;

//         if (error.response?.status === 401 && !originalRequest._retry) {
//           originalRequest._retry = true;

//           try {
//             const refreshToken = localStorage.getItem('refreshToken');
//             console.log(refreshToken);
            
//             const response = await this.client.post('/auth/refresh', { refreshToken });
            
//             localStorage.setItem('accessToken', response.data.accessToken);
//             localStorage.setItem('refreshToken', response.data.refreshToken);
            
//             originalRequest.headers.Authorization = `Bearer ${response.data.accessToken}`;
//             return this.client(originalRequest);
//           } catch (refreshError) {
//             // Refresh token expired - redirect to login
//             localStorage.clear();
//             window.location.href = '/';
//             return Promise.reject(refreshError);
//           }
//         }

//         return Promise.reject(error);
//       }
//     );
//   }

//   public static getInstance(): ApiClient {
//     if (!ApiClient.instance) {
//       ApiClient.instance = new ApiClient();
//     }
//     return ApiClient.instance;
//   }

//   public getClient(): AxiosInstance {
//     return this.client;
//   }
// }

// export const apiClient = ApiClient.getInstance().getClient();