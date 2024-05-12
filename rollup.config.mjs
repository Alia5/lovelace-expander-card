import resolve from '@rollup/plugin-node-resolve';
import replace from '@rollup/plugin-replace';
import svelte from 'rollup-plugin-svelte';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';
import terser from '@rollup/plugin-terser';
import sveltePreprocess from 'svelte-preprocess';
import json from "@rollup/plugin-json";

const production = !process.env.ROLLUP_WATCH;

const MAIN_COMPONENT_NAME = 'ExpanderCard';
const TAG_NAME = production ? 'expander-card' : 'expander-card-dev';
const CONTAINER_TAG_NAME = production ? 'expander-child-card' : 'expander-child-card-dev';
const FILE_NAME = `${TAG_NAME}.js`;


export default (commandlineargs) => {
    console.log('commandlineargs: ', commandlineargs);
    return ({
        input: 'src/index.ts',
        output: {
            sourcemap: true,
            format: 'umd',
            name: MAIN_COMPONENT_NAME,
            file: `public/${FILE_NAME}`
        },
        plugins: [
            replace({
                'tag-name': TAG_NAME,
                'container-tag-name': CONTAINER_TAG_NAME,
                'preventAssignment': true
            }),
            svelte({
                preprocess:
                sveltePreprocess({
                    sourceMap: true
                }),
                compilerOptions: {
                    customElement: true,
                    hydratable: true,
                    dev: true,

                },
                emitCss: true
            }),
            resolve({
                browser: true,
                dedupe: ['svelte']
            }),
            commonjs(),
            json(),
            typescript({
                sourceMap: true,
                inlineSources: !production
            }),
            production && terser()
        ],
        watch: {
            clearScreen: false
        }
    }); };
