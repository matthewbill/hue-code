
const vscode = require('vscode');

class HueSensorsProvider {
  constructor(hueSensorsRepository) {
    const self = this;
    self.hueSensorsRepository = hueSensorsRepository;
  }

  getTreeItem(element) {
    return element;
  }

  async getChildren() {
    const self = this;
    let items = [];
    try {
      const sensors = await self.hueSensorsRepository.getSensors();
      items = sensors.map(sensor => new vscode.TreeItem(sensor.name, vscode.TreeItemCollapsibleState.None));
    } catch (error) {
      throw error;
    }

    return items;
  }
}

module.exports = HueSensorsProvider;
