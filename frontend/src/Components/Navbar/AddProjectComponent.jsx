import React, { useState } from 'react';
import { authorizedPost, authorizedPostMedia } from '../../Pages/apiCaller';

const Modal = ({ isOpen, onClose, children }) => {
    if (!isOpen) return null;

    return (
        <div
            className="fixed z-10 inset-0 bg-black bg-opacity-50 flex items-center justify-center"
            onClick={onClose}>
            <div
                className="bg-white rounded-lg shadow-lg p-6 w-1/2"
                onClick={(e) => e.stopPropagation()}>
                <div className="flex justify-between items-center border-b pb-2 mb-4">
                    <h2 className="text-xl font-bold">Create Project</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-600 hover:text-gray-800 text-2xl">
                        &times;
                    </button>
                </div>
                {children}
            </div>
        </div>
    );
};

const AddProjectComponent = ({ isClick, setIsClick }) => {
    const [projectName, setProjectName] = useState('');
    const [projectDescription, setProjectDescription] = useState('');
    const [file, setFile] = useState(null);

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleSave = async () => {
        
        if (!file || !projectName || !projectDescription) {
            alert('All fields are required.');
            return;
        }
        
        const formData = new FormData();
        formData.append('projectName', projectName);
        formData.append('projectDescription', projectDescription);
        formData.append('file', file);

        try {
            const response = await authorizedPostMedia('addProjectData', formData);
            const data = await response.json();
            if (response.ok) {
                alert('Project added successfully');
            } else {
                alert(`Error: ${data.message}`);
            }
        } catch (error) {
            console.error('Error uploading project:', error);
            alert('An error occurred while uploading the project.');
        }
    };



    return (
        <div>
            <Modal isOpen={isClick} onClose={() => setIsClick(false)}>
                <div>
                    <p className="mb-2">Project Name</p>
                    <input
                        className="border w-full p-2 mb-4"
                        placeholder="Enter project name"
                        value={projectName}
                        onChange={(e) => setProjectName(e.target.value)}
                    />

                    <p className="mb-2">Description</p>
                    <textarea
                        className="border w-full p-2 mb-4"
                        placeholder="Enter project description"
                        value={projectDescription}
                        onChange={(e) => setProjectDescription(e.target.value)}
                    />

                    <p className="mb-2">Upload File</p>
                    <input
                        type="file"
                        className="border w-full p-2"
                        onChange={handleFileChange}
                    />
                </div>

                <div className="flex justify-end gap-4 mt-4">
                    <button
                        onClick={() => setIsClick(false)}
                        className="bg-red-500 text-white px-4 py-2 rounded"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={() => handleSave()}
                        className="bg-blue-500 text-white px-4 py-2 rounded"
                    >
                        Save
                    </button>
                </div>
            </Modal>
        </div>
    );
};

export default AddProjectComponent;
