
const vscode = require('vscode');

class HueLightsProvider {
  constructor(hueLightsRepository) {
    const self = this;
    self.hueLightsRepository = hueLightsRepository;
  }

  getTreeItem(element) {
    return element;
  }

  async getChildren() {
    const self = this;
    let items = [];
    try {
      const lights = await self.hueLightsRepository.getLights();
      items = lights.map(light => new vscode.TreeItem(light.name, vscode.TreeItemCollapsibleState.None));
    } catch (error) {
      throw error;
    }

    return items;
  }
}

module.exports = HueLightsProvider;
