import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, Keyboard, FlatList } from 'react-native';
import { Input, ListItem, Button, Icon } from 'react-native-elements';
import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabase("products.db");

export default function Sqlite() {
  
  const [product, setProduct] = useState("");
  const [amount, setAmount] = useState("");
  const [shoppingList, setShoppingList] = useState([]);

  const save = () => {
    db.transaction(tx => {
      tx.executeSql('insert into product (product, amount) values (?, ?);',
        [product, amount]);
      }, null, updateList);
    setProduct("");
    setAmount("");
    Keyboard.dismiss();
  }

  // näyttää listan
  const updateList = () => {
    db.transaction(tx => {
      tx.executeSql('select * from product;', [], (_, { rows }) => {
      setShoppingList(rows._array)
      });
    });
  }

  // poistaa tuotteen
  const deleteItem = (id) => {
    db.transaction(
      tx => {
        tx.executeSql(`delete from product where id = ?;`, [id]);
      }, null, updateList
    )
  }
  
  useEffect(() => {
    db.transaction(tx => {
      tx.executeSql('create table if not exists product (id integer primary key not null, product text, amount text);');
    }, null, updateList);
  }, []);


  return (
    <View style={styles.container}>
      <View style={styles.input}>
        <Input
            style={{ paddingLeft: 4,}}
            value={product}
            placeholder="Product"
            leftIcon={{ type: 'material-community', name: 'tea' }}
            onChangeText={input => setProduct(input)}
          />
        <Input
            style={{ paddingLeft: 4}}
            value={amount}
            placeholder="Amount"
            leftIcon={{ type: 'material-community', name: 'calculator' }}
            onChangeText={input => setAmount(input)}
          />
        <View style={{width: "30%"}}>
          <Button
            onPress={save}
            title="Save"
          />
        </View>
      </View>
        <Text style={styles.listHeader}>Shopping list</Text>
        <FlatList
          data={shoppingList}
          ListEmptyComponent={<Text>The list is empty, try adding some products</Text>}
          keyExtractor={item => item.id.toString()} 
          renderItem={({ item }) => (
            <ListItem bottomDivider>
              <ListItem.Content>
                <ListItem.Title>{item.product}</ListItem.Title>
                <ListItem.Subtitle>{item.amount}</ListItem.Subtitle>
              </ListItem.Content>
              <ListItem.Content>
              <Button
            onPress={save}
            title="bought" onPress={() => deleteItem(item.id)} />
              </ListItem.Content>
            </ListItem>)}
        />
      </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "pink",
    justifyContent: 'center',
    margin: 10,
  },
  input: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20
  },
  list: {
    alignItems: 'center',
    justifyContent: 'flex-end'
  },
  listHeader: {
    marginTop: 30,
    marginBottom: 20,
    fontWeight: "bold",
    fontSize: 22
  },
  delete: {
    color: '#0000ff',
    marginTop: 3,
    marginLeft: 10,
    fontSize:18,
  }
});