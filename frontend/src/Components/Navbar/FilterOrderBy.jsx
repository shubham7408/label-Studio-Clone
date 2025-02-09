import React, { useEffect, useState, } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setSortOrder, setSortingColumn } from '../../redux/tableFilterReducer';

const FilterOrderBy = () => {
    const dispatch = useDispatch();
    const sortOrder = useSelector((state) => state.tableFilter.sortOrder);
    const columnNames = useSelector((state) => state.tableFilter.columnNames);

    const handleOrderChange = () => {
        dispatch(setSortOrder(!sortOrder));
    };

    return (
        <div className="relative inline-block text-left flex">
            <div >
                <select
                    value={useSelector((state) => state.tableFilter.sortingColumn)}
                    onChange={(e) => { dispatch(setSortingColumn(e.target.value)) }}
                    className=" rounded mr-1 rounded-md border border-gray-300 shadow-sm px-4 py-1.5 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">
                    <option value="">Select Field</option>
                    {columnNames.map((option) => (
                        <option key={option} value={option}>
                            {option}
                        </option>
                    ))}
                </select>
            </div>
            <div >
                <button
                    onClick={() => handleOrderChange()}
                    className=" h-full inline-flex items-center justify-center rounded-md border border-gray-300 shadow-sm px-2 py-1.5 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">
                    <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path
                            transform={`rotate(${sortOrder ? 0 : 180} 10 10)`}
                            fillRule="evenodd"
                            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                            clipRule="evenodd"
                        />
                    </svg>
                </button>
            </div>
        </div>
    );
};

export default FilterOrderBy;
