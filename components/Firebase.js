import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, Button, Alert, FlatList } from 'react-native';
import { Input } from 'react-native-elements';
import { initializeApp } from 'firebase/app'; //expo install firebase
import { getDatabase, push, ref, onValue } from 'firebase/database';
import { Header } from'react-native-elements';


const firebaseConfig = {
    apiKey: "AIzaSyDK09x8b4CyuHWwa_BaxQr5WAujEp3DyBg",
    authDomain: "shoppinglist-41d19.firebaseapp.com",
    projectId: "shoppinglist-41d19",
    storageBucket: "shoppinglist-41d19.appspot.com",
    messagingSenderId: "33312209741",
    appId: "1:33312209741:web:a3e24ba0b3a3e57bee1504",
    measurementId: "G-YN2DP03VZ7"
  };
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

export default function Firebase() {
  
  const [product, setProduct] = useState("");
  const [amount, setAmount] = useState("");
  const [shoppingList, setShoppingList] = useState([]);

  const save = () => {
    push(
      ref(database, 'items/'),
      { 'product': product, 'amount': amount });
    setProduct("");
    setAmount("");
  }
  const deleteItem = (id) => {
    
  }
  
  useEffect(() => {
    const itemsRef = ref(database, 'items/');
    onValue(itemsRef, (snapshot) => {
      const data = snapshot.val();
      setShoppingList(Object.values(data));
    })}, []);

  return (
    <View style={styles.container}>
       <Header  
     // leftComponent={{ icon: 'menu', color: '#fff' }}  
      centerComponent={{ text: 'SHOPPING LIST', style: { color: '#fff' } }}  
     // rightComponent={{ icon: 'home', color: '#fff'}}
     />
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
          onPress={save} title="Save" />
        </View>
      </View>
        <Text style={styles.listHeader}>Shopping list</Text>
        <FlatList
          data={shoppingList}
          ListEmptyComponent={<Text>The list is empty, try adding some products</Text>}
          keyExtractor={(item,index) => index.toString()}
          renderItem={({item}) =>
          <View style={{flexDirection: 'row'}}>
            <Text style={{fontSize:20, fontWeight: "bold"}}> {item.product} </Text>
            <Text style={{fontSize:20}}> {item.amount} </Text>
            {}
          </View>}
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
    width:"80%",
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