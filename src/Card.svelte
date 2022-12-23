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
