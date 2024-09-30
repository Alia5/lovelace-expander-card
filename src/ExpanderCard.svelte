
<script lang="ts" module>
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    import Editor from './ExpanderCardEditor.svelte';
    const devMode = import.meta.env.MODE === 'dev';
    export const defaults = {
        'gap': '0.6em',
        'padding': '1em',
        'clear': false,
        'clear-children': false,
        'title': 'Expander',
        'overlay-margin': '2em',
        'child-padding': '0.5em',
        'button-background': 'transparent'
    };
</script>

<!-- eslint-disable-next-line svelte/valid-compile -->
<svelte:options customElement={{
    tag: 'expander-card',
    extend: (customElementConstructor) => class extends customElementConstructor {
        // re-declare props used in customClass.
        public config!: ExpanderConfig;
        public self!: HTMLElement;

        public constructor() {
            super();
            // hack to get reference to self in component
            this.self = this;
        }

        public static getConfigElement() {
            return document.createElement(`expander-card-editor${devMode ? '-dev' : ''}`);
        };

        public static getStubConfig(){
            return { ...defaults };
        };

        public setConfig(conf = {}) {
            this.config = { ...defaults, ...conf };
        };
    }
}} />

<script lang="ts">

    // import { default as Editor } from './ExpanderCardEditor.svelte';

    import { slide } from 'svelte/transition';
    import type { HomeAssistant } from 'custom-card-helpers';
    import Card from './Card.svelte';

    import type { ExpanderConfig } from './configtype';
    import { onMount } from 'svelte';

    let expanded = $state(false);

    let isEditorMode = $state(false);
    // add fields used in customClass as props.
    const {
        hass,
        self,
        config = defaults
    }: {hass: HomeAssistant; config: ExpanderConfig; self: HTMLElement} = $props();

    onMount(() => {
        isEditorMode = (self)?.parentElement?.hasAttribute('preview') || false;
        if (isEditorMode) {
            expanded = true;
        } else {
            let configExpanded = config.expanded;
            if (config['expand-id'] !== undefined) {
                try {
                    const storageValue = localStorage.getItem(`expander-${config['expand-id']}`);
                    configExpanded = storageValue ? storageValue === 'true' : configExpanded;
                } catch (e) {
                    console.error(e);
                }
            }
            if (configExpanded !== undefined) {
                setTimeout(() => (expanded = configExpanded), 100);
            }
        }
    });
</script>

<ha-card
    class={`expander-card ${config.clear ? 'clear' : ''}`}
    style="--padding:{config.padding}; --gap:{config.gap}"
>
    {#if config['title-card']}
        <div class={`title-card-header${config['title-card-button-overlay'] ? '-overlay' : ''}`}>
            <div class="title-card-container" style="--title-padding:{config['title-card-padding']}">
                <Card
                    hass={hass}
                    config={config['title-card']}
                    type={config['title-card'].type}
                    clearChild={config['clear-children'] || false} />
            </div>
            <button
            aria-label="Toggle"
                style="--overlay-margin:{config['overlay-margin']}; --button-background:{config[
                    'button-background'
                ]};"
                class={`header ripple ${config['title-card-button-overlay'] ? 'header-overlay' : ''}`}
                onclick={() => {
                    expanded = !expanded;
                    if (config['expand-id'] !== undefined) {
                        try {
                            localStorage.setItem(`expander-${config['expand-id']}`,expanded ? 'true' : 'false');
                        }
                        catch (e) {
                            console.error(e);
                        }
                    }
                }}
            >
                <ha-icon icon="mdi:chevron-down" class={`primaryico ${expanded ? 'flipped' : ''}`} ></ha-icon>
            </button>
        </div>
    {:else}
        <button
            class="header ripple"
            onclick={() => {
                expanded = !expanded;
                if (config['expand-id'] !== undefined) {
                    try {
                        localStorage.setItem(`expander-${config['expand-id']}`,expanded ? 'true' : 'false');
                    }
                    catch (e) {
                        console.error(e);
                    }
                }
            }}
            style="--button-background:{config['button-background']};"
        >
            <div class="primary title">{config.title}</div>
            <ha-icon icon="mdi:chevron-down" class={` primaryico ${expanded ? 'flipped' : ''}`} ></ha-icon>
        </button>
    {/if}
    {#if config.cards}
        <div class="animation-wrapper" style="grid-template-rows: {expanded ? '1fr' : '0fr'};">
            <div
                style={`--gap:${config.gap}; --child-padding:${config['child-padding']};`}
                class="children-container"
            >
                {#each config.cards as card (card)}
                        <Card
                            hass={hass}
                            config={card}
                            type={card.type}
                            clearChild={config['clear-children'] || false} />
                {/each}
            </div>
        </div>
    {/if}
</ha-card>

<style>
    .expander-card {
        display: grid;
        padding: var(--padding);
        grid-template-rows: 0fr;
        transition: all 0.5s ease-in-out;
    }

    .animation-wrapper {
        display: grid;
        overflow: hidden;
        grid-template-rows: 0;
        transition: grid-template-rows 0.5s ease-in-out;
    }

    .children-container {
        padding:  var(--child-padding);
        display: grid;
        gap: var(--gap);
        transition: all 0.3s ease-in-out;
        overflow: hidden;
        & > :global(:first-child) {
            margin-top: var(--gap);
        }
    }
    .clear {
        background-color: transparent;
        border-style: none;
    }
    .clear-children {
        & :global(::slotted(ha-card)) {
            background-color: transparent !important;
            border-style: none !important;
        }
    }

    :global(::slotted(ha-card)) {
        background-color: transparent !important;
        border-style: none !important;
    }

    .title-card-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        flex-direction: row;
    }
    .title-card-header-overlay {
        display: block;
    }
    .title-card-container {
        width: 100%;
        padding: var(--title-padding);
    }
    .header {
        display: flex;
        flex-direction: row;
        align-items: center;
        padding: 0.8em 0.8em;
        margin: 2px;
        background: var(--button-background);
        border-style: none;
    }
    .header-overlay {
        position: absolute;
        top: 0;
        right: 0;
        margin: var(--overlay-margin);
    }
    .title {
        width: 100%;
        text-align: left;
    }
    .ico {
        color: var(--primary-text-color);
        transition-property: transform;
        transition-duration: 0.35s;
    }

    .flipped {
        transform: rotate(180deg);
    }

    .ripple {
        background-position: center;
        transition: background 0.8s;
        border-radius: 1em;
    }
    .ripple:hover {
        background: #ffffff12 radial-gradient(circle, transparent 1%, #ffffff12 1%) center/15000%;
    }
    .ripple:active {
        background-color: #ffffff25;
        background-size: 100%;
        transition: background 0s;
    }
</style>
