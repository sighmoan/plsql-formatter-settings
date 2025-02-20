import { exec } from 'child_process';
import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
	const configuration = vscode.workspace.getConfiguration('plSqlFormatter');
	const graalvmJavaPath = configuration.get<string>('pathToGraalVMJdk');
	const tvdFormatPath = configuration.get<string>('pathToTvdformat');
	const xmlSettingsPath = configuration.get<string>('pathToXmlSettingsFile');

	const disposable = vscode.languages.registerDocumentFormattingEditProvider('oracle-sql', {
		provideDocumentFormattingEdits(document: vscode.TextDocument): vscode.TextEdit[] {
			const filePath = document.fileName;

			exec(`${graalvmJavaPath} -jar ${tvdFormatPath} ${filePath} xml=${xmlSettingsPath}`, (error, stdout, stderr) => {
				vscode.window.showInformationMessage(`Trying to format ${filePath}`);
				if (error) {
					vscode.window.showErrorMessage(`Error: ${stderr}`);
					return;
				}
				vscode.window.showInformationMessage(`Formatted: ${stdout}`);
			});

			return [];
		}
	});

	context.subscriptions.push(disposable);
}

export function deactivate() {}
