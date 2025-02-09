import React, { useState, useEffect } from 'react';
function UserOverViewORG({ userOverView, setUserOverViewVisible }) {
   
   
    return (
        <div
        style={{
            position: "relative",
            width: "400px",
            border: "1px solid #ccc",
            borderRadius: "8px",
            padding: "16px",
            fontFamily: "Arial, sans-serif",
            display: "flex",
            flexDirection: "column",
        }}>
        <button
            onClick={() => { setUserOverViewVisible(false) }}
            style={{
                position: "absolute",
                top: "8px",
                right: "10px",
                background: "none",
                border: "none",
                color: "#555",
                fontSize: "16px",
                cursor: "pointer",
            }}
        >
            X
        </button>

        <div
            style={{
                fontSize: "16px",
                fontWeight: "bold",
                display: "flex",
                alignItems: "center",
                gap: "12px",
            }}>
            {userOverView?.img ? (
                <img
                    src={userOverView?.img}
                    alt="User Avatar"
                    className="h-16 w-16 rounded-full"
                />
            ) : (
                <div className="h-16 w-16 bg-gray-100 rounded-full flex items-center justify-center text-gray-600 border border-gray-300">
                    {userOverView?.email?.slice(0, 2).toUpperCase()}
                </div>
            )}
            <p>
                {userOverView?.email}
                <br />
                <span
                    style={{
                        fontSize: "14px",
                        fontWeight: "bold",
                        color: "#555",
                    }}
                >
                    {userOverView?.employeeName}
                </span>
            </p>
        </div>

        {userOverView?.contribution?.length > 0 && (
            <div>
                <span style={{ fontSize: "14px", fontWeight: "bold" }}>
                    Contributed to
                </span>
                <ul
                    style={{
                        listStyle: "none",
                        paddingLeft: "0",
                        marginTop: "8px",
                    }}
                >
                    {userOverView?.contribution.map((project, index) => (
                        <li
                            key={project.id}
                            style={{
                                fontSize: "14px",
                                margin: "4px 0",
                                color:
                                    project.priority === "high"
                                        ? "red"
                                        : "black",
                            }}
                        >
                            {project.name}
                            {project.priority === "high" && (
                                <span role="img" aria-label="priority">
                                    🔥
                                </span>
                            )}
                        </li>
                    ))}
                </ul>
            </div>
        )}
        <div
            style={{
                fontSize: "12px",
                color: "#555",
            }}
        >
            Last activity on: <b>{userOverView?.lastActivity}</b>
        </div>
    </div>

    );
}

export default UserOverViewORG;