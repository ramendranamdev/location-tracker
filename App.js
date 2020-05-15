import * as React from "react";
import {
  AsyncStorage,
  Button,
  Text,
  TextInput,
  View,
  ToastAndroid,
} from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import LoginScreen from "./screens/LoginScreen";
import RegisterScreen from "./screens/RegisterScreen";
import ForgotPasswordScreen from "./screens/Auth/ForgotPasswordScreen";
import Routes from "./Routes";
import { AuthContext } from "./Context/AuthContext";
import HomeScreen from "./screens/HomeScreen";
import { api_base_url } from "./config";
import { registerUser, loginUser } from "./core/Api";

function SplashScreen() {
  return (
    <View>
      <Text>Loading...</Text>
    </View>
  );
}

const Stack = createStackNavigator();

export default function App({ navigation }) {
  const [state, dispatch] = React.useReducer(
    (prevState, action) => {
      switch (action.type) {
        case "RESTORE_TOKEN":
          return {
            ...prevState,
            userToken: action.token,
            isLoading: false,
          };
        case "SIGN_IN":
          return {
            ...prevState,
            isSignout: false,
            userToken: action.token,
          };
        case "SIGN_OUT":
          return {
            ...prevState,
            isSignout: true,
            userToken: null,
          };
      }
    },
    {
      isLoading: true,
      isSignout: false,
      userToken: null,
    }
  );

  React.useEffect(() => {
    // Fetch the token from storage then navigate to our appropriate place
    const bootstrapAsync = async () => {
      let userToken;

      try {
        userToken = await AsyncStorage.getItem(
          "userToken",
          (err, userToken) => {
            if (userToken != "") {
              dispatch({ type: "RESTORE_TOKEN", token: userToken });
            } else {
              dispatch({ type: "RESTORE_TOKEN", token: "" });
            }
          }
        );

        //$$$$$$$
        // if (userToken != "") {
        //   dispatch({ type: "RESTORE_TOKEN", token: userToken });
        // } else {
        //   dispatch({ type: "RESTORE_TOKEN", token: "" });
        // }
      } catch (e) {
        // Restoring token failed
      }

      // After restoring token, we may need to validate it in production apps

      // This will switch to the App screen or Auth screen and this loading
      // screen will be unmounted and thrown away.
      // dispatch({ type: "RESTORE_TOKEN", token: userToken });
    };

    bootstrapAsync();
  }, []);

  const authContext = React.useMemo(
    () => ({
      signIn: async (email, password) => {
        // In a production app, we need to send some data (usually username, password) to server and get a token
        // We will also need to handle errors if sign in failed
        // After getting token, we need to persist the token using `AsyncStorage`
        // In the example, we'll use a dummy token

        const token = "";

        loginUser(email, password)
          .then((data) => {
            console.log(data);

            if (data.CODE == "200") {
              const TOKEN = data.user.token;
              AsyncStorage.setItem("userToken", TOKEN, (err) => {
                if (err) throw err;
                dispatch({ type: "SIGN_IN", token: TOKEN });
              });
              // dispatch({ type: "SIGN_IN", token: TOKEN });
            } else {
              ToastAndroid.show("Try again", ToastAndroid.SHORT);
            }
          })
          .catch((err) => {
            console.log(err);
          });

        // dispatch({ type: "SIGN_IN", token: "dummy-auth-token" });
      },
      signOut: async () => {
        AsyncStorage.removeItem("userToken", function (err) {
          if (err) throw err;
          dispatch({ type: "SIGN_OUT" });
        });
        // dispatch({ type: "SIGN_OUT" });
      },
      signUp: async (data) => {
        // In a production app, we need to send user data to server and get a token
        // We will also need to handle errors if sign up failed
        // After getting token, we need to persist the token using `AsyncStorage`
        // In the example, we'll use a dummy token
        const email = data.email.value;
        const name = data.name.value;
        const password = data.password.value;

        // console.log(name);

        registerUser(name, email, password)
          .then((res) => {
            console.log(res);
            // console.log(`RES.CODE ${res.CODE}`);

            if (res.CODE == "409") {
              ToastAndroid.show("User already exists !", ToastAndroid.SHORT);
              // console.log("Toast Called");
            } else {
              ToastAndroid.show("Successfully Registered", ToastAndroid.SHORT);
            }
          })
          .catch((err) => {
            console.log(err);
            throw err;
          });
        dispatch({ type: "SIGN_OUT" });
        // dispatch({ type: "SIGN_IN", token: "dummy-auth-token" });
      },
    }),
    []
  );

  function AuthenticationRoutes() {
    return (
      <Stack.Navigator headerMode="none">
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{
            title: "Sign in",
            // When logging out, a pop animation feels intuitive
            animationTypeForReplace: state.isSignout ? "pop" : "push",
          }}
        />
        <Stack.Screen name="RegisterScreen" component={RegisterScreen} />
        <Stack.Screen name="ResetPassword" component={ForgotPasswordScreen} />
      </Stack.Navigator>
    );
  }

  return (
    <AuthContext.Provider value={authContext}>
      <NavigationContainer>
        <Stack.Navigator>
          {state.isLoading ? (
            // We haven't finished checking for the token yet
            <Stack.Screen name="Splash" component={SplashScreen} />
          ) : state.userToken == null ? (
            // No token found, user isn't signed in
            <Stack.Screen
              name="SignIn"
              component={AuthenticationRoutes}
              options={{
                title: "Sign in",
                // When logging out, a pop animation feels intuitive
                animationTypeForReplace: state.isSignout ? "pop" : "push",
              }}
            />
          ) : (
            // User is signed in

            <Stack.Screen name="Home" component={Routes} />
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </AuthContext.Provider>
  );
}
