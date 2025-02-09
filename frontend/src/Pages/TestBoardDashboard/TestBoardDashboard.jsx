import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { authorizedPost } from "../apiCaller";
import ReactMarkdown from "react-markdown";
import EditableMarkdown from "../../Components/EditableMarkdown/EditableMarkdown";
import Timer from "../../Components/Navbar/Timer";
import UserInfo from "../../Components/Navbar/UserInfo";
import { useSelector } from "react-redux";
import Annotations from "../../Components/Annotations/Annotations";
import LongSla from "../../LongSla/LongSla";
const TestBoardDashboard = () => {
  const data = useSelector((state) => state.project.project);
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(true);
  const [isSubmit, setIsSubmit] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [submitChange, setSubmitChange] = useState(1);
  const [currentHistoryData, setCurrentHistoryData] = useState({});
  const [currectIndex, setCurrentIndex] = useState(0);
  const [isCurrentHistoryDataClick, setCurrentHistoryDataClick] =
    useState(false);
  const [taskCount, setTaskCount] = useState(0);
  const maxTasks = 10;
  const [testCompleted, setTestCompleted] = useState(false);
  const [task, setTask] = useState({});
  const { user_id, project_id, id } = useParams();

  const [projectId, setProjectId] = useState(project_id);
  const [learnerAns, setMarkdown] = useState("");
  const [_id, set_id] = useState(id);
  const [history, setHistory] = useState([]);
  const navigate = useNavigate();
  const [testId, setTestId] = useState();
  const location = useLocation();
  const [isAnswerVisible, setIsAnswerVisible] = useState(false);
  const { type } = location.state || {};

  useEffect(() => {
    const fetchTaskListData = async () => {
      try {
        const response = await authorizedPost("get-by-task-id", {
          _id,
          projectId,
        });
        if (!response.ok) {
          throw new Error("Failed to fetch task data");
        }
        const taskData = await response.json();
        setTask(taskData);
        // console.log(taskData);
        const response_ = await authorizedPost(
          "getEmployeSubmitedTasksHistory",
          { projectId, userId: user_id, taskId: _id }
        );
        if (!response_.ok) {
          throw new Error(`Failed to fetch task history: ${response_.status}`);
        }
        const historyData = await response_.json();
        setHistory(historyData);
        // console.log("response_3", historyData);
      } catch (error) {
        console.error("Error fetching task data:", error);
      }
    };

    fetchTaskListData();
  }, [_id, projectId, user_id, submitChange]);

  useEffect(() => {
    const fetchData = async () => {
      const response = await authorizedPost("get-by-test-id", {
        projectId,
      });
      if (!response.ok) {
        throw new Error(`Failed to fetch task history: ${response.status}`);
      }
      const data = await response.json();
      setTestId(data?.testId);
      setTaskCount(data.count);
    };
    if (type === "test" && localStorage.getItem("role") === "employee")
      fetchData();
  }, [_id, projectId, user_id, submitChange]);

  useEffect(() => {
    if (localStorage.getItem("role") === "admin") {
      clickHandler(currectIndex);
    } else {
      if (history.length > 0) {
        clickHandler(currectIndex);
      }
    }
  }, [history]);

  const clickHandler = async (index) => {
    setCurrentIndex(index);
    setCurrentHistoryData(history[index]);
    setCurrentHistoryDataClick(true);
    setMarkdown(history[index]?.EmpAns);
  };

  const answer = task?.data?.seed?.answer || "";
  const trimmedAnswer = answer.split("```", 2).join("```").trim();

  const nextQuestion = async () => {
    if (taskCount + 1 < maxTasks) {
      setTime(0);
      const response = await authorizedPost(
        "startPractice-get-random-task-id",
        { projectId: projectId }
      );
      // console.log(response);
      response.json().then((_id) => {
        set_id(_id);
      });
      setMarkdown(" ");
      setIsSubmit(true);
      // setAiExplanation('');
      // setAcceptanceRate(0);
      // setAiRecommendations('');
      setCurrentHistoryDataClick(false);
      setTaskCount(taskCount + 1);
    } else {
      setTestCompleted(true);
    }
  };

  const viewAns = () => {
    setIsAnswerVisible((prev) => !prev); // Toggle the answer visibility
    setIsCurrentHistoryDataClick(false); // Toggle the answer visibility on click
  };

  const submitAnswer = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(
        "https://nrqbae7ul3.execute-api.ap-south-1.amazonaws.com/prod/output-comparison",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            learner: learnerAns,
            expected: task?.data?.seed?.answer,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      if (response.ok) {
        await response.json().then(async (data) => {
          const { recommendations, acceptance_rate, explanation } = data.body;
          // console.log(recommendations, acceptance_rate, explanation);
          await authorizedPost("add-learner-answer", {
            projectId,
            questionId: id,
            answer: learnerAns,
            timeTaken: time,
            aiRecommendations: recommendations,
            aiAcceptanceRate: acceptance_rate,
            aiExplanation: explanation,
            testId: testId,
          });
          // setAiExplanation(explanation);
          // setAcceptanceRate(acceptance_rate);
          // setAiRecommendations(recommendations);
          setCurrentHistoryDataClick(true);
          setTime(0);

          // console.log(testId);
          setSubmitChange(submitChange + 1);
          if (isSubmit) {
            setIsSubmit(false);
          }
          setIsLoading(false);
          setIsSubmit(false);
        });
      }
    } catch (err) {
      setIsLoading(false);
      setIsSubmit(false);
      console.error("Error in submitAnswer:", err.message);
    }
  };

  const handleOkClick = () => {
    setTestId(testId + 1);
    navigate("/projects");
  };

  return (
    <div className="h-full ">
      {isLoading && <SpinningProgressBar />}
      <>
        <div className="flex">
          <div className="w-screen">
            <div className=" flex bg-slate-200">
              {localStorage.getItem("role") === "employee" && (
                <Timer
                  time={time}
                  setTime={setTime}
                  isRunning={isRunning}
                  setIsRunning={setIsRunning}
                />
              )}
              <UserInfo />
              {type === "test" && (
                <>
                  <span className="items-center py-2 relative px-6">
                    <b>Tasks </b>:{taskCount + 1}/10
                  </span>
                  <span className="items-center py-2 relative px-6">
                    <b>Current Test ID: </b>
                    {testId}
                  </span>
                </>
              )}
              <span className="items-center py-2 relative px-6">
                You are starting a {type === "test" ? "Test" : "Practice"}{" "}
                session!
              </span>
            </div>
            {projectId == 9 && (
              <div className="flex h-full">
                <div className=" bg-gray-100 ">
                  <div className="px-1 pt-2 flex">
                    <h1 className="text-xl font-bold text-gray-800">Code</h1>
                    <div className="flex items-center">
                      <span className="text-gray-600 mx-1 px-4 flex gap-2">
                        <p className="font-medium">Language:</p>
                        <p className="font-medium">{task?.data?.language}</p>
                      </span>
                    </div>
                  </div>
                  <div className="border mt-1 px-2  w-full h-full min-h-screen">
                    <div
                      className={`grid ${
                        type === "test" ? "grid-cols-3" : "grid-cols-4"
                      } px-2 mt-5 gap-2 h-full `}
                    >
                      <div className="bg-white  rounded-lg w-full h-full p-3 px-2 mx-auto mt-4 overflow-auto max-w-full">
                        <h2 className="text-sm  font-semibold text-gray-800">
                          Question:
                        </h2>
                        <ReactMarkdown>
                          {task?.data?.seed?.question}
                        </ReactMarkdown>
                      </div>
                      <div className="bg-white rounded-lg w-full p-3 px-2 mx-auto mt-4 overflow-auto max-w-full">
                        <h2 className="text-sm font-semibold text-gray-800">
                          Answer:
                        </h2>
                        <EditableMarkdown
                          markdown={learnerAns}
                          setMarkdown={setMarkdown}
                        />
                      </div>
                      <div className="bg-white  rounded-lg w-full p-3 px-2 mx-auto mt-4 overflow-auto max-w-full">
                        <div className="flex justify-between ">
                          <h2 className="text-sm font-semibold text-gray-800">
                            Ai Response
                          </h2>
                          {type === "practice" && (
                            <h2
                              onClick={viewAns}
                              className="text-sm text-end font-semibold text-gray-800 cursor-pointer"
                            >
                              {isAnswerVisible ? "Hide Answer" : "View Answer"}
                            </h2>
                          )}
                        </div>
                        {isAnswerVisible && type === "practice" ? (
                          <div>
                            <p className="text-gray-700 mt-2">
                              <pre>
                                <code>
                                  <b>Answer:</b> <br />
                                  {trimmedAnswer} <br />
                                </code>
                              </pre>
                            </p>
                          </div>
                        ) : (
                          isCurrentHistoryDataClick && (
                            <div>
                              <p className="text-gray-700 mt-2">
                                <b> Accuracy:</b>{" "}
                                {currentHistoryData?.AcceptanceRate}% <br />
                                <b>Explanation:</b>{" "}
                                {currentHistoryData?.AiExplanation} <br />
                                <b> Recommendations:</b>{" "}
                                {currentHistoryData?.AiRecommendations}
                              </p>
                            </div>
                          )
                        )}
                      </div>

                      {localStorage.getItem("role") === "employee" &&
                        type === "practice" && (
                          <Annotations
                            history={history}
                            clickHandler={clickHandler}
                            currectIndex={currectIndex}
                          />
                        )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {localStorage.getItem("role") === "employee" && (
          <div className="flex fixed bottom-0 right-0 items-right justify-end px-5 py-1 gap-2">
            {type === "practice" && (
              <button
                className="px-2 py-1 w-32 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition duration-300 text-center"
                onClick={submitAnswer}
              >
                {isSubmit ? "Submit" : "Update"}
              </button>
            )}

            {type === "test" && isSubmit && (
              <button
                className="px-2 py-1 w-32 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition duration-300 text-center"
                onClick={submitAnswer}
              >
                Submit
              </button>
            )}
            <button
              className={`px-2 py-1 w-32 rounded-full text-white transition duration-300 text-center ${
                taskCount === 9
                  ? "bg-red-500 hover:bg-red-600"
                  : "bg-blue-500 hover:bg-blue-600"
              } ${type === "test" && isSubmit ? "hidden" : ""} `}
              onClick={nextQuestion}
            >
              {taskCount === 10 ? "End Test" : "Next"}
            </button>
          </div>
        )}
        {projectId == 10 && (
          <div className="flex">
            <div className={type === "practice" ? "w-5/6" : "w-full"}>
              <LongSla
                projectId={projectId}
                task={task}
                taskCount={taskCount}
              />
            </div>
            {localStorage.getItem("role") === "employee" &&
              type === "practice" && (
                <div className="w-1/6">
                  <Annotations
                    history={history}
                    clickHandler={clickHandler}
                    currectIndex={currectIndex}
                  />
                </div>
              )}
          </div>
        )}
      </>
      {testCompleted && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-5 w-2/6  h-48 rounded-lg shadow-lg text-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Test Completed
            </h2>
            <button
              className="px-4 mt-4 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600"
              onClick={handleOkClick}
            >
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

const SpinningProgressBar = () => {
  const radius = 50;
  const strokeWidth = 8;
  const circumference = 2 * Math.PI * radius;

  return (
    <div className="absolute top-1/2 left-1/2">
      <svg width={50} height={50} className="transform rotate-90">
        <circle
          cx="60"
          cy="60"
          r={radius}
          stroke="#e6e6e6"
          strokeWidth={strokeWidth}
          fill="none"
        />
        <circle
          cx="60"
          cy="60"
          r={radius}
          stroke="#3498db"
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset="0"
          className="spinning-circle"
        />
      </svg>
      <style jsx>{`
        .spinning-circle {
          animation: spin 2s linear infinite;
        }

        @keyframes spin {
          0% {
            stroke-dashoffset: 0;
          }
          100% {
            stroke-dashoffset: ${circumference};
          }
        }
      `}</style>
    </div>
  );
};

export default TestBoardDashboard;
