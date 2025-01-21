import Icon from "../atoms/Icon";
import Button from "../atoms/Button";
import axios from "axios";

const ProfileCard = () => {
    return (
        <div className="bg-white rounded-lg shadow-md p-6 w-80">
            <div className="flex items-center mb-4">
                <i className="fas fa-user-circle text-orange-500 text-3xl"></i>
                <div className="ml-3">
                    <div className="text-orange-500 font-bold text-lg">Setiabudi Aria</div>
                    <div className="text-yellow-500 text-sm">2310102028</div>
                </div>
            </div>
            <hr className="border-gray-300 mb-4" />
          
            <div className="flex justify-between items-center">
            <Button className="w-full bg-white text-red-600 flex justify-between items-center p-2 hover:bg-white"> Logout
                <Icon name="sign-out" className="text-red-600" />
            </Button>
            </div>
        </div>
    );
}

export default ProfileCard;