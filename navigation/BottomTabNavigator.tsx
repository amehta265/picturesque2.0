import { Ionicons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import * as React from 'react';
import { Platform } from 'react-native';
import Colors from '../constants/Colors';
import useColorScheme from '../hooks/useColorScheme';
import HomeScreen from '../screens/HomeScreen';
import AboutScreen from '../screens/CameraScreen';
import DebugScreen from '../screens/StatsScreen';
import { BottomTabParamList, HomeParamList, CameraParamList, StatsParamList } from '../types';

const BottomTab = createBottomTabNavigator<BottomTabParamList>();

export default function BottomTabNavigator() {
  const colorScheme = useColorScheme();

  return (
    <BottomTab.Navigator
      initialRouteName="Home"
      tabBarOptions={{ activeTintColor: Colors[colorScheme].tint }}>
      <BottomTab.Screen
        name="Home"
        component={HomeNavigator}
        options={{
          tabBarIcon: ({ color }) => <TabBarIcon color={color} name={Platform.OS === 'ios' ? 'ios-home' : 'md-home'} />,
        }}
      />
      <BottomTab.Screen
        name="Camera"
        component={TabCameraNavigator}
        options={{
          tabBarIcon: ({ color }) => <TabBarIcon color={color} name={Platform.OS === 'ios' ? 'ios-camera' : 'md-camera'} />,
        }}
      />
      <BottomTab.Screen
        name="Stats"
        component={TabStatsNavigator}
        options={{
          tabBarIcon: ({ color }) => <TabBarIcon color={color} name={Platform.OS === 'ios' ? 'ios-information' : 'md-information'} />,
        }}
      />
    </BottomTab.Navigator>
  );
}

// You can explore the built-in icon families and icons on the web at:
// https://icons.expo.fyi/
function TabBarIcon(props: { name: string; color: string }) {
  return <Ionicons size={30} style={{ marginBottom: -3 }} {...props} />;
}

// Each tab has its own navigation stack, you can read more about this pattern here:
// https://reactnavigation.org/docs/tab-based-navigation#a-stack-navigator-for-each-tab
const HomeStack = createStackNavigator<HomeParamList>();

function HomeNavigator() {
  return (
    <HomeStack.Navigator>
      <HomeStack.Screen
        name="HomeScreen"
        component={HomeScreen}
        options={{ headerTitle: 'Home' }}
      />
    </HomeStack.Navigator>
  );
}

const AboutTabStack = createStackNavigator<CameraParamList>();

function TabCameraNavigator() {
  return (
    <AboutTabStack.Navigator>
      <AboutTabStack.Screen
        name="CameraScreen"
        component={AboutScreen}
        options={{ headerTitle: 'Camera' }}
      />
    </AboutTabStack.Navigator>
  );
}

const DebugTabStack = createStackNavigator<StatsParamList>();

function TabStatsNavigator() {
  return (
    <DebugTabStack.Navigator>
      <DebugTabStack.Screen
        name="StatsScreen"
        component={DebugScreen}
        options={{ headerTitle: 'Stats' }}
      />
    </DebugTabStack.Navigator>
  );
}