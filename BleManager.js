import { NativeModules, NativeEventEmitter } from 'react-native';

const { BluetoothManager } = NativeModules;
const eventEmitter = new NativeEventEmitter(BluetoothManager);

class BleManager {
  constructor() {
    this.eventEmitter = eventEmitter;

    // Set up event listeners
    this._setupEventListeners();
  }

  // Set up event listeners
  _setupEventListeners = () => {
    this.eventEmitter.addListener('foundPairedGlasses', this._onPairedGlassesFound);
    this.eventEmitter.addListener('glassesConnected', this._onGlassesConnected);
    this.eventEmitter.addListener('glassesDisconnected', this._onGlassesDisconnected);
  };

  // Start scanning for devices
  startScan = async () => {
    try {
      const result = await BluetoothManager.startScan();
      console.log('Scan started:', result);
    } catch (error) {
      console.error('Error starting scan:', error);
      throw error;
    }
  };

  // Stop scanning for devices
  stopScan = async () => {
    try {
      const result = await BluetoothManager.stopScan();
      console.log('Scan stopped:', result);
    } catch (error) {
      console.error('Error stopping scan:', error);
      throw error;
    }
  };

  // Connect to a specific device
  connectToDevice = async (deviceName) => {
    try {
      const result = await BluetoothManager.connectToDevice(deviceName);
      console.log('Connecting to device:', result);
    } catch (error) {
      console.error('Error connecting to device:', error);
      throw error;
    }
  };

  // Disconnect from all devices
  disconnectFromGlasses = async () => {
    try {
      const result = await BluetoothManager.disconnectFromGlasses();
      console.log('Disconnected from glasses:', result);
    } catch (error) {
      console.error('Error disconnecting from glasses:', error);
      throw error;
    }
  };

  // Send data to the glasses
  // TODO: Probably not the best way, it needs to be improved
  sendData = async (data, lr) => {
    try {
      const result = await BluetoothManager.sendData(data, lr);
      console.log('Data sent:', result);
    } catch (error) {
      console.error('Error sending data:', error);
      throw error;
    }
  };

  // Handle found paired glasses
  _onPairedGlassesFound = (deviceInfo) => {
    console.log('Found paired glasses:', deviceInfo);
    // Notify listeners (e.g., React component)
    this.eventEmitter.emit('onPairedGlassesFound', deviceInfo);
  };

  // Handle connected glasses
  _onGlassesConnected = (connectedInfo) => {
    console.log('Glasses connected:', connectedInfo);
    // Notify listeners (e.g., React component)
    this.eventEmitter.emit('onGlassesConnected', connectedInfo);
  };

  // Handle disconnected glasses
  _onGlassesDisconnected = () => {
    console.log('Glasses disconnected');
    // Notify listeners (e.g., React component)
    this.eventEmitter.emit('onGlassesDisconnected');
  };

  // TODO: get audio stream from glasses - fix
  _onAudioDataReceived = (audioData) => {
    console.log('Audio data received:', audioData);
    const processedData = this._processAudioData(audioData);
  
    // Send the processed data back to the glasses
    this.sendData(processedData, 'L');
  };
  
  _processAudioData = (audioData) => {
    // TODO: Process the audio data - STT
    return audioData;
  };
}

export default new BleManager();