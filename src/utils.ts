import path from 'path';
import log from './log.js';

import type { Config } from './config.js';

/**
 * Get the current OS.
 */
export const getOs = () => {
  if (process.platform === 'win32') return 'WIN';
  else if (process.platform === 'darwin') return 'MACOS';
  else if (process.platform === 'linux') return 'LINUX';
  return 'UNDEFINED';
};

export const getSlash = getOs() === 'WIN' ? '\\' : '/';

/**
 * Find the `dt-scss.config.js` file of themes or current directory.
 */
export const getConfig = async (themeName?: string, sourceDir: string = 'themes') => {
  const find = themeName ? path.join(process.cwd(), sourceDir, themeName, 'dt-scss.config.js') : path.join(process.cwd(), 'dt-scss.config.js');

  try {
    let config = (await import((getOs() === 'WIN' ? 'file://' : '') + find)).default as Config;
    return config;
  } catch (err) {
    log.error(
      `Cannot find ${log.code('theme.config.js')} in the theme(s) directory.\n\n` +
      `If you do have a config file, make sure you include ${log.code('type": "module', '"')} in your ${log.code('package.json')} file.`
    );
  }
};

/**
 * Construct the meta given by the `dt-scss.config.js` file.
 */
export const generateMeta = async (config: Config) => {
  return `/**\n${Object.entries(config.meta)
    .map(([key, value]) => ` * @${key} ${value}\n`)
    .join('')}*/\n\n`;
};

/**
 * Transforms the given value to an absolute path.
 */
export const getPath = (...val: string[]) => {
  return path.resolve(...[...val].flat(42));
};

/**
 * Generates an array with missing meta to be used to tell the user if they're missing any.
 */
export const getMissingMeta = (meta: Record<string, any>) => {
  const keys = Object.keys(meta);

  const requiredMeta = ['name', 'author', 'description', 'version', 'source'];
  let missing: string[] = [];

  requiredMeta.forEach((requiredKey) => {
    if (!keys.includes(requiredKey)) missing = [...missing, requiredKey];
  });

  return missing.map((key) => ` - ${key}\n`).join();
};
