import { useParams, useNavigate } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import Pagination from '../../Components/Pagination/Pagination';
import { authorizedPost } from '../apiCaller';
import Toolbar from '../../Components/Navbar/Toolbar';
import { useSelector, useDispatch } from 'react-redux';
import { setNavText } from '../../redux/navbarReducer';
import {
  setDataLength,
  setCurrentPage,
  setItemsPerPage,
  setColumnNames,
  setIsLoading,
  setVisibleColumns,
} from '../../redux/tableFilterReducer';

function SubmitedTaskViewDashboard() {

  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [data, setData] = useState([]);
  const dataLength = useSelector((state) => state.tableFilter.dataLength);
  const currentPage = useSelector((state) => state.tableFilter.currentPage);
  const itemsPerPage = useSelector((state) => state.tableFilter.itemsPerPage);
  const isLoading = useSelector((state) => state.tableFilter.isLoading);
  const project = useSelector((state) => state.project.project);
  const start = useSelector((state) => state.tableFilter.start);
  const columnNames = useSelector((state) => state.tableFilter.columnNames);
  const sortOrder = useSelector((state) => state.tableFilter.sortOrder);
  const sortingColumn = useSelector((state) => state.tableFilter.sortingColumn);
  const visibleColumns = useSelector((state) => state.tableFilter.visibleColumns);

  const limit = itemsPerPage;
  
  useEffect(() => {
    (async () => {
      try {
        dispatch(setIsLoading(true));
        project?.map((item) => {
          if (item.id === id) {
            dispatch(setNavText("Project / " + item.projectName));
          }
        });

        // console.log(id, start, limit, sortingColumn, sortOrder);
        const response = await authorizedPost('getEmployeSubmitedTasks', { id, start, limit, sortingColumn, sortOrder });
        if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);
        const data = await response.json();

        setData(data);
        // console.log(data);
        dispatch(setDataLength(data.length));

        filterColumnNames(data);

      } catch (error) {
        console.error('Error fetching projects:', error);
      } finally {
        dispatch(setIsLoading(false));
      }
    })();
  }, [id, start, limit, sortingColumn, sortOrder]);

  const filterColumnNames = (data) => {
    const columns = new Set();
    const visiblecolumns = new Set();
    data.forEach((item) => {
      if (item) Object.keys(item).forEach((key) => { columns.add(key) });
    });
    const columnsArray = Array.from(columns);
    dispatch(setColumnNames(columnsArray));
    columnsArray.map((item) => {
      visiblecolumns.add({ [item]: true });
    });
    dispatch(setVisibleColumns(Array.from(visiblecolumns)));
  };

  const getVisibleColumnValue = (key) => {
    const column = visibleColumns?.find((col) => Object.keys(col)[0] === key);
    return column ? column[Object.keys(column)[0]] : undefined;
  }

  function trimString(str) {
    if (typeof str !== 'string') return str;
    return str?.length > 30 ? `${str.slice(0, 30)}...` : str;
  }

  const getValue = (item, col) => {
    let value = '';
    if (col in item) value = item[col];
    else if (item.data && col in item.data) value = item.data[col];
    else if (item.annotations && item.annotations[0] && col in item.annotations[0]) {
      value = item.annotations[0][col];
    }
    if (value && typeof value === 'object') {
      if ('path' in value) return value.path;
      return JSON.stringify(value);
    }
    return typeof value === 'string' && value?.length > 30 ? `${value?.slice(0, 30)}...` : value || '-';
  };


  const rowClickedOpenTask = (item) => {
    navigate(`/testBoard/${id}/${item.TestID}/${item.Employee_ID}`);
  };

  function trimString(str) {
    if (typeof str !== 'string') return str;
    return str?.length > 30 ? `${str.slice(0, 30)}...` : str;
  }

  return (
    <div className=" bg-grey-100 ">
      <Toolbar />
      <div className="p-1	">
        {isLoading ? (
          <div className="text-center text-gray-600">Loading data...</div>
        ) : (
          <>
            <div className="p-1">
              <div
                className="overflow-auto max-h-[73vh] min-w-full border-b border-gray-300 rounded-lg shadow-lg"
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(4, 1fr)',
                  gap: '16px',
                }}
              >
                <table className="table-auto">
                  <thead className="sticky top-[0vh] bg-white w-full">
                    <tr>
                      {columnNames.map((col) =>
                        <>
                          {getVisibleColumnValue(col) &&
                            <th className="px-6 py-3 border-b border-black text-left text-sm font-medium text-black" key={col}>
                              {col}
                            </th>
                          }
                        </>
                      )}
                    </tr>
                  </thead>
                  <tbody>
                  {data.map((item, index) => (
                      <tr
                        key={index}
                        onClick={() => rowClickedOpenTask(item)}
                        className={`cursor-pointer hover:bg-gray-300 transition duration-150 ease-in-out ${index % 2 === 0 ? "bg-gray-100" : "bg-gray-50"}`}>
                        {columnNames.map((col) =>
                          <>
                            {getVisibleColumnValue(col) &&
                              <td
                                key={col}
                                className="px-6 py-4 border-b border-gray-300 text-sm text-gray-700 whitespace-nowrap overflow-hidden text-ellipsis"
                              >
                                {trimString(getValue(item, col))}
                              </td>
                            }
                          </>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="flex justify-end py-2 ">
              <Pagination
                totalItems={dataLength}
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
                itemsPerPage={itemsPerPage}
                setItemsPerPage={setItemsPerPage}
              />
            </div>
          </>
        )}
      </div>
    </div>

  );
}

export default SubmitedTaskViewDashboard;
