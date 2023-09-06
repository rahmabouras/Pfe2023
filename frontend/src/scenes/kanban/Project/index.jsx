import React, { useState, useEffect } from 'react';
import useApi from 'scenes/kanban/shared/hooks/api';
import axios from 'axios';
import { updateArrayItemById } from 'scenes/kanban/shared/utils/javascript';
import { PageLoader, PageError, Modal } from 'scenes/kanban/shared/components';

import Board from './Board';
import { ProjectPage } from './Styles';
import Header from 'components/Header';
import { MenuItem, TextField } from '@mui/material';

const replaceKeysRecursively = (obj) => {
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }
  
  if (Array.isArray(obj)) {
    return obj.map(item => replaceKeysRecursively(item));
  }
  
  const newObj = {};
  for (const key in obj) {
    if (key === '_id') {
      newObj['id'] = obj[key];
    } else {
      newObj[key] = replaceKeysRecursively(obj[key]);
    }
  }
  
  return newObj;
};




const Project = () => {
  const [projectsList, setProjectsList] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedProject, setselectedProject] = useState(1);
  const [{ data, error, setLocalData }, fetchProject] = useApi.get('/projects/');

  useEffect(() => {
    const project = replaceKeysRecursively(data);
    console.log(project);
  }, [data]);

useEffect(() => {

  async function getProjectList() {
    const response = await axios.get('http://localhost:5000/api/projects/list');
    setProjectsList(response.data);
    setselectedProject(response.data[0]._id);
    console.log("Projects requested")
    console.log(response.data);
  }
  async function getUserList() {
    const response = await axios.get('http://localhost:5000/api/users/');
    const userList = response.data.map(user => { return {...user, id: user._id, avatarUrl: `http://localhost:5000/avatars/${user._id}`}})
    setUsers(userList);
    console.log("Users requested")
    console.log(userList);
  }

  getProjectList()
  getUserList()

  getProjectList()
}, []);

useEffect(() => {

    fetchProject();
}, [selectedProject]);

const handleProjectChange = (event) => {
  setselectedProject(event.target.value);
};
  const updateLocalProjectIssues = (issueId, updatedFields) => {
    fetchProject();
    // setLocalData(currentData => ({
    //   project: {
    //     ...currentData.project,
    //     issues: updateArrayItemById(currentData.project.issues, issueId, updatedFields),
    //   },
    // }));
  };
  const project = data && users.length > 0 ? {...replaceKeysRecursively(data.find(project => project._id === selectedProject)) ,users: users} : null;
  console.log("Projectselected requested")
  console.log(selectedProject);
  console.log(project);
  return (
    <ProjectPage>
            <Header title="KANBAN BOARD" subtitle={projectsList  && projectsList.length>0 ? "Kanban Board Of "+projectsList.find(project => project._id === selectedProject).projectName : "Kanban Board "} />
      <TextField
                select
                fullWidth
                variant="filled"
                label="Please select a Project"
                name="Project"
                value={selectedProject}
                onChange={handleProjectChange}
                sx={{ width: '400px' , marginBottom: '10px' }}
              >
                {projectsList.map(project => 
                <MenuItem key={project._id} value={project._id}>{project.projectName}</MenuItem>
                )}
              </TextField>
    { project &&
      <Board
        project={project}
        fetchProject={fetchProject}
        updateLocalProjectIssues={updateLocalProjectIssues}
      />
    }
    </ProjectPage>
  );
};

export default Project;
