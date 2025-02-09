import React, { useState } from "react";
import { FaHistory, FaComment } from "react-icons/fa"; // Icon library for History and Comment

const Annotations = ({history, clickHandler, currectIndex}) => {
  
  return (
    <div className="bg-gray-50 px-3 py-3 h-full rounded-lg shadow-md text-sm">
      <div className="flex justify-start mb-6 border-b-2 border-gray-200">
        <button
          className={`flex items-center gap-2 px-6 py-2 font-semibold transition-colors duration-300 "text-blue-600 border-b-4 border-blue-600"`}>
          <FaHistory size={20} />
          History
        </button>
      </div>
      
      <div>
          <div className="space-y-2">
            {history.map((item, index) => (
              <div
                key={index}
                className={`${currectIndex==index ? 'bg-gray-300' : 'bg-gray-100'} flex items-center gap-6 px-3 border rounded-lg  shadow-sm hover:bg-gray-200 transition-all `}
                onClick={() => clickHandler(index)}
              >
                {/* <div className="w-12 h-12 rounded-full bg-gray-400"></div> */}
                <div>
                  <h4 className="font-semibold text-gray-900">{item.EmployeeName}</h4>
                  <h4 className="font-semibold text-gray-900">{item.EmployeeEmail}</h4>
                  <p className="text-gray-500">{item.UpdateTime}</p>
                </div>
              </div>
            ))}
          </div>
      </div>
      
    </div>
  );
};

export default Annotations;
