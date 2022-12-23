
export { default as default } from './ExpanderCard.svelte';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { cardUtil } from './cardUtil';
// Make Typescript Happy!
declare global {
    interface Window {
        customCards?: {
            type: string;
            name: string;
            preview: boolean;
            description: string;
        }[];
    }
}

console.info('ExpanderCard Version: versionStr');

const devMode = 'devModeValue' as unknown as boolean;

window.customCards = window.customCards || [];
window.customCards.push(...[
    {
        type: 'tag-name',
        name: `Expander Card${devMode ? '-dev' : ''}`,
        preview: true,
        description: 'Expander card'
    }
]);
