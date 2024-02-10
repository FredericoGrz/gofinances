import React, { useCallback, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { ActivityIndicator } from 'react-native';

import { useTheme } from 'styled-components';

import {
  Container,
  Header,
  UserInfo,
  User,
  Photo,
  UserGreeting,
  UserName,
  UserWrapper,
  Icon,
  HighlightCards,
  Transactions,
  Title,
  TransactionList,
  GestureContainer,
  LogoutButton,
  LoadContainer,
} from './styles';
import { HighlightCard } from '../../components/HighlightCard';
import {
  TransactionCard,
  TransactionCardProps,
} from '../../components/TransactionCard';

export interface DataListProps extends TransactionCardProps {
  id: string;
}

export function Dashboard() {
  const theme = useTheme();
  const [isLoading, setIsLoading] = useState(true);
  const [transactions, setTransactions] = useState([]);
  const [highlightData, setHighlightData] = useState({});

  async function loadTransactions() {
    try {
      const response = await AsyncStorage.getItem('@gofinance:transactions');
      const transactions = response ? JSON.parse(response) : [];

      let entriesTotal = 0;
      let expensesTotal = 0;

      const transactionsFormatted = transactions.map((transaction) => {
        const amount = Number(transaction.amount).toLocaleString('pt-BR', {
          style: 'currency',
          currency: 'BRL',
        });

        const date = Intl.DateTimeFormat('pt-BR', {
          day: '2-digit',
          month: '2-digit',
          year: '2-digit',
        }).format(new Date(transaction.data));

        if (transaction.type === 'positive')
          entriesTotal += Number(transaction.amount);
        else expensesTotal += Number(transaction.amount);

        return {
          id: transaction.id,
          name: transaction.name,
          type: transaction.type,
          category: transaction.category,
          amount,
          date,
        };
      });

      setTransactions(transactionsFormatted);

      const lastTransactionEntries = transactions.filter(
        (transaction) => transaction.type === 'positive',
      );

      setHighlightData({
        entries: {
          amount: entriesTotal.toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL',
          }),
        },
        expensives: {
          amount: expensesTotal.toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL',
          }),
        },
        total: {
          amount: (entriesTotal - expensesTotal).toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL',
          }),
        },
      });

      setIsLoading(false);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    loadTransactions();
    // AsyncStorage.removeItem('@gofinance:transactions');
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadTransactions();
    }, []),
  );

  return (
    <Container>
      {isLoading ? (
        <LoadContainer>
          <ActivityIndicator
            color={theme.colors.primary}
            size="large"
          />
        </LoadContainer>
      ) : (
        <>
          <Header>
            <UserWrapper>
              <UserInfo>
                <Photo
                  source={{ uri: 'https://github.com/fredericogrz.png' }}
                />
                <User>
                  <UserGreeting>Ola,</UserGreeting>
                  <UserName>Frederico</UserName>
                </User>
              </UserInfo>
              <GestureContainer>
                <LogoutButton onPress={() => {}}>
                  <Icon name="power" />
                </LogoutButton>
              </GestureContainer>
            </UserWrapper>
          </Header>
          <HighlightCards>
            {highlightData.entries && (
              <HighlightCard
                type="up"
                title="Entradas"
                amount={highlightData.entries.amount}
                lastTransaction="Ultima entrada dia 13 de abril"
              />
            )}
            {highlightData.expensives && (
              <HighlightCard
                type="down"
                title="Saídas"
                amount={highlightData.expensives.amount}
                lastTransaction="Ultima saída dia 13 de abril"
              />
            )}
            {highlightData.total && (
              <HighlightCard
                type="total"
                title="Total"
                amount={highlightData.total.amount}
                lastTransaction="Ultima transação dia 13 de abril"
              />
            )}
          </HighlightCards>

          <Transactions>
            <Title>Listagem</Title>
            <TransactionList
              data={transactions}
              keyExtractor={(item: DataListProps) => item.id}
              renderItem={({ item }: { item: DataListProps }) => (
                <TransactionCard data={item} />
              )}
            />
          </Transactions>
        </>
      )}
    </Container>
  );
}
