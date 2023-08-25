import styled from 'styled-components';

import { issueTypeColors } from 'scenes/kanban/shared/utils/styles';
import { Icon } from 'scenes/kanban/shared/components';

export const TypeIcon = styled(Icon)`
  color: ${props => issueTypeColors[props.color]};
`;
