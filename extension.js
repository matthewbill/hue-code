// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');

const HueBridgesRepository = require('./src/hue/hue-bridges-repository.js');
const HueUsersRepository = require('./src/hue/hue-users-repository.js');
const HueGroupsRepository = require('./src/hue/hue-groups-repository.js');
const HueGroupsProvider = require('./src/hue-groups-provider.js');
const HueLightsRepository = require('./src/hue/hue-lights-repository.js');
const HueLightsProvider = require('./src/hue-lights-provider.js');
const HueSensorsRepository = require('./src/hue/hue-sensors-repository.js');
const HueSensorsProvider = require('./src/hue-sensors-provider.js');

global.hueBridgesRepository = new HueBridgesRepository();

function sleep(milliseconds) {
  return new Promise(resolve => setTimeout(resolve, milliseconds));
}

function getConfiguration(context) {
  const bridgeIp = context.globalState.get('bridgeIp');
  const userId = context.globalState.get('userId');
  const configuration = {
    bridgeIp,
    userId,
  };
  return configuration;
}

function selectBridge(bridges) {
  const items = bridges.map(bridge => `${bridge.id}:${bridge.internalipaddress}`);
  try {
    const result = vscode.window.showQuickPick(items, { placeHolder: 'Multiple bridges detected. Please select the one you wish to sync with.' });
    const itemArray = result.split(':');
    const bridge = itemArray[1];
    return bridge;
  } catch (error) {
    throw Error(error);
  }
}

async function discoverBridges() {
  try {
    const options = {
      location: vscode.ProgressLocation.Notification,
      title: 'Discovering Hue Bridges',
      cancellable: true,
    };
    const bridges = await vscode.window.withProgress(options, (progress, token) => {
      token.onCancellationRequested(() => {
        vscode.window.showInformationMessage('Cancelled Hue Bridge Discovery.');
      });

      progress.report({ increment: 0, message: 'Discovering Bridges...' });

      return new Promise((resolve) => {
        global.hueBridgesRepository.getHueBridges().then((getHueBridgesResult) => {
          resolve(getHueBridgesResult);
        }).catch((reason) => {
          console.log(reason);
        });
      });
    });
    return bridges;
  } catch (error) {
    throw Error(error);
  }
}

async function getBridge(context) {
  try {
    const bridges = await discoverBridges();
    let bridge = bridges[0].internalipaddress;
    if (bridges.length > 1) {
      bridge = await selectBridge(bridges);
    }
    console.log(`Connected to bridge: ${bridge}`);
    context.globalState.update('bridgeIp', bridge);
    return bridge;
    // get the user
  } catch (error) {
    throw error;
  }
}

async function pollUser(context, progress) {
  for (let i = 1; i < 100; i += 1) {
    try {
      const userId = await global.hueUsersRepository.getUser();
      context.globalState.update('userId', userId);
      global.connected = true;
      return userId;
    } catch (error) {
      if (error.message === HueUsersRepository.LINK_BUTTON_NOT_PRESSED_ERROR_CODE) {
        progress.report({ increment: 1, message: 'Still trying to connect! - make sure to press the bridge button...' });
        await sleep(1000);
      } else {
        throw error;
      }
    }
  }
  // throw timeout error
  return null;
}

async function pairBridge(options, context) {
  try {
    const progressOptions = {
      location: vscode.ProgressLocation.Notification,
      title: 'Paring with Hue Bridge',
      cancellable: true,
    };
    const userId = await vscode.window.withProgress(progressOptions, (progress, token) => {
      token.onCancellationRequested(() => {
        vscode.window.showInformationMessage('Cancelled Hue Bridge Pairing.');
      });

      progress.report({ increment: 0, message: 'Press the link button on the top of your Hue Bridge' });

      return new Promise((resolve) => {
        pollUser(context, progress).then((result) => {
          resolve(result);
        }).catch((reason) => {
          throw reason;
        });
      });
    });
    return userId;
  } catch (error) {
    throw error;
  }
}

async function connectHue(options, context) {
  // if (!options.userId) {
    let { bridgeIp } = options;
    if (!bridgeIp) {
      try {
        bridgeIp = await getBridge(context);
      } catch (error) {
        throw error;
      }
    }
    global.hueUsersRepository = new HueUsersRepository({
      bridgeIp: options.bridgeIp,
    });
    try {
      await pairBridge({ bridgeIp }, context);
    } catch (error) {
      vscode.window.showErrorMessage(error.message);
    }
  // }
}

function connectHueCommand(configuration, context) {
  connectHue(configuration, context).then(() => {
    vscode.window.showInformationMessage('Bridge Paired');
  }).catch((reason) => {
    vscode.window.showErrorMessage(reason);
  });
}

function displayMenuCommand(configuration, context) {
  const quickPickItems = [];
  if (global.connected) {
    quickPickItems.push({ label: '$(cross) Disconnect', description: 'Disconnect from your Hue Bridge' });
  } else {
    quickPickItems.push({ label: '$(plug) Connect', description: 'Connect to your Hue Bridge' });
  }
  vscode.window.showQuickPick(quickPickItems, { placeHolder: 'Select what you want to do' }).then((result) => {
    connectHueCommand(configuration, context);
  });
}

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
function activate(context) {
  // Use the console to output diagnostic information (console.log) and errors (console.error)
  // This line of code will only be executed once when your extension is activated
  console.log('Congratulations, your extension "hue-code" is now active!');

  // The command has been defined in the package.json file
  // Now provide the implementation of the command with  registerCommand
  // The commandId parameter must match the command field in package.json
  // let disposable = vscode.commands.registerCommand('extension.sayHello', function () {
  // The code you place here will be executed every time your command is executed
  const statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left);
  statusBarItem.text = '$(light-bulb) Hue Code';
  statusBarItem.command = 'huecode.displayMenu';
  context.subscriptions.push(statusBarItem);
  const configuration = getConfiguration(context);

  if (configuration.bridgeIp && configuration.userId) {
    global.connected = true;
  }

  context.subscriptions.push(vscode.commands.registerCommand('huecode.displayMenu', () => displayMenuCommand(configuration, context)));

  statusBarItem.show();

  vscode.window.onDidCloseTerminal((terminal) => {
    console.log(terminal);
  });

const hueGroupsRepository = new HueGroupsRepository({ 
  userId: configuration.userId,
  bridgeIp: configuration.bridgeIp,
});
const hueGroupsProvider = new HueGroupsProvider(hueGroupsRepository);
  vscode.window.registerTreeDataProvider('groups', hueGroupsProvider);

  const hueLightsRepository = new HueLightsRepository({ 
    userId: configuration.userId,
    bridgeIp: configuration.bridgeIp,
  });
  const hueLightsProvider = new HueLightsProvider(hueLightsRepository);
    vscode.window.registerTreeDataProvider('lights', hueLightsProvider);


    const hueSensorsRepository = new HueSensorsRepository({ 
      userId: configuration.userId,
      bridgeIp: configuration.bridgeIp,
    });
    const hueSensorsProvider = new HueSensorsProvider(hueSensorsRepository);
      vscode.window.registerTreeDataProvider('sensors', hueSensorsProvider);

  // validation <-- show box again with validatio message
  // });

  /* vscode.window.onDidChangeActiveTextEditor - flash white

    vscode.window.onDidChangeTextEditorSelection - make lights colour of selected text

    vscode.window.onDidChangeVisibleTextEditors

    vscode.window.onDidCloseTerminal - flash red

    vscode.window.onDidOpenTerminal - flash green

    vscode.debug.onDidStartDebugSession - pulse red

    vscode.debug.onDidTerminateDebugSession - stop pulsing red

    vscode.window.activeTextEditor.document.isDirty - stays red

    vscode.window.activeTextEditor.document. */

  // context.subscriptions.push(disposable);
}
exports.activate = activate;

// this method is called when your extension is deactivated
function deactivate() {
}
exports.deactivate = deactivate;
