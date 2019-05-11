/* eslint-disable class-methods-use-this */
const axios = require('axios');

class HueUserRepository {

  static get LINK_BUTTON_NOT_PRESSED_ERROR_CODE() { return 'link-button-not-pressed'; }

  constructor(options) {
    const self = this;
    self.bridgeIp = options.bridgeIp;
  }

  async getUser() {
    const self = this;
    const url = `http://${self.bridgeIp}/api`;
    try {
      const result = await axios.post(url, {
        devicetype: 'hue-code',
      });
      if (result.data[0].error) {
        throw new Error(HueUserRepository.LINK_BUTTON_NOT_PRESSED_ERROR_CODE);
      } else {
        const userId = result.data[0].success.username;
        return userId;
      }
    } catch (error) {
      throw error;
    }
  }
}

module.exports = HueUserRepository;
