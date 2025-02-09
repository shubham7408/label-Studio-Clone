import React, { useState } from "react";
import { useSelector, useDispatch } from 'react-redux';

const Pagination = ({totalItems, currentPage, setCurrentPage, itemsPerPage, setItemsPerPage }) => {
    const dispatch = useDispatch();
    const totalPages = Math.ceil(totalItems/itemsPerPage);

    const handlePageChange = (newPage) => {
        if (newPage > 0 && newPage <= totalPages) {
            dispatch(setCurrentPage(newPage));
        }
    };
    
    const setItemsPerPage_ = (e) => {
        dispatch(setItemsPerPage(Number(event.target.value)));
        dispatch(setCurrentPage(1));
    };

    return (
        <div
            style={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                gap: "10px",
                fontFamily: "Arial, sans-serif",
                fontSize: "14px",
            }}>
            <div
                style={{
                    height: "100%",
                    display: "flex",
                    alignItems: "center",
                    border: "1px solid #ccc",
                    borderRadius: "5px",
                    padding: "5px 10px",
                    backgroundColor: "#f9f9f9",
                }}
            >
                <button
                    onClick={() => handlePageChange(1)}
                    disabled={currentPage === 1}
                    style={{
                        border: "none",
                        background: "none",
                        color: currentPage === 1 ? "#ccc" : "#007bff",
                        cursor: currentPage === 1 ? "not-allowed" : "pointer",
                    }}
                >
                    «
                </button>
                <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    style={{
                        border: "none",
                        background: "none",
                        color: currentPage === 1 ? "#ccc" : "#007bff",
                        cursor: currentPage === 1 ? "not-allowed" : "pointer",
                        margin: "0 10px",
                    }}
                >
                    ‹
                </button>
                <span style={{ color: "#555" }}>
                    {currentPage} of {totalPages}
                </span>
                <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    style={{
                        border: "none",
                        background: "none",
                        color: currentPage === totalPages ? "#ccc" : "#007bff",
                        cursor: currentPage === totalPages ? "not-allowed" : "pointer",
                        margin: "0 10px",
                    }}
                >
                    ›
                </button>
                <button
                    onClick={() => handlePageChange(totalPages)}
                    disabled={currentPage === totalPages}
                    style={{
                        border: "none",
                        background: "none",
                        color: currentPage === totalPages ? "#ccc" : "#007bff",
                        cursor: currentPage === totalPages ? "not-allowed" : "pointer",
                    }}
                >
                    »
                </button>
            </div>

            <div
                style={{
                    height: "100%",
                    display: "flex",
                    alignItems: "center",
                    border: "1px solid #ccc",
                    borderRadius: "5px",
                    padding: "5px 10px",
                    backgroundColor: "#fff",
                }}>
                <select
                    value={itemsPerPage}
                    onChange={setItemsPerPage_}
                    style={{
                        height: "100%",
                        border: "none",
                        outline: "none",
                        fontSize: "14px",
                        color: "#333",
                        cursor: "pointer",
                        background: "none",
                    }}>
                    <option value={10}>10 per page</option>
                    <option value={20}>20 per page</option>
                    <option value={30}>30 per page</option>
                    <option value={50}>50 per page</option>
                </select>
            </div>
        </div>

    );
};

export default Pagination;
