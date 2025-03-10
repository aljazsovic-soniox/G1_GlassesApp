import React, { useEffect, useState } from 'react';
import { View, Text, Button, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import BleManager from './BleManager';


// TODO: Test with macOS and Iphone -> find out if it works or not

// TODO: send text result to glasses
// TODO: display text on glasses

const App = () => {
  const [connectionStatus, setConnectionStatus] = useState('Not connected');
  const [pairedGlasses, setPairedGlasses] = useState([]);
  const [selectedDevice, setSelectedDevice] = useState(null);

  useEffect(() => {
    // Start scanning for devices when the app loads
    BleManager.startScan();

    // Set up event listeners
    const onPairedGlassesFound = BleManager.eventEmitter.addListener(
      'onPairedGlassesFound',
      (deviceInfo) => {
        setPairedGlasses((prevDevices) => {
          const isAlreadyPaired = prevDevices.some(
            (device) => device.channelNumber === deviceInfo.channelNumber
          );
          return isAlreadyPaired ? prevDevices : [...prevDevices, deviceInfo];
        });
      }
    );

    const onGlassesConnected = BleManager.eventEmitter.addListener(
      'onGlassesConnected',
      (connectedInfo) => {
        setConnectionStatus(
          `Connected: \n${connectedInfo.leftDeviceName} \n${connectedInfo.rightDeviceName}`
        );
      }
    );

    const onGlassesDisconnected = BleManager.eventEmitter.addListener(
      'onGlassesDisconnected',
      () => {
        setConnectionStatus('Not connected');
      }
    );

    // Clean up listeners when the component unmounts
    return () => {
      onPairedGlassesFound.remove();
      onGlassesConnected.remove();
      onGlassesDisconnected.remove();
    };
  }, []);

  const handleConnect = () => {
    if (selectedDevice) {
      BleManager.connectToDevice(selectedDevice.channelNumber);
    } else {
      console.warn('No device selected.');
    }
  };

  const handleDisconnect = () => {
    BleManager.disconnectFromGlasses();
  };

  const handleSendData = () => {
    BleManager.sendData('Hello', 'L');
  };

  const renderDeviceItem = ({ item }) => (
    <TouchableOpacity
      style={styles.deviceItem}
      onPress={() => setSelectedDevice(item)}
    >
      <Text style={styles.deviceText}>
        {item.leftDeviceName} - {item.rightDeviceName}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.statusText}>Connection Status: {connectionStatus}</Text>
      <Text style={styles.statusText}>Paired Devices: {pairedGlasses.length}</Text>

      <FlatList
        data={pairedGlasses}
        renderItem={renderDeviceItem}
        keyExtractor={(item) => item.channelNumber}
      />

      <Button title="Connect to Glasses" onPress={handleConnect} />
      <Button title="Disconnect from Glasses" onPress={handleDisconnect} />
      <Button title="Send Data" onPress={handleSendData} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  statusText: {
    fontSize: 16,
    marginBottom: 10,
  },
  deviceItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  deviceText: {
    fontSize: 14,
  },
});

export default App;