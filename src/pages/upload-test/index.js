// src/pages/upload-test/index.js
import DefaultLayout from '../../components/templates/DefaultLayout';
import UploadBox from '../../components/organisms/UploadBox';
import PreviewTransmittal from '@/components/organisms/PreviewTransmittal';

function UploadPageTest() {
    return (
        <DefaultLayout>
            <div className="container">
                <UploadBox/>
                <PreviewTransmittal/>
            </div>
         </DefaultLayout>
    );
}

export default UploadPageTest;