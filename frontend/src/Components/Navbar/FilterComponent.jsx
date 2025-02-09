import React, { useState } from 'react';
import { useSelector } from 'react-redux';


const FilterComponent = ({ filters, setFilters }) => {
  const fieldOptions = useSelector((state) => state.tableFilter.columnNames);
  const operatorOptions = ['contains', 'not contains', 'regex', 'equal', 'not equal', 'is equal'];
  const [logic, setLogic] = useState('AND'); // Single state for "AND/OR" logic
  
  // Handler for adding another filter
  const addFilter = () => {
    setFilters([...filters, { id: filters.length + 1, field: '', operator: '', value: '' }]);
  };

  // Handler for removing a filter
  const removeFilter = (id) => {
    setFilters(filters.filter((filter) => filter.id !== id));
  };

  // Update the filter value
  const handleFilterChange = (id, field, value) => {
    const updatedFilters = filters.map((filter) =>
      filter.id === id ? { ...filter, [field]: value } : filter
    );
    setFilters(updatedFilters);
  };

  // Update the logic (AND/OR) and apply it to all filters
  const handleLogicChange = (e) => {
    setLogic(e.target.value);
  };

  return (
    <div className="p-4">
      {filters.map((filter, index) => (
        <div key={filter.id} className="flex items-center mb-2">
          {/* Logical operator displayed in front of each filter, but same for all */}
          {index !== 0 && (
            <select
              value={logic}
              onChange={handleLogicChange}  // Changing logic for all filters
              className="border rounded p-1 mr-2"
            >
              <option value="AND">AND</option>
              <option value="OR">OR</option>
            </select>
          )}

          {index === 0 && <label className="mr-2">Where</label>} {/* "Where" label only for the first filter */}

          <select
            value={filter.field}
            onChange={(e) => handleFilterChange(filter.id, 'field', e.target.value)}
            className="border rounded p-1 mr-2"
          >
            <option value="">Select Field</option>
            {fieldOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>

          <select
            value={filter.operator}
            onChange={(e) => handleFilterChange(filter.id, 'operator', e.target.value)}
            className="border rounded p-1 mr-2"
          >
            <option value="">Select Operator</option>
            {operatorOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>

          <input
            type="text"
            value={filter.value}
            onChange={(e) => handleFilterChange(filter.id, 'value', e.target.value)}
            className="border rounded p-1 mr-2"
            placeholder="Enter value"
          />

          <button
            onClick={() => removeFilter(filter.id)}
            className="text-red-500 hover:text-red-700"
          >
            🗑️
          </button>
        </div>
      ))}

      <button
        onClick={addFilter}
        className="bg-white text-black border-2 px-2 py-1 rounded flex items-center"
      >
        ➕ Add Another Filter
      </button>
    </div>
  );
};

export default FilterComponent;
