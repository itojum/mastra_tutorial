import { Memory } from '@mastra/memory';
import { LibSQLStore } from '@mastra/libsql';

export const memory = (template?: string): Memory => {
  return new Memory({
    storage: new LibSQLStore({
      url: 'file:../mastra.db',
    }),
    options: {
      workingMemory: {
        enabled: template !== undefined,
        template,
      },
    }
  });
};