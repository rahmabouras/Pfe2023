import { get } from 'lodash';

import useApi from 'scenes/kanban/shared/hooks/api';

const useCurrentUser = ({ cachePolicy = 'cache-only' } = {}) => {
  // const [{ data }] = useApi.get('/currentUser', {}, { cachePolicy });

  return {
    // currentUser: get(data, 'currentUser'),
    // currentUserId: get(data, 'currentUser.id'),
    currentUser: 
      {
          id: 501806,
          name: "Lord Gaben",
          email: "gaben@jira.guest",
          avatarUrl: "https://i.ibb.co/6RJ5hq6/gaben.jpg",
          createdAt: "2023-07-18T10:20:54.262Z",
          updatedAt: "2023-07-18T10:20:54.271Z",
          projectId: 167023
      },
    currentUserId: 501806,
  };
};

export default useCurrentUser;
