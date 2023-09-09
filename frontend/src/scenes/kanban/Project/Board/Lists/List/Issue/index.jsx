import React from 'react';
import PropTypes from 'prop-types';
import { Draggable } from 'react-beautiful-dnd';

import { IssueTypeIcon, IssuePriorityIcon } from 'scenes/kanban/shared/components';

import { Issue, Title, Bottom, Assignees, AssigneeAvatar } from './Styles';

const propTypes = {
  projectUsers: PropTypes.array.isRequired,
  issue: PropTypes.object.isRequired,
  index: PropTypes.number.isRequired,
  openIssueDetails: PropTypes.func.isRequired, // Add this line
};

const ProjectBoardListIssue = ({ projectUsers, issue, index, openIssueDetails }) => { // Add openIssueDetails here
  const assignees = issue.userIds.map(userId => projectUsers.find(user => user.id === userId));
  console.log("aasignees =================================================================");
  console.log(assignees);
  const handleIssueClick = () => { // Define the click handler
    openIssueDetails(issue.id);
  };

  return (
    <Draggable draggableId={issue.id.toString()} index={index}>
      {(provided, snapshot) => (
        <div // Replace Link with a div
          onClick={handleIssueClick} // Add the click handler here
          ref={provided.innerRef}
          data-testid="list-issue"
          {...provided.draggableProps}
          {...provided.dragHandleProps}
        >
          <Issue isBeingDragged={snapshot.isDragging && !snapshot.isDropAnimating}>
            <Title>{issue.title}</Title>
            <Bottom>
              <div>
                <IssueTypeIcon type={issue.type} />
                <IssuePriorityIcon priority={issue.priority} top={-1} left={4} />
              </div>
              <Assignees>
                {assignees.length>0 && assignees.map(user => {if (user) return (
                  <AssigneeAvatar
                    key={user.id}
                    size={24}
                    avatarUrl={`http://localhost:5000/avatars/${user.id}`}
                    name={user.firstName}
                  />
                )})}
              </Assignees>
            </Bottom>
          </Issue>
        </div>
      )}
    </Draggable>
  );
};

ProjectBoardListIssue.propTypes = propTypes;

export default ProjectBoardListIssue;
