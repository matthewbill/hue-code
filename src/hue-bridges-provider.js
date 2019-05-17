
const vscode = require('vscode');

class HueBridgesProvider {

  constructor(bridges) {
    const self = this;
    self.bridges = bridges;
  }

  getTreeItem(element) {
    return element;
  }

  async getChildren() {
    const self = this;
    let items = [];
    try {
      items = global.bridges.map((bridge) => {
        const treeItem = new vscode.TreeItem(bridge.id, vscode.TreeItemCollapsibleState.None);
        treeItem.id = bridge.internalipaddress;
        treeItem.description = bridge.internalipaddress;
        return treeItem;
      });
    } catch (error) {
      throw error;
    }

    return items;
  }
}

module.exports = HueBridgesProvider;
