import React, { Fragment, useRef, useState } from 'react';
import PropTypes from 'prop-types';

import { KeyCodes } from 'scenes/kanban/shared/constants/keyCodes';
import { is, generateErrors } from 'scenes/kanban/shared/utils/validation';

import { TitleTextarea, ErrorText } from './Styles';

const propTypes = {
  issue: PropTypes.object.isRequired,
  updateIssue: PropTypes.func.isRequired,
};

const ProjectBoardIssueDetailsTitle = ({ issue, updateIssue }) => {
  const [title, setTitle] = useState(issue.title);
  const [error, setError] = useState(null);

  const handleTitleChange = (newTitle) => {
    setTitle(newTitle);
  };
  

  const handleBlur = () => {
    setError(null);

    if (title === issue.title) return;

    const errors = generateErrors({ title }, { title: [is.required(), is.maxLength(200)] });

    if (errors.title) {
      setError(errors.title);
    } else {
      updateIssue({ title });
    }
  };

  return (
    <Fragment>
      <TitleTextarea
        minRows={1}
        placeholder="Short summary"
        value={title}
        onChange={handleTitleChange}
        onBlur={handleBlur}
        onKeyDown={event => {
          if (event.keyCode === KeyCodes.ENTER) {
            event.target.blur();
          }
        }}
      />
      {error && <ErrorText>{error}</ErrorText>}
    </Fragment>
  );
};


ProjectBoardIssueDetailsTitle.propTypes = propTypes;

export default ProjectBoardIssueDetailsTitle;
