import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import "react-native-gesture-handler";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { NavigationContainer } from "@react-navigation/native";
import SettingsScreen from "./screens/SettingsScreen";
import DashboardScreen from "./screens/DashboardScreen";
import CreateExperiment from "./screens/CreateExperimentScreen";
import { createStackNavigator } from "@react-navigation/stack";
import CreateExperimentScreen from "./screens/CreateExperimentScreen";

const Drawer = createDrawerNavigator();

const Stack = createStackNavigator();

const DashBoardRoutes = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        options={{ headerShown: false }}
        name="dashboard"
        component={DashboardScreen}
      ></Stack.Screen>
      <Stack.Screen
        name="createExperiment"
        component={CreateExperimentScreen}
      ></Stack.Screen>
    </Stack.Navigator>
  );
};

export default function App() {
  return (
    <NavigationContainer>
      <Drawer.Navigator>
        <Drawer.Screen name="Dashboard" component={DashBoardRoutes} />
        <Drawer.Screen name="Settings" component={SettingsScreen} />
      </Drawer.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
