import {
  createConnection,
  TextDocuments,
  ProposedFeatures,
  InitializeParams,
  InitializeResult,
  TextEdit,
  Range,
} from 'vscode-languageserver/node';

import { TextDocument } from 'vscode-languageserver-textdocument';
import { pinc_format } from '@pinc-official/pincfmt';

const connection = createConnection(ProposedFeatures.all);
const documents: TextDocuments<TextDocument> = new TextDocuments(TextDocument);

connection.onDocumentFormatting((formattingParams) => {
  const document = documents.get(formattingParams.textDocument.uri);
  if (!document) {
    return null;
  }

  const wholeDocument = Range.create(0, 0, document.lineCount, 0);
  const text = document.getText();
  const formatted = pinc_format(text);

  return [TextEdit.replace(wholeDocument, formatted)];
});

connection.onInitialize((params: InitializeParams) => {
  const result: InitializeResult = {
    capabilities: {
      documentFormattingProvider: true,
    },
  };

  return result;
});

documents.listen(connection);

connection.listen();
