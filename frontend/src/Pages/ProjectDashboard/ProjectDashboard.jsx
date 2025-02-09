import ProjectCard from '../../Components/ProjectCard/ProjectCard'
import { useNavigate } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  getProject, setProject
} from '../../redux/projectReducer';
import { setNavText } from '../../redux/navbarReducer';
import { authorizedGet } from '../apiCaller';
import Alert from '../../Components/Alert/Alert';

function ProjectDashboard() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
 
  dispatch(setNavText('Projects'));
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await authorizedGet('getProjectsInfo');
        response.json().then((data) => {
          setProjects(data);
          dispatch(setProject(data));
          console.log(data)
        });
      } catch (error) {
        console.error('Error fetching projects:', error);
      }
    };

    fetchProjects();
  }, []);

  return (
    <div>
      <div className="p-4">
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: "16px",
            // marginTop: "8vh",
          }}>
          {projects?.map((project, index) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </div>
    </div>


  );
}

export default ProjectDashboard;
