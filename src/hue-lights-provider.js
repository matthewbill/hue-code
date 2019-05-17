
const vscode = require('vscode');

class HueLightsProvider {
  constructor(lights) {
    const self = this;
    self.lights = lights;
  }

  getTreeItem(element) {
    return element;
  }

  async getChildren() {
    const self = this;
    let items = [];
    try {
      items = global.lights.map((light) => {
        const treeItem = new vscode.TreeItem(light.name, vscode.TreeItemCollapsibleState.None);
        treeItem.id = light.id;
        treeItem.tooltip = light.id;
        treeItem.description = light.type;
        return treeItem;
      });
    } catch (error) {
      throw error;
    }

    return items;
  }
}

module.exports = HueLightsProvider;
