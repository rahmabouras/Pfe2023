import React, { useState, useEffect, Fragment } from 'react';
import PropTypes from 'prop-types';

import { Avatar, Select, Icon } from 'scenes/kanban/shared/components';

import { SectionTitle } from '../Styles';
import { User, Username } from './Styles';

const propTypes = {
  issue: PropTypes.object.isRequired,
  updateIssue: PropTypes.func.isRequired,
  projectUsers: PropTypes.array.isRequired,
};

const ProjectBoardIssueDetailsAssigneesReporter = ({ issue, updateIssue, projectUsers }) => {
  const [assignees, setAssignees] = useState(issue.userIds || []);
  const [reporter, setReporter] = useState(issue.reporterId || null);

  useEffect(() => {
    // This will sync the local state with the parent component
    updateIssue({ userIds: assignees, reporterId: reporter });
  }, [assignees, reporter]);

  const getUserById = userId => projectUsers.find(user => user.id === userId);

  const userOptions = projectUsers.map(user => ({ value: user.id, label: user.firstName }));

  return (
    <Fragment>
      <SectionTitle>Assignees</SectionTitle>
      <Select
        isMulti
        variant="empty"
        dropdownWidth={343}
        placeholder="Unassigned"
        name="assignees"
        value={assignees}
        options={userOptions}
        onChange={userIds => {
          setAssignees(userIds);
        }}
        renderValue={({ value: userId, removeOptionValue }) =>
          renderUser(getUserById(userId), true, removeOptionValue)
        }
        renderOption={({ value: userId }) => renderUser(getUserById(userId), false)}
      />

      <SectionTitle>Reporter</SectionTitle>
      <Select
        variant="empty"
        dropdownWidth={343}
        withClearValue={false}
        name="reporter"
        value={reporter}
        options={userOptions}
        onChange={userId => setReporter(userId)}
        renderValue={({ value: userId }) => renderUser(getUserById(userId), true)}
        renderOption={({ value: userId }) => renderUser(getUserById(userId))}
      />
    </Fragment>
  );
};

const renderUser = (user, isSelectValue, removeOptionValue) => {
  if (user) {
    return (
      <User
        key={user.id}
        isSelectValue={isSelectValue}
        withBottomMargin={!!removeOptionValue}
        onClick={() => removeOptionValue && removeOptionValue()}
      >
        <Avatar avatarUrl={`http://localhost:5000/avatars/${user.id}`} name={user.firstName} size={24} />
        <Username>{user.firstName}</Username>
        {removeOptionValue && <Icon type="close" top={1} />}
      </User>
    );
  }
};

ProjectBoardIssueDetailsAssigneesReporter.propTypes = propTypes;

export default ProjectBoardIssueDetailsAssigneesReporter;
