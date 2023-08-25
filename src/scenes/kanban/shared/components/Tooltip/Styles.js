import styled from 'styled-components';

import { zIndexValues, mixin } from 'scenes/kanban/shared/utils/styles';

export const StyledTooltip = styled.div`
  z-index: ${zIndexValues.modal + 1};
  position: fixed;
  width: ${props => props.width}px;
  border-radius: 3px;
  background: #fff;
  ${mixin.hardwareAccelerate}
  ${mixin.boxShadowDropdown}
`;
