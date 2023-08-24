
import axios from 'axios';

export async function initTasks() {
  let projects = [];

  try {
    const response = await axios.get('http://localhost:4001/api/projects');
    projects = response.data[0];
  } catch (error) {
    console.error(`There was an error retrieving the projects: ${error}`);
  }

  console.log(projects);
  
  const currentDate = new Date();

  let taskss = [
    {
      start: new Date(currentDate.getFullYear(), currentDate.getMonth(), 1),
      end: new Date(currentDate.getFullYear(), currentDate.getMonth(), 15),
      name: projects.name,
      id: projects._id.toString(),
      progress: 25,
      type: "project",
      hideChildren: false,
      displayOrder: 1,
    },
  ];

  projects.issues.forEach((issue, index) => {
    let task = {
      start: new Date(issue.start),
      end: new Date(issue.end),
      name: issue.title,
      progress: (issue.estimate / (issue.estimate + issue.timeSpent)) * 100,
      type: "task",
      project: projects._id.toString(),
    };



    taskss.push(task);
  });

  taskss.sort((a, b) => a.start - b.start);

  // Optionally update displayOrder after sorting
  taskss.forEach((task, index) => {
    task.id = `Task ${index}`;

    task.displayOrder = index + 1;
    if (task.type === "task" && index !== 1) {
      task.dependencies = [`Task ${index-1}`];
    }

  });
taskss.push({
  start: new Date(currentDate.getFullYear(), currentDate.getMonth(), 15),
  end: new Date(currentDate.getFullYear(), currentDate.getMonth(), 15),
  name: "Release",
  id: "Task 6",
  progress: currentDate.getMonth(),
  type: "milestone",
  dependencies: [`Task ${taskss.length - 1}`],
  project: projects._id.toString(),
  displayOrder: taskss.length + 1,
},);

  const tasks = [
    {
      start: new Date(currentDate.getFullYear(), currentDate.getMonth(), 1),
      end: new Date(currentDate.getFullYear(), currentDate.getMonth(), 15),
      name: "Some Project",
      id: "ProjectSample",
      progress: 25,
      type: "project",
      hideChildren: false,
      displayOrder: 1,
    },
    {
      start: new Date(currentDate.getFullYear(), currentDate.getMonth(), 1),
      end: new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        2,
        12,
        28
      ),
      name: "Idea",
      id: "Task 0",
      progress: 45,
      type: "task",
      project: "ProjectSample",
      displayOrder: 2,
    },
    {
      start: new Date(currentDate.getFullYear(), currentDate.getMonth(), 2),
      end: new Date(currentDate.getFullYear(), currentDate.getMonth(), 4, 0, 0),
      name: "Research",
      id: "Task 1",
      progress: 25,
      dependencies: ["Task 0"],
      type: "task",
      project: "ProjectSample",
      displayOrder: 3,
    },
    {
      start: new Date(currentDate.getFullYear(), currentDate.getMonth(), 4),
      end: new Date(currentDate.getFullYear(), currentDate.getMonth(), 8, 0, 0),
      name: "Discussion with team",
      id: "Task 2",
      progress: 10,
      dependencies: ["Task 1"],
      type: "task",
      project: "ProjectSample",
      displayOrder: 4,
    },
    {
      start: new Date(currentDate.getFullYear(), currentDate.getMonth(), 8),
      end: new Date(currentDate.getFullYear(), currentDate.getMonth(), 9, 0, 0),
      name: "Developing",
      id: "Task 3",
      progress: 2,
      dependencies: ["Task 2"],
      type: "task",
      project: "ProjectSample",
      displayOrder: 5,
    },
    {
      start: new Date(currentDate.getFullYear(), currentDate.getMonth(), 8),
      end: new Date(currentDate.getFullYear(), currentDate.getMonth(), 10),
      name: "Review",
      id: "Task 4",
      type: "task",
      progress: 70,
      dependencies: ["Task 2"],
      project: "ProjectSample",
      displayOrder: 6,
    },
    {
      start: new Date(currentDate.getFullYear(), currentDate.getMonth(), 15),
      end: new Date(currentDate.getFullYear(), currentDate.getMonth(), 15),
      name: "Release",
      id: "Task 6",
      progress: currentDate.getMonth(),
      type: "milestone",
      dependencies: ["Task 4"],
      project: "ProjectSample",
      displayOrder: 7,
    },
    {
      start: new Date(currentDate.getFullYear(), currentDate.getMonth(), 18),
      end: new Date(currentDate.getFullYear(), currentDate.getMonth(), 19),
      name: "Party Time",
      id: "Task 9",
      progress: 0,
      isDisabled: true,
      type: "task",
    },
  ];

  console.log("tasks =================================================");
  console.log(tasks);
  console.log("taskss =================================================");
  console.log(taskss);

  return taskss;
}

export function getStartEndDateForProject(tasks, projectId) {
  const projectTasks = tasks.filter(t => t.project === projectId);
  let start = projectTasks[0].start;
  let end = projectTasks[0].end;

  for (let i = 0; i < projectTasks.length; i++) {
    const task = projectTasks[i];
    if (start.getTime() > task.start.getTime()) {
      start = task.start;
    }
    if (end.getTime() < task.end.getTime()) {
      end = task.end;
    }
  }
  return [start, end];
}
