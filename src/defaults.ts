import type { Config } from './types.js';

export const CREATE_DEFAULTS = async function (config: Config) {
  return {
    dist: {
      target: 'src/dist.scss',
      output: 'theme'
    },
    base: {
      target: 'src/base.scss',
      output: 'theme'
    },
    baseImport: `https://${config?.meta.author.toLowerCase()}.github.io/${config?.meta.name}/${config?.meta.name}.css`
  };
}
