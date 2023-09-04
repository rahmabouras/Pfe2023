import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';

import api from 'scenes/kanban/shared/utils/api';
import toast from 'scenes/kanban/shared/utils/toast';
import { getStoredAuthToken, storeAuthToken } from 'scenes/kanban/shared/utils/authToken';
import { PageLoader } from 'scenes/kanban/shared/components';

const Authenticate = () => {
  const history = useHistory();

  useEffect(() => {
    const createGuestAccount = async () => {
      try {
        const { authToken } = await api.post('/authentication/guest');
        storeAuthToken(authToken);
        history.push('/');
      } catch (error) {
        toast.error(error);
      }
    };

    if (!getStoredAuthToken()) {
      createGuestAccount();
    }
  }, [history]);

  return <PageLoader />;
};

export default Authenticate;
