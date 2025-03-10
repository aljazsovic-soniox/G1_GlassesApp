//
//  BluetoothModule.swift
//  Runner
//
//  Created by Aljaz on 2025/03/10.
//

import Foundation
import CoreBluetooth
import React

@objc(BluetoothModule)
class BluetoothModule: NSObject {
    private let bluetoothManager = BluetoothManager(channel: FlutterMethodChannel())

    @objc func startScan(_ resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
        bluetoothManager.startScan { result in
            resolve(result)
        }
    }

    @objc func stopScan(_ resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
        bluetoothManager.stopScan { result in
            resolve(result)
        }
    }

    @objc func connectToDevice(_ deviceName: String, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
        bluetoothManager.connectToDevice(deviceName: deviceName) { result in
            resolve(result)
        }
    }

    @objc func disconnectFromGlasses(_ resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
        bluetoothManager.disconnectFromGlasses { result in
            resolve(result)
        }
    }

    @objc func sendData(_ data: String, lr: String, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
        let params: [String: Any] = ["data": data, "lr": lr]
        bluetoothManager.sendData(params: params)
        resolve(nil)
    }

    @objc func enableMicrophone(_ enable: Bool, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
        bluetoothManager.enableMicrophone(enable) { result in
            resolve(result)
        }
    }
}
