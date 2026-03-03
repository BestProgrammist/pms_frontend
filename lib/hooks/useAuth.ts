// // lib/api/hooks/useAuth.ts
// import { useEffect, useState } from 'react';
// import { useRouter } from 'next/navigation';
// import { toast } from 'sonner';
// import { User } from '@/types/user';
// import apiClient from '../api/client';

// interface LoginData {
//   jshshir: string;
//   password: string;
// }

// interface RegisterData {
//   jshshir: string;
//   username: string;
//   firstName: string;
//   lastName: string;
//   password: string;
//   phone?: string;
// }

// interface AuthResponse {
//   accessToken: string;
//   refreshToken: string;
//   expiresIn: number;
//   user: User;
// }

// export const useAuth = () => {
//   const [loading, setLoading] = useState(false);
//   const [user, setUser] = useState<User | null>(null);
//   // const [token, setToken] = useState<string | null>(null);
//   console.log(user);
  
//   const router = useRouter();

//   useEffect(() => {
//     // Sahifa yuklanganda token va user ma'lumotlarini tekshirish
//     const initAuth = async () => {
//       setLoading(true);
//       const storedToken = localStorage.getItem('accessToken');
//       const storedUser = localStorage.getItem('user');
      
//       if (storedToken && storedUser) {
//         try {
//           // setToken(storedToken);
//           setUser(JSON.parse(storedUser));
//           // Token validligini tekshirish
//           // await apiClient.verifyToken();
//         } catch (error) {
//           console.error('Authentication failed:', error);
//           logout();
//         }
//       }
      
//       setLoading(false);
//     };
    
//     initAuth();
//   }, []);


//   const login = async (data: LoginData) => {
//     try {
//       setLoading(true);
//       const response = await apiClient.post<AuthResponse>('/auth/login', data);
      
//       localStorage.setItem('accessToken', response.data.accessToken);
//       localStorage.setItem('refreshToken', response.data.refreshToken);
//       localStorage.setItem('user', JSON.stringify(response.data.user));
//       setUser(response.data.user);
      
//       toast.success('Tizimga muvaffaqiyatli kirdingiz');
      
//       // Role based redirect
//       const role = response.data.user.role;
//       if (role === 'admin') router.push('/admin');
//       else if (role === 'teacher') router.push('/dashboard/teacher');
//       else if (role === 'student') router.push('/dashboard/student');
//       else if (role === 'parent') router.push('/dashboard/parent');
//       else router.push('/dashboard');
      
//       return response.data;
//     } catch (error: any) {
//       toast.error(error.response?.data?.message || 'Xatolik yuz berdi');
//       throw error;
//     } finally {
//       setLoading(false);
//     }
//   };

//   const register = async (data: RegisterData) => {
//     try {
//       setLoading(true);
//       const response = await apiClient.post<AuthResponse>('/auth/register', data);
      
//       localStorage.setItem('accessToken', response.data.accessToken);
//       localStorage.setItem('refreshToken', response.data.refreshToken);
//       localStorage.setItem('user', JSON.stringify(response.data.user));
//       setUser(response.data.user);
      
//       toast.success('Ro\'yxatdan muvaffaqiyatli o\'tdingiz');
//       router.push('/dashboard');
      
//       return response.data;
//     } catch (error: any) {
//       toast.error(error.response?.data?.message || 'Xatolik yuz berdi');
//       throw error;
//     } finally {
//       setLoading(false);
//     }
//   };

//   const logout = async () => {
//     try {
//       await apiClient.post('/auth/logout');
//     } catch (error) {
//       console.error('Logout error:', error);
//     } finally {
//       localStorage.clear();
//       router.push('/');
//       setUser(null);
//       toast.success('Tizimdan chiqdingiz');
//     }
//   };

//   return { login, register, logout, loading, user };
// };