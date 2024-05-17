import { StatusBar, Button, StyleSheet, Text, View } from "react-native";
import React, { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { CreateExperimentScreen } from "./CreateExperimentScreen";
import { createStackNavigator } from "@react-navigation/stack";

export default function DashboardScreen() {
  const [showButton, setShowButton] = useState(true);
  const experiments = ["Experiment 1", "Experiment 2", "Experiment 3"];

  const Stack = createStackNavigator();
  const navigation = useNavigation();

  const toggleShowButton = () => {
    // setShowButton(!showButton);
  };

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      {showButton ? (
        <View style={styles.buttonContainer}>
          <Button
            title="Create New"
            onPress={() => navigation.navigate("createExperiment")}
          />
        </View>
      ) : (
        <View style={styles.listContainer}>
          {experiments.map((experiment, index) => (
            <Text key={index}>{experiment}</Text>
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  buttonContainer: {
    width: "100%",
    alignItems: "center",
  },
  listContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    borderColor: "red",
    borderWidth: 0.5,
    width: "100%",
  },
});
