import fs from 'fs';
import path from 'path';

import * as sass from 'sass';
import { Processor } from 'postcss';
import autoprefixer from 'autoprefixer';

import { generateMeta, getMissingMeta, getSlash } from './utils.js';
import { CREATE_DEFAULTS } from './defaults.js';
import * as log from './log.js';

import { performance } from 'perf_hooks';
import type { CompilerOptions } from './types.js';

export default async (options: CompilerOptions) => {
  const { config, mode, target, output } = options;
  const { meta } = config;
  const missingMeta = getMissingMeta(meta);
  const DEFAULTS = await CREATE_DEFAULTS(config);

  if (!meta) log.error(`Your ${log.code('theme.config.js')} file is missing the ${log.code('meta')} object.`);
  if (missingMeta.length > 0) log.error(`Your ${log.code('meta')} object is missing the following requires properties:\n` + missingMeta);
  const startTime = performance.now();
  const isTheme = mode === 'dist' || false;
  const fileName =
    mode !== 'addon'
      ? `${config?.fileName || config?.meta.name}${isTheme ? '.theme' : ''}.css`
      : output.split(getSlash).pop()!;
  const dirPath = output
    .split(getSlash)
    .filter((el) => !el.endsWith('.css'))
    .join(getSlash);

  // // Check if target file exists.
  if (!fs.existsSync(target)) log.error(`Cannot find the target file ${log.code(target)}`);

  log.info(`Building ${log.code(target)} file...`);

  // Check if path exists, if not make it.
  if (!fs.existsSync(dirPath)) fs.mkdirSync(dirPath, { recursive: true });

  // Compile and parse css.
  let css;
  try {
    css = sass.compile(target, {
      charset: false,
      loadPaths: ['node_modules'],
    }).css;
  } catch (err: any) {
    log.error(`Sass compilation failed: ${err.message}`);
    return;
  }

  let parsedcss;
  try {
    const postcss = new Processor([autoprefixer]).process(css);
    parsedcss = postcss.css;
  } catch(err: any) {
    log.error(`PostCSS processing failed: ${err.message}`);
  }

  let generatedFile: string | undefined = '';

  if (isTheme) {
    try {
      generatedFile = await generateMeta(config);
      if (mode == "dist") {
        generatedFile += `@import url('${config.baseImport || DEFAULTS.baseImport}');\n\n`;
      }
    } catch(err: any) {
      log.error(`Failed to generate meta: ${err.message}`);
      return
    }
  }

  generatedFile += parsedcss;

  const endTime = performance.now();

  if (!generatedFile) {
    log.error('Could not generate file');
    return;
  }

  // Write file to disk.
  try {
    fs.writeFile(path.join(dirPath, fileName.replace(/ /g, '')), generatedFile, err => {
      if (err) {
        console.error(err);
      }
    });
    log.success(`Built in ${(endTime - startTime).toFixed()}ms`);
  } catch (error) {
    log.error(error);
  }
};
