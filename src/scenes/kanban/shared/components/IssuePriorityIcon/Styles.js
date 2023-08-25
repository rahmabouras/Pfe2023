import styled from 'styled-components';

import { issuePriorityColors } from 'scenes/kanban/shared/utils/styles';
import { Icon } from 'scenes/kanban/shared/components';

export const PriorityIcon = styled(Icon)`
  color: ${props => issuePriorityColors[props.color]};
`;
