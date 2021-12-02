//@ts-check

// This script will be run within the webview itself
// It cannot access the main VS Code APIs directly.
(function () {
    // @ts-ignore
    const vscode = acquireVsCodeApi();

    const oldState = vscode.getState() || { tests: [] };
    let tests = oldState.tests;
    //tests = [];
    updateTestsList(tests);

    document.querySelector('.run-test-button').addEventListener('click', () => {
        vscode.postMessage({ type: 'runTest', testlist: tests});   
    });
    
    // Handle messages sent from the extension to the webview
    window.addEventListener('message', event => {
        const message = event.data; // The json data that the extension sent
        switch (message.type) {
            case 'addTest':
                {
                    tests.push(message.value);
                    updateTestsList(tests);
                    break;
                }
        }
    });

    function updateTestsList(tests) {
        const ul = document.querySelector('.tests-list');
        ul.textContent = '';
        for (let i = 0; i < tests.length; i++) { 
            const li = document.createElement("li");
            li.textContent = tests[i];
            ul.appendChild(li);
        }
        vscode.setState({ tests: tests });
        vscode.postMessage({ type: 'updateTestList', testlist: tests});
    }

    //tests = []; // Remove if you want tests to stay between runs
    
}());


