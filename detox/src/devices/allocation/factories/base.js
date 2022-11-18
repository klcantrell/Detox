// @ts-nocheck
const DeviceAllocator = require('../DeviceAllocator');

class DeviceAllocatorFactory {
  /**
   * @param {*} deps
   * @returns { DeviceAllocator }
   */
  createDeviceAllocator(deps) {
    const allocDriver = this._createDriver(deps);
    return new DeviceAllocator(allocDriver);
  }

  /**
   * @param {*} _deps
   * @returns { AllocationDriverBase }
   * @abstract
   * @protected
   */
  _createDriver(_deps) {}
}

module.exports = DeviceAllocatorFactory;
