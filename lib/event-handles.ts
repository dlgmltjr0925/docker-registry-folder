import React, { ChangeEvent, Dispatch, SetStateAction } from 'react';

export const handleChangeText = (setter: Dispatch<SetStateAction<string>>) => (e: ChangeEvent<HTMLInputElement>) => {
  setter(e.target.value);
};

export const handleChangeSelectValue = <T extends unknown>(setter: Dispatch<SetStateAction<T>>) => (
  e: React.ChangeEvent<{ name?: string; value: unknown }>
) => {
  const value = e.target.value as T;
  setter(value);
};
