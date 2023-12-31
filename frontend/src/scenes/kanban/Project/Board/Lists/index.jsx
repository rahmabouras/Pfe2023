import React from 'react';
import PropTypes from 'prop-types';
import { DragDropContext } from 'react-beautiful-dnd';
import { useAuthUser } from 'react-auth-kit'
import api from 'scenes/kanban/shared/utils/api';
import { moveItemWithinArray, insertItemIntoArray } from 'scenes/kanban/shared/utils/javascript';
import { IssueStatus } from 'scenes/kanban/shared/constants/issues';

import List from './List';
import { Lists } from './Styles';

const propTypes = {
  project: PropTypes.object.isRequired,
  filters: PropTypes.object.isRequired,
  updateLocalProjectIssues: PropTypes.func.isRequired,
};

const ProjectBoardLists = ({ project, filters, updateLocalProjectIssues, openIssueDetails }) => {
  const getUser = useAuthUser();
  const user = getUser();
  const  currentUserId  = user.user._id;

  const handleIssueDrop = ({ draggableId, destination, source }) => {
    if (!isPositionChanged(source, destination)) return;

    const issueId = draggableId;
    const updatedFields = {     
      status: destination.droppableId,
      listPosition: calculateIssueListPosition(project.issues, destination, source, issueId),
    };
    
    // Optimistically update frontend state
    updateLocalProjectIssues(issueId, updatedFields);

    // Then make the API call
    api.optimisticUpdate(`/issues/${issueId}`, {
      updatedFields,
      currentFields: project.issues.find(({ id }) => id === issueId),
      setLocalData: fields => updateLocalProjectIssues(issueId, fields),
    }).catch(error => {
        // If the API call fails, revert the frontend change
        // You'll need the previous state for this; it might be contained in 'currentFields' or you may need to adjust your logic
        updateLocalProjectIssues(issueId, /* some logic to get the previous state */);
        alert('Failed to update issue position. Please try again.');
    });
};


  return (
    <DragDropContext onDragEnd={handleIssueDrop}>
      <Lists>
        {Object.values(IssueStatus).map(status => (
          <List
            key={status}
            status={status}
            project={project}
            filters={filters}
            currentUserId={currentUserId}
            openIssueDetails={openIssueDetails}
          />
        ))}
      </Lists>
    </DragDropContext>
  );
};

const isPositionChanged = (destination, source) => {
  console.log(`sources: ${source}`);
  console.log(source);
  console.log(`destination: ${destination}`);
  console.log(destination);
  if (!destination) return false;
  const isSameList = destination.droppableId === source.droppableId;
  const isSamePosition = destination.index === source.index;
  return !isSameList || !isSamePosition;
};

const calculateIssueListPosition = (...args) => {
  const { prevIssue, nextIssue } = getAfterDropPrevNextIssue(...args);
  console.log("prevIssue", prevIssue);
  console.log("nextIssue", nextIssue);
  let position;

  if (!prevIssue && !nextIssue) {
    position = 1;
  } else if (!prevIssue) {
    position = nextIssue.listPosition - 1;
  } else if (!nextIssue) {
    position = prevIssue.listPosition + 1;
  } else {
    position = prevIssue.listPosition + (nextIssue.listPosition - prevIssue.listPosition) / 2;
  }
  return position;
};

const getAfterDropPrevNextIssue = (allIssues, destination, source, droppedIssueId) => {
  const beforeDropDestinationIssues = getSortedListIssues(allIssues, destination.droppableId);
  const droppedIssue = allIssues.find(issue => issue.id === droppedIssueId);
  const isSameList = destination.droppableId === source.droppableId;

  const afterDropDestinationIssues = isSameList
    ? moveItemWithinArray(beforeDropDestinationIssues, droppedIssue, destination.index)
    : insertItemIntoArray(beforeDropDestinationIssues, droppedIssue, destination.index);

    console.log(afterDropDestinationIssues);

  return {
    prevIssue: afterDropDestinationIssues[destination.index - 1],
    nextIssue: afterDropDestinationIssues[destination.index + 1],
  };
};

const getSortedListIssues = (issues, status) =>
  issues.filter(issue => issue.status === status).sort((a, b) => a.listPosition - b.listPosition);

  ProjectBoardLists.propTypes = {
    ...propTypes,
    openIssueDetails: PropTypes.func.isRequired,
  };

export default ProjectBoardLists;
