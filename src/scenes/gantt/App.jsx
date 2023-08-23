import React, { useEffect } from "react";
import { ViewMode, Gantt } from "gantt-task-react";
import { ViewSwitcher } from "./components/view-switcher";
import { getStartEndDateForProject, initTasks } from "./helper";
import axios from 'axios';
import "gantt-task-react/dist/index.css";

// Init
const App = () => {
  const [view, setView] = React.useState(ViewMode.Day);
  const [tasks, setTasks] = React.useState([]);
  const [isChecked, setIsChecked] = React.useState(true);
  let columnWidth = 65;

  useEffect(() => {
    async function fetchData() {
      const tasks = await initTasks();
      setTasks(tasks);
    }

    fetchData();
  }, []);

  if (view === ViewMode.Year) {
    columnWidth = 350;
  } else if (view === ViewMode.Month) {
    columnWidth = 300;
  } else if (view === ViewMode.Week) {
    columnWidth = 250;
  }

  const updateIssue = async (issue) => {
    try {
      const response = await axios.put(`http://localhost:4001/api/issues/${issue.id}`, {
        start: issue.start,
        end: issue.end,
        progress: Math.round(issue.progress)
      });
      return response.data;
    } catch (error) {
      console.error(`There was an error updating the issue: ${error}`);
      throw error;
    }
  };
  

  const handleTaskChange = (task) => {
    console.log("On date change Id:" + task.id);
  
    updateIssue(task).then((updatedIssue) => {
      let newTasks = tasks.map(t => (t.id === task.id ? task : t));
      if (task.project) {
        const [start, end] = getStartEndDateForProject(newTasks, task.project);
        const project = newTasks[newTasks.findIndex(t => t.id === task.project)];
        if (
          project.start.getTime() !== start.getTime() ||
          project.end.getTime() !== end.getTime()
        ) {
          const changedProject = { ...project, start, end };
          newTasks = newTasks.map(t =>
            t.id === task.project ? changedProject : t
          );
        }
      }
      setTasks(newTasks);
    });
  };
  

  const handleTaskDelete = (task) => {
    const conf = window.confirm("Are you sure about " + task.name + " ?");
    if (conf) {
      setTasks(tasks.filter(t => t.id !== task.id));
    }
    return conf;
  };

  const handleProgressChange = async (task) => {
    setTasks(tasks.map(t => (t.id === task.id ? task : t)));
    console.log("On progress change Id:" + task.id);
    updateIssue(task)
  };

  const handleDblClick = (task) => {
    alert("On Double Click event Id:" + task.id);
  };

  const handleClick = (task) => {
    console.log("On Click event Id:" + task.id);
  };

  const handleSelect = (task, isSelected) => {
    console.log(task.name + " has " + (isSelected ? "selected" : "unselected"));
  };

  const handleExpanderClick = (task) => {
    setTasks(tasks.map(t => (t.id === task.id ? task : t)));
    console.log("On expander click Id:" + task.id);
  };

  return (
    <div className="Wrapper">
      <ViewSwitcher
        onViewModeChange={viewMode => setView(viewMode)}
        onViewListChange={setIsChecked}
        isChecked={isChecked}
      />

      <h3>Gantt With Limited Height</h3>
      {tasks.length>0 ? 
      (<Gantt
        tasks={tasks}
        viewMode={view}
        onDateChange={handleTaskChange}
        onDelete={handleTaskDelete}
        onProgressChange={handleProgressChange}
        onDoubleClick={handleDblClick}
        onClick={handleClick}
        onSelect={handleSelect}
        onExpanderClick={handleExpanderClick}
        listCellWidth={isChecked ? "155px" : ""}
        ganttHeight={700}
        columnWidth={columnWidth}
      />): (<div> Loading </div>)}
    </div>
  );
};

export default App;
