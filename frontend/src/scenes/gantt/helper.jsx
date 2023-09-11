import axios from 'axios';

export async function initTasks(id) {
  let project = null;

  try {
    if (id !== 0) {
    const response = await axios.get(`http://localhost:5000/api/projects/${id}`);
    project = response.data;
  }
  } catch (error) {
    console.error(`There was an error retrieving the project: ${error}`);
  }

  console.log(project);

  if (project === null) {
    console.log('Project data is null, returning an empty task array.');
    return [];
  }

  project.issues.sort((a, b) => new Date(a.start) - new Date(b.start));

  const currentDate = new Date();

  let tasks = [
    {
      start: new Date(project.startDate),
      end: new Date(project.dueDate),
      name: project.projectName,
      id: project._id.toString(),
      progress: 25,
      type: "project",
      hideChildren: false,
      displayOrder: 1,
    },
  ];

  project.issues.forEach((issue, index) => {
    let task = {
      start: new Date(issue.start),
      end: new Date(issue.end),
      name: issue.title,
      id: issue._id.toString(), // Using issue ID as task ID
      progress: issue.timeRemaining ? (issue.timeSpent / (issue.timeSpent + issue.timeRemaining)) * 100 : (issue.timeSpent / issue.estimate) * 100,
      type: "task",
      project: project._id.toString(),
    };

    if (index > 0) {
      task.dependencies = [project.issues[index - 1]._id.toString()]; // Setting dependencies to previous task ID
    }

    tasks.push(task);
  });

  tasks.sort((a, b) => a.start - b.start);

  // Optionally update displayOrder after sorting
  tasks.forEach((task, index) => {
    task.displayOrder = index + 1;
  });

  tasks.push({
    start: new Date(project.dueDate),
    end: new Date(project.dueDate),
    name: "Release",
    id: `Task ${tasks.length}`,
    progress: currentDate.getMonth(),
    type: "milestone",
    dependencies: [tasks[tasks.length - 1].id],
    project: project._id.toString(),
    displayOrder: tasks.length + 1,
  });

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
