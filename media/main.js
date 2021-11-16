//@ts-check

// This script will be run within the webview itself
// It cannot access the main VS Code APIs directly.
(function () {
    // @ts-ignore
    const vscode = acquireVsCodeApi();
    
    // This pulls all the values within the Add Test treeview
    document.querySelector('.add-test-button').addEventListener('click', () => {
        //addTest();

        // Test Name
        const testName = document.querySelector('.test-name');
        // @ts-ignore
        const val1 = testName.value;
        // @ts-ignore
        testName.value = '';

        //Function Name
        const functionName = document.querySelector('.functions');
        // @ts-ignore
        const val2 = functionName.value;
        // @ts-ignore
        functionName.value = 'default';

        // Input
        const input = document.querySelector('.input1');
        // @ts-ignore
        const val3 = input.value;
        // @ts-ignore
        input.value = '';

        // Output
        const output = document.querySelector('.output1');
        // @ts-ignore 
        const val4 = output.value;
        // @ts-ignore
        output.value = '';

        vscode.postMessage({ type: 'addTest', testName: val1, functionName: val2, input: val3, output: val4});
        
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
            option.text = names[i].name;
            // Maybe add the function definition as the value to pull def quicker?
            // @ts-ignore
            select.add(option, i+1);
        }  
    }
}());


