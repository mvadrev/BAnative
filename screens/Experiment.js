import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, Dimensions, ScrollView } from "react-native";
import React, { useEffect, useState } from "react";
import { Client, Message } from "paho-mqtt";
import { LineChart } from "react-native-chart-kit";

export default function Experiment({ route }) {
  const { formData } = route.params;
  const [client, setClient] = useState(null);
  const [dataPoints, setDataPoints] = useState([]);
  const [timestamps, setTimestamps] = useState([]);

  useEffect(() => {
    const brokerUrl = "b29ed685441749cd86432c8680b3fb1a.s2.eu.hivemq.cloud";
    const port = 8884; // WebSocket secure port for HiveMQ Cloud
    const clientId = "clientId-" + Math.random().toString(16).substr(2, 8);
    const mqttClient = new Client(`wss://${brokerUrl}:${port}/mqtt`, clientId);

    mqttClient.connect({
      useSSL: true,
      userName: "vadrev",
      password: "Qwerty@123",
      onSuccess: () => {
        console.log("Connected to MQTT broker");
        setClient(mqttClient);

        mqttClient.subscribe("experiment", {
          onSuccess: () => {
            console.log("Subscribed to topic: experiment");

            const startMessage = new Message("start");
            startMessage.destinationName = "controlTopic";
            mqttClient.send(startMessage);
            console.log("Start message sent to topic: controlTopic");
          },
          onFailure: (error) => {
            console.log("Subscription failed:", error.errorMessage);
          },
        });
      },
      onFailure: (error) => {
        console.log("Connection failed:", error.errorMessage);
      },
    });

    mqttClient.onConnectionLost = (responseObject) => {
      if (responseObject.errorCode !== 0) {
        console.log("onConnectionLost:", responseObject.errorMessage);
      }
    };

    mqttClient.onMessageArrived = (message) => {
      const payloadString = message.payloadString;
      console.log("onMessageArrived: Value:", payloadString);

      // Add detailed logging to check the payload content
      const dataString = payloadString.replace("Value: ", "").trim();
      const data = parseFloat(dataString);
      console.log("Parsed value:", data);

      if (!isNaN(data)) {
        const timestamp = new Date().toLocaleTimeString();

        // Update the state with new data points
        setDataPoints((prevDataPoints) => [...prevDataPoints, data]);
        setTimestamps((prevTimestamps) => [...prevTimestamps, timestamp]);
      } else {
        console.log("Received NaN value, skipping...");
      }
    };

    return () => {
      if (mqttClient && mqttClient.isConnected()) {
        mqttClient.disconnect();
      }
    };
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text>Experiment</Text>
      <Text>Form Data: {JSON.stringify(formData)}</Text>

      {dataPoints.length > 0 && (
        <LineChart
          data={{
            labels: timestamps,
            datasets: [
              {
                data: dataPoints,
              },
            ],
          }}
          width={Dimensions.get("window").width} // from react-native
          height={220}
          yAxisLabel=""
          yAxisSuffix=""
          yAxisInterval={1} // optional, defaults to 1
          chartConfig={{
            backgroundColor: "#e26a00",
            backgroundGradientFrom: "#fb8c00",
            backgroundGradientTo: "#ffa726",
            decimalPlaces: 2, // optional, defaults to 2dp
            color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
            style: {
              borderRadius: 16,
            },
            propsForDots: {
              r: "6",
              strokeWidth: "2",
              stroke: "#ffa726",
            },
          }}
          bezier
          style={{
            marginVertical: 8,
            borderRadius: 16,
          }}
        />
      )}

      <StatusBar style="auto" />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
});
