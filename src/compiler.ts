import fs from 'fs';
import path from 'path';

import * as sass from 'sass';
import { Processor } from 'postcss';
import autoprefixer from 'autoprefixer';

import { generateMeta, getMissingMeta, getSlash } from './utils.js';
import { CREATE_DEFAULTS } from './defaults.js';
import log from './log.js';

import { performance } from 'perf_hooks';
import type { Config } from './config.js';

interface Options {
  target: string;
  output: string;
  mode?: 'dist' | 'addon';
  config: Config;
}

export default async (options: Options) => {
  const config = options.config;
  const { meta } = config;
  const missingMeta = getMissingMeta(meta);
  const DEFAULTS = await CREATE_DEFAULTS(config!);

  if (!meta) log.error(`Your ${log.code('theme.config.js')} file is missing the ${log.code('meta')} object.`);
  if (missingMeta.length > 0) log.error(`Your ${log.code('meta')} object is missing the following requires properties:\n` + missingMeta);
  const startTime = performance.now();
  const isTheme = options.mode === 'dist' || false;
  const fileName =
    options.mode !== 'addon'
      ? `${config?.fileName || config?.meta.name}${isTheme ? '.theme' : ''}.css`
      : options.output.split(getSlash).pop()!;
  const dirPath = options.output
    .split(getSlash)
    .filter((el) => !el.endsWith('.css'))
    .join(getSlash);

  // // Check if target file exists.
  if (!fs.existsSync(options.target)) log.error(`Cannot find the target file ${log.code(options.target)}`);

  log.info(`Building ${log.code(options.target)} file...`);

  // Check if path exists, if not make it.
  if (!fs.existsSync(dirPath)) fs.mkdirSync(dirPath, { recursive: true });

  // Compile and parse css.
  const css = sass.compile(options.target, {
    charset: false,
    loadPaths: ['node_modules']
  }).css;

  const postcss = new Processor([autoprefixer]).process(css);
  const parsedcss = postcss.css;

  let generatedFile: string | undefined = '';

  if (isTheme) {
    generatedFile = await generateMeta(config!);
    if (options.mode === 'dist') generatedFile += `@import url('${options.config.baseImport || DEFAULTS.baseImport}');\n\n`;
  }
  generatedFile += parsedcss;

  const endTime = performance.now();

  if (!generatedFile) {
    log.error('Could not generate file');
    return;
  }

  // Write file to disk.
  try {
    fs.writeFileSync(path.join(dirPath, fileName.replace(/ /g, '')), generatedFile);
    log.success(`Built in ${(endTime - startTime).toFixed()}ms`);
  } catch (error) {
    log.error(error);
  }
};
