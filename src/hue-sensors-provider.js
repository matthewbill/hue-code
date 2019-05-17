
const vscode = require('vscode');

class HueSensorsProvider {
  constructor(sensors) {
    const self = this;
    self.sensors = sensors;
  }

  getTreeItem(element) {
    return element;
  }

  async getChildren() {
    const self = this;
    let items = [];
    try {
      items = global.sensors.map(sensor => new vscode.TreeItem(sensor.name, vscode.TreeItemCollapsibleState.None));
    } catch (error) {
      throw error;
    }

    return items;
  }
}

module.exports = HueSensorsProvider;
