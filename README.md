# dt-scss

Simple package to create themes for Discord using SCSS.

<br>

## Usage

Install the package with:

```bash
npm install dt-scss
# or
yarn add dt-scss
# or
pnpm add dt-scss
```

Then create a `dt-scss.config.js` file in the root of your project folder with the following:

```js
/** @type {import('dt-scss/lib/config').Config} */
export default {
	meta: {
		name: 'Nicetheme',
		author: 'DiscordStyler',
		version: '1.0.0',
		description: 'My cool theme',
		source: 'https://github.com/DiscordStyler/Nicetheme',
	},
};
```

> NOTE: If you have multiple themes, create a `dt-scss.config.js` in every theme folder.

And then use the `dt-scss` command followed by the script you wish to use.

```bash
dt-scss build [themeName] [srcDir] # will build the necessary files to distribute your theme(s).
```

> **NOTE**: Make sure you have `"type": "module"` set in your `package.json`.

<br>

## Compiler API

| Property     | Type                 | Required | Description                                                                                                                                    |
| ------------ | -------------------- | -------- | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| `meta`       | Object               | true     | The BetterDiscord theme/plugin META. View all avaiable meta [HERE](https://github.com/BetterDiscord/BetterDiscord/wiki/Plugin-and-Theme-METAs) |
| `dist`       | Object               | false    | The target and output path of the dist file.                                                                                                   |
| `base`       | Object               | false    | The target and output path of the base file.                                                                                                   |
| `fileName`   | string               | false    | The name of the file to be compiled. This will default to your `meta.name` if this option is not provided.                                     |
| `addons`     | ([string, string])[] | false    | Any addons that should be compiled separately from your theme files.                                                                           |
| `baseImport` | string               | false    | The `@import` url used in the .theme.css file.                                                                                                 |

All `dist` and `base` objects contain a `target` and `output` properties, and are relative to the project directory.  


## License

See the [LICENSE](./LICENSE) file for license rights and limitations (MIT).
