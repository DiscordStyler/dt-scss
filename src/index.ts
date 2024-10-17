#!/usr/bin/env node

import sade from 'sade';
import path from 'path';
import compile from './compiler.js';
import { getConfig, getPath } from './utils.js';
import { CREATE_DEFAULTS } from './defaults.js';
import * as log from './log.js';

const prog = sade('build-theme');

prog
  .command('build [themeName] [srcDir]')
  .describe('Compiles the `dist` and `base` config objects.')
  .action(async (themeName, srcDir) => {
    log.info(`Running ${log.code('build')} script...`);

    const config = await getConfig(themeName, srcDir);
    const DEFAULTS = await CREATE_DEFAULTS(config!);

    let distTarget = config?.dist?.target || DEFAULTS.dist.target;
    let baseTarget = config?.base?.target || DEFAULTS.base.target;
    if (config?.source) {
      distTarget = path.join(config.source, distTarget);
      baseTarget = path.join(config.source, baseTarget);
    }

    try {
      // Build the .theme.css file for end users to download and install.
      await compile({
        target: getPath(distTarget),
        output: getPath(config?.dist?.output || DEFAULTS.dist.output),
        mode: 'dist',
        config: config!
      });

      // Build the "base" .css file to be @import
      await compile({
        target: getPath(baseTarget),
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
          let addonTarget = config?.source ? path.join(config?.source, addon[0]) : addon[0];
          await compile({
            target: getPath(addonTarget),
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
