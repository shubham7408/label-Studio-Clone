import React, { useState } from "react";
import "../App.css";

const ButtonPanel = () => {
  const [activeTab, setActiveTab] = useState("comment");
  const [comments, setComments] = useState([]);
  const [history, setHistory] = useState([
    { name: "a", image: "", datetime: "Dec 9, 2024, 10:00 AM" },
    { name: "a", image: "", datetime: "Dec 9, 2024, 10:00 AM" },
    { name: "a", image: "", datetime: "Dec 9, 2024, 10:00 AM" },
    { name: "a", image: "", datetime: "Dec 9, 2024, 10:00 AM" },
    { name: "a", image: "", datetime: "Dec 9, 2024, 10:00 AM" },
    { name: "a", image: "", datetime: "Dec 9, 2024, 10:00 AM" },
    { name: "a", image: "", datetime: "Dec 9, 2024, 10:00 AM" },
  ]);
  const [newComment, setNewComment] = useState("");

  const handleAddComment = () => {
    if (newComment.trim()) {
      setComments([...comments, newComment]);
      setNewComment("");
    }
  };

  return (
    <div>
      {/* Tab Headers */}
      <div className="tab-header">
        <button
          className={`tab-btn ${activeTab === "comment" ? "active" : ""}`}
          onClick={() => setActiveTab("comment")}
        >
          Comment
        </button>
        <button
          className={`tab-btn ${activeTab === "history" ? "active" : ""}`}
          onClick={() => setActiveTab("history")}
        >
          History
        </button>
      </div>

      {/* Tab Content */}
      <div className="tab-content">
        {activeTab === "comment" && (
          <div className="comment-section">
            <div className="relative">
              <textarea
                className="comment-textarea"
                placeholder="Add a comment..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
              ></textarea>
              <button
                className="absolute bottom-7 right-2 px-2 py-1 text-black rounded-full hover:bg-blue-600 transition"
                onClick={handleAddComment}
              >
                ➤
              </button>
            </div>
            <div
              className={`comment-list-container ${
                comments.length > 7 ? "scrollable" : ""
              }`}
            >
              <ul className="comment-list">
                {comments.map((comment, index) => (
                  <li key={index} className="comment-item">
                    {comment}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
        {activeTab === "history" && (
          <div className="history-section flex flex-col gap-3 max-h-60 overflow-y-auto">
            <div className="history-card flex flex-col gap-4">
              {history.map((item, index) => (
                <div
                  key={index}
                  className="user-profile flex items-center gap-4 p-2 border rounded-lg bg-gray-100"
                >
                  <div className="profile-circle w-10 h-9 rounded-full bg-gray-400"></div>
                  <div>
                    <h4 className="username font-bold text-lg">{item.name}</h4>
                    <p className="timestamp text-sm text-gray-500">
                      {item.datetime}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ButtonPanel;
