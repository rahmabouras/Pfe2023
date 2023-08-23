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
  projects.issues.sort((a, b) => new Date(a.start) - new Date(b.start));

  const currentDate = new Date();

  let tasks = [
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
      id: issue._id.toString(), // Using issue ID as task ID
      progress: issue.timeRemaining ? (issue.timeSpent / (issue.timeSpent + issue.timeRemaining)) * 100 : (issue.timeSpent / issue.estimate) * 100,
      type: "task",
      project: projects._id.toString(),
    };

    if (index > 0) {
      task.dependencies = [projects.issues[index - 1]._id.toString()]; // Setting dependencies to previous task ID
    }

    tasks.push(task);
  });

  tasks.sort((a, b) => a.start - b.start);

  // Optionally update displayOrder after sorting
  tasks.forEach((task, index) => {
    task.displayOrder = index + 1;
  });

  tasks.push({
    start: new Date(currentDate.getFullYear(), currentDate.getMonth(), 15),
    end: new Date(currentDate.getFullYear(), currentDate.getMonth(), 15),
    name: "Release",
    id: `Task ${tasks.length}`,
    progress: currentDate.getMonth(),
    type: "milestone",
    dependencies: [tasks[tasks.length - 1].id],
    project: projects._id.toString(),
    displayOrder: tasks.length + 1,
  });

  console.log("tasks =================================================");
  console.log(tasks);

  return tasks;
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
