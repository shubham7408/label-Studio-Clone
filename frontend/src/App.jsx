import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Login from "./Pages/login/Login";
import ProjectDashboard from "./Pages/ProjectDashboard/ProjectDashboard";
import OrganizationEmployees from "./Pages/OrganizationEmployees/OrganizationEmployees";
import WithNavbarLayout from "./Components/WithNavbarLayout/WithNavbarLayout";
import Account from "./Pages/User/Account/Account";
import MainLayout from "./Components/MainLayout/MainLayou";
import TestBoardDashboard from "./Pages/TestBoardDashboard/TestBoardDashboard";
import TestBoardViewDashboard from "./Pages/TestBoardDashboard/TestBoardViewDashboard";
// import TestAndPracticeBoardDashboard from './Pages/TestBoardDashboard/TestAndPracticeBoardDashboard';

import "./App.css";
import SubmitedTaskViewDashboard from "./Pages/SubmitedTaskViewDashboard/SubmitedTaskViewDashboard";
import LongSla from "./LongSla/LongSla";

function App() {
  return (
    <Router>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/login" element={<Login />} />
          <Route element={<WithNavbarLayout />}>
            <Route path="/projects" element={<ProjectDashboard />} />
            <Route
              path="/projects/:id"
              element={({ match }) => {
                const { id } = match.params;
                return id === "10" ? (
                  <Navigate to="/LongSla" />
                ) : (
                  <SubmitedTaskViewDashboard />
                );
              }}
            />
            <Route
              path="/projects/:id/"
              element={<SubmitedTaskViewDashboard />}
            />
            <Route
              path="/testBoard/:project_id/:id/"
              element={<TestBoardDashboard />}
            />
            <Route
              path="/testBoard/:project_id/:test_id/:user_id/"
              element={<TestBoardViewDashboard />}
            />
            <Route path="/organization" element={<OrganizationEmployees />} />
            <Route path="/user/account" element={<Account />} />
            <Route path="/employees/:id" element={<Account />} />
            <Route path="/LongSla" element={<LongSla />} />
          </Route>
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
