<!-- eslint-disable-next-line svelte/valid-compile -->
<svelte:options tag="tag-name" />

<script lang="ts">
    /* eslint-disable prettier/prettier */
    import { default as Editor } from './ExpanderCardEditor.svelte';

    import type { HomeAssistant } from 'custom-card-helpers';
    import Card from './Card.svelte';
    import collapse from 'svelte-collapse';

    // hack get reference to own component
    import { get_current_component } from 'svelte/internal';
    import type { ExpanderConfig } from './configtype';
    import { onMount } from 'svelte';
    const thisComponent = get_current_component();

    let open = false;

    let isEditorMode = false;

    export let hass: HomeAssistant;

    const defaults = {
        'gap': '0.0em',
        'expanded-gap': '0.6em',
        'padding': '1em',
        'clear': false,
        'title': " ",
        'overlay-margin': '0.0em',
        'child-padding': '0.0em',
        'child-margin-top': '0.0em',
        'button-background': 'transparent',
        'expander-card-background': 'var(--ha-card-background,var(--card-background-color,#fff))',
        'header-color': 'var(--primary-text-color,#fff)',
        'arrow-color': 'var(--arrow-color,var(--primary-text-color,#fff))',
        'expander-card-display': 'block',
        'title-card-clickable': false
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
            open = true;
        } else {
            if (config.expanded !== undefined) {
                setTimeout(() => (open = config.expanded as boolean), 100);
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


    let element: HTMLElement;

    onMount(() => {
        if (config['title-card-clickable']) {
            if(element.tagName === 'DIV') {
                element.addEventListener('click', () => {
                open = !open;
            });
            }
        }else{
            element.addEventListener('click', () => {
                open = !open;
            });
        }
    });
</script>

<ha-card
    class={`expander-card ${config.clear ? 'clear' : ''}`}
    style="--expander-card-display:{config['expander-card-display']}; --gap:{open ? config['expanded-gap'] : config.gap}; --padding:{config.padding}; --expander-card-background:{config['expander-card-background']}"
>
    {#if config['title-card']}
        <div class={`title-card-header${config['title-card-button-overlay'] ? '-overlay' : ''}`} bind:this={element}>
            <div class="title-card-container" style="--title-padding:{config['title-card-padding']}">
                <Card {hass} config={config['title-card']} type={config['title-card'].type} />
            </div>
            <button
                style="--overlay-margin:{config['overlay-margin']}; --button-background:{config[
                    'button-background'
                ]}; --header-color:{config['header-color']};"
                class={`header ripple ${config['title-card-button-overlay'] ? 'header-overlay' : ''}`}
                on:click={() => {
                    open = !open;
                }}
            >
                <ha-icon style="--arrow-color:{config['arrow-color']}" icon="mdi:chevron-down" class={`ico ${open ? 'flipped' : ''}`} />
            </button>
        </div>
    {:else}
        <button
            class="header ripple"
            on:click={() => {
                open = !open;
            }}
            style="--header-width:100%; --button-background:{config['button-background']};--header-color:{config['header-color']};"
        >
            <div class="primary title">{config.title}</div>
            <ha-icon style="--arrow-color:{config['arrow-color']}" icon="mdi:chevron-down" class={`ico ${open ? 'flipped' : ''}`} />
        </button>
    {/if}
    {#if config.cards}
        <div
            style="--expander-card-display:{config['expander-card-display']}; --gap:{open ? config['expanded-gap'] : config.gap}; --child-padding:{config[
                'child-padding'
            ]}"
            class="children-container"
            use:collapse={{ open }}
        >
            {#each config.cards as card (card)}
                <Card {hass} config={card} type={card.type} marginTop={config['child-margin-top']}/>
            {/each}
        </div>
    {/if}
</ha-card>

<style>
    .expander-card {
        display: var(--expander-card-display,block);
        gap: var(--gap);
        padding: var(--padding);
        background: var(--expander-card-background,#fff) !important;
    }
    .children-container {
        padding: var(--child-padding);
        display: var(--expander-card-display,block);
        gap: var(--gap);
    }
    .clear {
        background: none !important;
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
        width: var(--header-width,auto);
        color: var(--header-color,#fff);
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
        color: var(--arrow-color,#fff);
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
