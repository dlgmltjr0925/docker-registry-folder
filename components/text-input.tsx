import styled from 'styled-components';

import { faCheck, faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { OutlinedTextFieldProps, TextField, TextFieldProps } from '@material-ui/core';

interface TextInputProps extends Omit<OutlinedTextFieldProps, 'variant'> {
  valid?: boolean;
}

const TextInput = ({ valid, ...props }: TextInputProps) => {
  return (
    <Container valid={valid}>
      <TextField {...props} variant="outlined" />
      {valid !== undefined && (
        <div className="valid-check">
          {valid ? (
            <FontAwesomeIcon icon={faCheck} color="#82dd55" />
          ) : (
            <FontAwesomeIcon icon={faTimes} color="#b71c1c" />
          )}
        </div>
      )}
    </Container>
  );
};

interface ContainerProps {
  valid?: boolean;
}

const Container = styled.div<ContainerProps>`
  display: inline-flex;
  width: 100%;

  input {
    height: 100%;
  }

  .valid-check {
    display: inline-flex;
    width: 20px;
    height: 55px;
    margin-left: 10px;
    justify-content: center;
    align-items: center;
  }
`;

export default TextInput;
