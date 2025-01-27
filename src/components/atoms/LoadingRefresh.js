import React from "react";
import { Spinner } from "flowbite-react";

const LoadingRefresh = () => {
    return (
        <div className="flex justify-center items-center w-full">
            <div className="mt-4 bg-white p-10 rounded-lg shadow-md text-center max-w-sm w-full">
                <h1 className="text-2xl font-semibold mb-4">Tunggu Sebentar...</h1>
                <Spinner color="warning" className="mx-auto" size="xl"/>
            </div>
        </div>
    );
};

export default LoadingRefresh;