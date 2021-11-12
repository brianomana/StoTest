//@ts-check

// This script will be run within the webview itself
// It cannot access the main VS Code APIs directly.
(function () {
    // @ts-ignore
    const vscode = acquireVsCodeApi();
    
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
            case 'functionNames':
                {
                    populateFunctionNames(message.value);
                    break;
                }
        }
    });

    // Populate drop down when webview is activated
    vscode.postMessage({ type: 'functionNames' });

    function addTest() {
        vscode.postMessage({ type: 'addTest' });
    }

    function populateFunctionNames(names) {
        // This is how to populate select dropdown
        const select = document.getElementById('functions');
        for (let i = 0; i < names.length; i++) {
            var option = document.createElement('option');
            option.text = names[i];
            // @ts-ignore
            select.add(option, i+1);
        }  
    }
}());


