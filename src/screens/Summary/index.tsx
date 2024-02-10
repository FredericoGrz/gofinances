import React, { useCallback, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ActivityIndicator } from 'react-native';
import { VictoryPie } from 'victory-native';
import { addMonths, subMonths, format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

import { useFocusEffect } from '@react-navigation/native';
import { useTheme } from 'styled-components';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';

import { categories } from '../../utils/categories';
import {
  Container,
  Header,
  Title,
  Content,
  ChartContainer,
  MonthSelect,
  MonthSelectButton,
  Month,
  SelectIcon,
} from './styles';
import { HistoryCard } from '../../components/HistoryCard';
import { LoadContainer } from '../Dashboard/styles';
import { RFValue } from 'react-native-responsive-fontsize';

interface TransactionData {
  type: 'positive' | 'negative';
  name: string;
  amount: string;
  category: string;
  date: string;
}

interface CategoryData {
  name: string;
  totalFormatted: string;
  total: number;
  color: string;
  percent: number;
  percentFormatted: string;
}

export function Summary() {
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [totalByCategories, setTotalByCategories] = useState<CategoryData[]>(
    [],
  );

  function handleChangeDate(action: 'next' | 'prev') {
    let newDate;
    if (action === 'next') {
      newDate = addMonths(selectedDate, 1);
    } else newDate = subMonths(selectedDate, 1);
    setSelectedDate(newDate);
  }

  async function loadData() {
    const dataKey = '@gofinance:transactions';

    const response = await AsyncStorage.getItem(dataKey);
    const responseFormatted = response ? JSON.parse(response) : [];

    const expensives = responseFormatted.filter(
      (expensive: TransactionData) => expensive.type === 'negative',
    );

    const expensivesTotal = expensives.reduce(
      (accumulator: number, expensive: TransactionData) => {
        return accumulator + Number(expensive.amount);
      },
      0,
    );

    const totalByCategory: CategoryData[] = [];

    categories.forEach((category) => {
      let categorySum = 0;

      expensives.forEach((expensive: TransactionData) => {
        if (expensive.category === category.key) {
          categorySum += Number(expensive.amount);
        }
      });

      if (categorySum > 0) {
        const totalFormatted = categorySum.toLocaleString('pt-BR', {
          style: 'currency',
          currency: 'BRL',
        });

        const percent = (categorySum / expensivesTotal) * 100;

        const percentFormatted = `${percent.toFixed(0)}%`;

        totalByCategory.push({
          name: category.name,
          color: category.color,
          total: categorySum,
          totalFormatted,
          percent,
          percentFormatted,
        });
      }
    });

    setTotalByCategories(totalByCategory);
    setIsLoading(false);
  }

  useEffect(() => {
    loadData();
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, []),
  );

  return (
    <Container>
      {isLoading ? (
        <LoadContainer>
          <ActivityIndicator
            color={useTheme().colors.primary}
            size="large"
          />
        </LoadContainer>
      ) : (
        <>
          <Header>
            <Title>Resumo por categoria</Title>
          </Header>

          <Content
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{
              paddingBottom: useBottomTabBarHeight(),
              paddingHorizontal: 24,
            }}>
            <MonthSelect>
              <MonthSelectButton onPress={() => handleChangeDate('prev')}>
                <SelectIcon name="chevron-left" />
              </MonthSelectButton>
              <Month>
                {format(selectedDate, 'MMMM, yyyy', { locale: ptBR })}
              </Month>
              <MonthSelectButton onPress={() => handleChangeDate('next')}>
                <SelectIcon name="chevron-right" />
              </MonthSelectButton>
            </MonthSelect>
            <ChartContainer>
              <VictoryPie
                data={totalByCategories}
                x="percentFormatted"
                y="total"
                colorScale={totalByCategories.map((category) => category.color)}
                labelRadius={110}
                style={{
                  labels: {
                    fontSize: RFValue(18),
                    fontWeight: 'bold',
                    fill: useTheme().colors.shape,
                  },
                }}
              />
            </ChartContainer>

            {totalByCategories.length > 0 &&
              totalByCategories.map((item, index) => (
                <HistoryCard
                  key={String(index)}
                  title={item.name}
                  amount={item.totalFormatted}
                  color={item.color}
                />
              ))}
          </Content>
        </>
      )}
    </Container>
  );
}
