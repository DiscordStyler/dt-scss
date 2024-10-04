#!/usr/bin/env node

import sade from 'sade';

import compile from './compiler.js';
import { getConfig, getPath } from './utils.js';
import { CREATE_DEFAULTS } from './defaults.js';
import log from './log.js';

const prog = sade('build-theme');

prog
  .command('build [themeName] [srcDir]')
  .describe('Compiles the `dist` and `base` config objects.')
  .action(async (themeName, srcDir) => {
    log.info(`Running ${log.code('build')} script...`);

    const config = await getConfig(themeName, srcDir);
    const DEFAULTS = await CREATE_DEFAULTS(config!);

    try {
      // Build the .theme.css file for end users to download and install.
      await compile({
        target: getPath(config?.dist?.target || DEFAULTS.dist.target),
        output: getPath(config?.dist?.output || DEFAULTS.dist.output),
        mode: 'dist',
        config: config!
      });

      // Build the "base" .css file to be @import
      await compile({
        target: getPath(config?.base?.target || DEFAULTS.base.target),
        output: getPath(config?.base?.output || DEFAULTS.base.output),
        config: config!
      });
    } catch (err) {
      log.error(err);
    }

    // Builds any add-ons
    if (config?.addons && Array.isArray(config?.addons) && config?.addons.length > 0) {
      config?.addons.forEach(async (addon) => {
        try {
          await compile({
            target: getPath(addon[0]),
            output: getPath(addon[1]),
            mode: 'addon',
            config: config!
          });
        } catch (err) {
          log.error(err);
        }
      });
    }

    log.success('Built all files.');
  });

prog.parse(process.argv);
