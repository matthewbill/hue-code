/* eslint-disable class-methods-use-this */
const axios = require('axios');

class HueSensorsRepository {
  constructor(configuration) {
    const self = this;
    self.configuration = configuration;
  }

  async getSensors() {
    const self = this;
    const url = `http://${self.configuration.bridgeIp}/api/${self.configuration.userId}/sensors`;
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
