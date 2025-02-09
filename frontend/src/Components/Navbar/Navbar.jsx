import React, { useState, useEffect } from "react";
import { MenuIcon, CogIcon, LogoutIcon } from "@heroicons/react/outline";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFolder, faBuilding } from "@fortawesome/free-solid-svg-icons";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import { useSelector } from 'react-redux';
import AddProjectComponent from "./AddProjectComponent";

const UserProfileModal = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  if (!isOpen) return null;

  const handleAccountSettingsClick = () => {
    onClose();
    navigate("/user/account");
  };

  return (
    <div
      className="fixed inset-0 z-50"
      onClick={onClose}
    >
      <div
        className="absolute w-[13rem] bg-white z-50 rounded-lg border-gray top-14 right-5"
        onClick={(e) => e.stopPropagation()}
      >
        <ul>
          <li className="flex items-center gap-2 hover:bg-gray-200 cursor-pointer px-2 py-1">
            <CogIcon className="h-5 w-5" />
            <span onClick={handleAccountSettingsClick}>Account & Settings</span>
          </li>
          <li className="flex items-center gap-2 hover:bg-gray-200 cursor-pointer px-2 py-1" onClick={() => {
                navigate('/login');
                localStorage.clear();
              }}>
            <LogoutIcon className="h-5 w-5" />
            <span className="cursor-pointer"
              onClick={() => {
                navigate('/login');
                localStorage.clear();
              }}>Logout</span>
          </li>
        </ul>
      </div>
    </div>
  );
};

const Navbar = () => {
  const { id, taskid } = useParams();
  const projectName = useSelector((state) => state.navbar.navtext);
  const company_name = "TaskWise";
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const [isClick, setIsClick] = useState(false);
  const [showUserProfileModal, setShowUserProfileModal] = useState(false)
  const role = localStorage.getItem('role');
  const isAdmin = () => role === 'admin';

  const toggleDrawer = () => {
    setIsOpen(!isOpen);
  };

  const toggleCreate = () => {
    setIsClick(!isClick);
  };

  const navigateLeftMenuHandler = (label) => {
    if (location.pathname.includes("projects") && label === "organization") {
      navigate(`/organization`);
    } else if (label === "projects") {
      navigate(`/projects`);
    }

    if (location.pathname.includes("organization") && label === "projects") {
      navigate(`/projects`);
    } else if (label === "organization") {
      navigate(`/organization`);
    }

    setIsOpen(!isOpen);
  };

  const handleProfileClick = () => {
    setShowUserProfileModal((prev) => !prev);
  };

  const closeProfileModal = () => {
    setShowUserProfileModal(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest(".user-profile-modal")) {
        closeProfileModal();
      }
    };

    if (showUserProfileModal) {
      document.addEventListener("click", handleClickOutside);
    }

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [showUserProfileModal]);

  return (
    <>
      {/* Sidebar */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-50 flex"
          onClick={toggleDrawer}
        >
          <div
            className="bg-white w-64 h-full shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4 border-b">
              <div className="text-xl font-bold whitespace-nowrap">
                Studio for {company_name}
              </div>
              <button
                onClick={toggleDrawer}
                className="absolute top-4 right-4 text-gray-600 hover:text-gray-800"
              >
                &times;
              </button>
            </div>
            <ul className="p-4">
              <li
                onClick={() => navigateLeftMenuHandler("projects")}
                className={`p-2 ${location.pathname.includes("projects")
                  ? "bg-gray-200"
                  : "hover:bg-gray-100 cursor-pointer"
                  } rounded flex items-center gap-2`}
              >
                <FontAwesomeIcon
                  icon={faFolder}
                  className="text-gray-600 w-4 h-4"
                />
                Projects
              </li>
              <li
                onClick={() => navigateLeftMenuHandler("organization")}
                className={`p-2 ${location.pathname.includes("organization")
                  ? "bg-gray-200"
                  : "hover:bg-gray-100 cursor-pointer"
                  } rounded flex items-center gap-2`}
              >
                <FontAwesomeIcon
                  icon={faBuilding}
                  className="text-gray-600 w-4 h-4"
                />
                Organization
              </li>
            </ul>
          </div>
        </div>
      )}

      {/* Navbar */}
      <nav className="fixed bg-white shadow z-50 w-full h-14 p-4 flex items-center justify-between border">
        <div
          className="flex items-center space-x-3 cursor-pointer"
          onClick={() => setIsOpen(true)}
        >
          <div className="text-xl font-bold whitespace-nowrap">
            {company_name}
          </div>
          <button className="text-2xl">
            <MenuIcon className="h-6 w-6" />
          </button>
        </div>
        <div className="m-8 flex items-left w-full space-x-3">
          {projectName ? (
            <div className="text-xl whitespace-nowrap">{projectName}</div>
          ) : null}
        </div>

        <div className="flex items-center space-x-6">
          {taskid && id ? (
            <div className="flex items-center gap-2">
            </div>
          ) : id ? (
            <div className="rounded bg-green-200 font-bold text-sm p-1 cursor-pointer hover:opacity-70 text-green-800">
              Completed
            </div>
          ) : (
            <>
              {isAdmin() ? (
                <button
                  onClick={toggleCreate}
                  className="bg-blue-500 text-white px-4 py-2 rounded"
                >
                  Create
                </button>
              ) : null}
            </>
          )}
          <div className="relative">
            <div
              onClick={handleProfileClick}
              className="bg-green-500 cursor-pointer text-white w-8 h-8 rounded-full flex items-center justify-center user-profile-modal"
            >
              {localStorage.getItem("email")?.slice(0, 2).toUpperCase()}
            </div>
          </div>
        </div>
      </nav>

      {/* Add Project Modal */}
      <AddProjectComponent isClick={isClick} setIsClick={setIsClick} />

      {/* User Profile Modal */}
      <UserProfileModal
        isOpen={showUserProfileModal}
        onClose={closeProfileModal}
      />
    </>
  );
};

export default Navbar;
