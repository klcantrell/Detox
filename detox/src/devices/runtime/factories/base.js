const RuntimeDevice = require('../RuntimeDevice');

class RuntimeDeviceFactory {
  createRuntimeDevice(deviceCookie, commonDeps, configs) {
    const deps = this._createDriverDependencies(commonDeps);
    const runtimeDriver = this._createDriver(deviceCookie, deps, configs);
    return new RuntimeDevice({ ...commonDeps, ...configs }, runtimeDriver);
  }

  _createDriverDependencies(_commonDeps) { }
  _createDriver(_deviceCookie, _deps, _configs) {}
}

module.exports = RuntimeDeviceFactory;
