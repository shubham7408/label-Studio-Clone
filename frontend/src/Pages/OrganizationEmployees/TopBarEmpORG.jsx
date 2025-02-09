function TopBarEmpORG({ searchQuery, handleSearchChange, handleAddEmployee }) {
    const role = localStorage.getItem('role');
    const isAdmin = () => role === 'admin';
    return (
        <div style={{ justifyContent: "center", marginBottom: "2vh", marginTop: "2vh", alignItems: "center", height: "10vh", gap: "10px", display: "flex" }}>
            <input
                type="text"
                value={searchQuery}
                onChange={handleSearchChange}
                placeholder="Search Employee"
                style={{
                    padding: "5px 10px",
                    borderRadius: "5px",
                    border: "lightgray 1px solid",
                    width: "40%",
                    outline: "none",
                }}
            />
            { isAdmin &&
                <button
                    onClick={handleAddEmployee}
                    style={{
                        padding: "0px 20px",
                        backgroundColor: "#4CAF50",
                        color: "white",
                        border: "none",
                        borderRadius: "5px",
                        cursor: "pointer",
                        height: "60%",
                    }}>
                    Add Employee
                </button>
            }
        </div>
    )
}

export default TopBarEmpORG;