import { useNavigate } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import Pagination from '../../Components/Pagination/Pagination';
import { authorizedPost } from '../apiCaller';
import TopBarEmpORG from './TopBarEmpORG';
import TableEmpORG from './TableEmpORG';
import AddEmpORG from './AddEmpORG';
import UserOverViewORG from './UserOverViewORG';
import { useSelector, useDispatch } from 'react-redux';
import {
    getProject, setProject
} from '../../redux/projectReducer';
import { setNavText } from '../../redux/navbarReducer';

function OrganizationEmployees() {
    const dispatch = useDispatch();
    dispatch(setNavText("Organization"));
    const [employees, setEmployees] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalNumberOfEmployees, setTotalNumberOfEmployees] = useState(0);
    const [loading, setLoading] = useState(true);
    const [userOverViewVisible, setUserOverViewVisible] = useState(false);
    const [userOverView, setUserOverView] = useState({});
    const [error, setError] = useState(null);
    const [itemsPerPage, handleItemsPerPageChange] = useState(10);
    const start = (currentPage - 1) * itemsPerPage;
    const limit = itemsPerPage;
    const [searchQuery, setSearchQuery] = useState("");
    const [isNewEmployeeRegisteredViewOpened, setIsNewEmployeeRegisteredViewOpened] = useState(false);

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };

    const handleAddEmployee = () => {
        setIsNewEmployeeRegisteredViewOpened(!isNewEmployeeRegisteredViewOpened);
    };

    useEffect(() => {
        (async () => {
            try {
                const response_ = await authorizedPost('getEmployeesDataLengthOrgPage', { searchQuery });
                if (!response_.ok) {
                    throw new Error("Failed to fetch employee data");
                }
                const length = await response_.json();
                setTotalNumberOfEmployees(length);

                const response = await authorizedPost('getEmployeesDataOrgPage', { start, limit, searchQuery });
                if (!response.ok) {
                    throw new Error("Failed to fetch employee data");
                }
                const EmployeesData = await response.json();
                setEmployees(EmployeesData);

                setLoading(false);
            } catch (err) {
                setError(err.message);
                setLoading(false);
            }
        })();

    }, [start, limit, searchQuery, isNewEmployeeRegisteredViewOpened]);


    useEffect(() => {
        setCurrentPage(1);
    }, [searchQuery]);

    const seeUserOverview = async (user) => {
        const id = user?._id;
        try {
            const response = await authorizedPost('getEmployeesOverviewDataOrgPage', { id });
            if (!response.ok) {
                throw new Error("Failed to fetch employee data");
            }
            const data = await response.json();
            setUserOverViewVisible(true);
            setUserOverView(data);
        } catch (err) {
            setError(err.message);
            setLoading(false);
        }
    };


    if (loading) {
        return <p>Loading...</p>;
    }

    if (error) {
        return <p>Error: {error}</p>;
    }

    return (
        <div style={{ height: "100vh", display: "flex", width: "100vw" }}>
            <div style={{ width: "60vw", marginLeft: "5vh", justifyContent: "left", alignItems: "center", height: "100vh" }}>
                <TopBarEmpORG searchQuery={searchQuery} handleSearchChange={handleSearchChange} handleAddEmployee={handleAddEmployee} />
                <TableEmpORG employees={employees} seeUserOverview={seeUserOverview} />
                <div style={{ padding: "5px", width: "100%" }}>
                    <Pagination totalItems={totalNumberOfEmployees} currentPage={currentPage} setCurrentPage={setCurrentPage} itemsPerPage={itemsPerPage} handleItemsPerPageChange={handleItemsPerPageChange} />
                </div>
            </div>

            <div style={{ position: "fixed", marginLeft: "65vw", marginTop: "20vh", height: "100vh", width: "30vw", color: "black", display: "flex", flexDirection: "column", overflowY: "auto", gap: "16px" }}>
                {userOverViewVisible ? (
                    <UserOverViewORG userOverView={userOverView} setUserOverViewVisible={setUserOverViewVisible} />
                ) : null}

                <AddEmpORG
                    isNewEmployeeRegisteredViewOpened={isNewEmployeeRegisteredViewOpened}
                    setIsNewEmployeeRegisteredViewOpened={setIsNewEmployeeRegisteredViewOpened} />
            </div>
        </div>
    );
};


export default OrganizationEmployees;
