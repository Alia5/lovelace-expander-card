import resolve from '@rollup/plugin-node-resolve';
import replace from "@rollup/plugin-replace";
import svelte from 'rollup-plugin-svelte';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';
import terser from '@rollup/plugin-terser';
import sveltePreprocess from "svelte-preprocess";


const production = !process.env.dev;

const MAIN_COMPONENT_NAME = "ExpanderCard";
const MAIN_COMPONENT_REGEX = /ExpanderCard\.svelte$/;
const TAG_NAME = production ? "expander-card" : "expander-card-dev";
const CONTAINER_TAG_NAME = production ? "expander-child-card" : "expander-child-card-dev";
const FILE_NAME = `${TAG_NAME}.js`;



export default (commandlineargs) => {
    console.log("commandlineargs: ", commandlineargs);
    return ({
    input: 'src/index.ts',
    output: {
        format: 'umd',
        name: MAIN_COMPONENT_NAME,
        file: `public/${FILE_NAME}`,
        sourcemap: () => {
            return !production;
        },
    },
    plugins: [
        replace({
            "tag-name": TAG_NAME,
            "container-tag-name": CONTAINER_TAG_NAME,
            "devModeValue": !production,
            "versionStr": process.env.VERSION,
            preventAssignment: true,
        }),
        svelte({
            preprocess:
                sveltePreprocess({
                    sourceMap: !production,
                }),
            compilerOptions: {
                customElement: true,
                hydratable: true,
            },
            emitCss: true
        }),
        resolve({
            browser: true,
            dedupe: ['svelte']
        }),
        commonjs(),
        typescript({
            sourceMap: !production,
            inlineSources: !production
        }),
        // If we're building for production (npm run build
        // instead of npm run dev), minify
        production && terser(),
    ],
    watch: {
        clearScreen: false,
    },
})};
