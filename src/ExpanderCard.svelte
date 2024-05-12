<!-- eslint-disable-next-line svelte/valid-compile -->
<svelte:options tag="tag-name" />

<script lang="ts">
    /* eslint-disable prettier/prettier */
    import { default as Editor } from './ExpanderCardEditor.svelte';

    import { fade } from 'svelte/transition';
    import { cubicIn, cubicOut } from 'svelte/easing';
    import type { HomeAssistant } from 'custom-card-helpers';
    import Card from './Card.svelte';
    import { flip } from 'svelte/animate';
    import { quintOut } from 'svelte/easing';

    // hack get reference to own component
    import { get_current_component } from 'svelte/internal';
    import type { ExpanderConfig } from './configtype';
    import { onMount } from 'svelte';
    const thisComponent = get_current_component();

    let expanded = false;

    let isEditorMode = false;

    export let hass: HomeAssistant;

    const defaults = {
        'gap': '0.6em',
        'padding': '1em',
        'clear': false,
        'title': 'Expander',
        'overlay-margin': '2em',
        'child-padding': '0.5em',
        'button-background': 'transparent'
    };

    let config: ExpanderConfig = defaults;

    // Home Assistant will call this with the config object!
    // leave export let otherwise hass wil thro errors....
    // eslint-disable-next-line svelte/no-unused-svelte-ignore
    // svelte-ignore unused-export-let
    export let setConfig = (conf = {}) => {
        config = { ...defaults, ...conf };
    };

    onMount(() => {
        isEditorMode = (thisComponent as HTMLElement).parentElement?.localName === 'hui-card-preview';
        if (isEditorMode) {
            expanded = true;
        } else {
            if (config.expanded !== undefined) {
                setTimeout(() => (expanded = config.expanded as boolean), 100);
            }
        }
    });

    // Hack add static method to compiled Card class
    thisComponent.constructor.getConfigElement = () => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (window as any).ExpanderCardEditor = Editor;
        return document.createElement('tag-name-editor');
    };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    thisComponent.constructor.getStubConfig = () => ({
        ...defaults
    });

    /* eslint-enable prettier/prettier */
</script>

<ha-card
    class={`expander-card ${config.clear ? 'clear' : ''}`}
    style="--gap:{config.gap}; --padding:{config.padding}"
>
    {#if config['title-card']}
        <div class={`title-card-header${config['title-card-button-overlay'] ? '-overlay' : ''}`}>
            <div class="title-card-container" style="--title-padding:{config['title-card-padding']}">
                <Card {hass} config={config['title-card']} type={config['title-card'].type} />
            </div>
            <button
                style="--overlay-margin:{config['overlay-margin']}; --button-background:{config[
                    'button-background'
                ]};"
                class={`header ripple ${config['title-card-button-overlay'] ? 'header-overlay' : ''}`}
                on:click={() => {
                    expanded = !expanded;
                }}
            >
                <ha-icon icon="mdi:chevron-down" class={`primaryico ${expanded ? 'flipped' : ''}`} />
            </button>
        </div>
    {:else}
        <button
            class="header ripple"
            on:click={() => {
                expanded = !expanded;
            }}
            style="--button-background:{config['button-background']};"
        >
            <div class="primary title">{config.title}</div>
            <ha-icon icon="mdi:chevron-down" class={` primaryico ${expanded ? 'flipped' : ''}`} />
        </button>
    {/if}
    {#if config.cards && expanded}
        <div style="--gap:{config.gap}; --child-padding:{config['child-padding']}" class="children-container">
            {#each config.cards as card (card)}
                <div class="child-card" animate:flip={{ delay: 250, duration: 250, easing: quintOut }}>
                    <div
                        in:fade={{ duration: 500, easing: cubicOut }}
                        out:fade={{ duration: 250, easing: cubicIn }}
                    >
                        <Card {hass} config={card} type={card.type} />
                    </div>
                </div>
            {/each}
        </div>
    {/if}
</ha-card>

<style>
    .expander-card {
        display: grid;
        gap: var(--gap);
        padding: var(--padding);
        transition: all 0.3s ease-in-out;
    }
    .children-container {
        padding: var(--child-padding);
        display: grid;
        gap: var(--gap);
        transition: all 0.3s ease-in-out;
    }
    .clear {
        background-color: transparent;
        border-style: none;
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
