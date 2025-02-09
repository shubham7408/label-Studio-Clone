import React, { useCallback } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { authorizedPost } from '../apiCaller';
import { showAlert } from '../../redux/alertReducer';
import { useSelector, useDispatch } from 'react-redux';


const Modal = React.memo(({ isOpen, onClose, children }) => {
    if (!isOpen) return null;
    return (
        <div
            className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center"
            onClick={onClose}>
            <div
                className="bg-white rounded-lg shadow-lg p-6 w-1/2"
                onClick={(e) => e.stopPropagation()}>
                <div className="flex justify-between items-center border-b pb-2 mb-4">
                    <h2 className="text-xl font-bold">Add New Employee</h2>
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
});

function AddEmpORG({ isNewEmployeeRegisteredViewOpened, setIsNewEmployeeRegisteredViewOpened }) {
    const dispatch = useDispatch();
    const validationSchema = Yup.object({
        employeeID: Yup.string().required('Employee ID is required.'),
        employeeName: Yup.string().required('Employee name is required.'),
        email: Yup.string()
            .email('Please enter a valid email address.')
            .required('Email/Username is required.')
            .test('validity-check', (value) => {
                if (!value) return false;
                const isEmail = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value);
                if (!isEmail) {
                    return new Yup.ValidationError('The email format is invalid.', null, 'email');
                }
                return true;
            }),
        password: Yup.string().required('Temporary password is required.'),
        role: Yup.string().required('Role is required.')
            .test('validity-check', (value) => {
                if (!value) return false;
                if (value !== 'employee' && value !== 'manager') {
                    return new Yup.ValidationError('Role must be either "Employee" or "Manager".', null, 'role');
                }
                return true;
            }),
    });

    const formik = useFormik({
        initialValues: {
            employeeID: '',
            employeeName: '',
            email: '',
            password: '',
            role: '',
        },
        validationSchema,
        onSubmit: async (values) => {
            try {
                const response = await authorizedPost('addEmployeeData', values);
                if (response.status === 200) {
                    response.json().then((data) => {
                        dispatch(showAlert({ message: data.message, type: 'success' }));
                        // console.log('Employee data saved!');
                        setIsNewEmployeeRegisteredViewOpened(false);
                        formik.resetForm();
                    })
                } else {
                    response.json().then((data) => {
                        dispatch(showAlert({ message: data.error, type: 'error' }));
                    })
                }
            } catch (error) {
                dispatch(showAlert({ message: "Failed to save employee data", type: 'error' }));
            }
        },
    });

    const handleClose = useCallback(() => {
        formik.resetForm();
        setIsNewEmployeeRegisteredViewOpened(false);
    }, [setIsNewEmployeeRegisteredViewOpened]);


    return (
        <Modal isOpen={isNewEmployeeRegisteredViewOpened} onClose={handleClose}>
            <form onSubmit={formik.handleSubmit}>
                <div>
                    <p className="mb-2">Employee ID</p>
                    <input
                        type="text"
                        className="border w-full p-2 mb-4"
                        placeholder="Enter employee ID"
                        {...formik.getFieldProps('employeeID')}
                    />
                    {formik.touched.employeeID && formik.errors.employeeID && (
                        <p className="text-red-500 text-sm">{formik.errors.employeeID}</p>
                    )}

                    <p className="mb-2">Employee Name</p>
                    <input
                        type="text"
                        className="border w-full p-2 mb-4"
                        placeholder="Enter employee name"
                        {...formik.getFieldProps('employeeName')}
                    />
                    {formik.touched.employeeName && formik.errors.employeeName && (
                        <p className="text-red-500 text-sm">{formik.errors.employeeName}</p>
                    )}

                    <p className="mb-2">Email / Username</p>
                    <input
                        type="email"
                        className="border w-full p-2 mb-4"
                        placeholder="Enter employee email or username"
                        {...formik.getFieldProps('email')}
                    />
                    {formik.touched.email && formik.errors.email && (
                        <p className="text-red-500 text-sm">{formik.errors.email}</p>
                    )}

                    <p className="mb-2">Temporary Password</p>
                    <input
                        type="password"
                        className="border w-full p-2 mb-4"
                        placeholder="Enter temporary password"
                        {...formik.getFieldProps('password')}
                    />
                    {formik.touched.password && formik.errors.password && (
                        <p className="text-red-500 text-sm">{formik.errors.password}</p>
                    )}

                    <p className="mb-2">Role:</p>
                    <select
                        className="border w-full p-2 mb-4"
                        {...formik.getFieldProps('role')}
                    >
                        <option value="">None</option>
                        <option value="employee">Employee</option>
                        <option value="manager">Manager/Reviewer</option>
                    </select>
                    {formik.touched.role && formik.errors.role && (
                        <p className="text-red-500 text-sm">{formik.errors.role}</p>
                    )}
                </div>
                <div className="flex justify-end gap-4 mt-4">
                    <button
                        type="button"
                        onClick={handleClose}
                        className="bg-red-500 text-white px-4 py-2 rounded">
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className="bg-blue-500 text-white px-4 py-2 rounded">
                        Save
                    </button>
                </div>
            </form>
        </Modal>
    );
}

export default AddEmpORG;
