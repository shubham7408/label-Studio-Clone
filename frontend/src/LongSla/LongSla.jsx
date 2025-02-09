import React, { useEffect, useState } from "react";
import { ButtonSLA } from "./ButtonSLA";
import { CardSLA } from "./CardSLA";


  const LongSla = ({ _id, projectId, user_id, submitChange, task, history, testId, taskCount }) => {
    const [selectedOption, setSelectedOption] = useState("");
    const [rationale, setRationale] = useState("");
    const historyContents = task?.data?.history_with_context?.map(item => item.content) || [];

    useEffect(() => {
      if (task) {
        // Assuming task contains data and other necessary info, 
        // no need to fetch task data here since it comes as a prop
        console.log("Received task data:", task);
      }
    }, [task]);
  
    const handleOptionSelect = (option) => {
      setSelectedOption(option);
    };
  
    const handleRationaleChange = (e) => {
      setRationale(e.target.value);
    };
  
    const handleSubmit = () => {
      if (!selectedOption || !rationale) {
        console.log("Please select an option and provide a rationale.");
        return;
      }


      console.log("Selected option:", selectedOption);
      console.log("Rationale:", rationale);
      console.log("Task data:", task?.data);
      console.log(historyContents);

      setSelectedOption("");
      setRationale("");
    };
    const renderCode = (content) => {
      // Step 1: Handle code text (text within backticks)
      const formatCode = (text) => {
        // Check if there are any backticks in the text to identify code blocks
        if (text.includes("`")) {
          const parts = text.split("`");
          return parts.map((part, index) => {
            // Only format the actual code part (odd indexes) with backticks
            if (index % 2 === 1) {
              return (
                <code
                  key={index}
                  className="bg-slate-200 text-black py-1 px-2 rounded font-mono text-base inline-block"
                >
                  {part} {/* The actual code */}
                </code>
              );
            }
            return part; // Return non-code part as normal text
          });
        }
        return text; // Return text as is if no code is present
      };
    
      // Apply code formatting
      let formattedContent = formatCode(content);
    
      return <span>{formattedContent}</span>;
    };
    
    
  
  return (
    <>
      <div className="p-4">
        
      {task?.data?.history_with_context?.map((item, index) => (
        <div
          key={index}
          className={item.role === "user" ? "p-4 text-md my-2 bg-gray-200" : "p-4 text-md my-2 bg-green-100"}
        >
          {/* Display the role in bold */}
          <p className="font-bold">
            <strong>{item.role === "user" ? "User" : "Assistant"}</strong>:
          </p>
          {/* Display the content */}
          <p>{item.content}</p>
        </div>
      ))}
    </div>
        <div>
          <div className="text-2xl font-bold border-y-2 p-2 justify-center">
            2️⃣ Evaluate the answers for the given conversation:
          </div>
          {/* <div className="flex justify-between p-2">
             Left 
            <div className="w-1/2 border-r-2 pr-4">
              <span className="font-bold">Left</span>
                
            </div>
             Right 
            <div className="w-1/2 pl-4">
              <span className="font-bold">Right</span>
                
            </div>
          </div> */}
         {task?.data?.answers_pair && task.data.answers_pair.length === 2 && (
        <div className="flex justify-between p-2 mt-4">
          {/* Left Section */}
          <div className="w-1/2 pr-4">
            <span className="font-bold">Left:</span>
            <pre className="whitespace-pre-wrap break-words">{renderCode(task.data.answers_pair[0])}</pre>
          </div>

          {/* Right Section */}
          <div className="w-1/2 pl-4">
            <span className="font-bold">Right:</span>
            <pre className="whitespace-pre-wrap break-words ">{renderCode(task.data.answers_pair[1])}</pre>
          </div>
        </div>
      )}
    </div>
   
        
        <div className="flex flex-col  p-1">
          <CardSLA className="w-full border-y-2 ">
            <div className="mb-4">
              <div className="flex space-x-4 mt-2">
                <ButtonSLA
                  isClicked={selectedOption === "Left is better"}
                  onClick={() => handleOptionSelect("Left is better")}
                >
                  Left is better
                </ButtonSLA>
                <ButtonSLA
                  isClicked={selectedOption === "Right is better"}
                  onClick={() => handleOptionSelect("Right is better")}
                >
                  Right is better
                </ButtonSLA>
                <ButtonSLA
                  isClicked={selectedOption === "Both good"}
                  onClick={() => handleOptionSelect("Both good")}
                >
                  Both good
                </ButtonSLA>
                <ButtonSLA
                  isClicked={selectedOption === "Both bad"}
                  onClick={() => handleOptionSelect("Both bad")}
                >
                  Both bad
                </ButtonSLA>
                <ButtonSLA
                  isClicked={selectedOption === "Broken Task"}
                  onClick={() => handleOptionSelect("Broken Task")}
                >
                  Broken Task
                </ButtonSLA>
                <ButtonSLA
                  isClicked={selectedOption === "Skip Task"}
                  onClick={() => handleOptionSelect("Skip Task")}
                >
                  Skip Task
                </ButtonSLA>
              </div>
            </div>
          </CardSLA>
          <div className="mb-1">
            <p className=" text-2xl mt-4 font-bold">
              3️⃣ Please provide your rationale below:
            </p>
            <textarea
              className="w-full p-2 border rounded-lg mt-2"
              rows="4"
              value={rationale}
              onChange={handleRationaleChange}
              placeholder="Enter your rationale here..."
            ></textarea>
          </div>
        </div>
      
    </>
  );
};

export default LongSla;
