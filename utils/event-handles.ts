import { ChangeEvent, Dispatch, SetStateAction } from 'react';

export const handleChangeText = (setter: Dispatch<SetStateAction<string>>) => (e: ChangeEvent<HTMLInputElement>) => {
  setter(e.target.value);
};
