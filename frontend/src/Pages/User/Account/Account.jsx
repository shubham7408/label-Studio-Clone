import { React, useEffect, useState } from 'react';
import { PencilIcon } from '@heroicons/react/outline';
import { useParams } from 'react-router-dom';
import { authorizedPost, authorizedPut } from '../../apiCaller';
import { useSelector, useDispatch } from 'react-redux';
import { setNavText } from '../../../redux/navbarReducer';
import Alert from '../../../Components/Alert/Alert';
import { showAlert } from '../../../redux/alertReducer';


const Account = () => {
    const { id } = useParams();
    const [editMode, setEditMode] = useState(false);
    const [userData, setUserData] = useState({});
    const dispatch = useDispatch();
    const role = localStorage.getItem('role');
    const email = localStorage.getItem('email');
    const isAdmin = () => role === 'admin';

    const changeEditMode = () => {
        setEditMode(!editMode);
    }

    const handleCancelClick = () => {
        setEditMode(!editMode);
    }

    const handleUpdateClick = async () => {
        const updatedData = {
            _id: userData?._id,
            email: userData?.email,
            employeeName: userData?.employeeName,
            mobileNo: userData?.mobileNo,
            employeeID: userData?.employeeID,
            role: userData?.role,
        };

        try {
            const response = await authorizedPut('updateEmployeeData', updatedData);
            if (!response.ok) {
                // throw new Error("Failed to update employee data");
                dispatch(showAlert({ message: "Failed to update employee data", type: 'error' }));
                return;
            }
            const data = await response.json();
            setUserData(data?.user);
            setEditMode(false);
            dispatch(showAlert({ message: "Employee data updated successfully", type: 'success' }));

        } catch (error) {
            // console.error("Error updating employee data:", error);
            dispatch(showAlert({ message: "Failed to update employee data", type: 'error' }));
        }
    }

    useEffect(() => {
        (async () => {
            const query = {};
            if (id) {
                query._id = id;
            } else {
                query.email = localStorage.getItem('email');
            }
            try {
                const response = await authorizedPost('getEmployeeData', query);
                if (!response.ok) {
                    throw new Error("Failed to fetch employee data");
                }
                const data = await response.json();
                setUserData(data?.user);
            } catch (error) {
                console.error("Error fetching employee data:", error);
            }
            dispatch(setNavText("Profile"));
        })();
    }, [id, editMode]);

    return (
        <div className='text-gray-800 bg-gray-50 bg-opacity-50'>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-14">
                <div className="border-gray p-6 py-10 relative">
                    {(isAdmin() || email === userData?.email) &&
                        <div className='flex justify-end absolute top-0 left-0 w-full p-6'>
                            {!editMode && (
                                <PencilIcon
                                    onClick={changeEditMode}
                                    className="h-4 w-4 cursor-pointer"
                                />
                            )}
                        </div>
                    }
                    <div className='flex justify-center'>
                        <div className='w-24 h-24 border-gray rounded-full flex text-center items-center justify-center'>
                            {userData?.img ? (
                                <img
                                    src={userData?.img}
                                    alt="User Avatar"
                                    className="h-16 w-16 rounded-full"
                                />
                            ) : (
                                <div className="bold flex items-center font-bold text-3xl text-gray-400">
                                    {userData?.email?.slice(0, 2).toUpperCase()}
                                </div>
                            )}
                        </div>
                    </div>
                    <div className='space-y-2 mt-8'>
                        <div className='flex items-center gap-4'>
                            <label className='w-[7rem]'>Email</label>
                            <input
                                placeholder="Email"
                                className='border-gray rounded bg-transparent py-1 px-4 border w-full focus:outline-none'
                                disabled={!editMode}
                                value={userData?.email}
                                onChange={(e) => setUserData({...userData, email: e.target.value})} />
                        </div>
                        <div className='flex items-center gap-4'>
                            <label className='w-[7rem]'>Name</label>
                            <input
                                placeholder="Employee name"
                                className='border-gray rounded bg-transparent py-1 px-4 border w-full focus:outline-none'
                                disabled={!editMode}
                                value={userData?.employeeName}
                                onChange={(e) => setUserData({...userData, employeeName: e.target.value})}/>
                        </div>
                        <div className='flex items-center gap-4'>
                            <label className='w-[7rem]'>Mobile No</label>
                            <input
                                placeholder="Mobile number"
                                className='border-gray rounded bg-transparent py-1 px-4 border w-full focus:outline-none'
                                disabled={!editMode}
                                value={userData?.mobileNo}
                                onChange={(e) => setUserData({...userData, mobileNo: e.target.value})}/>
                        </div>
                        <div className='flex items-center gap-4'>
                            <label className='w-[7rem]'>Employee ID</label>
                            <input
                                placeholder="Employee ID"
                                className='border-gray rounded bg-transparent py-1 px-4 border w-full focus:outline-none'
                                disabled={true}
                                value={userData?.employeeID}/>
                        </div>
                        <div className='flex items-center gap-4'>
                            <label className='w-[7rem]'>Position</label>
                            <select
                                className='border-gray rounded bg-transparent py-1 px-4 border w-full focus:outline-none'
                                disabled={!editMode}
                                value={userData?.role}
                                onChange={(e) => setUserData({...userData, role: e.target.value})}>
                                <option value="employee">Employee</option>
                                <option value="manager">Manager/Reviewer</option>
                                <option value="admin">Admin</option>
                            </select>
                        </div>
                    </div>

                    {editMode && (
                        <div className="flex flex-col items-center mt-8 text-center text-lg font-bold space-y-3">
                            <button
                                onClick={handleUpdateClick}
                                className="w-32 cursor-pointer rounded-md border border-blue-500 bg-blue-500 text-white py-2 px-4 shadow-sm hover:shadow-md hover:bg-blue-600 transition duration-300">
                                Update
                            </button>
                            <button
                                onClick={handleCancelClick}
                                className="w-32 cursor-pointer rounded-md border border-red-600 bg-red-600 text-white py-2 px-4 shadow-sm hover:shadow-md hover:bg-red-700 transition duration-300">
                                Cancel
                            </button>
                            <Alert
                                show={true}
                            />
                        </div>
                    )}
                </div>

                <div className="border-gray p-6 py-10">
                    <p className='text-xl font-bold'>Contributions</p>
                    <ul className='list-none pl-5'>
                        <li>Project P</li>
                    </ul>
                </div>
            </div>
        </div>
    )
}

export default Account;
