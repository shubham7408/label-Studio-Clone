import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import FilterOrderBy from './FilterOrderBy';
import FilterComponent from './FilterComponent';
import {updateVisibleColumns} from '../../redux/tableFilterReducer';
import { FaBluetooth } from 'react-icons/fa';

const Toolbar = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const columnNames = useSelector((state) => state.tableFilter.columnNames);
  const visibleColumn = useSelector((state) => state.tableFilter.visibleColumns);
  const [filters, setFilters] = useState([{ id: 1, field: '', operator: '', value: '' }]);
  const [showActionsDropdown, setShowActionsDropdown] = useState(false);
  const [showColumnsDropdown, setShowColumnsDropdown] = useState(false);
  const [showFiltersDropdown, setShowFiltersDropdown] = useState(false);
  const isLoading = useSelector((state) => state.tableFilter.isLoading);
  const [showOrderDropdown, setShowOrderDropdown] = useState(false);
  const dataLength = useSelector((state) => state.tableFilter.dataLength);

  const toggleDropdown = (dropdown) => {
    switch (dropdown) {
      case 'actions':
        setShowActionsDropdown(!showActionsDropdown);
        setShowColumnsDropdown(false);
        setShowFiltersDropdown(false);
        setShowOrderDropdown(false);
        break;
      case 'columns':
        setShowColumnsDropdown(!showColumnsDropdown);
        setShowActionsDropdown(false);
        setShowFiltersDropdown(false);
        setShowOrderDropdown(false);
        break;
      case 'filters':
        setShowFiltersDropdown(!showFiltersDropdown);
        setShowActionsDropdown(false);
        setShowColumnsDropdown(false);
        setShowOrderDropdown(false);
        break;
      case 'order':
        setShowOrderDropdown(!showOrderDropdown);
        setShowActionsDropdown(false);
        setShowColumnsDropdown(false);
        setShowFiltersDropdown(false);
        break;
      default:
        break;
    }
  };

  return (
    <div className="flex items-center z-10 space-x-2 bg-gray-100 p-2 rounded-lg">
      {/* Actions dropdown */}
      <div className="relative inline-block text-left">
        <button
          onClick={() => toggleDropdown('actions')}
          className="inline-flex justify-center z-1 w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          Actions
          <svg
            className="-mr-1 ml-2 h-5 w-5"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </button>
        {showActionsDropdown && (
          <div className="absolute left-0 mt-2 w-48 bg-white shadow-lg z-10 rounded-md">
            <ul>
              <li className="px-4 py-2 hover:bg-gray-200">Action 1</li>
              <li className="px-4 py-2 hover:bg-gray-200">Action 2</li>
              <li className="px-4 py-2 hover:bg-gray-200">Action 3</li>
            </ul>
          </div>
        )}
      </div>

      <div className="relative inline-block text-left">
        <button
          onClick={() => toggleDropdown('columns')}
          className="inline-flex justify-center w-full rounded-md border border-gray-300 shadow-sm px-4 py-1.5 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          Columns
          <svg
            className="-mr-1 ml-2 h-5 w-5"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </button>
        {showColumnsDropdown && (
          <div className="absolute left-0 mt-2 w-48 bg-white shadow-lg z-10 rounded-md max-h-60 overflow-y-auto">
            <ul>
              {visibleColumn.map((col) => (
                <li className="px-4 py-2 hover:bg-gray-200">
                  <label className="flex items-center space-x-2">
                    <input type="checkbox" className="form-checkbox" checked={col[Object.keys(col)[0]]} onChange={() => dispatch(updateVisibleColumns({ key: Object.keys(col)[0] }))} />
                    <span>{Object.keys(col)[0]}</span>
                  </label>
                </li>
              ))}
            </ul>
          </div>
        )}

      </div>

      {/* Filters dropdown */}
      <div className="relative inline-block text-left">
        <button
          onClick={() => toggleDropdown('filters')}
          className="inline-flex items-center justify-center rounded-md border border-gray-300 shadow-sm px-4 py-1.5 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          Filters
          <span className="ml-1 bg-blue-500 text-white text-xs font-bold rounded-full px-2 py-0.5 ">
            {filters.length}
          </span>
          <svg
            className="-mr-1 ml-2 h-5 w-5"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </button>
        {showFiltersDropdown && (
          <div className="absolute left-0 mt-2 w-50 min-w-60 bg-white shadow-lg z-10 rounded-md">
            <FilterComponent filters={filters} setFilters={setFilters} />
          </div>
        )}
      </div>
     
      <FilterOrderBy />
      {localStorage.getItem("role") === "admin" &&(
      <div className=' absolute right-44 mr-4  flex items-end text-sm'>
          <button        
           className="inline-flex mx-2 items-center justify-center rounded-md border border-gray-300 shadow-sm px-4 py-1.5 bg-white text-md font-medium text-gray-700 hover:bg-gray-200 active:bg-gray-400 focus:outline-none"
          >
            Test
          </button>
          <button
           className="inline-flex items-center justify-center rounded-md border border-gray-300 shadow-sm px-4 py-1.5 bg-white text-md font-medium text-gray-700 hover:bg-gray-200 active:bg-gray-400 focus:outline-none ml-2"

          >
            Pratice
          </button>
      </div>
  )}
      <div className='absolute right-20 text-sm mx-4'>
        <span className='font-bold mx-2'>Tasks :</span>{dataLength}
      </div>
    
    </div>
  );
};

export default Toolbar;
