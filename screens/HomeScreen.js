import * as React from 'react'
import {useState, useEffect} from 'react'
import {Platform, View, Text, StyleSheet, Button } from 'react-native';
import { AuthContext } from '../Context/AuthContext';


const instructions = Platform.select({
    ios: `Press Cmd+R to reload,\nCmd+D or shake for dev menu`,
    android: `Double tap R on your keyboard to reload,\nShake or press menu button for dev menu`,
  });

function HomeScreen({navigation}) {

  const {signOut} = React.useContext(AuthContext);

  console.log(signOut);

  return (

                <View style={styles.container}>
                  {console.log(signOut)}
                  <Text style={styles.welcome}>Welcome to React Native!</Text>
                  <Text style={styles.instructions}>This is your Home Screen</Text>
                  <Text style={styles.instructions}>To get started, edit App.js</Text>
                  <Text style={styles.instructions}>{instructions}</Text>
                  {/* <BottomNavigationComponent /> */}
                  {/* <Button title="Sign out" onPress={navigation.navigate("Settings")} /> */}

                  <Text>Signed in!</Text>
                  <Button title="Sign out" onPress={signOut} />
                </View> 
    )
}



export default HomeScreen

const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#F5FCFF',
    },
    welcome: {
      fontSize: 20,
      textAlign: 'center',
      margin: 10,
    },
    instructions: {
      textAlign: 'center',
      color: '#333333',
      marginBottom: 5,
      },
  });
  