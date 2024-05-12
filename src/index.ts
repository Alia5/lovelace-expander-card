/*
Copyright 2021-2022 Peter Repukat - FlatspotSoftware
Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at
http://www.apache.org/licenses/LICENSE-2.0
Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/
export { default as default } from './ExpanderCard.svelte';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { cardUtil } from './cardUtil';
import { version } from "../package.json";
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

/* eslint no-console: 0 */
console.info(
    `%c  Expander-Card Version ${version}`,
    'color: orange; font-weight: bold; background: black',
    'color: white; font-weight: bold; background: dimgray',
  );

window.customCards = window.customCards || [];
window.customCards.push(...[
    {
        type: 'tag-name',
        name: 'Expander Card',
        preview: true,
        description: 'Expander card'
    }
]);
