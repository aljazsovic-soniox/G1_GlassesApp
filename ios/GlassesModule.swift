import Foundation
import CoreBluetooth

@objc(GlassesModule)
class GlassesModule: NSObject {
    private var bluetoothManager: BluetoothManager?

    override init() {
        super.init()
        bluetoothManager = BluetoothManager()
    }

    @objc func connectToGlasses(_ resolve: @escaping RCTPromiseResolveBlock,
                                 reject: @escaping RCTPromiseRejectBlock) {
        bluetoothManager?.startScanning { isConnected in
            if isConnected {
                resolve("Connected to glasses!")
            } else {
                reject("ERROR", "Failed to connect to glasses", nil)
            }
        }
    }

    @objc static func requiresMainQueueSetup() -> Bool {
        return true
    }
}
