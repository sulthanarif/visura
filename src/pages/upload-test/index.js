// src/pages/upload-test/index.js
import DefaultLayout from '../../components/templates/DefaultLayout';
import UploadBox from '../../components/organisms/UploadBox/index';


function UploadPageTest() {
    return (
        <DefaultLayout>
            <div className="container">
                <UploadBox/>
            </div>
         </DefaultLayout>
    );
}

export default UploadPageTest;