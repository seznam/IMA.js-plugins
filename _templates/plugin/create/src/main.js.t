---
to: packages/<%= h.changeCase.paramCase(name) %>/src/main.js
---
import { pluginLoader } from '@ima/core';

pluginLoader.register('@ima/<%= h.changeCase.paramCase(name) %>', () => ({
   })
);

export { };
