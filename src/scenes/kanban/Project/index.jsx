import React, { useState } from 'react';
import useApi from 'scenes/kanban/shared/hooks/api';
import { updateArrayItemById } from 'scenes/kanban/shared/utils/javascript';
import { PageLoader, PageError, Modal } from 'scenes/kanban/shared/components';

import Board from './Board';
import { ProjectPage } from './Styles';


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

  const [{ data, error, setLocalData }, fetchProject] = useApi.get('/projects/1');

  if (!data) return <PageLoader />;
  if (error) return <PageError />;

const project = replaceKeysRecursively(data);
console.log(project);
// const project = {
//   ...project1,
//   issues: project1.issues.map(issue => ({
//     ...issue,
//     userIds: issue.users
//   }))
//   , users: project1.users.map(user => ({
//     ...user,
//     projectId: "64d9ebbaa3430a1253ac7e2d"
//   }))
// };

//   const project = {
//     "id": 184072,
//     "name": "singularity 1.0",
//     "url": "https://www.atlassian.com/software/jira",
//     "description": "Plan, track, and manage your agile and software development projects in Jira. Customize your workflow, collaborate, and release great software.",
//     "category": "software",
//     "createdAt": "2023-08-04T21:20:44.935Z",
//     "updatedAt": "2023-08-04T21:20:44.935Z",
//     "users": [
//         {
//             "id": 552952,
//             "name": "Pickle Rick",
//             "email": "rick@jira.guest",
//             "avatarUrl": "https://i.ibb.co/7JM1P2r/picke-rick.jpg",
//             "createdAt": "2023-08-04T21:20:44.930Z",
//             "updatedAt": "2023-08-04T21:20:44.935Z",
//             "projectId": 184072
//         },
//         {
//             "id": 552953,
//             "name": "Baby Yoda",
//             "email": "yoda@jira.guest",
//             "avatarUrl": "https://i.ibb.co/6n0hLML/baby-yoda.jpg",
//             "createdAt": "2023-08-04T21:20:44.930Z",
//             "updatedAt": "2023-08-04T21:20:44.935Z",
//             "projectId": 184072
//         },
//         {
//             "id": 552954,
//             "name": "Lord Gaben",
//             "email": "gaben@jira.guest",
//             "avatarUrl": "https://i.ibb.co/6RJ5hq6/gaben.jpg",
//             "createdAt": "2023-08-04T21:20:44.930Z",
//             "updatedAt": "2023-08-04T21:20:44.935Z",
//             "projectId": 184072
//         }
//     ],
//     "issues": [
//         {
//             "id": 1497734,
//             "title": "Click on an issue to see what's behind it.",
//             "type": "task",
//             "status": "backlog",
//             "priority": "2",
//             "listPosition": 2,
//             "createdAt": "2023-08-04T21:20:44.952Z",
//             "updatedAt": "2023-08-04T21:20:44.952Z",
//             "userIds": [
//                 552952
//             ]
//         },
//         {
//             "id": 1497733,
//             "title": "This is an issue of type: Task.",
//             "type": "task",
//             "status": "backlog",
//             "priority": "4",
//             "listPosition": 1,
//             "createdAt": "2023-08-04T21:20:44.952Z",
//             "updatedAt": "2023-08-04T21:20:44.952Z",
//             "userIds": [
//                 552952
//             ]
//         },
//         {
//             "id": 1497735,
//             "title": "Try dragging issues to different columns to transition their status.",
//             "type": "story",
//             "status": "backlog",
//             "priority": "3",
//             "listPosition": 3,
//             "createdAt": "2023-08-04T21:20:44.952Z",
//             "updatedAt": "2023-08-04T21:20:44.952Z",
//             "userIds": []
//         },
//         {
//             "id": 1497736,
//             "title": "You can use rich text with images in issue descriptions.",
//             "type": "story",
//             "status": "backlog",
//             "priority": "1",
//             "listPosition": 4,
//             "createdAt": "2023-08-04T21:20:44.971Z",
//             "updatedAt": "2023-08-04T21:20:44.971Z",
//             "userIds": [
//                 552954
//             ]
//         },
//         {
//             "id": 1497738,
//             "title": "Each issue has a single reporter but can have multiple assignees.",
//             "type": "story",
//             "status": "selected",
//             "priority": "4",
//             "listPosition": 6,
//             "createdAt": "2023-08-04T21:20:44.979Z",
//             "updatedAt": "2023-08-04T21:20:44.979Z",
//             "userIds": [
//                 552953,
//                 552954
//             ]
//         },
//         {
//             "id": 1497739,
//             "title": "Try leaving a comment on this issue.",
//             "type": "task",
//             "status": "done",
//             "priority": "3",
//             "listPosition": 7,
//             "createdAt": "2023-08-04T21:20:44.984Z",
//             "updatedAt": "2023-08-04T21:20:44.984Z",
//             "userIds": [
//                 552953
//             ]
//         },
//         {
//             "id": 1497740,
//             "title": "You can track how many hours were spent working on an issue, and how many hours remain.",
//             "type": "task",
//             "status": "inprogress",
//             "priority": "1",
//             "listPosition": 7,
//             "createdAt": "2023-08-04T21:20:44.987Z",
//             "updatedAt": "2023-08-04T21:20:44.987Z",
//             "userIds": []
//         },
//         {
//             "id": 1497737,
//             "title": "Each issue can be assigned priority from lowest to highest.",
//             "type": "task",
//             "status": "selected",
//             "priority": "5",
//             "listPosition": 5,
//             "createdAt": "2023-08-04T21:20:44.971Z",
//             "updatedAt": "2023-08-04T21:21:01.132Z",
//             "userIds": []
//         }
//     ]
// };
  


  console.log(project);
  const updateLocalProjectIssues = (issueId, updatedFields) => {
    fetchProject();
    // setLocalData(currentData => ({
    //   project: {
    //     ...currentData.project,
    //     issues: updateArrayItemById(currentData.project.issues, issueId, updatedFields),
    //   },
    // }));
  };

  return (
    <ProjectPage>

      <Board
        project={project}
        fetchProject={fetchProject}
        updateLocalProjectIssues={updateLocalProjectIssues}
      />
    </ProjectPage>
  );
};

export default Project;
