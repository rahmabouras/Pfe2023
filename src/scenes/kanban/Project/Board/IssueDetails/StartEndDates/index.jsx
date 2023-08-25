import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { DatePicker } from 'scenes/kanban/shared/components';

const propTypes = {
  issue: PropTypes.object.isRequired,
  updateIssue: PropTypes.func.isRequired,
};

const ProjectBoardIssueDetailsStartEndDates = ({ issue, updateIssue }) => (

  <Fragment>
    <div style={{ marginTop: '20px' }}>
        <label>Start Date:</label>
        <DatePicker 
          value={issue.start} 
          onChange={date => updateIssue({ start : date })} 
        />
      </div>
      <div>
        <label>End Date:</label>
        <DatePicker 
          value={issue.end} 
          onChange={date => updateIssue({ end : date })} 
        />
      </div> 
  </Fragment>
);

ProjectBoardIssueDetailsStartEndDates.propTypes = propTypes;

export default ProjectBoardIssueDetailsStartEndDates;
