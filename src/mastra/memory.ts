import { Memory } from '@mastra/memory';
import { LibSQLStore, LibSQLVector } from '@mastra/libsql';
import { googleEmbeddingModel } from './models';

export const memory = (template?: string) => new Memory({
  storage: new LibSQLStore({
    url: 'file:../mastra.db',
  }),
  vector: new LibSQLVector({
    connectionUrl: 'file:../mastra.db',
  }),
  embedder: googleEmbeddingModel,
  options: {
    lastMessages: 10,
    semanticRecall: {
      topK: 3,
      messageRange: 2,
    },
    workingMemory: {
      enabled: true,
      template,
    },
  },
});