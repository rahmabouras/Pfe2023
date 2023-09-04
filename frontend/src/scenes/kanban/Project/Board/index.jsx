import React, { Fragment, useState } from 'react';
import PropTypes from 'prop-types';
import { Modal } from 'scenes/kanban/shared/components';

import useMergeState from 'scenes/kanban/shared/hooks/mergeState';
import { Breadcrumbs } from 'scenes/kanban/shared/components';

import Filters from './Filters';
import Lists from './Lists';
import IssueCreate from '../IssueCreate';
import IssueDetails from './IssueDetails';

const propTypes = {
  project: PropTypes.object.isRequired,
  fetchProject: PropTypes.func.isRequired,
  updateLocalProjectIssues: PropTypes.func.isRequired,
};

const defaultFilters = {
  searchTerm: '',
  userIds: [],
  myOnly: false,
  recent: false,
};

const ProjectBoard = ({ project, fetchProject, updateLocalProjectIssues }) => {
  const [filters, mergeFilters] = useMergeState(defaultFilters);
  const [isIssueDetailsOpen, setIssueDetailsOpen] = useState(false);
  const [selectedIssueId, setSelectedIssueId] = useState(null);
  const [isIssueCreateModalOpen, setIssueCreateModalOpen] = useState(false);

  const openIssueDetails = issueId => {
    setSelectedIssueId(issueId);
    setIssueDetailsOpen(true);
  };

  const closeIssueDetails = () => {
    setSelectedIssueId(null);
    setIssueDetailsOpen(false);
  };

  return (
    <Fragment>
      <Filters
        projectUsers={project.users}
        defaultFilters={defaultFilters}
        filters={filters}
        mergeFilters={mergeFilters}
        issueCreateModalOpen={() => setIssueCreateModalOpen(true)}
      />
      <Lists
        project={project}
        filters={filters}
        updateLocalProjectIssues={updateLocalProjectIssues}
        openIssueDetails={openIssueDetails} // Pass this function to Lists to open modal
      />
      {isIssueDetailsOpen && (
        <Modal
          isOpen
          testid="modal:issue-details"
          width={1040}
          withCloseIcon={false}
          onClose={closeIssueDetails}
          renderContent={modal => (
            <IssueDetails
              issueId={selectedIssueId}
              projectUsers={project.users}
              fetchProject={fetchProject}
              updateLocalProjectIssues={updateLocalProjectIssues}
              modalClose={modal.close}
            />
          )}
        />
      )}


        {isIssueCreateModalOpen && (
        <Modal
          isOpen
          testid="modal:issue-create"
          width={800}
          withCloseIcon={false}
          onClose={() => setIssueCreateModalOpen(false)}
          renderContent={modal => (
            <IssueCreate
              project={project}
              fetchProject={fetchProject}
              onCreate={() => setIssueCreateModalOpen(false)}
              modalClose={modal.close}
            />
          )}
        />
      )}


    </Fragment>
  );
};

ProjectBoard.propTypes = propTypes;

export default ProjectBoard;
