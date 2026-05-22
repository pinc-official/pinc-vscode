"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const node_1 = require("vscode-languageserver/node");
const vscode_languageserver_textdocument_1 = require("vscode-languageserver-textdocument");
const pincfmt_1 = require("@pinc-official/pincfmt");
const connection = (0, node_1.createConnection)(node_1.ProposedFeatures.all);
const documents = new node_1.TextDocuments(vscode_languageserver_textdocument_1.TextDocument);
connection.onDocumentFormatting((formattingParams) => {
    const document = documents.get(formattingParams.textDocument.uri);
    if (!document) {
        return null;
    }
    const wholeDocument = node_1.Range.create(0, 0, document.lineCount, 0);
    const text = document.getText();
    const formatted = (0, pincfmt_1.pinc_format)(text);
    return [node_1.TextEdit.replace(wholeDocument, formatted)];
});
connection.onInitialize((params) => {
    const result = {
        capabilities: {
            documentFormattingProvider: true,
        },
    };
    return result;
});
documents.listen(connection);
connection.listen();
