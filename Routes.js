import * as React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import HomeScreen from './screens/HomeScreen';
import LocationAPI from './screens/LocationAPI';
import BackgroundLocationAPI from './screens/BackgroundLocationAPI';






const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

//Function To Customize Tab.Navigator Tab Bar
// function MyTabBar({ state, descriptors, navigation }) {
//   return (
//     <View style={{ flexDirection: 'row' }}>
//       {state.routes.map((route, index) => {
//         const { options } = descriptors[route.key];
//         const label =
//           options.tabBarLabel !== undefined
//             ? options.tabBarLabel
//             : options.title !== undefined
//             ? options.title
//             : route.name;

//         const isFocused = state.index === index;

//         const onPress = () => {
//           const event = navigation.emit({
//             type: 'tabPress',
//             target: route.key,
//             canPreventDefault: true,
//           });

//           if (!isFocused && !event.defaultPrevented) {
//             navigation.navigate(route.name);
//           }
//         };

//         const onLongPress = () => {
//           navigation.emit({
//             type: 'tabLongPress',
//             target: route.key,
//           });
//         };

//         return (
//           <TouchableOpacity
//             accessibilityRole="button"
//             accessibilityStates={isFocused ? ['selected'] : []}
//             accessibilityLabel={options.tabBarAccessibilityLabel}
//             testID={options.tabBarTestID}
//             onPress={onPress}
//             onLongPress={onLongPress}
//             style={{ flex: 1 }}
//           >
//             <Text style={{ color: isFocused ? '#673ab7' : '#222' }}>
//               {label}
//             </Text>
//           </TouchableOpacity>
//         );
//       })}
//     </View>
//   );
// }

function HomeTabs() {
  return (
    <Tab.Navigator
        screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
            let iconName;

            if (route.name === 'Home') {
            iconName = focused
                ? 'ios-information-circle'
                : 'ios-information-circle-outline';
            } else if (route.name === 'Settings') {
            iconName = focused ? 'ios-list-box' : 'ios-list';
            }else if(route.name === 'Track'){
              iconName = focused ? 'ios-list-box' : 'ios-list';
            }else if(route.name === 'Stats'){
              iconName = focused ? 'ios-list-box' : 'ios-list';
            }

            // You can return any component that you like here!
            return <Ionicons name={iconName} size={size} color={color} />;
        },
        })}
        tabBarOptions={{
        activeTintColor: 'tomato',
        inactiveTintColor: 'gray',
        }}
        
    >
  
        <Tab.Screen headerMode="none" name="Home" component={HomeScreen} />
        <Tab.Screen name="Track" component={HomeScreen} />
        <Tab.Screen name="Location" component={LocationAPI} />
        <Tab.Screen name="BG Location" component={BackgroundLocationAPI} />
    </Tab.Navigator>
  );
}




export default function Routes() {
  return (

    <Stack.Navigator headerMode="none" >
      <Stack.Screen name="Home" component={HomeTabs} />
    </Stack.Navigator>

  );
}