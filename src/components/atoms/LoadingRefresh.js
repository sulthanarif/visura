import React from "react";

import { Spinner } from "flowbite-react";

const LoadingRefresh = () => {
    return (
        <div className="bg-white p-8 rounded-lg shadow-md text-center">
            <h1 className="text-2xl font-semibold mb-4">Tunggu Sebentar...</h1>
             <Spinner className="mx-auto"/>
        </div>
    );
};

export default LoadingRefresh;