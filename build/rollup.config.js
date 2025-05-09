import terser from "@rollup/plugin-terser";
import resolve from '@rollup/plugin-node-resolve';
import commonJS from '@rollup/plugin-commonjs';
import postcss from 'rollup-plugin-postcss';
import postcssImport from 'postcss-import';
import postcssCopy from 'postcss-copy';
import rollupGitVersion from 'rollup-plugin-git-version';
import copy from 'rollup-plugin-copy'

import plugin from '../package.json' with { type: "json" };

let plugin_name = plugin.name.replace("@openagenda/", "");

let input = plugin.module;
let output = {
	file: "dist/" + plugin_name + ".js",
	format: "umd",
	sourcemap: true,
	name: plugin_name,
	inlineDynamicImports: true

};

let plugins = [
	resolve(),
	commonJS({
		include: '../node_modules/**'
	}),
	rollupGitVersion(),
	copy({ targets: [ { src: ['src/locales/**/*', '!src/locales/**/*.min.js'], dest: 'dist/locales' }, ] }),
];

export default [
	//** "leaflet-gesture-handling.js" **//
	{
		input: input,
		output: output,
		plugins: plugins,
	},

	//** "leaflet-gesture-handling.min.js" **//
	{
		input: input,
		output: Object.assign({}, output, {
			file: "dist/" + plugin_name + ".min.js"
		}),
		plugins: plugins.concat(terser()),
	},

	//** "leaflet-gesture-handling.css" **//
	{
		input: input.replace(".js", ".css"),
		output: {
			file: "dist/" + plugin_name + ".css",
			format: 'es'
		},
		plugins: [
			postcss({
				extract: true,
				inject: false,
				minimize: false,
				plugins: [
					postcssImport({}),
					postcssCopy({
						basePath: 'node_modules',
						dest: "dist",
						template: "images/[path][name].[ext]",
					})
				]
			})
		]
	},

	//** "leaflet-gesture-handling.min.css" **//
	{
		input: input.replace(".js", ".css"),
		output: {
			file: "dist/" + plugin_name + ".min.css",
			format: 'es'
		},
		plugins: [
			postcss({
				extract: true,
				inject: false,
				minimize: true,
				plugins: [
					postcssImport({}),
					postcssCopy({
						basePath: 'node_modules',
						dest: "dist",
						template: "images/[path][name].[ext]",
					})
				]
			})
		]
	},

];
