/* eslint-disable no-console */
import { svelte } from '@sveltejs/vite-plugin-svelte';
import { defineConfig } from 'vite';
import { replaceCodePlugin } from "vite-plugin-replace";



export default defineConfig({
    plugins: [
        replaceCodePlugin({
            replacements: process.env.DEV ? [
                {
                    from: '"expander-card-editor"',
                    to: '"expander-card-editor-dev"'
                },
                {
                    from: '"expander-card"',
                    to: '"expander-card-dev"'
                },
                {
                    from: '"expander-sub-card"',
                    to: '"expander-sub-card-dev"'
                }
            ] : [
            ],
        }),
        svelte(),
    ],
    build: {
        lib: {
            entry: 'src/index.ts',
            name: 'lovelace-expander-card.js',
        }
    }
});

process
    .on('unhandledRejection', (reason, p) => {
        console.error(reason, 'Unhandled Rejection at Promise', p);
        process.exit(1);
    })
    .on('uncaughtException', (err) => {
        console.error(err, 'Uncaught Exception thrown');
        process.exit(1);
    });
