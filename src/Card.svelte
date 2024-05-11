<!--
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
-->
<svelte:options tag="expander-sub-card" />

<script lang="ts">
  import type { HomeAssistant, LovelaceCardConfig } from 'custom-card-helpers';
  import { cardUtil } from './cardUtil';

  export let type = 'div';
  export let config: LovelaceCardConfig;
  export let hass: HomeAssistant;

  let loading = true;
  const uplift = (
      node: HTMLElement,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      p: { type: string; hass: HomeAssistant }
  ) => ({
      // eslint-disable-next-line no-shadow
      update: (p: { type: string; hass: HomeAssistant }) => {
          if (node) {
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              if ((node.firstChild as any)?.tagName) {
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  (node.firstChild as any).hass = p.hass;
                  return;
              }
              void (async () => {
                  const el = (await cardUtil).createCardElement(config);
                  el.hass = p.hass;
                  node.innerHTML = '';
                  node.appendChild(el);
                  loading = false;
              })();
          }
      }
  });
</script>

<div use:uplift={{ type, hass }} />
{#if loading}
  <span style={'padding: 1em; display: block; '}> Loading... </span>
{/if}

<style>
</style>
