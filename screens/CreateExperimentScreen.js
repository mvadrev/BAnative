import React, { useEffect, useState } from "react";
import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Button,
  ScrollView,
} from "react-native";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { AsyncStorage } from "react-native";
import { Client, Message } from "paho-mqtt";

const schema = yup.object().shape({
  nominalVoltage: yup
    .number()
    .required("Nominal voltage is required")
    .positive("Must be a positive number"),
  maxCurrent: yup
    .number()
    .required("Max current is required")
    .positive("Must be a positive number"),
  formFactor: yup.string().required("Form factor is required"),
  cellChemistry: yup.string().required("Cell chemistry is required"),
  cathode: yup.string().required("Cathode is required"),
  anode: yup.string().required("Anode is required"),
});

export default function CreateExperimentScreen() {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const [client, setClient] = useState(null);

  // const mqttClient = new Client({
  //   uri: "b29ed685441749cd86432c8680b3fb1a:8883",
  //   clientId: "clientId-" + Math.random().toString(16).substr(2, 8),
  //   userName: "mukund",
  //   password: "Qwerty@123",
  //   useSSL: true,
  // });

  //Set up an in-memory alternative to global localStorage
  const myStorage = {
    setItem: (key, item) => {
      myStorage[key] = item;
    },
    getItem: (key) => myStorage[key],
    removeItem: (key) => {
      delete myStorage[key];
    },
  };

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
        if (mqttClient.isConnected()) {
          console.log("MQTT client is connected");
        } else {
          console.log("MQTT client is not connected");
        }
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
      console.log("onMessageArrived:", message.payloadString);
    };

    return () => {
      if (mqttClient && mqttClient.isConnected()) {
        mqttClient.disconnect();
      }
    };
  }, []);

  const onSubmit = (data) => {
    if (client) {
      const message = new Message(JSON.stringify(data));
      message.destinationName = "your/topic/here";
      client.send(message);
      console.log("Message sent to topic: your/topic/here", data);
    } else {
      console.log("MQTT client is not connected");
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Create a new experiment</Text>

      <Controller
        control={control}
        name="nominalVoltage"
        render={({ field: { onChange, onBlur, value } }) => (
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Nominal Voltage</Text>
            <TextInput
              style={styles.input}
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              keyboardType="numeric"
              placeholder="Enter nominal voltage"
              placeholderTextColor="#999"
            />
            {errors.nominalVoltage && (
              <Text style={styles.error}>{errors.nominalVoltage.message}</Text>
            )}
          </View>
        )}
      />

      <Controller
        control={control}
        name="maxCurrent"
        render={({ field: { onChange, onBlur, value } }) => (
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Max Current</Text>
            <TextInput
              style={styles.input}
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              keyboardType="numeric"
              placeholder="Enter max current"
              placeholderTextColor="#999"
            />
            {errors.maxCurrent && (
              <Text style={styles.error}>{errors.maxCurrent.message}</Text>
            )}
          </View>
        )}
      />

      <Controller
        control={control}
        name="formFactor"
        render={({ field: { onChange, onBlur, value } }) => (
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Form Factor</Text>
            <TextInput
              style={styles.input}
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              placeholder="Enter form factor"
              placeholderTextColor="#999"
            />
            {errors.formFactor && (
              <Text style={styles.error}>{errors.formFactor.message}</Text>
            )}
          </View>
        )}
      />

      <Controller
        control={control}
        name="cellChemistry"
        render={({ field: { onChange, onBlur, value } }) => (
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Cell Chemistry</Text>
            <TextInput
              style={styles.input}
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              placeholder="Enter cell chemistry"
              placeholderTextColor="#999"
            />
            {errors.cellChemistry && (
              <Text style={styles.error}>{errors.cellChemistry.message}</Text>
            )}
          </View>
        )}
      />

      <Controller
        control={control}
        name="cathode"
        render={({ field: { onChange, onBlur, value } }) => (
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Cathode</Text>
            <TextInput
              style={styles.input}
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              placeholder="Enter cathode"
              placeholderTextColor="#999"
            />
            {errors.cathode && (
              <Text style={styles.error}>{errors.cathode.message}</Text>
            )}
          </View>
        )}
      />

      <Controller
        control={control}
        name="anode"
        render={({ field: { onChange, onBlur, value } }) => (
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Anode</Text>
            <TextInput
              style={styles.input}
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              placeholder="Enter anode"
              placeholderTextColor="#999"
            />
            {errors.anode && (
              <Text style={styles.error}>{errors.anode.message}</Text>
            )}
          </View>
        )}
      />

      <Button title="Submit" onPress={handleSubmit(onSubmit)} />

      <StatusBar style="auto" />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#f5f5f5",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#333",
  },
  inputContainer: {
    marginBottom: 15,
    width: "100%",
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    color: "#333",
  },
  input: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    backgroundColor: "#fff",
    color: "#333",
  },
  error: {
    color: "red",
    marginTop: 5,
  },
});
