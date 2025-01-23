import Icon from "../atoms/Icon";
import Button from "../atoms/Button";
import { Badge } from "flowbite-react";

import axios from "axios";

const ProfileCard = ({ user, onLogout }) => {

    const isThisAdmin = user?.role === "admin";
    
    return (
        <div className="bg-white rounded-lg shadow-md p-6 w-80">
            <div className="flex items-center mb-4">
                <i className="fas fa-user-circle text-orange-500 text-3xl"></i>
                <div className="ml-3">
                    <div className="text-orange-500 font-bold text-lg">{user?.nama_pegawai}
                        </div>
                    <div className="text-yellow-500 text-sm">NIP: {user?.nomor_pegawai}</div>
                </div>
                <div className="flex items-center ml-auto">
                <Badge size="sm" color="info">{user?.role}</Badge>                
            </div>
            </div>
        
            <hr className="border-gray-300 mb-4" />

            <div className="flex justify-between items-center">
            <Button onClick={onLogout} className="w-full bg-white text-red-600 flex justify-between items-center p-2 hover:bg-white"> Logout
                <Icon name="sign-out" className="text-red-600" />
            </Button>
            </div>
        </div>
    );
}

export default ProfileCard;