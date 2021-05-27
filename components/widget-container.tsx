import { DetailedHTMLProps, FC, HTMLAttributes, PropsWithChildren } from 'react';
import styled from 'styled-components';

import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

interface WidgetContainerProps extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  title?: string;
  titleIcon?: IconProp;
}

const WidgetContainer: FC<PropsWithChildren<WidgetContainerProps>> = ({
  title,
  titleIcon,
  children,
  ref,
  ...props
}) => {
  return (
    <Container {...props}>
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
  min-width: 480px;

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
