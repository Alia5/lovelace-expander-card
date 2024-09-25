<!-- eslint-disable-next-line svelte/valid-compile -->
<svelte:options
customElement={{
    tag: 'tag-name',
    extend: (customElementConstructor) => class extends customElementConstructor {
        // eslint-disable-next-line no-shadow,@typescript-eslint/explicit-member-accessibility
        setConfig(config) {
            const defaults = {
                'gap': '0.0em',
                'expanded-gap': '0.6em',
                'padding': '1em',
                'clear': false,
                'title': ' ',
                'overlay-margin': '0.0em',
                'child-padding': '0.0em',
                'child-margin-top': '0.0em',
                'button-background': 'transparent',
                'expander-card-background': 'var(--ha-card-background,var(--card-background-color,#fff))',
                'header-color': 'var(--primary-text-color,#fff)',
                'arrow-color': 'var(--arrow-color,var(--primary-text-color,#fff))',
                'expander-card-display': 'block',
                'title-card-clickable': false,
                'min-width-expanded': 0,
                'max-width-expanded': 0
            };
            this.config = { defaults, ...config };
            // Add the function here, not below in the component so that
            // it's always available, not just when the inner Svelte component
            // is mounted
            // see ticket https://github.com/sveltejs/svelte/issues/8954
        }
    }
}}
/>

<script lang="ts">
    import type { HomeAssistant } from 'custom-card-helpers';
    import Card from './Card.svelte';
    import collapse from 'svelte-collapse';
    import { onMount } from 'svelte';

    let open = false;

    let isListenerAdded = false;

    // fix for #199
    // eslint-disable-next-line no-undef-init
    export let hass: HomeAssistant | undefined = undefined;
    export let config;

    onMount(() => {
        const minWidthExpanded = config['min-width-expanded'];
        const maxWidthExpanded = config['max-width-expanded'];
        const offsetWidth = document.body.offsetWidth;

        if (minWidthExpanded && maxWidthExpanded) {
            config.expanded = offsetWidth >= minWidthExpanded && offsetWidth <= maxWidthExpanded;
        } else if (minWidthExpanded) {
            config.expanded = offsetWidth >= minWidthExpanded;
        } else if (maxWidthExpanded) {
            config.expanded = offsetWidth <= maxWidthExpanded;
        }

        if (config.expanded !== undefined) {
            setTimeout(() => (open = config.expanded as boolean), 100);
        }
    });


    let element: HTMLElement;
    let touchPreventClick = false;
    onMount(() => {
        if(isListenerAdded) {
            return;
        }
        if (config['title-card-clickable']) {
            if (element.parentElement) {
                isListenerAdded = true;
                element.parentElement.addEventListener('click', (event) => {
                    if (touchPreventClick) {
                        event.preventDefault();
                        event.stopImmediatePropagation();
                        touchPreventClick = false;
                        return false;
                    }
                    open = !open;
                });
            }
            return;
        }
        if (element.tagName === 'BUTTON') {
            isListenerAdded = true;
            element.addEventListener('click', (event) => {
                if (touchPreventClick) {
                    event.preventDefault();
                    event.stopImmediatePropagation();
                    touchPreventClick = false;
                    return false;
                }
                open = !open;
            });
        }
    });

    let touchElement: HTMLElement | undefined;
    let isScrolling = false;
    let startX = 0;
    let startY = 0;
    const touchStart = (event: TouchEvent) => {
        touchElement = event.target as HTMLElement;
        startX = event.touches[0].clientX;
        startY = event.touches[0].clientY;
        isScrolling = false;
    };

    const touchMove = (event: TouchEvent) => {
        const currentX = event.touches[0].clientX;
        const currentY = event.touches[0].clientY;
        if (Math.abs(currentX - startX) > 10 || Math.abs(currentY - startY) > 10) {
            isScrolling = true;
        }
    };

    const touchEnd = (event: TouchEvent) => {
        if (!isScrolling && touchElement === event.target && config['title-card-clickable']) {
            open = !open;
        }
        touchElement = undefined;
        touchPreventClick = true;
        setTimeout(() => touchPreventClick = false, 300);
    };
</script>

<ha-card
    class={`expander-card${config.clear ? ' clear' : ''}${open ? ' open' : ' close'}`}
    style="--expander-card-display:{config['expander-card-display']};
     --gap:{open ? config['expanded-gap'] : config.gap}; --padding:{config.padding};
     --expander-state:{open};
     --card-background:{open && config['expander-card-background-expanded'] ? config['expander-card-background-expanded']: config['expander-card-background']}">
    {#if config['title-card']}
        <div id='id1' class={`title-card-header${config['title-card-button-overlay'] ? '-overlay' : ''}`}>
            <div id='id2' class="title-card-container" style="--title-padding:{config['title-card-padding']}" on:touchstart|passive={touchStart} on:touchmove|passive={touchMove} on:touchend={touchEnd}>
                <Card {hass} config={config['title-card']} type={config['title-card'].type} />
            </div>
            <button bind:this={element}
                style="--overlay-margin:{config['overlay-margin']}; --button-background:{config[
                    'button-background'
                ]}; --header-color:{config['header-color']};"
                class={`header ripple${config['title-card-button-overlay'] ? ' header-overlay' : ''}${open ? ' open' : ' close'}`}
            >
                <ha-icon style="--arrow-color:{config['arrow-color']}" icon="mdi:chevron-down" class={`ico${open ? ' flipped open' : 'close'}`} />
            </button>
        </div>
    {:else}
        <button
            bind:this={element}
            class={`header${config['expander-card-background-expanded'] ? '' : ' ripple'}${open ? ' open' : ' close'}`}
            style="--header-width:100%; --button-background:{config['button-background']};--header-color:{config['header-color']};"
        >
            <div class={`primary title${open ? ' open' : ' close'}`}>{config.title}</div>
            <ha-icon style="--arrow-color:{config['arrow-color']}" icon="mdi:chevron-down" class={`ico${open ? ' flipped open' : ' close'}`} />
        </button>
    {/if}
    {#if config.cards}
        <div
            style="--expander-card-display:{config['expander-card-display']};
             --gap:{open ? config['expanded-gap'] : config.gap}; --child-padding:{config['child-padding']}"
            class="children-container"
            use:collapse={{ open, duration: 0.2, easing: 'ease' }}
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
        background: var(--card-background,#fff);
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
        color: var(--arrow-color,var(--primary-text-color,#fff));
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
