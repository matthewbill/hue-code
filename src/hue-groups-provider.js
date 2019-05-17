
const vscode = require('vscode');
let groups = [];

class HueGroupsProvider {

  constructor(lightGroups) {
    const self = this;
    self.lightGroups = lightGroups;
  }

  refresh() {

  }

  getTreeItem(element) {
    return element;
  }

  async getChildren(element) {
    const self = this;
    let items = [];
    if (!element) {
      try {
        items = global.groups.map((group) => {
          const treeItem = new vscode.TreeItem(group.name, vscode.TreeItemCollapsibleState.Collapsed);
          treeItem.id = group.name;
          treeItem.description = group.type;
          return treeItem;
        });
      } catch (error) {
        throw error;
      }
    } else {
      const group = global.groups.find(g => g.name === element.id);
      for (let i = 0; i < group.lights.length; i += 1) {
        const treeItem = new vscode.TreeItem(group.lights[i], vscode.TreeItemCollapsibleState.None);
        items.push(treeItem);
      }
    }
    return items;
  }
}

module.exports = HueGroupsProvider;
