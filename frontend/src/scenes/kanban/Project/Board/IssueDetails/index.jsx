import React, { Fragment } from 'react';
import PropTypes from 'prop-types';

import api from 'scenes/kanban/shared/utils/api';
import useApi from 'scenes/kanban/shared/hooks/api';
import { PageError, CopyLinkButton, Button, AboutTooltip } from 'scenes/kanban/shared/components';

import Loader from './Loader';
import Type from './Type';
import Delete from './Delete';
import Title from './Title';
import Description from './Description';
import Comments from './Comments';
import Status from './Status';
import AssigneesReporter from './AssigneesReporter';
import Priority from './Priority';
import EstimateTracking from './EstimateTracking';
import Dates from './Dates';
import StartEndDates from './StartEndDates';
import { TopActions, TopActionsRight, Content, Left, Right } from './Styles';

const propTypes = {
  issueId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  projectUsers: PropTypes.array.isRequired,
  fetchProject: PropTypes.func.isRequired,
  updateLocalProjectIssues: PropTypes.func.isRequired,
  modalClose: PropTypes.func.isRequired,
};

const ProjectBoardIssueDetails = ({
  issueId,
  projectUsers,
  fetchProject,
  updateLocalProjectIssues,
  modalClose,
}) => {
  const [{ data, error, setLocalData }, fetchIssue] = useApi.get(`/issues/${issueId}`);

  if (!data) return <Loader />;
  if (error) return <PageError />;

//  const issue = {...data, id: data._id, comments: [], users: [],reporterId: data.reporterId[0], projectId: data.projectId[0]  };
const issue = {
  ...data,
  id: data._id,
  reporterId: data.reporterId ? data.reporterId[0] : null,
  projectId: data.projectId ? data.projectId[0] : null
};

  console.log(issue);

  const updateLocalIssueDetails = fields =>
  setLocalData(currentData => ({
    ...currentData, // Spread the existing data object
    issue: { ...currentData.issue, ...fields }, // Spread the previous issue properties
  }));


  const updateIssue = updatedFields => {
    const updatedIssue = { ...issue, ...updatedFields }; // Create a new updated issue
  
    api.optimisticUpdate(`/issues/${issueId}`, {
      updatedFields: updatedIssue,
      currentFields: issue,
      setLocalData: fields => {
        // Update the local state using the updated issue
        updateLocalIssueDetails(fields);
        updateLocalProjectIssues(issue.id, fields);
      },
    });

    fetchIssue();
  };
  

  return (
    <Fragment>
      <TopActions>
        <Type issue={issue} updateIssue={updateIssue} />
        <TopActionsRight>
          <Delete issue={issue} fetchProject={fetchProject} modalClose={modalClose} />
          <Button icon="close" iconSize={24} variant="empty" onClick={modalClose} />
        </TopActionsRight>
      </TopActions>
      <Content>
        <Left>
          <Title issue={issue} updateIssue={updateIssue} />
          <Description issue={issue} updateIssue={updateIssue} />
          <Comments issue={issue} fetchIssue={fetchIssue} />
        </Left>
        <Right>
          <Status issue={issue} updateIssue={updateIssue} />
          <AssigneesReporter issue={issue} updateIssue={updateIssue} projectUsers={projectUsers} />
          <Priority issue={issue} updateIssue={updateIssue} />
          <StartEndDates issue={issue} updateIssue={updateIssue} />
          <EstimateTracking issue={issue} updateIssue={updateIssue} />
          <Dates issue={issue} />
        </Right>
      </Content>
    </Fragment>
  );
};

ProjectBoardIssueDetails.propTypes = propTypes;

export default ProjectBoardIssueDetails;
