import * as React from "react";
import { useState, useEffect, useRef } from "react";
import {
  Platform,
  View,
  Text,
  StyleSheet,
  Button,
  AsyncStorage,
} from "react-native";
import { AuthContext } from "../Context/AuthContext";

const instructions = Platform.select({
  ios: `Press Cmd+R to reload,\nCmd+D or shake for dev menu`,
  android: `Double tap R on your keyboard to reload,\nShake or press menu button for dev menu`,
});

function HomeScreen({ navigation }) {
  const { signOut } = React.useContext(AuthContext);
  let [token, setToken] = useState("");

  useEffect(() => {
    // _retrieveData();
    retrieveItem("userToken")
      .then((data) => {
        //this callback is executed when your Promise is resolved
        // console.log(data);
        usertoken = data;
        setToken(data);
        console.log(usertoken);
      })
      .catch((error) => {
        //this callback is executed when your Promise is rejected
        console.log("Promise is rejected with error: " + error);
      });
  });

  async function retrieveItem(key) {
    try {
      const retrievedItem = await AsyncStorage.getItem(key);
      // const item = JSON.parse(retrievedItem);
      const item = retrievedItem;
      return item;
    } catch (error) {
      console.log(error.message);
    }
    return;
  }

  if (token !== "") {
    return (
      <View>
        <Text>Loading...</Text>
      </View>
    );
  } else
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
        <Text>{token}</Text>
        <Button title="Sign out" onPress={signOut} />
      </View>
    );
}

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5FCFF",
  },
  welcome: {
    fontSize: 20,
    textAlign: "center",
    margin: 10,
  },
  instructions: {
    textAlign: "center",
    color: "#333333",
    marginBottom: 5,
  },
});
