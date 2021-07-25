import { FC } from 'react';
import styled from 'styled-components';

interface WidgetItemProps {
  label: string;
  value: string;
}

const WidgetItem: FC<WidgetItemProps> = ({ label, value }) => {
  return (
    <Container>
      <span className="label">{label}</span>
      <span className="value">{value}</span>
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

  span {
    font-size: 15px;
    color: #000;
  }

  .label {
    flex: 1;
  }

  .value {
    flex: 4;
  }
`;

export default WidgetItem;
