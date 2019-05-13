
const vscode = require('vscode');

class HueGroupsProvider {
  constructor(hueGroupsRepository) {
    const self = this;
    self.hueGroupsRepository = hueGroupsRepository;
  }

  getTreeItem(element) {
    return element;
  }

  async getChildren() {
    const self = this;
    let items = [];
    try {
      const groups = await self.hueGroupsRepository.getGroups();
      items = groups.map(group => new vscode.TreeItem(group.name, vscode.TreeItemCollapsibleState.None));
    } catch (error) {
      throw error;
    }

    return items;
  }
}

module.exports = HueGroupsProvider;
