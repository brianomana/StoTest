//@ts-check

// This script will be run within the webview itself
// It cannot access the main VS Code APIs directly.
(function () {
    // @ts-ignore
    const vscode = acquireVsCodeApi();

    // This is how to populate select dropdown
    const select = document.getElementById('functions');
    var option = document.createElement('option');
    option.text = "factorial";
    // @ts-ignore
    select.add(option, 1);
    
    //1? This seems to be the issue... It is never triggered
    document.querySelector('.add-test-button').addEventListener('click', () => {
        addTest();

        // This is how to clear input
        const el = document.querySelector('.input1');
        // @ts-ignore
        const val = el.value;
        // @ts-ignore
        el.value = '';
        vscode.postMessage({ type: 'input', value: val });

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


