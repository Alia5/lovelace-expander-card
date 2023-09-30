import resolve from '@rollup/plugin-node-resolve';
import replace from "@rollup/plugin-replace";
import svelte from 'rollup-plugin-svelte';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';
import terser from '@rollup/plugin-terser';
import sveltePreprocess from "svelte-preprocess";


const dev = process.env.ROLLUP_WATCH;

const MAIN_COMPONENT_NAME = "ExpanderCard";
const MAIN_COMPONENT_REGEX = /ExpanderCard\.svelte$/;
const TAG_NAME = dev ? "expander-card-dev" : "expander-card";
const CONTAINER_TAG_NAME = dev ? "expander-child-card-dev" : "expander-child-card";
const FILE_NAME = `${TAG_NAME}.js`;



export default (commandlineargs) => {
    console.log("commandlineargs: ", commandlineargs);
    return ({
    input: 'src/index.ts',
    output: {
        format: 'umd',
        sourcemap: true,
        name: MAIN_COMPONENT_NAME,
        file: `public/${FILE_NAME}`,
    },
    onwarn(warning, warn) {
      if (warning.code === 'THIS_IS_UNDEFINED') return;
      warn(warning);
    },
    plugins: [
        replace({
            "tag-name": TAG_NAME,
            "container-tag-name": CONTAINER_TAG_NAME,
            "versionStr": process.env.VERSION,
            preventAssignment: true,
        }),
        svelte({
            preprocess:
                sveltePreprocess({
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
        typescript({ sourceMap: true }),
        !dev && terser({ format: { comments: false } }),
    ],
    watch: {
        clearScreen: false,
    },
})};
