import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import Icon from '../atoms/Icon';
import ProfileCard from '../molecules/ProfileCard';
import { useRouter } from 'next/router';
import { decodeToken } from '../../utils/authHelpers';


const Header = () => {
    const [showProfile, setShowProfile] = useState(false);
    const profileRef = useRef(null);
    const [user, setUser] = useState(null);
    const router = useRouter();


    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
          const decoded = decodeToken(token);
            setUser(decoded);
        }
    }, []);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (profileRef.current && !profileRef.current.contains(event.target)) {
                setShowProfile(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleLogout = () => {
      localStorage.removeItem('token');
      router.push('/login');
    };

    const renderNavItems = () => {
        if (user?.role === 'admin') {
          return (
              <>
                  <a href="/admin">Dashboard</a>
                  <a href="/admin/users">Users</a>
                  <a href="/admin/library">Library</a>
              </>
          );
        } else if (user?.role === 'user') {
            return (
                <>
                    <a href="/upload-test">Scan Files</a>
                    <a href="/library">Library</a>
                </>
            );
        }
        return null;
    };

    return (
        <header className="header relative">
            <Image
                alt="Summarecon Logo"
                height={40}
                src="/assets/Summarecon_Agung 1.svg"
                width={150}
            />
             <nav>
               {renderNavItems()}
            </nav>
            <div
                ref={profileRef}
                className="relative"
            >
                <div
                    className="user-info cursor-pointer hover:bg-gray-100 rounded-lg p-2 transition-colors"
                    onClick={() => setShowProfile(!showProfile)}
                >
                  <div className="flex items-center space-x-2">
                    <Icon name='user-circle'/>
                    <span>Halo, {user?.nama_pegawai || 'Guest'}</span>
                    <Icon name='chevron-down'/>
                  </div>
                </div>

                {showProfile && (
                    <div className="absolute right-1 mt-4 w-100 rounded-lg shadow-xl transition-all duration-200 ease-in-out transform origin-top">
                        <ProfileCard user={user} onLogout={handleLogout}/>
                    </div>
                )}
            </div>
        </header>
    );
}

export default Header;