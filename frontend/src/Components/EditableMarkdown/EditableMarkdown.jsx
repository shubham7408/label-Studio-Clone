import React, { useState } from "react";
import ReactMarkdown from "react-markdown";

const EditableMarkdown = ({ markdown, setMarkdown }) => {
  const [isEditing, setIsEditing] = useState(true);
  const handleInputChange = (e) => {
    setMarkdown(e.target.value);
  };

  return (
    <div className="flex flex-col gap-4 bg-white rounded-lg p-1 shadow-md h-full">
      {/* Editable Text Area */}
      <div className="flex justify-start gap-4">
      <button onClick={() => setIsEditing(true)} className={`${isEditing ? 'text-blue-600' : ''}`}>Markdown</button>
      <button onClick={() => setIsEditing(false)} className={`${!isEditing ? 'text-blue-600' : ''}`}>Visual</button>
      </div>
      <div className="border rounded-lg p-2 bg-gray-50 h-full">
        {/* { isEditing ? <button onClick={() => setIsEditing(false)}>Save</button> : <button onClick={() => setIsEditing(true)}>Edit</button> } */}
        { isEditing ? <textarea
          className="w-full  h-full border-none focus:outline-none bg-gray-50 resize-none"
          value={markdown}
          onChange={handleInputChange}
          placeholder="Write your markdown here..."
        />: <ReactMarkdown>{markdown}</ReactMarkdown> }
       
      </div>

      
    </div>
  );
};

export default EditableMarkdown;
