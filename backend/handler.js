const db = await import("./db.js");
import jwt from "jsonwebtoken";
const SECRET_KEY = "LableStudioReplica";
const { readFileContent } = await import("./fileHandler.js");

export const getProjectsInfo = async (req, res) => {
  const data = await db.getProjectsInfo();
  res.status(200).json(data);
};

export const getEmployeesDataOrgPage = async (req, res) => {
  try {
    const { start, limit, searchQuery } = req.body;
    const employees = await db.getEmployeesData_OrgPage(
      start,
      limit,
      searchQuery
    );
    res.json(employees);
  } catch (error) {
    console.error("Error fetching employees", error);
    res.status(500).send("Internal Server Error");
  }
};

export const startPracticeGetRandomTaskId = async (req, res) => {
  const { projectId } = req.body;
  const data = await db.startPracticeGetRandomTaskId(projectId, req.user._id);
  // console.log(data);
  res.status(200).json(data);
};

export const GetTaskById = async (req, res) => {
  const { _id, projectId } = req.body;
  
  const data = await db.GetTaskById(_id, projectId);
  // console.log(data);
  res.status(200).json(data);
};

export const GetTestById = async (req, res) => {
  const { projectId } = req.body;
  const user = req.user;
  const data = await db.GetTestById(user._id, projectId);
  res.status(200).json(data);
};

export const getEmployeesDataLengthOrgPage = async (req, res) => {
  try {
    const { searchQuery } = req.body;
    const employees = await db.getEmployeesDataLength(searchQuery);
    res.json(employees);
  } catch (error) {
    console.error("Error fetching employees", error);
    res.status(500).send("Internal Server Error");
  }
};

export const getEmployeesOverviewDataOrgPage = async (req, res) => {
  try {
    const { id } = req.body;
    const employees = await db.getEmployeesOverviewData_OrgPage(id);
    res.json(employees);
  } catch (error) {
    console.error("Error fetching employees", error);
    res.status(500).send("Internal Server Error");
  }
};

export const addEmployeeData = async (req, res) => {
  const { employeeID, employeeName, email, password, role } = req.body;
  if (!employeeID || !employeeName || !email || !password) {
    return res.status(400).json({ error: "All fields are required." });
  }
  try {
    const existingEmployee = await db.checkEmployeeExists({
      employeeID,
      email,
    });
    if (existingEmployee) {
      return res
        .status(409)
        .json({ error: "Employee with this ID or email already exists." });
    }
    await db.createEmployee(employeeID, employeeName, email, password, role);
    res.status(200).json({ message: "Employee added successfully!" });
  } catch (error) {
    console.error("Error adding employee:", error);
    res
      .status(500)
      .json({ error: "An error occurred while adding the employee." });
  }
};

export const addProjectData = async (req, res) => {
  try {
    const { projectName, projectDescription } = req.body;
    const file = req.file;

    if (!projectName || !projectDescription || !file) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }
    const id = await db.getProjectsNewID();
    const fileContent = await readFileContent(file);
    const userInitials = projectName.slice(0, 2).toUpperCase();
    // console.log(fileContent);
    await db.createProject({
      id,
      projectName,
      projectDescription,
      userInitials,
      fileContent,
    });
    res
      .status(200)
      .json({ success: true, message: "Project added successfully" });
  } catch (error) {
    console.error("Error in /addProjectData:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const updateEmployeeData = async (req, res) => {
  const { _id, email, employeeName, mobileNo, employeeID, role } = req.body;
  // const { _id, email, employeeName, mobileNo, employeeID,  password, role } = req.body;
  if (!employeeID || !employeeName || !email || !_id) {
    return res.status(400).json({
      error: "Employee ID, Employee Name, Email and _id fields are required.",
    });
  }
  try {
    const existingEmployee = await db.checkEmployeeExists({ _id });
    if (existingEmployee) {
      return res
        .status(409)
        .json({ error: "Employee with this ID already exists." });
    }
    if (req.user.email !== email) {
      const existingEmployee = await db.checkEmployeeExists({ email });
      if (existingEmployee) {
        return res
          .status(409)
          .json({ error: "Employee with this email already exists." });
      }
    }
    await db.updateEmployee({
      _id,
      email,
      employeeName,
      mobileNo,
      employeeID,
      role,
    });
    res.status(200).json({ message: "Employee added successfully!" });
  } catch (error) {
    console.error("Error adding employee:", error);
    res
      .status(500)
      .json({ error: "An error occurred while adding the employee." });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: "All fields are required." });
  }
  try {
    const isEmployeeExists = await db.checkEmployeeCredential(email, password);
    if (isEmployeeExists) {
      const existingEmployee = await db.getEmployeeData({ email: email });
      const token = jwt.sign(
        {
          _id: existingEmployee._id,
          employeeID: existingEmployee.employeeID,
          email: existingEmployee.email,
          role: existingEmployee.role,
        },
        SECRET_KEY,
        { expiresIn: "30h" }
      );
      // console.log('Generated token:', token);
      // console.log('Existing employee:', existingEmployee);
      return res.status(200).json({
        message: "Employee login success!",
        token: token,
        employee: existingEmployee,
      });
    }
    return res.status(401).json({ error: "Invalid email or password." });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ error: "An error occurred during login." });
  }
};

export const getEmployeeData = async (req, res) => {
  try {
    const { email, token, _id } = req.body;
    // console.log(email, token, _id);
    const query = {};
    if (!email && !token && !_id) {
      return res
        .status(400)
        .json({ error: "email or token or _id is required" });
    }
    if (token && token.includes(".") && token.split(".").length === 3) {
      const decoded = jwt.verify(token, SECRET_KEY);
      if (!decoded) {
        return res.status(401).json({ error: "Invalid or expired token" });
      }
      query._id = decoded._id;
    }
    if (_id) {
      query._id = _id;
    }
    if (email) {
      query.email = email;
    }

    const userData = await db.getEmployeeData(query);
    if (!userData) {
      return res.status(404).json({ error: "User not found" });
    }
    res.status(200).json({ user: userData });
  } catch (error) {
    console.error("Error in /getEmployeeDataByToken:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getProjectsDataLength = async (req, res) => {
  try {
    const { id } = req.body;
    const data = await db.getProjectDataLength(id);
    res.status(200).json(data);
  } catch (error) {
    console.error("Error in /getProjectsDataLength:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// export const getEmployeSubmitedTasksLength = async (req, res) => {
//     try {
//         const { id } = req.body;
//         const employeesSubmitedTasksLength = await db.getEmployeSubmitedTasks(id);
//         console.log(employeesSubmitedTasksLength);
//         res.json(employeesSubmitedTasksLength.length);
//     } catch (error) {
//         console.error('Error in /getProjectsDataLength:', error);
//         res.status(500).json({ error: 'Internal Server Error' });
//     }
// }

export const addLearnerAnswer = async (req, res) => {
  try {
    const requestBody = req.body;
    const userId = req.user._id;
    const data = await db.addLearnerAnswer({ ...requestBody, userId });
    res.status(200).json(data);
  } catch (error) {
    console.error("Error in /getProjectsDataLength:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getProjectsData = async (req, res) => {
  try {
    const { id, start, limit, sortingColumn, sortOrder } = req.body;
    const data = await db.getProjectsData(
      id,
      start,
      limit,
      sortingColumn,
      sortOrder
    );
    res.status(200).json(data);
  } catch (error) {
    console.error("Error in /getProjectsData:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getEmployeSubmitedTasksHistory = async (req, res) => {
  try {
    const { projectId, userId, taskId } = req.body;

    const userId_ = userId ? userId : req.user._id;
    const data = await db.getEmployeeSubmittedTasksHistory(
      projectId,
      userId_,
      taskId
    );

    const enrichedData = await Promise.all(
      data.map(async (item) => {
        // console.log("item",item);
        const employee = await db.getEmployeeData({ _id: item.userId });
        const question = await db.getSingleQuestionProjectData(
          projectId,
          item.questionId
        );

        const cleanedEmployee = JSON.parse(JSON.stringify(employee));
        const cleanedQuestion = JSON.parse(JSON.stringify(question));

        return {
          QuestionId: cleanedQuestion[0]?.id,
          Question: cleanedQuestion[0]?.data.seed.question,
          EmployeeName: cleanedEmployee.employeeName,
          EmployeeEmail: cleanedEmployee.email,
          EmployeeID: cleanedEmployee.employeeID,
          NumberOfAttempts: item.count,
          TimeTaken: item.timeTaken,
          AcceptanceRate: item.aiAcceptanceRate,
          UpdateTime: item.time,
          EmpAns: item.answer,
          AiRecommendations: item.aiRecommendations,
          AiExplanation: item.aiExplanation,
        };
      })
    );

    res.status(200).json(enrichedData);
  } catch (error) {
    console.error("Error in /getProjectsData:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};




export const getEmployeSubmitedTasksList = async (req, res) => {
  try {
    const { id, start, limit, sortingColumn, sortOrder } = req.body;
    const data = await db.getEmployeSubmitedTasks(id, start, limit, sortingColumn, sortOrder);
    const enrichedData = await Promise.all(data.map(async (item) => {
      const cleanedEmployee = await db.getEmployeeData({ _id: item._id.userId });
      return {
        EmployeeName: cleanedEmployee.employeeName,
        EmployeeEmail: cleanedEmployee.email,
        Employee_ID: cleanedEmployee._id,
        EmployeeID: cleanedEmployee.employeeID,
        NumberOfAttempts: item.count,
        TimeTaken: item.timeTaken,
        AcceptanceRate: item.aiAcceptanceRate,
        UpdateTime: item.newestTime,
        TestID: item._id.testId
      };
    }));
    res.status(200).json(enrichedData);
  } catch (error) {
    console.error('Error in /getProjectsData:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};


export const getSubmitedTasksList = async (req, res) => {
  try {
    const { user_id, projectId, test_id } = req.body;
    // console.log("user_id, projectId, test_id", user_id, projectId, test_id)
    const data = await db.getSubmitedTask( user_id, projectId, test_id );
    const enrichedData = await Promise.all(data.map(async (item) => {
      const cleanedEmployee = await db.getEmployeeData({ _id: item.userId });
      const question = await db.getSingleQuestionProjectData(projectId, item.questionId);
      // console.log("question",question[0]?.data.seed.question)
      return {
        QuestionId: question[0]?.id,
        Question_Id: question[0]?._id,
        Question: question[0]?.data.seed.question,
        EmployeeName: cleanedEmployee.employeeName,
        EmployeeEmail: cleanedEmployee.email,
        Employee_ID: cleanedEmployee._id,
        EmployeeID: cleanedEmployee.employeeID,
        TimeTaken: item.timeTaken,
        AcceptanceRate: item.aiAcceptanceRate,
        TestID: item.testId,
        ...item
      };
    }));

    res.status(200).json(enrichedData);
  } catch (error) {
    console.error('Error in /getProjectsData:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};


// export const getEmployeSubmitedTasks = async (req, res) => {
//   try {
//     console.log("req.body",req.body);  // Log request body
//     const { id, start, limit, sortingColumn, sortOrder } = req.body;

//     const data = await db.getEmployeSubmitedTasks(
//       id,
//       start,
//       limit,
//       sortingColumn,
//       sortOrder
//     );

//     // Log the fetched tasks data
//     console.log("Task data fetched from DB:", data);
//     data.forEach(item => console.log(`Task ID: ${item._id}, Question ID: ${item._id.questionId}`));

//     const enrichedData = await Promise.all(
//       data.map(async (item) => {
//         console.log("Processing task item:", item);

//         const employee = await db.getEmployeeData({ _id: item._id.userId });
//         console.log("eeeeeeeee:", employee);

//         // Log the projectId and questionId being passed
//         console.log(`Fetching question data for Project ID: ${item._id.projectId}, Question ID: ${item._id.questionId}`);

//         const question = await db.getSingleQuestionProjectData(
//           item._id.projectId,  // Project ID from task
//           item._id.questionId  // Question ID from task
//         );

//         // Log the fetched question data
//         console.log("Fetched question data:", question);

//         if (!question || question.length === 0) {
//           console.error("No question data found for questionId:", item.questionId);
//           return null;  // Skip if no question data
//         }

//         const cleanedEmployee = JSON.parse(JSON.stringify(employee));
//         const cleanedQuestion = JSON.parse(JSON.stringify(question));
// console.log(cleanedQuestion,"cleanedQuestion")
//         return {
//           QuestionId: cleanedQuestion[0].id,
//           Question_Id: cleanedQuestion[0]._id,
//           Answer: item.answer,
//           EmployeeName: cleanedEmployee.employeeName,
//           EmployeeEmail: cleanedEmployee.email,
//           Employee_ID: cleanedEmployee._id,
//           EmployeeID: cleanedEmployee.employeeID,
//           NumberOfAttempts: item.count,
//           TimeTaken: item.timeTaken,
//           AcceptanceRate: item.aiAcceptanceRate,
//           UpdateTime: item.newestTime,
//           SubmissionTime: item.time
//         };
//       })
//     );

//     const validEnrichedData = enrichedData.filter(item => item !== null);
//     res.status(200).json(validEnrichedData);
//   } catch (error) {
//     console.error("Error in /getEmployeSubmitedTasks:", error);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// };



export const getProjectInfo = async (req, res) => {
  try {
    const { id } = req.params;
    const data = await db.getProjectInfo(id);
    res.status(200).json(data);
  } catch (error) {
    console.error("Error in /getProjectsData:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
