import { StatusBar } from 'expo-status-bar';
import { disableExpoCliLogging } from 'expo/build/logs/Logs';
import React, { useEffect, useState } from 'react';
import { DataTable, IconButton, Colors } from 'react-native-paper';
import { Alert } from 'react-native';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Button,
} from 'react-native';
import {
  NavigationContainer,
  HeaderBackButton,
} from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';


const HomeScreen = ({ route, navigation }) => {
  const [getPrice, setPrice] = useState('');
  const [getDiscount, setDiscount] = useState('');
  const [getList, setList] = useState([]);
  const [getDisabled, setDisabled] = useState(true);
  const [getSave, setSave] = useState(false);
  const [getP, setP] = useState(true);
  const [getD, setD] = useState(true);

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity
          style={styles.headerButton}
          onPress={() => navigation.navigate('history', { getList })}>
          <Text style={styles.headerButtonText}>History</Text>
        </TouchableOpacity>
      ),
    });
  });

  useEffect(() => {
    if (route.params?.getRow) {
      setList(route.params?.getRow);
    }
  }, [route.params?.getRow]);

  const add = () => {
    var row = {
      price: getPrice,
      discount: getDiscount,
      final: finalPrice(),
    };
    setList([...getList, row]);
    setPrice(' ');
    setDiscount(' ');
    setDisabled(true);
    setSave(true);
    setP(true);
    setD(true);
  };
  const checkPrice = (price) => {
    if (price >= 0) {
      setP(false);
      setSave(false);
      return setPrice(price);
    }
  };
  const checkDiscount = (discount) => {
    if (discount >= 0 && discount <= 100) {
      setD(false);
      setSave(false);
      return setDiscount(discount);
    }
  };
  const finalPrice = () => {
    return parseFloat(getPrice - (getPrice / 100) * getDiscount).toFixed(2);
  };
  const saveFun = () => {
    return getPrice - finalPrice();
  };
  useEffect(() => {
    if (getP == false && getD == false) {
      setDisabled(false);
    } else {
      setDisabled(true);
    }
    if (getSave) {
      setDisabled(true);
    }
  });
  return (
    <View style={styles.container}>
      <Text style={styles.head}>Discount App</Text>
      <TextInput
        style={styles.input}
        value={getPrice}
        onChangeText={(val) => {
          checkPrice(val);
        }}
        placeholder={'Original Price'}
        keyboardType="numeric"
      />
      <View style={{ marginBottom: 50 }}>
        <TextInput
          style={styles.input}
          onChangeText={(val) => {
            checkDiscount(val);
          }}
          value={getDiscount}
          placeholder={'Discount Percentage'}
          keyboardType="numeric"
        />
      </View>

      <Text style={{ fontSize: 20 }}>
        You Save: Rs{' '}
        <Text style={{ fontWeight: 'bold' }}>
          {parseFloat(saveFun()).toFixed(2)}
        </Text>
      </Text>
      <Text style={{ fontSize: 20 }}>
        Final Price: Rs{' '}
        <Text style={{ fontWeight: 'bold' }}>{finalPrice()}</Text>
      </Text>

      <TouchableOpacity
        style={[
          styles.save,
          { backgroundColor: getDisabled ? '#1C2449' : '#6441a4' },
        ]}
        disabled={getDisabled}
        onPress={() => {
          add();
        }}>
        <Text style={styles.saveText}>Save</Text>
      </TouchableOpacity>

      <StatusBar style="auto" />
    </View>
  );
};

const HistoryScreen = ({ route, navigation }) => {
  const { getList } = route.params;
  const [getRow, setRow] = useState(getList);
  console.log(getRow);

  const remove = (itemKey) => {
    var list = getRow.filter((item) => item != itemKey);
    setRow(list);
    console.log(getRow);
  };
  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity
          style={styles.headerButton}
          onPress={() =>
            Alert.alert('Confirmation', 'Clear History?', [
              { text: 'Cancel', onPress: () => console.log('OK Pressed') },
              {
                text: 'Yes',
                onPress: () => {
                  navigation.navigate({
                    name: 'Discount App',
                    params: { getRow: [] },
                    merge: true,
                  });
                },
                style: 'No',
              },
            ])
          }>
          <Text style={styles.headerButtonText}>Clear All</Text>
        </TouchableOpacity>
      ),
    });
  });

  return (
    <View style={{ flex: 1 }}>
      <ScrollView>
        <DataTable>
          <DataTable.Header>
            <DataTable.Title numeric>Actual Price</DataTable.Title>
            <DataTable.Title numeric>Discount %</DataTable.Title>
            <DataTable.Title numeric>Final Price</DataTable.Title>
            <DataTable.Title numeric>Delete</DataTable.Title>
          </DataTable.Header>

          {getRow.map((item, key1) => (
            <DataTable.Row key={key1}>
              <DataTable.Cell numeric>{item.price}</DataTable.Cell>
              <DataTable.Cell numeric>{item.discount}</DataTable.Cell>
              <DataTable.Cell numeric>{item.final}</DataTable.Cell>

              <DataTable.Cell numeric>
                <IconButton
                  icon="close"
                  color={Colors.red500}
                  size={20}
                  onPress={() => remove(item)}
                />
              </DataTable.Cell>
            </DataTable.Row>
          ))}
        </DataTable>
        <View
          style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <TouchableOpacity
            style={styles.save}
            onPress={() => {
              navigation.navigate({
                name: 'Discount App',
                params: { getRow },
                merge: true,
              });
            }}>
            <Text style={styles.saveText}>Save</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Discount App" component={HomeScreen} />
        <Stack.Screen name="history" component={HistoryScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    flex: 1,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    height: 40,
    width: 200,
    margin: 10,
    borderWidth: 5,
    borderTopColor: 'white',
    borderLeftColor: 'white',
    borderRightColor: 'white',
    borderBottomColor: '#6441a4',
    shadowOffset: {
      width: 2,
      height: 2,
    },
    shadowOpacity: 0.5,
    shadowRadius: 2,
  },
  head: {
    color: 'black',
    alignItems: 'center',
    justifyContent: 'center',
    textShadowColor: '#1C2449',
    textShadowOffset: { width: 3, height: 1 },
    textShadowRadius: 1,
    fontSize: 35,
    fontWeight: 'bold',
  },
  save: {
    backgroundColor: '#6441a4',
    borderRadius: 50,
    elevation: 10,
    padding: 12,
    marginTop: 30,
    width: '23%',
    alignSelf: 'center',
    shadowColor: 'black',
    shadowRadius: 3,
    shadowOffset: { width: 4, height: 7 },
    shadowOpacity: 1,
  },
  saveText: {
    color: 'white',
    fontSize: 19,
    alignSelf: 'center',
  },
  headerButton: {
    width: 70,
    marginRight: 5,
    height: '70%',
    backgroundColor: '#6441a4',
    justifyContent: 'center',
    borderRadius: 10,
  },
  headerButtonText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold',
  },
});
