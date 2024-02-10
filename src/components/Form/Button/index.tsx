import React from 'react';
import { TouchableOpacityProps } from 'react-native';

import { Container, Bt, Title } from './styles';

interface Props extends TouchableOpacityProps {
  title: string;
}

export function Button({ title, ...rest }: Props) {
  return (
    <Container>
      <Bt {...rest}>
        <Title>{title}</Title>
      </Bt>
    </Container>
  );
}
