/**
 * @typedef {object} DeviceCookie
 */

/**
 * @typedef DeallocOptions
 * @property shutdown { Boolean }
 */

class AllocationDriverBase {
  /**
   * @param {Detox.DetoxDeviceConfig} _deviceConfig
   * @return {Promise<DeviceCookie>}
   */
  async allocate(_deviceConfig) {}

  /**
   * @param {DeviceCookie} _cookie
   * @param {DeallocOptions} _options
   * @return {Promise<void>}
   */
  async free(_cookie, _options) {}
}

module.exports = AllocationDriverBase;
