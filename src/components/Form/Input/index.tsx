import React from 'react';
import { TextInputProps } from 'react-native';

import { Container } from './styles';

interface Props extends TextInputProps {
  error?: string;
}

export function Input({ error, ...rest }: Props) {
  return (
    <Container
      error={error}
      {...rest}
    />
  );
}
