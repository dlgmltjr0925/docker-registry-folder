import { FC, PropsWithChildren } from 'react';
import styled from 'styled-components';

import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

interface WidgetContainerProps {
  title?: string;
  titleIcon?: IconProp;
}

const WidgetContainer: FC<PropsWithChildren<WidgetContainerProps>> = ({ title, titleIcon, children }) => {
  return (
    <Container>
      {/* title */}
      {title && (
        <div className="title-container">
          {titleIcon && <FontAwesomeIcon className="title-icon" icon={titleIcon} />}
          <span className="title">{title}</span>
        </div>
      )}
      {children}
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  margin: 15px 15px 0;
  background-color: white;
  border: 1px solid #ddd;
  border-radius: 3px;

  .title-container {
    flex: 1;
    background: #f6f6f6;
    padding: 10px 15px;
    color: #767676;
    border-bottom: 1px solid #ddd;

    .title-icon {
      margin-right: 10px;
    }

    .title {
      font-weight: bold;
    }
  }
`;

export default WidgetContainer;
