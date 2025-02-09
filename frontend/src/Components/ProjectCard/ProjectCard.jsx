import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { setProject } from "../../redux/projectReducer";
import { authorizedPost } from "../../Pages/apiCaller";
import { IoCloseSharp } from "react-icons/io5";

function ProjectCard({ project }) {
  const dispatch = useDispatch();
  const [menuOpen, setMenuOpen] = useState(false);
  const [showPracticeModal, setShowPracticeModal] = useState(false);
  const navigate = useNavigate();
  const role = localStorage.getItem("role");

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const openProject = () => {
    if (role === "employee") {
      setShowPracticeModal(true);
    } else if (role === "manager" || role === "admin") {
      navigate(`/projects/${project?.id}/`);
    }
  };

  const startTest = async () => {
    const response = await authorizedPost("startPractice-get-random-task-id", {
      projectId: project?.id,
    });
    response.json().then((question_objectid) => {
      // Navigate to testBoard with 'type' set to 'test'
      navigate(`/testBoard/${project?.id}/${question_objectid}/`, {
        state: { type: "test" },
      });
      setShowPracticeModal(false);
    });
  };

  const startPractice = async () => {
    const response = await authorizedPost("startPractice-get-random-task-id", {
      projectId: project?.id,
    });
    response.json().then((question_objectid) => {
      // Navigate to testBoard with 'type' set to 'practice'
      navigate(`/testBoard/${project?.id}/${question_objectid}/`, {
        state: { type: "practice" },
      });
      setShowPracticeModal(false);
    });
  };

  return (
    <div
      className={`max-w-sm rounded overflow-hidden cursor-pointer shadow-lg bg-blue-200 ${project?.bgColorDown}`}
    >
      <div className={`rounded-t-lg p-3 ${project?.bgColorUp}`}>
        <div className="flex justify-between items-center">
          <h2
            onClick={openProject}
            className={`font-semibold cursor-pointer transition-colors ${
              project?.bgColorUp.includes('blue') ? 'text-black hover:text-white' : 'text-black hover:text-blue-600'
            }`}
            title="Click to open project"
          >
            {project?.projectName}
          </h2>
          <div className="relative">
            <button
              className="text-gray-800 focus:outline-none"
              onClick={toggleMenu}
              aria-label="Toggle project menu"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 15a2 2 0 110-4 2 2 0 010 4zm0 5a2 2 0 110-4 2 2 0 010 4zm0-10a2 2 0 110-4 2 2 0 010 4z" />
              </svg>
            </button>
            {menuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-50">
                <ul className="py-1">
                  <li>
                    <button
                      className="block px-4 py-2 text-gray-800 hover:bg-gray-200 w-full text-left"
                      onClick={() => alert("Setting clicked")}
                    >
                      Setting
                    </button>
                  </li>
                  <li>
                    <button
                      className="block px-4 py-2 text-gray-800 hover:bg-gray-200 w-full text-left"
                      onClick={() => alert("Label clicked")}
                    >
                      Label
                    </button>
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>
        <div>
          <div className="flex justify-between items-center mt-2">
            <p className="text-black">
              {project?.completed} / {project?.total}
            </p>
            <span className="bg-green-300 text-green-800 text-xs font-bold px-2.5 py-0.5 rounded">
              {project?.status}
            </span>
            <div className="flex items-center mt-2">
              <span className="text-green-700 ml-2">✔ {project?.progress}</span>
              <span className="text-red-600 ml-2">— 0</span>
              <span className="text-blue-500 ml-2">💡 0</span>
            </div>
          </div>
        </div>
      </div>
      <div className="flex justify-between items-center mt-4 p-3">
        <div className="text-gray-500 text-sm">{project?.date}</div>
        <div className="flex items-center">
          {project?.avatar ? (
            <img
              src={project?.avatar}
              alt="User Avatar"
              className="h-8 w-8 rounded-full"
            />
          ) : (
            <div className="h-8 w-8 bg-gray-100 rounded-full flex items-center justify-center text-gray-600 border border-gray-300">
              {project?.userInitials}
            </div>
          )}
        </div>
      </div>

      {/* Modal for confirming practice start */}
      {showPracticeModal && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-80 text-center">
            <IoCloseSharp
              className="relative left-64 text-gray-600 hover:text-gray-900 cursor-pointer"
              onClick={() => setShowPracticeModal(false)}
              size={24} // Adjust the size as needed
            />
            <h2 className="text-xl font-semibold mb-6">
              Do you want to start ?
            </h2>
            <div className="flex justify-evenly gap-4 ">
              <button
                className="bg-green-500 w-full text-white py-2 px-4 rounded-lg hover:bg-green-600 transition"
                onClick={startTest}
              >
                Test
              </button>
              <button
                className="bg-red-500 w-full text-white py-2 px-4 rounded-lg hover:bg-red-600 transition"
                onClick={startPractice}
              >
                Practice
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProjectCard;
