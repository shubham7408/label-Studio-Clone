import { useNavigate } from 'react-router-dom';

function TableEmpORG({ employees, seeUserOverview }) {
    const navigate = useNavigate();
    const seeUserDetails = (id) => {
        navigate(`/employees/${id}`);
    }
    
    return (
        <table
            style={{
                width: "100%",
                borderCollapse: "collapse",
                backgroundColor: "#ffffff",
                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                borderRadius: "10px",
                overflow: "hidden",
                border: "1px solid #000000",
                borderColor: "#ff0000",
            }}>
            <thead>
                <tr style={{ textAlign: "left" }}>
                    <th style={{ padding: "12px" }}></th>
                    <th style={{ padding: "12px" }}>Email</th>
                    <th style={{ padding: "12px" }}>Name</th>
                    <th style={{ padding: "12px" }}>Last Activity</th>
                </tr>
            </thead>
            <tbody>
                {employees.map((employee, index) => (
                    <tr
                        key={index}
                        style={{ backgroundColor: index % 2 === 0 ? "#f2f2f2" : "#ffffff", textAlign: "left" }}
                        onClick={() => seeUserOverview(employee)}>
                        <td style={{ padding: "12px" }}>
                            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
                                {employee?.img ? (
                                    <img src={employee?.img} alt="User Avatar" className="h-8 w-8 rounded-full" />
                                ) : (
                                    <div className="h-8 w-8 bg-gray-100 rounded-full flex items-center justify-center text-gray-600 border border-gray-300">
                                        {employee?.email?.slice(0, 2).toUpperCase()}
                                    </div>
                                )}
                            </div>
                        </td>
                        <td style={{ padding: "12px", fontFamily: "Arial, sans-serif" }}>
                            <span
                                style={{ cursor: "pointer", textDecoration: "none" }}
                                onMouseEnter={(e) => e.target.style.textDecoration = "underline"}
                                onMouseLeave={(e) => e.target.style.textDecoration = "none"}
                                onClick={() => seeUserDetails(employee?._id)}>
                                {employee?.email}
                            </span>
                        </td>
                        <td style={{ padding: "12px", fontFamily: "Arial, sans-serif" }}>
                            {employee?.employeeName}
                        </td>
                        <td style={{ padding: "12px", fontFamily: "Arial, sans-serif" }}>
                            {new Date(employee?.lastActivity).toLocaleDateString()}
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    )
}

export default TableEmpORG;