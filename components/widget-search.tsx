import { DetailedHTMLProps, FC, InputHTMLAttributes } from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import styled from 'styled-components';

interface WidgetSearchProps extends DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement> {}

const WidgetSearch: FC<WidgetSearchProps> = ({ ...props }) => {
  return (
    <Container>
      <FontAwesomeIcon className="search-icon" icon="search" />
      <input className="search-text" type="text" {...props} />
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: row;
  height: 40px;
  align-items: center;
  padding: 0 15px;
  color: #767676;
  border-bottom: 1px solid #ddd;

  .search-icon {
    margin-right: 10px;
  }

  .search-text {
    flex: 1;
    outline: none;
    border: none;

    &::placeholder {
      font-weight: 500;
    }
  }
`;

export default WidgetSearch;
