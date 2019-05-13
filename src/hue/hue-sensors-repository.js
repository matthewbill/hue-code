/* eslint-disable class-methods-use-this */
const axios = require('axios');

class HueSensorsRepository {
  constructor(options) {
    const self = this;
    self.bridgeIp = options.bridgeIp;
    self.userId = options.userId;
  }

  async getSensors() {
    const self = this;
    const url = `http://${self.bridgeIp}/api/${self.userId}/sensors`;
    try {
      const result = await axios.get(url);
      const sensors = Object.values(result.data);
      return sensors;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = HueSensorsRepository;
