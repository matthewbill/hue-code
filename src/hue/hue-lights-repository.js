/* eslint-disable class-methods-use-this */
const axios = require('axios');

class HueLightsRepository {
  constructor(options) {
    const self = this;
    self.bridgeIp = options.bridgeIp;
    self.userId = options.userId;
  }

  async getLights() {
    const self = this;
    const url = `http://${self.bridgeIp}/api/${self.userId}/lights`;
    try {
      const result = await axios.get(url);
      const groups = Object.values(result.data);
      return groups;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = HueLightsRepository;
