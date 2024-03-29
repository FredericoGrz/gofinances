import React from 'react';
import { RectButtonProps } from 'react-native-gesture-handler';
import { SvgProps } from 'react-native-svg';

import { Container, Button, ImageContainer, Text } from './styles';

interface Props extends RectButtonProps {
  title: string;
  svg: React.FC<SvgProps>;
}

export function SignInSocialButton({ title, svg: Svg, ...rest }: Props) {
  return (
    <Container>
      <Button>
        <ImageContainer>
          <Svg />
        </ImageContainer>
        <Text>{title}</Text>
      </Button>
    </Container>
  );
}
