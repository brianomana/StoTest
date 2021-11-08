//@ts-check

// This script will be run within the webview itself
// It cannot access the main VS Code APIs directly.
(function () {
    const vscode = acquireVsCodeApi();

    
    //1? This seems to be the issue... It is never triggered
    document.querySelector('.add-test-button').addEventListener('click', () => {
        addTest();
    });

    // Handle messages sent from the extension to the webview
    window.addEventListener('message', event => {
        const message = event.data; // The json data that the extension sent
        switch (message.type) {
            case 'addTest':
                {
                    addTest();
                    break;
                }
        }
    });

    //2?
    function addTest() {
        vscode.postMessage({ type: 'addTest' });
    }
}());


