import { PropsWithChildren } from 'react';
import ReactLoading from 'react-loading';
import styled from 'styled-components';

import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button, ButtonProps, withStyles } from '@material-ui/core';

interface IconButtonProps extends ButtonProps {
  icon?: IconProp;
  loading?: boolean;
}

const IconButton = ({ children, icon, loading, ...props }: PropsWithChildren<IconButtonProps>) => {
  return (
    <StyledButton color="primary" {...props}>
      <Container>
        {icon && <FontAwesomeIcon className="icon" icon={icon} />}
        {children}
        {loading && <ReactLoading className="loading" type="spinningBubbles" width={12} height={12} />}
      </Container>
    </StyledButton>
  );
};

const StyledButton = withStyles({
  root: {
    background: '#6E9FC7',
    borderRadius: 4,
    border: 0,
    color: 'white',
    height: 48,
    padding: '10px 20px',
  },
})(Button);

const Container = styled.div`
  display: inline-block;

  .icon {
    display: inline-block;
    margin-right: 6px;
    font-size: 12px;
  }

  .loading {
    display: inline-block;
    margin-left: 10px;
  }
`;

export default IconButton;
