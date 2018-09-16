const axios = require('axios');

class HueBridgeRepository {

  test() {
    
  }

  async getHueBridges() {
    const discoveryUrl = 'https://discovery.meethue.com/';
    try {
      const result = await axios.get(discoveryUrl);
      // Mapping
      const entities = result.data;
      return entities;
    } catch(error) {
      throw new Error(error);
    }
  }

}

module.exports = HueBridgeRepository;
