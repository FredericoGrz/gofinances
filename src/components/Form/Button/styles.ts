import { RFValue } from "react-native-responsive-fontsize";
import styled from "styled-components/native";
import { GestureHandlerRootView, RectButton } from "react-native-gesture-handler";


export const Container = styled(GestureHandlerRootView)`
  width: 100%;
  `;

export const Bt = styled(RectButton)`
  width: 100%;
  background-color: ${({theme} : {theme:any}) => theme.colors.secondary};
  
  padding: 18px;
  border-radius: 5px;
  align-items: center;
  `;

export const Title = styled.Text`
  font-family: ${({theme} : {theme:any}) => theme.fonts.regular};
  font-size: ${RFValue(14)}px;
  color: ${({theme} : {theme:any}) => theme.colors.shape};
  `;