import React, { useState, useEffect } from 'react';
import { Button, Text, View, StyleSheet, TextInput, NativeEventEmitter } from 'react-native';
import { NativeModules } from 'react-native';

const { BluetoothModule } = NativeModules;
const eventEmitter = new NativeEventEmitter(BluetoothModule);

const App = () => {
  const [deviceName, setDeviceName] = useState('');
  const [dataToSend, setDataToSend] = useState('');
  const [lr, setLr] = useState('L'); // Default to 'L' for left device
  const [microphoneEnabled, setMicrophoneEnabled] = useState(false);
  const [audioData, setAudioData] = useState('');
  const [foundDevices, setFoundDevices] = useState([]); // List of found devices

  // Listen for found devices
  useEffect(() => {
    const foundDevicesListener = eventEmitter.addListener('onFoundDevices', (event) => {
      setFoundDevices(event.devices); // Update the list of found devices
    });

    return () => {
      foundDevicesListener.remove();
    };
  }, []);

  // Listen for audio data received event
  useEffect(() => {
    const audioListener = eventEmitter.addListener('onAudioDataReceived', (event) => {
      if (event.type === 'audio') {
        setAudioData(event.data);
      }
    });

    return () => {
      audioListener.remove();
    };
  }, []);

  const startScan = async () => {
    try {
      const result = await BluetoothModule.startScan();
      console.log(result);
      alert(result); // Show result in an alert
    } catch (error) {
      console.error(error);
      alert(`Error: ${error.message}`); // Show error in an alert
    }
  };

  const connectToDevice = async (deviceName) => {
    try {
      const result = await BluetoothModule.connectToDevice(deviceName);
      console.log(result);
      alert(result); // Show result in an alert
    } catch (error) {
      console.error(error);
      alert(`Error: ${error.message}`); // Show error in an alert
    }
  };

  const sendData = async () => {
    if (!dataToSend) {
      alert('Please enter data to send');
      return;
    }
    try {
      await BluetoothModule.sendData(dataToSend, lr);
      console.log('Data sent successfully');
      alert('Data sent successfully'); // Show success message
    } catch (error) {
      console.error(error);
      alert(`Error: ${error.message}`); // Show error in an alert
    }
  };

  const toggleMicrophone = async () => {
    try {
      await BluetoothModule.enableMicrophone(!microphoneEnabled);
      setMicrophoneEnabled(!microphoneEnabled);
      alert(`Microphone ${!microphoneEnabled ? 'enabled' : 'disabled'}`);
    } catch (error) {
      console.error(error);
      alert(`Error: ${error.message}`);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bluetooth Glasses Control</Text>

      {/* Scan Button */}
      <Button title="Start Scan" onPress={startScan} />

      {/* List of Found Devices */}
      {foundDevices.length > 0 && (
        <View style={styles.devicesContainer}>
          <Text>Found Devices:</Text>
          {foundDevices.map((device, index) => (
            <Button
              key={index}
              title={device.name}
              onPress={() => connectToDevice(device.name)}
            />
          ))}
        </View>
      )}

      {/* Data to Send Input */}
      <TextInput
        style={styles.input}
        placeholder="Enter Data to Send"
        value={dataToSend}
        onChangeText={setDataToSend}
      />

      {/* Left/Right Selector */}
      <View style={styles.lrContainer}>
        <Text>Select Device:</Text>
        <Button title="Left (L)" onPress={() => setLr('L')} />
        <Button title="Right (R)" onPress={() => setLr('R')} />
      </View>

      {/* Send Data Button */}
      <Button title="Send Data" onPress={sendData} />

      {/* Microphone Toggle Button */}
      <Button
        title={microphoneEnabled ? 'Disable Microphone' : 'Enable Microphone'}
        onPress={toggleMicrophone}
      />

      {/* Display Audio Data */}
      <Text style={styles.audioData}>
        Audio Data: {audioData}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    width: '80%',
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  lrContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  audioData: {
    marginTop: 20,
    fontSize: 16,
    color: 'blue',
  },
  devicesContainer: {
    marginTop: 10,
    marginBottom: 10,
  },
});

export default App;