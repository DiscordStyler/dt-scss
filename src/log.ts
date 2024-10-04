import ansis from 'ansis';

export default {
  success: (message: unknown | any) => {
    console.log(`${ansis.greenBright.bold('[SUCCESS]')} ${message}`);
  },
  warning: (message: unknown | any) => {
    console.log(`${ansis.yellowBright.bold('[WARNING]')} ${message}`);
  },
  error: (message: unknown | any) => {
    console.log(`\n${ansis.redBright.bold('[ERROR]')} ${message}\n`);
    process.exit(1);
  },
  info: (message: unknown | any, title?: string) => {
    console.log(`${ansis.blueBright.bold(`[${title || 'INFO'}]`)} ${message}`);
  },
  code: (message: unknown | any, char: string = '`') => {
    return ansis.yellow(`${char}` + message + `${char}`);
  }
};
