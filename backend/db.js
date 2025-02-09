import connectDB from './connectDB.js';
const { ObjectId } = await import('mongodb');
import bcrypt from 'bcrypt';
import { format } from 'date-fns';


const db = await connectDB();
const employeesCollection = db.collection('employees');
const projectsCollection = db.collection('projects');
const employeeSubmitedRecodsCollection = db.collection('employeeSubmitedRecods');

export const getProjectsInfo = async () => {
  try {
    return await projectsCollection.find({}).toArray();
  } catch (error) {
    console.error("Failed to insert projects", error);
    console.log(response.statusText)
    return [];
  }
};

export const getProjectsNewID = async () => {
  try {
    const projects = await projectsCollection.find({}).toArray();
    const maxId = projects.reduce((max, project) => {
      return project.id > max ? project.id : max;
    }, 0);
    const newId = Math.floor(Math.random() * 12) + (maxId + 1);
    return newId;
  } catch (error) {
    console.error("Failed to retrieve projects", error);
    return null;
  }
};


export const createProject = async (project) => {
  try {
    const { id, projectName, projectDescription, userInitials, fileContent } = project;
    const totalItems = fileContent.length;
    const projects = await projectsCollection.insertOne({
      id: id,
      projectName: projectName,
      projectDescription: projectDescription,
      progress: 0,
      completed: 0,
      total: totalItems,
      status: 'In progress',
      bgColorUp: "bg-blue-400",
      bgColorDown: "bg-blue-600",
      userInitials: userInitials,
      date: format(new Date(), 'yyyy-MM-dd HH:mm:ss'),
      avatar: null
    });
    const idCollection = db.collection(id);
    return await idCollection.insertMany(fileContent);
  } catch (error) {
    console.error("Failed to retrieve projects", error);
    return null;
  }
};


export const getProjectInfo = async (id) => {
  try {
    return await projectsCollection.find({ id }).toArray();;
  } catch (error) {
    console.error("Failed to insert projects", error);
    return [];
  }
};

export const getProjectsData = async (id, start, limit, sortingColumn, sortOrder) => {
  try {
    const projectsCollection = db.collection(id);
    const projects = await projectsCollection.find({}).sort({ [sortingColumn]: sortOrder ? 1 : -1 }).skip(start).limit(limit).toArray();
    return projects;
  } catch (error) {
    console.error("Failed to fetch projects:", error);
    return [];
  }
};


export const getSingleQuestionProjectData = async (id, _id_list) => {
  try {
    const projectCollection = db.collection(String(id));
    let allProjects = [];  // Renamed to avoid naming conflicts
    
    // for (let i = 0; i < _id_list.length; i++) {
    //   const project = await projectCollection.find({ _id: new ObjectId(_id_list[i]) }).toArray();
    //   allProjects.push(project);  // Add each project as a new array element
    // }
      const project = await projectCollection.find({ _id: new ObjectId(_id_list) }).toArray();
    
    // console.log("projects:" + JSON.stringify(allProjects));  // Updated to properly log array contents

    return project;
  } catch (error) {
    console.error("Failed to fetch projects:", error);
    return [];
  }
};


export const addLearnerAnswer = async (data) => {
  try {
    // console.log(data);
    return await employeeSubmitedRecodsCollection.insertOne({ ...data, time: format(new Date(), 'yyyy-MM-dd HH:mm:ss') });
  } catch (error) {
    console.error("Failed to fetch projects:", error);
    return false;
  }
};

export const getProjectDataLength = async (id) => {
  try {
    const projectsCollection = db.collection(id);
    const projectsLength = await projectsCollection.countDocuments();
    return projectsLength;
  } catch (error) {
    console.error("Failed to fetch projects:", error);
    return [];
  }
};
// import { ObjectId } from "mongodb";

export const getEmployeeSubmittedTasksHistory = async (projectId, userId, taskId) => {
  try {
    // console.log(projectId, userId, taskId);
    const aggregationResult = await employeeSubmitedRecodsCollection.aggregate([
      {
        $match: {
          userId: String(userId),
          questionId: String(taskId),
          projectId: String(projectId),
        },
      },
      {
        $sort: {
          time: -1,
        },
      },
    ]).toArray();

    // console.log("Aggregation Result:", aggregationResult);
    return aggregationResult;
  } catch (error) {
    console.error("Failed to fetch employee submitted tasks history:", error);
    return [];
  }
};


// export const getEmployeSubmitedTasks = async (id, start, limit, sortingColumn, sortOrder) => {
//   try {
//     if (!id) {
//       throw new Error("Project ID is required");
//     }

//     const validSortingColumns = ['userId', 'projectId', 'questionId', 'newestTime'];
//     const columnToSortBy = validSortingColumns.includes(sortingColumn) ? sortingColumn : 'newestTime';
//     const order = sortOrder ? 1 : -1;

//     const aggregationResult = await employeeSubmitedRecodsCollection.aggregate([
//       {
//         $match: {
//           projectId: String(id),
//         },
//       },
//       {
//         $group: {
//           _id: {
//             userId: "$userId",
//             projectId: "$projectId",
//             questionId: "$questionId",
//           },
//           count: { $sum: 1 },
//           timeTaken: { $push: "$timeTaken" },
//           aiAcceptanceRate: { $push: "$aiAcceptanceRate" },
//           newestTime: { $max: "$time" },
//         },
//       },
//       {
//         $sort: {
//           [`_id.${columnToSortBy}`]: order,
//         },
//       },
//       {
//         $skip: start,
//       },
//       {
//         $limit: limit,
//       },
//     ]).toArray();
//     // console.log(aggregationResult,"aggregatonffResult")

//     // Ensure you access properties using _id
//     // aggregationResult.forEach(result => {
//     //   console.log(`User ID: ${result._id.userId}, Project ID: ${result._id.projectId}, Question ID: ${result._id.questionId}`);      
//     // });

//     return aggregationResult;
//   } catch (error) {
//     console.error("Failed to fetch employee submitted tasks:", error);
//     return [];
//   }
// };


export const getSubmitedTask = async (user_id, projectId, test_id) => {
  try {
    const aggregationResult = await employeeSubmitedRecodsCollection.aggregate([
      {
        $match: {
          projectId: projectId,
          userId: String(user_id),
          testId: parseInt(test_id)
        }
      }
    ]).toArray();

    // console.log("Aggregation Result:", aggregationResult);
    return aggregationResult;
  } catch (error) {
    console.error("Failed to fetch employee submitted tasks:", error); 
    console.log(error);
  // Corrected the error message for better clarity
    return [];
  }
};



export const getEmployeSubmitedTasks = async (id, start, limit, sortingColumn, sortOrder) => {
  try {
    const order = sortOrder ? 1 : -1;
    const skip = Math.max(0, start);  // Prevent negative values for skip
    const limitValue = Math.max(0, limit);
    const aggregationResult = await employeeSubmitedRecodsCollection.aggregate([
      {
        $match: {
          projectId: String(id),
          testId: { $exists: true, $ne: "" } 
          // Ensure testId is not empty and exists
        }
      },
      {
        $group: {
          _id: {
            userId: "$userId",
            projectId: "$projectId",
            testId: "$testId"
          },
          count: { $sum: 1 },
          timeTaken: { $push: "$timeTaken" },
          aiAcceptanceRate: { $push: "$aiAcceptanceRate" },
          newestTime: { $max: "$time" },
          questionId: { $push: "$questionId" }
        }
      },
      {
        $sort: {
          [`_id.${sortingColumn}`]: order
        }
      },
      {
        $skip: start
      },
      {
        $limit: limitValue
      }
    ]).toArray();

   console.log("Aggregation Result:", aggregationResult);
    return aggregationResult;
  } catch (error) {
    console.error("Failed to fetch employee submitted tasks:", error);
    return [];
  }
};





export const getEmployeesData_OrgPage = async (start, limit, searchQuery) => {
  try {
    const query = {
      $or: [
        { name: { $regex: searchQuery, $options: "i" } },
        { email: { $regex: searchQuery, $options: "i" } }
      ]
    };
    return await employeesCollection.find(query).sort({ email: 1 }).skip(start).limit(limit).toArray();
  } catch (error) {
    console.error("Error fetching employees", error);
    return [];
  }
};


export const startPracticeGetRandomTaskId = async (projectId, _id) => {
  const projectsIDCollection = db.collection(String(projectId));
  // console.log("Random Document:");
  try {
    const randomDocument = await projectsIDCollection.aggregate([{ $sample: { size: 1 } }]).toArray();
    if (randomDocument.length > 0) {
      // console.log("Random Document:",randomDocument.toArray());
      // console.log("Random Document:", randomDocument[0]);
      return randomDocument[0]._id;
    }
  } catch (error) {
    console.error("Error retrieving random task:", error);
    throw error;
  }
};

export const GetTaskById = async (_id, projectId) => {
  const projectsIDCollection = db.collection(String(projectId));
  // console.log("Random Document:");
  try {
    // const randomDocument = await projectsIDCollection.aggregate([{ $sample: { size: 1 } }]).toArray();
    const id = new ObjectId(_id)
    // console.log("Random Document:", id);
    const randomDocument = await projectsIDCollection.find({ _id: id }).toArray();
    if (randomDocument.length > 0) {
      // console.log("Random Document:", randomDocument);
      return randomDocument[0];
    }
  } catch (error) {
    console.error("Error retrieving random task:", error);
    throw error;
  }
};


// export const GetTestById = async (_id, projectId) => {
//   const results = await employeeSubmitedRecodsCollection.aggregate([
//     {
//       $match: {
//         userId: String(_id),
//         projectId: String(projectId)
//       }
//     },
//     {
//       $group: {
//         _id: {
//           projectId: "$projectId",
//           userId: "$userId",
//           testId: "$testId"
//         },
//          testId: { $push: "$testId" },
//         count: { $sum: 1 }
//       }
//     },
//     {
//       $match: {
//         count: { $lt: 10 }
//       }
//     }
//   ]).toArray();

//   if (results.length === 0) {
//     // You might have a separate query or logic to find the max testId.
//     // Assuming you have a variable maxTestId from another query:
//     const maxTestId = await employeeSubmitedRecodsCollection.find()
//       .sort({ testId: -1 })
//       .limit(1)
//       .toArray();
    
//     // If maxTestId is empty, set it to 0, otherwise increment the value.
//     const newTestId = maxTestId.length > 0 ? maxTestId[0].testId + 1 : 1;
  
//     return { testId: newTestId, count: 1 };
//   } else {
//     // Print the results if any counts are less than 10.
//     // return results[0];
//     return { testId: results[0]._id.testId, count: results[0].count + 1 };
//   }
  
//   // console.log(results);
// };



export const GetTestById = async (_id, projectId) => {
  const results = await employeeSubmitedRecodsCollection.aggregate([
    {
      $match: {
        userId: String(_id),
        projectId: String(projectId),
        testId: { $ne: null } // Exclude documents where testId is null
      }
    },
    {
      $match: {
        testId: { $exists: true } // Exclude documents where testId is absent
      }
    },
    {
      $group: {
        _id: {
          projectId: "$projectId",
          userId: "$userId",
          testId: "$testId"
        },
        testId: { $push: "$testId" },
        count: { $sum: 1 }
      }
    },
    {
      $match: {
        count: { $lt: 10 }
      }
    }
  ]).toArray();

  if (results.length === 0) {
    // Assuming you have a variable maxTestId from another query:
    const maxTestId = await employeeSubmitedRecodsCollection.find()
      .sort({ testId: -1 })
      .limit(1)
      .toArray();
    
    // If maxTestId is empty, set it to 0, otherwise increment the value.
    const newTestId = maxTestId.length > 0 ? maxTestId[0].testId + 1 : 1;
  
    return { testId: newTestId, count: 1 };
  } else {
    // Return the results if any counts are less than 10.
    return { testId: results[0]._id.testId, count: results[0].count + 1 };
  }
};



export const getEmployeesDataLength = async (searchQuery) => {
  try {
    const query = {
      $or: [
        { name: { $regex: searchQuery, $options: "i" } },
        { email: { $regex: searchQuery, $options: "i" } }
      ]
    };
    return await employeesCollection.countDocuments(query);
  } catch (error) {
    console.error("Error fetching employees", error);
    return [];
  }
};

export const getEmployeesOverviewData_OrgPage = async (id) => {
  try {
    const objectId = new ObjectId(id);
    const employees = await employeesCollection.findOne({ _id: objectId });
    // console.log(employees);
    return employees;
  } catch (error) {
    console.error("Error fetching employees", error);
    return [];
  }
};

export const getEmployeesData = async (id) => {
  try {
    const objectId = new ObjectId(id);
    const employees = await employeesCollection.findOne({ _id: objectId });
    // console.log(employees);
    return employees;
  } catch (error) {
    console.error("Error fetching employees", error);
    return [];
  }
};


export const checkEmployeeCredential = async (email, password) => {
  const existingEmployee = await employeesCollection.findOne({
    $or: [{ email }],
  });
  if (!existingEmployee) {
    return false;
  }
  const userExists = await bcrypt.compare(password, existingEmployee?.hashedPassword);
  return userExists;
}

export const getEmployeeData = async (query_) => {
  const query = {};
  if (query_._id) {
    query._id = new ObjectId(query_._id);
  }
  if (query_.email) {
    query.email = query_.email;
  }
  const existingEmployee = await employeesCollection.findOne(query);
  return existingEmployee;
}


export const checkEmployeeExists = async (query) => {
  const conditions = [];
  if (query.employeeID) {
    conditions.push({ employeeID: query.employeeID });
  }
  if (query.email) {
    conditions.push({ email: query.email });
  }
  if (query._id) {
    conditions.push({ _id: new ObjectId(query._id) });
  }
  const existingEmployee = await employeesCollection.findOne({
    $or: conditions,
  });
  return existingEmployee;
};

export const createEmployee = async (employeeID, employeeName, email, password, role) => {
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(password, saltRounds);
  const result = await employeesCollection.insertOne({
    employeeID,
    employeeName,
    email,
    hashedPassword,
    createdAt: format(new Date(), 'yyyy-MM-dd HH:mm:ss'),
    lastActivity: format(new Date(), 'yyyy-MM-dd HH:mm:ss'),
    role
  });
  return result;
};


export const updateEmployee = async (employee) => {
  const { _id, email, employeeName, mobileNo, employeeID, role } = employee;
  const result = await employeesCollection.updateOne(
    { _id: new ObjectId(_id) }, // Ensure the _id is an ObjectId
    {
      $set: {
        employeeID: employeeID,
        email: email,
        employeeName: employeeName,
        mobileNo: mobileNo,
        role: role,
        lastActivity: format(new Date(), 'yyyy-MM-dd HH:mm:ss')
      }
    }
  );
  return result;
};



export const updateEmployeeLastActivity = async (_id) => {
  const result = await employeesCollection.updateOne(
    { _id },
    {
      $set: {
        lastActivity: format(new Date(), 'yyyy-MM-dd HH:mm:ss'),
      },
    }
  );

  return result;
};








