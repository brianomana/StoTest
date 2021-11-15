// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import {PythonShell} from 'python-shell';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	
	const testProvider = new TestsViewProvider(context.extensionUri);

	context.subscriptions.push(
		vscode.window.registerWebviewViewProvider(TestsViewProvider.viewType, testProvider));

	context.subscriptions.push(
		vscode.commands.registerCommand('stogitresponse.myTest', () => {
			// The code you place here will be executed every time your command is executed
			// Display a message box to the user
			vscode.window.showInformationMessage('Successfully added test!');
			vscode.window.showInputBox({
				title: "Add Test",
				placeHolder: "Test Name"
			});
		})
	);
}

class TestsViewProvider implements vscode.WebviewViewProvider {

	public static readonly viewType = 'stogitresponse-createtests';

	private _view?: vscode.WebviewView;

	constructor(
		private readonly _extensionUri: vscode.Uri,
	) { }

	public resolveWebviewView(
		webviewView: vscode.WebviewView,
		context: vscode.WebviewViewResolveContext,
		_token: vscode.CancellationToken,
	) {
		this._view = webviewView;

		webviewView.webview.options = {
			// Allow scripts in the webview
			enableScripts: true,

			localResourceRoots: [
				this._extensionUri
			]
		};

		webviewView.webview.html = this._getHtmlForWebview(webviewView.webview);

		webviewView.webview.onDidReceiveMessage(data => {
			switch (data.type) {
				case 'addTest':
					{
						vscode.window.showInformationMessage('Add test button pushed!');
						console.log(data.testName);
						//console.log(data.function);
						console.log(data.input);
						console.log(data.output);
						// Function to create/check for unit test and write tests
						break;
					}
				case 'functionNames':
					{
						this.functionNames();
						break;
					}
			}
		});
	}


	public createUnitTest(testName: any, functionDef: any, input: any, output: any) {
		if (vscode.workspace.workspaceFolders !== undefined) {
			// Workspace Directory: vscode.workspace.workspaceFolders[0].uri.path
			// Extension Path: context.extensionUri.path
			var workspaceDir = vscode.workspace.workspaceFolders[0].uri.path;
			// var SCRIPT = this._extensionUri.path + '/src/scripts/SCRIPT.py';

			// Windows fix
			// scriptnamePath = scriptnamePath.replace('c:/','');
			// workspaceDir = workspaceDir.replace('/c','c');


		}
	}

	public sendFuntionNames(names: any) {
		if (this._view) {
			this._view.show?.(true);
			this._view.webview.postMessage({ type: 'functionNames', value: names });
		} else {
			console.log("failure");
		}
	}

	public async functionNames() {
		if (vscode.workspace.workspaceFolders !== undefined) {
			// Workspace Directory: vscode.workspace.workspaceFolders[0].uri.path
			// Extension Path: context.extensionUri.path
			var workspaceDir = vscode.workspace.workspaceFolders[0].uri.path;
			var funnamesPyPath = this._extensionUri.path + '/src/scripts/function-names.py';
			var names: string[];

			// Windows fix
			// funnamesPyPath = funnamesPyPath.replace('c:/','');
			// workspaceDir = workspaceDir.replace('/c','c');

			names = await new Promise((resolve, reject) => {
				PythonShell.run(funnamesPyPath, { args: [workspaceDir] }, function (err, results) {
					if (err) {
						throw err;
					}
					// results is an array consisting of messages collected during execution
					if (results !== undefined) {
						resolve(results);
					} else {
						console.log("No return");
					}
				});
			});
			this.sendFuntionNames(names);
		} // Add case if there is no open workspace
	}


	private _getHtmlForWebview(webview: vscode.Webview) {
		// Get the local path to main script run in the webview, then convert it to a uri we can use in the webview.
		const scriptUri = webview.asWebviewUri(vscode.Uri.joinPath(this._extensionUri, 'media', 'main.js'));

		// Do the same for the stylesheet.
		const styleResetUri = webview.asWebviewUri(vscode.Uri.joinPath(this._extensionUri, 'media', 'reset.css'));
		const styleVSCodeUri = webview.asWebviewUri(vscode.Uri.joinPath(this._extensionUri, 'media', 'vscode.css'));
		const styleMainUri = webview.asWebviewUri(vscode.Uri.joinPath(this._extensionUri, 'media', 'main.css'));

		// Use a nonce to only allow a specific script to be run.
		const nonce = getNonce();

		return `<!DOCTYPE html>
			<html lang="en">
			<head>
				<meta charset="UTF-8">

				<!--
					Use a content security policy to only allow loading images from https or from our extension directory,
					and only allow scripts that have a specific nonce.
				-->
				<meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src ${webview.cspSource}; script-src 'nonce-${nonce}';">

				<meta name="viewport" content="width=device-width, initial-scale=1.0">

				<link href="${styleResetUri}" rel="stylesheet">
				<link href="${styleVSCodeUri}" rel="stylesheet">
				<link href="${styleMainUri}" rel="stylesheet">
				
				<title>Cat Colors</title>
			</head>
			<body>
				<input placeholder="Test Name" class="test-name"></input>
				<label for="functions">Function:</label>
				<select name="functions" id="functions" class="functions">
					<option value="default">---</option>
				</select>
				<input placeholder="Input" class="input1"></input>
				<input placeholder="Expected Output" class="output1"></input>
				<button class="add-test-button">Add Test</button>
				<script nonce="${nonce}" src="${scriptUri}"></script>
			</body>
			</html>`;
	}
}

function getNonce() {
	let text = '';
	const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	for (let i = 0; i < 32; i++) {
		text += possible.charAt(Math.floor(Math.random() * possible.length));
	}
	return text;
}


// this method is called when your extension is deactivated
export function deactivate() {}
