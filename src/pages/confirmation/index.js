// page confirmation
import React from 'react';
import DefaultLayout from '../../components/templates/DefaultLayout';
import UploadBox from '../../components/organisms/UploadBox/index';
import IconWithText from '@/components/molecules/IconWithText';


function ConfirmationPage() {
    return (
            <div className="container">
                <IconWithText icon="check-circle" text="This is a confirmation page" />
            </div>
         
    );
}

export default ConfirmationPage;