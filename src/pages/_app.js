// src/pages/_app.js

import "@/styles/globals.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import { useRouter } from 'next/router';
import DefaultLayout from "@/components/templates/DefaultLayout";
import AdminLayout from "@/components/templates/AdminLayout";
import { Toaster } from 'react-hot-toast';
import LoadingRefresh from "@/components/atoms/LoadingRefresh";
import { useEffect, useState } from 'react';
import { decodeToken } from '@/utils/authHelpers';

export default function App({ Component, pageProps }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [isTokenValid, setIsTokenValid] = useState(false);

  // Auth pages that don't need layout
  const isAuthPage = 
     router.pathname === '/login' 
  || router.pathname === '/signup' 
  || router.pathname === '/forgotpassword' 
  || router.pathname === '/resetpassword'
  || router.pathname === '/otpsignupconfirmation'
  || router.pathname === '/otpforgotpasswordconfirmation';

  // Admin pages that use AdminLayout
  const isAdminPage = router.pathname.startsWith('/admin');

  useEffect(() => {
    // Function to perform the redirect based on user role and current path
    const performRedirect = () => {
      if (router.pathname === '/') {
        const token = localStorage.getItem('token');
        if (token) {
          const decoded = decodeToken(token);
          if (decoded && decoded.role === 'admin') {
            router.push('/admin/scanfile');
          } else if (decoded) {
            router.push('/scanfile');
          }
        } else {
          // If there's no token, redirect to login or handle as needed
          router.push('/login');
        }
      }
    };

    // Only redirect on the homepage
    if (router.pathname === '/') {
      performRedirect();
    }
  }, [router.pathname]);

  useEffect(() => {
    const checkAuth = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('token');
        
        if (!token) {
          if (!isAuthPage && router.pathname !== '/') {
            router.push('/login');
          }
          setIsTokenValid(false);
          setUser(null);
          return;
        }

        const decoded = decodeToken(token);
        
        if (!decoded) {
          localStorage.removeItem('token'); // Clear invalid token
          setIsTokenValid(false);
          setUser(null);
          if (!isAuthPage && router.pathname !== '/') {
            router.push('/login');
          }
          return;
        }
        
        setUser(decoded);
        setIsTokenValid(true);

        // Check admin access
        if (isAdminPage && decoded.role !== 'admin') {
          router.push('/403'); // Redirect to forbidden page if not admin
          return;
        }

      } catch (error) {
        console.error('Auth check failed:', error);
        localStorage.removeItem('token'); // Clear problematic token
        setIsTokenValid(false);
        setUser(null);
        if (!isAuthPage && router.pathname !== '/') {
          router.push('/login');
        }
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [router.pathname]);

  if(loading) {
    return (
      <LoadingRefresh />
    );
  }

  return (
    <>
      {/* Toaster for notifications */}
      <Toaster
        position="top-center"
        reverseOrder={false}
      />

      {/* Conditional Layout Rendering */}
      {isAuthPage ? (
        <Component {...pageProps} />
      ) : isAdminPage ? (
        isTokenValid && user?.role === 'admin' ? (
          <AdminLayout>
            <Component {...pageProps} />
          </AdminLayout>
        ) : null
      ) : isTokenValid ? (
        <DefaultLayout>
          <Component {...pageProps} />
        </DefaultLayout>
      ) : null
      }
    </>
  );
}