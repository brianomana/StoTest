// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import {PythonShell} from 'python-shell';

var functions: any[] = [];
var tests: string[] = [];

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	
	const myTestProvider = new MyTestsViewProvider(context.extensionUri);
	const testProvider = new TestsViewProvider(context.extensionUri, myTestProvider);

	context.subscriptions.push(
		vscode.window.registerWebviewViewProvider(TestsViewProvider.viewType, testProvider));
	
	context.subscriptions.push(
		vscode.window.registerWebviewViewProvider(MyTestsViewProvider.viewType, myTestProvider));
	
}

class TestsViewProvider implements vscode.WebviewViewProvider {

	public static readonly viewType = 'stotest-createtests';

	private _view?: vscode.WebviewView;

	constructor(
		private readonly _extensionUri: vscode.Uri,
		private readonly _testWebview: MyTestsViewProvider,
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
						console.log(data.functionName);
						//console.log(data.functionDef);
						console.log(data.input);
						console.log(data.output);
						var functionDef = "";
						for (var i = 0; i < functions.length; i++) {
							if (functions[i].name === data.functionName) {
								functionDef = functions[i].def;
								console.log(functionDef);
							}
						}
						this.createUnitTest(data.testName, data.functionName, functionDef, data.input, data.output);
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


	public async createUnitTest(testName: any, functionName: any, functionDef: any, input: any, output: any) {
		if (vscode.workspace.workspaceFolders !== undefined) {
			// Workspace Directory: vscode.workspace.workspaceFolders[0].uri.path
			// Extension Path: context.extensionUri.path
			var workspaceDir = vscode.workspace.workspaceFolders[0].uri.path;
			var writetestsPypath = this._extensionUri.path + '/src/scripts/writeTests.py';
			var filename = '';

			// Windows fix
			// writetestsPath = writetestsPath.replace('c:/','');
			// workspaceDir = workspaceDir.replace('/c','c');

			filename = await new Promise((resolve, reject) => {
				PythonShell.run(writetestsPypath, { args: [workspaceDir, testName, functionName, functionDef, input, output] }, function (err, results) {
					if (err) {
						throw err;
					}
					if (results !== undefined) {
						resolve(results[0]);
					}
					vscode.window.showInformationMessage('Successfully created test file');
					
				});
			});
			if(!tests.includes(testName)) {
				tests.push(testName);
				this._testWebview.newTest(testName);
			}
			console.log("TESTS:" +tests);
			
			
		}
	}

	public sendFuntionNames(names: any) {
		// Send to webview
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
			var funnamesPyPath = this._extensionUri.path + '/src/scripts/functionNames.py';
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

			var functionlist: any[] = [];
			for (var i = 0; i < names.length; i++) {
				functionlist.push(JSON.parse(names[i]));
			}
			functions = functionlist; // Set global variable - might be needed elsewhere
			console.log(functionlist);
			this.sendFuntionNames(functionlist);
			
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
				
				<title>Create Tests</title>
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

class MyTestsViewProvider implements vscode.WebviewViewProvider {

	public static readonly viewType = 'stotest-mytests';

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
				case 'runTest':
					{
						vscode.window.showInformationMessage('Running Tests');
						console.log(data.testlist);
						break;
					}
				case 'updateTestList':
					{
						tests = data.testlist;
						console.log(tests);
						break;
					}
			}
		});
	}

	public newTest(name: string) {
		if (this._view) {
			this._view.show?.(true);
			this._view.webview.postMessage({ type: 'addTest', value: name });
		} else {
			console.log("failure");
		}
	}

	private _getHtmlForWebview(webview: vscode.Webview) {
		// Get the local path to main script run in the webview, then convert it to a uri we can use in the webview.
		const scriptUri = webview.asWebviewUri(vscode.Uri.joinPath(this._extensionUri, 'media', 'mytests.js'));

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
				
				<title>My Tests</title>
			</head>
			<body>
				<ul class="tests-list">
				</ul>
				<button class="run-test-button">Run Tests</button>
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
