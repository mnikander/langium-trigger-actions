import type { LanguageClientOptions, ServerOptions} from 'vscode-languageclient/node.js';
import * as vscode from 'vscode';
import * as path from 'node:path';
import { LanguageClient, TransportKind } from 'vscode-languageclient/node.js';

let client: LanguageClient;

// This function is called when the extension is activated.
export function activate(context: vscode.ExtensionContext): void {
    client = startLanguageClient(context);
    vscode.window.showInformationMessage("Welcome to VS code with your Langium extension!");

    const panel = vscode.window.createWebviewPanel(
        'triggerAction', // Identifies the type of the webview. Used internally
        'Trigger Actions', // Title of the panel displayed to the user
        vscode.ViewColumn.One,
        {
            enableScripts: true
        }
    );

    panel.webview.html = getWebviewContent();
}

function getWebviewContent() {
    return `<!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Counting</title>

            <script>

                function createButton(label, payload) {
                    const button = document.createElement('button');
                    button.textContent = label;
                    document.body.appendChild(button);

                    const linebreak = document.createElement('br');
                    document.body.append(linebreak);

                    button.addEventListener('click', () => {
                        const printout = document.getElementById('printout');
                        printout.textContent = payload;
                    });
                }

                function createAllButtons() {
                    const txt = '[ \
                                    {"label"  : "Click me", \
                                    "message": "The button was clicked"}, \
                                    {"label"  : "Or Me", \
                                    "message": "The other button was clicked"} \
                                ]';
                    const buttons = JSON.parse(txt);

                    for (let b of buttons) {
                        createButton(b["label"], b["message"]);
                    }
                }

                window.onload = createAllButtons; // run the function after the page loads
            </script>
        </head>
        <body>
            <h1>Counter on a Webpage</h1>
            <h1 id="accumulator">0</h1>
            <p>This page increments a counter.</p>
            <script>

                const counter = document.getElementById('accumulator');

                let count = 0;
                setInterval(() => {
                    counter.textContent = count++;
                }, 1000);

            </script>
            <p id="printout"> </p>
        </body>
        </html>
`;
}

// This function is called when the extension is deactivated.
export function deactivate(): Thenable<void> | undefined {
    if (client) {
        return client.stop();
    }
    return undefined;
}

function startLanguageClient(context: vscode.ExtensionContext): LanguageClient {
    const serverModule = context.asAbsolutePath(path.join('out', 'language', 'main.cjs'));
    // The debug options for the server
    // --inspect=6009: runs the server in Node's Inspector mode so VS Code can attach to the server for debugging.
    // By setting `process.env.DEBUG_BREAK` to a truthy value, the language server will wait until a debugger is attached.
    const debugOptions = { execArgv: ['--nolazy', `--inspect${process.env.DEBUG_BREAK ? '-brk' : ''}=${process.env.DEBUG_SOCKET || '6009'}`] };

    // If the extension is launched in debug mode then the debug server options are used
    // Otherwise the run options are used
    const serverOptions: ServerOptions = {
        run: { module: serverModule, transport: TransportKind.ipc },
        debug: { module: serverModule, transport: TransportKind.ipc, options: debugOptions }
    };

    // Options to control the language client
    const clientOptions: LanguageClientOptions = {
        documentSelector: [{ scheme: '*', language: 'trigger-actions' }]
    };

    // Create the language client and start the client.
    const client = new LanguageClient(
        'trigger-actions',
        'Trigger Actions',
        serverOptions,
        clientOptions
    );

    // Start the client. This will also launch the server
    client.start();
    return client;
}
