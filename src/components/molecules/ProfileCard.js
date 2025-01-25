// components/molecules/ProfileCard.js
import Icon from "../atoms/Icon";
import Button from "../atoms/Button";
import { Badge, Dropdown } from "flowbite-react";

const ProfileCard = ({ user, onLogout, onProfileClick, onPasswordChangeClick }) => {
    const isThisAdmin = user?.role === "admin";

    return (
        <div className="bg-white rounded-lg shadow-md p-6 w-70">
            <div className="flex items-center mb-4">
                <i className="fas fa-user-circle text-orange-500 text-3xl"></i>
                <div className="ml-3">
                    <div className="text-orange-500 font-bold text-lg">{user?.nama_pegawai}</div>
                    <div className="text-yellow-500 text-sm">NIP: {user?.nomor_pegawai}</div>
                </div>
                {isThisAdmin ? (
                    <div className="flex items-center ml-auto">
                        <Badge size="sm" color="success">Admin</Badge>
                    </div>
                ) : (
                    <div className="flex items-center ml-auto">
                        <Badge size="sm" color="info">User</Badge>
                    </div>
                )}
            </div>

            <hr className="border-gray-300 mb-4" />

            <Dropdown
                label=""
                className="w-full text-left text-red-600"
                dismissOnClick={false}
                renderTrigger={() => <Button className="w-full bg-white text-red-600 flex justify-between items-center p-2 hover:bg-white">Profile <Icon name="user" className="text-red-600" /></Button>}
            >
                <Dropdown.Item onClick={onProfileClick}>
                    <div className="flex items-center">
                        <Icon name="user" className="text-red-600 mr-2" />
                        <span>Change Profile</span>
                    </div>
                </Dropdown.Item>
                <Dropdown.Item onClick={onPasswordChangeClick}>
                    <div className="flex items-center">
                        <Icon name="lock" className="text-red-600 mr-2" />
                        <span>Change Password</span>
                    </div>
                </Dropdown.Item>
            </Dropdown>

            <Button onClick={onLogout} className="w-full bg-white text-red-600 flex justify-between items-center p-2 hover:bg-white">
                Logout
                <Icon name="sign-out" className="text-red-600" />
            </Button>
        </div>
    );
};

export default ProfileCard;