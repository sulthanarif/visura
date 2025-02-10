import React from 'react';
import Icon from '../atoms/Icon';
import Button from '../atoms/Button';
import { Spinner, Badge } from 'flowbite-react';

const LibraryTable = ({
    projects,
    currentPage,
    projectsPerPage,
    handlePreviewClick,
    handleDeleteClick,
    loggedInUserId,
    isLoading,
}) => {
    if (isLoading) {
        return (
            <div className="flex justify-center items-center min-h-[45vh]">
                <Spinner size="xl" aria-label="Getting data..." />
            </div>
        );
    }

    return (
        <div className="overflow-x-auto w-full">
            <div className="max-h-[45vh] sm:max-h-[65vh] overflow-y-auto">
                <table className="w-full text-sm text-left text-gray-900 border-collapse border border-orange-300">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400 sticky top-0">
                        <tr>
                            <th className="px-4 py-3 border border-orange-300">No</th>
                            <th className="px-4 py-3 border border-orange-300">Project Name</th>
                             <th className="px-4 py-3 border border-orange-300">Uploaded By</th>
                            <th className="px-4 py-3 border border-orange-300">Created At</th>
                            <th className="px-4 py-3 border border-orange-300 text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {projects.map((project, index) => (
                            <tr
                                key={project.projectId}
                                className={index % 2 === 0 ? 'bg-orange-100' : 'bg-orange-200'}
                            >
                                <td className="px-4 py-3 border border-orange-300 bg-white">
                                    {index + 1 + (currentPage - 1) * projectsPerPage}
                                </td>
                                <td className="px-4 py-3 border border-orange-300">
                                    {project.projectName}
                                </td>
                                 <td className="px-4 py-3 border border-orange-300">
                                      {project.userId === loggedInUserId ? (
                                        <span className="flex items-center gap-2">
                                            You
                                           <Badge className="font-bold" color="dark">You</Badge>
                                         </span>
                                     ) : (
                                            <span>{project.userName || "N/A"}</span>
                                      )}
                                 </td>
                                <td className="px-4 py-3 border border-orange-300">
                                    {new Date(project.created_at).toLocaleDateString()}
                                </td>
                                <td className="px-4 py-3 border border-orange-300 text-center">
                                    <div className="flex items-center justify-center space-x-2">
                                        <Button
                                            onClick={() => handlePreviewClick(project)}
                                            className="bg-[#EBA801] hover:bg-[#F5C076]/90 text-white font-bold py-1 px-3 rounded"
                                        >
                                            <Icon name="eye" className="text-white mr-2" /> Preview
                                        </Button>
                                        <Button
                                            onClick={() => handleDeleteClick(project)}
                                            className="bg-red-500 hover:bg-red-600 text-white font-bold py-1 px-3 rounded"
                                        >
                                            <Icon name="trash" className="text-white mr-2" /> Delete
                                        </Button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default LibraryTable;