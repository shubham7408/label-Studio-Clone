import React from 'react';
const email = localStorage.getItem('email');
const UserInfo = () => {
  return (
    <>
      <div className="flex items-center my-1 p-1 bg-gray-100 rounded-lg shadow-md max-w-xs px-2 ">

        <div className="flex items-center justify-center w-7 h-7 bg-gray-400 rounded-full">
          <span className="text-white text-xs font-bold">VI</span>
        </div>

        <div className="ml-2">
          <div className="flex items-center ">
            <span className="text-gray-900">{email}</span>
          </div>
        </div>

      </div>
      
      <div className=" h-full flex items-center justify-center">
        <div className="flex items-center my-1 p-1 rounded-lg max-w-xs h-full ">
          <div className="ml-2 h-full ">
            <div className="flex items-center ">
              <span className="text-gray-900">Created 1 month ago</span>
            </div>
          </div>
        </div>
      </div>


    </>

  );
};

export default UserInfo;
