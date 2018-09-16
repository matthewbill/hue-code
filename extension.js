// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');

const HueBridgesRepository = require('./src/hue/hue-bridges-repository.js');
const hueBridgesRepository = new HueBridgesRepository();

function selectBridge(result) {
    const items = result.map(bridge => `${bridge.id}:${bridge.internalipaddress}`)
    try {
        const result = vscode.window.showQuickPick(items, { placeHolder: 'Multiple bridges detected. Please select the one you wish to sync with.' });
        const itemArray = result.split(':');
        const bridge = itemArray[1];
        return bridge;
    }catch(error) {
        throw Error(error);
    };
}

async function pairBridge() {
    try {
        const result = await hueBridgesRepository.getHueBridges();
        let bridge = result[0].internalipaddress;
        if (result.length > 1) {
            bridge = await selectBridge(result);
        }
        console.log(bridge);
        // get the user

    } catch(error) {
        vscode.window.showErrorMessage(error);
    }
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
    let disposable = vscode.commands.registerCommand('extension.sayHello', function () {
        // The code you place here will be executed every time your command is executed

        // Display a message box to the user
        vscode.window.showInformationMessage('Hello World!');

        pairBridge().then(result => {
            vscode.window.showInformationMessage('Bridge Paired');
        }).catch(error => {
            vscode.window.showErrorMessage(error);
        })

        // validation <-- show box again with validatio message
    });

    /* vscode.window.onDidChangeActiveTextEditor - flash white

    vscode.window.onDidChangeTextEditorSelection - make lights colour of selected text

    vscode.window.onDidChangeVisibleTextEditors

    vscode.window.onDidCloseTerminal - flash red

    vscode.window.onDidOpenTerminal - flash green

    vscode.debug.onDidStartDebugSession - pulse red

    vscode.debug.onDidTerminateDebugSession - stop pulsing red

    vscode.window.activeTextEditor.document.isDirty - stays red

    vscode.window.activeTextEditor.document. */

    context.subscriptions.push(disposable);
}
exports.activate = activate;

// this method is called when your extension is deactivated
function deactivate() {
}
exports.deactivate = deactivate;
