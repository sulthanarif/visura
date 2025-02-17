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
                    } else {
                        router.push('/scanfile');
                    }
                } else {
                    // If there's no token, redirect to login or handle as needed
                    router.push('/login');
                }
            }
        };

        // Call the redirect function on initial load or when the route changes
        performRedirect();
    }, [router]);


  useEffect(() => {
    const checkAuth = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('token');
        
        if (!token) {
          if (!isAuthPage && router.pathname !== '/') { // Allow access to '/' if no token
            router.push('/login');
          }
          return;
        }

        const decoded = decodeToken(token);
        setUser(decoded);
        setIsTokenValid(true);

        // Check admin access
        if (isAdminPage && decoded.role !== 'admin') {
          router.push('/403'); // Redirect to forbidden page if not admin
          return;
        }


      } catch (error) {
        console.error('Auth check failed:', error);
        setIsTokenValid(false);
        if (!isAuthPage && router.pathname !== '/') { // Allow access to '/' if auth check fails
          router.push('/login');
        }
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [router.pathname]);

  useEffect(() => {
      if(!isAuthPage && !loading){
           if (!isTokenValid && router.pathname !== '/') { // Allow access to '/' even if token is invalid
               router.push('/login');
           } 
      }
  }, [isTokenValid, router, loading, isAuthPage]);

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
           ): null
      ) :  isTokenValid ? (
         <DefaultLayout>
             <Component {...pageProps} />
         </DefaultLayout>
      ) : null
      }
    </>
  );
}