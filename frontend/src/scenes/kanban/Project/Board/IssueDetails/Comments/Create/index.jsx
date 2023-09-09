import React, { Fragment, useState } from 'react';
import PropTypes from 'prop-types';

import api from 'scenes/kanban/shared/utils/api';
import useCurrentUser from 'scenes/kanban/shared/hooks/currentUser';
import toast from 'scenes/kanban/shared/utils/toast';

import BodyForm from '../BodyForm';
import ProTip from './ProTip';
import { Create, UserAvatar, Right, FakeTextarea } from './Styles';
import { useAuthUser } from 'react-auth-kit';

const propTypes = {
  issueId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  fetchIssue: PropTypes.func.isRequired,
};

const ProjectBoardIssueDetailsCommentsCreate = ({ issueId, fetchIssue }) => {
  const [isFormOpen, setFormOpen] = useState(false);
  const [isCreating, setCreating] = useState(false);
  const [body, setBody] = useState('');

  const getUser = useAuthUser();
  const user = getUser();
  const  currentUserId  = user.user._id;
  const  currentUserName  = user.user.firstName + " " + user.user.lastName;

  const handleCommentCreate = async () => {
    try {
      setCreating(true);
      await api.post(`/comments`, { body, issueId, userId: currentUserId });
      await fetchIssue();
      setFormOpen(false);
      setCreating(false);
      setBody('');
    } catch (error) {
      toast.error(error);
    }
  };

  return (
    <Create>
      {currentUserId && <UserAvatar name={currentUserName} avatarUrl={`http://localhost:5000/avatars/${currentUserId}`} />}
      <Right>
        {isFormOpen ? (
          <BodyForm
            value={body}
            onChange={setBody}
            isWorking={isCreating}
            onSubmit={handleCommentCreate}
            onCancel={() => setFormOpen(false)}
          />
        ) : (
          <Fragment>
            <FakeTextarea onClick={() => setFormOpen(true)}>Add a comment...</FakeTextarea>
            <ProTip setFormOpen={setFormOpen} />
          </Fragment>
        )}
      </Right>
    </Create>
  );
};

ProjectBoardIssueDetailsCommentsCreate.propTypes = propTypes;

export default ProjectBoardIssueDetailsCommentsCreate;
