const handler = await import('./handler.js');
const validate = await import('./validate.js');
//  import('./fileHandler.js');
import fileHandler from './fileHandler.js';
const {checkAndCreateDir} = await import('./fileHandler.js');

import express from 'express';
import cors from 'cors';

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static('uploads'));
checkAndCreateDir();

// routes
app.post('/api/login', handler.login);

app.get('/api/getProjectsInfo', validate.valid_user, handler.getProjectsInfo );

app.post('/api/startPractice-get-random-task-id', validate.valid_user, handler.startPracticeGetRandomTaskId );

app.post('/api/get-by-task-id', validate.valid_user, handler.GetTaskById );

app.post('/api/get-by-test-id', validate.valid_user, handler.GetTestById );

app.post('/api/getEmployeesDataOrgPage', validate.valid_user, handler.getEmployeesDataOrgPage );

app.post('/api/getEmployeesData', validate.valid_user, handler.getEmployeeData );

app.post('/api/getEmployeesDataLengthOrgPage', validate.valid_user, handler.getEmployeesDataLengthOrgPage );

app.post('/api/getEmployeesOverviewDataOrgPage', validate.valid_user, handler.getEmployeesOverviewDataOrgPage );

app.post('/api/getEmployeeData', validate.valid_user, handler.getEmployeeData );

app.post('/api/getProjectsData', validate.valid_user, handler.getProjectsData );

app.post('/api/getEmployeSubmitedTasks', validate.valid_user, handler.getEmployeSubmitedTasksList );

app.get('/api/getEmployeSubmitedTasks', validate.valid_user, handler.getEmployeSubmitedTasksList );

app.post('/api/getEmployeSubmitedTasksHistory', validate.valid_user, handler.getEmployeSubmitedTasksHistory );

app.post('/api/get-submited-task', validate.valid_user, handler.getSubmitedTasksList );

app.get('/api/getProjectInfo/:id', validate.valid_user, handler.getProjectInfo );

app.post('/api/getProjectsDataLength', validate.valid_user, handler.getProjectsDataLength );

// app.post('/api/getEmployeSubmitedTasksLength', validate.valid_user, handler.getEmployeSubmitedTasksLength );

app.post('/api/add-learner-answer', validate.valid_user, handler.addLearnerAnswer );

app.put('/api/updateEmployeeData', validate.valid_user, handler.updateEmployeeData);

app.post('/api/addEmployeeData',  handler.addEmployeeData);

app.post('/api/addProjectData', validate.valid_admin,  fileHandler.single('file'), handler.addProjectData);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
