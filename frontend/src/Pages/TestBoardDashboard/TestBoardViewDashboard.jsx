import React, { useState, useEffect } from "react";
import { useParams, useNavigate,useLocation  } from 'react-router-dom';
import { authorizedPost } from "../apiCaller";
import ReactMarkdown from "react-markdown";
import EditableMarkdown from "../../Components/EditableMarkdown/EditableMarkdown";
import UserInfo from "../../Components/Navbar/UserInfo";
import TestStats from "../../Components/Statitics/TestStats.jsx";

const TestBoardViewDashboard = () => {

    const [taskCount, setTaskCount] = useState(-1);
    const [selectedTask, setSelectedTask] = useState(-1);
    const [tasks, setTasks] = useState([]);
    const [task, setTask] = useState();
    const { user_id, project_id, id, test_id } = useParams();
    const [projectId, setProjectId] = useState(project_id);
    const [learnerAns, setMarkdown] = useState("");
    const [_id, set_id] = useState(id);
    const navigate = useNavigate();
    const [testId, setTestId] = useState(tasks[0]?.TestID);

    const location = useLocation();
    const { type } = location.state || {};

    useEffect(() => {

        const fetchData = async () => {
            try {
                const response = await authorizedPost("get-submited-task", { user_id, projectId, test_id });
                if (!response.ok) {
                    throw new Error("Failed to fetch task data");
                }
                const taskData = await response.json();
                setTestId(taskData[0]?.TestID);
                setTasks(taskData);
                // console.log("taskData",taskData);

            } catch (error) {
                console.error("Error fetching task data:", error);
            }
        };

        if (test_id && projectId && user_id) {
            fetchData();
        }
    }, [projectId, user_id, test_id]);

    useEffect(() => {
        if(selectedTask >= 0){
            setTask(tasks[selectedTask]);
        }
    },[selectedTask]);

    return (
        <div className="h-full ">
            <>
                <div className="flex">
                    <div className="w-screen">
                        <div className=" flex bg-slate-200">
                            <UserInfo />
                            <span className="items-center py-2 relative px-6"><b>Tasks </b>:{taskCount + 1}/10</span>
                            <span className="items-center py-2 relative px-6"><b>Current Test ID: </b>:{testId}</span>

                        </div>

                        <div className="flex h-full">
                            <div className=" bg-gray-100" style={{ width: "90%" }}>
                                {selectedTask < 0 ?
                                   
                                        <TestStats tasks={tasks} />
                                     :
                                    <>
                                        <div className="px-1 pt-2 flex">
                                            <h1 className="text-xl font-bold text-gray-800">Code</h1>
                                            <div className="flex items-center">
                                                <span className="text-gray-600 mx-1 px-4 flex gap-2">
                                                    <p className="font-medium">Language:</p>
                                                    <p className="font-medium">Python</p>
                                                </span>

                                            </div>
                                        </div>
                                        <div className="border mt-1 px-2">
                                            <div className=" grid grid-cols-3 px-2  mt-5 gap-2">
                                                <div className="bg-white rounded-lg w-full p-3 px-2 mx-auto mt-4 overflow-auto max-w-full">
                                                    <h2 className="text-sm font-semibold text-gray-800">
                                                        Question:
                                                    </h2>
                                                    <ReactMarkdown>{task?.Question}</ReactMarkdown>
                                                </div>
                                                <div className="bg-white rounded-lg w-full p-3 px-2 mx-auto mt-4 overflow-auto max-w-full">
                                                    <h2 className="text-sm font-semibold text-gray-800">
                                                        Answer:
                                                    </h2>
                                                    <EditableMarkdown markdown={task?.answer} />
                                                </div>
                                                <div className="bg-white rounded-lg w-full p-3 px-2 mx-auto mt-4 overflow-auto max-w-full">
                                                    <h2 className="text-sm font-semibold  text-gray-800">
                                                        Ai Response
                                                    </h2>
                                                    <p className="text-gray-700 mt-2">
                                                        Acceptance Rate: {task?.AcceptanceRate}%<br />
                                                        Explanation: {task?.aiExplanation}<br />
                                                        Recommendations: {task?.aiRecommendations}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </>
                                }
                            </div>

                            {/* <TestSet tasks={tasks} /> */}
                            <div className="bg-gray-50 px-3 py-3 h-full rounded-lg shadow-md text-sm " style={{ width: "10%" }}>
                                <div className="flex justify-start mb-6 border-b-2 border-gray-200">
                                    <button
                                        className="flex items-center gap-2 px-6 py-2 font-semibold transition-colors duration-300 text-blue-600 border-b-4 border-blue-600">
                                        Taskset
                                    </button>
                                </div>


                                <div>
                                    <div className="space-y-2">
                                        {tasks.length > 0 ? (
                                            <>
                                                <div
                                                onClick={() => {setSelectedTask(-1); setTask({}); setTaskCount(-1)}}
                                                    className="flex items-center gap-6 px-3 border rounded-lg shadow-sm hover:bg-gray-200  transition-all"
                                                >
                                                    <div>
                                                        <h4 className="font-bold text-gray-900 text-center ">Overview</h4>
                                                    </div>
                                                </div>
                                                {
                                                    tasks.map((item, index) => (
                                                        <div
                                                            onClick={() => {setSelectedTask(index); setTask(item); setTaskCount(index)}}
                                                            key={index}
                                                            className="flex items-center gap-6 px-3 border rounded-lg shadow-sm hover:bg-gray-200  transition-all"
                                                        >
                                                            <div>
                                                                <h4 className="font-bold text-gray-900 text-center ">{item?.QuestionId}</h4>
                                                                {/* <h4 className="font-semibold text-gray-900">{item.EmployeeEmail}</h4> */}
                                                                <p className="text-gray-500">{item.UpdateTime}</p>
                                                            </div>
                                                        </div>
                                                    ))
                                                }
                                            </>
                                        ) : (
                                            <p>No matching tasks found</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </>
        </div>
    );
};


export default TestBoardViewDashboard;