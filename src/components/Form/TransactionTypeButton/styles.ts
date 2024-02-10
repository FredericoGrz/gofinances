import styled, {css} from "styled-components/native";
import {Feather} from "@expo/vector-icons";
import { RFValue } from "react-native-responsive-fontsize";

export const Container = styled.TouchableOpacity`
  width: 48%; 

  flex-direction: row;
  align-items: center;
  justify-content: center;

  border-width: ${({isActive}: {isActive: boolean}) => isActive ? 0: 1.5}px;
  border-style: solid;
  border-color: ${({theme} : {theme: any}) => theme.colors.text};
  border-radius: 5px;

  padding: 16px;

  ${({isActive, type} : {isActive: any, type: any}) => isActive && type === "up" && css`
    background-color: ${({theme}) => theme.colors.success_light};
  `}

  ${({isActive, type} : {isActive: any, type: any}) => isActive && type === "down" && css`
    background-color: ${({theme}) => theme.colors.attention_light};
  `}
`

export const Icon = styled(Feather)`
  font-size: ${RFValue(24)}px;

  margin-right: 12px;

  color: ${({theme, type} : {theme: any, type: any}) => type === "up" ? theme.colors.success : theme.colors.attention};
`

export const Title = styled.Text`
  font-size: ${RFValue(14)}px;
  font-family: ${({theme} : {theme: any}) => theme.fonts.regular};
`