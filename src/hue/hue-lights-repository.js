/* eslint-disable class-methods-use-this */
const axios = require('axios');

class HueLightsRepository {
  constructor(configuration) {
    const self = this;
    self.configuration = configuration;
  }

  async getLights() {
    const self = this;
    const url = `http://${self.configuration.bridgeIp}/api/${self.configuration.userId}/lights`;
    try {
      const result = await axios.get(url);
      const groups = Object.values(result.data);
      for (let i = 0; i < groups.length; i += 1) {
        groups[i].id = i + 1;
      }
      return groups;
    } catch (error) {
      throw error;
    }
  }

  async updateLightState(id, state) {
    const self = this;
    const url = `http://${self.configuration.bridgeIp}/api/${self.configuration.userId}/lights/${id}/state`;
    try {
      const result = await axios.put(url, state);
      return result;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = HueLightsRepository;
