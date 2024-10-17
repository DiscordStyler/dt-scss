import ansis from 'ansis';

export const success = (message: unknown | any) => {
  console.log(`${ansis.greenBright.bold('[SUCCESS]')} ${message}`);
}
export const warning = (message: unknown | any) => {
  console.log(`${ansis.yellowBright.bold('[WARNING]')} ${message}`);
}
export const error = (message: unknown | any) => {
  console.log(`\n${ansis.redBright.bold('[ERROR]')} ${message}\n`);
  process.exit(1);
}
export const info = (message: unknown | any, title?: string) => {
  console.log(`${ansis.blueBright.bold(`[${title || 'INFO'}]`)} ${message}`);
}
export const code = (message: unknown | any, char: string = '`') => {
  return ansis.yellow(`${char}` + message + `${char}`);
}
