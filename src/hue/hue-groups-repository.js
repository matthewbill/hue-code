/* eslint-disable class-methods-use-this */
const axios = require('axios');

class HueGroupsRepository {
  constructor(configuration) {
    const self = this;
    self.configuration = configuration;
    self.userId = configuration;
  }

  async getGroups() {
    const self = this;
    const url = `http://${self.configuration.bridgeIp}/api/${self.configuration.userId}/groups`;
    try {
      const result = await axios.get(url);
      const groups = Object.values(result.data);
      return groups;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = HueGroupsRepository;
