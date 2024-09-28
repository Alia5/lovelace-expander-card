<!--
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
-->
<!-- eslint-disable-next-line svelte/valid-compile -->
<svelte:options customElement={{
    tag: 'expander-card-editor',
    extend: (customElementConstructor) => class extends customElementConstructor {
        public config!: ExpanderConfig;
        public self!: HTMLElement;

        public constructor() {
            super();
            // hack to get reference to self in component
            this.self = this;
        }
        public setConfig(conf = {}) {
            this.config = { ...(this.config || {}), ...conf };
        };
    }

}} />

<script lang="ts">
    import { fireEvent, type HomeAssistant } from 'custom-card-helpers';
    import type { ExpanderConfig } from './configtype';

    const {
        hass,
        lovelace,
        self,
        config = {}
    }: {
        hass: HomeAssistant;
        lovelace: unknown;
        self: HTMLElement;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        config: Partial<ExpanderConfig> & Record<string, any>;
    } = $props();

    const configuratorElements: {
        [K in keyof Required<ExpanderConfig>]: [
            type: string,
            extra?: {
                label: string;
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                cond?: (conf: Partial<ExpanderConfig> & Record<string, any>) => boolean;
            }
        ];
    } = {
        'title': ['string', {
            label: 'Title (Not displayed if using Title-Card)'
        }],
        'clear': ['boolean', {
            label: 'Remove background'
        }],
        'expanded': ['boolean', {
            label: 'Start expanded (Always expanded in editor)'
        }],
        'expand-id': ['string', {
            label: 'LocalStorage ID'
        }],
        'button-background': ['string', {
            label: 'Button background (CSS color)'
        }],
        'gap': ['string', {
            label: 'Gap between cards'
        }],
        'padding': ['string', {
            label: 'Padding of all card content'
        }],
        'child-padding': ['string', {
            label: 'Padding of child cards'
        }],
        'title-card': ['card', {
            label: 'Title card'
        }],
        'title-card-padding': ['string', {
            label: 'Padding of title card',
            cond: (conf) => conf['title-card'] !== undefined
        }],
        'title-card-button-overlay':['boolean', {
            label: 'Expand button as overlay on title card',
            cond: (conf) => conf['title-card'] !== undefined

        }],
        'overlay-margin': ['string', {
            label: 'Margin of overlay button',
            cond: (conf) => !!conf['title-card-button-overlay']

        }],
        'cards': ['card[]']
    };

    const valueChanged = (): void => {
        fireEvent(self, 'config-changed', { config: config }, {
            bubbles: true,
            cancelable: false,
            composed: true // makes the event jump shadow DOM boundary
        });

    };

    // // eslint-disable-next-line @typescript-eslint/no-explicit-any
    // const configUpdater = (key: string, idx?: number) => (ev: any) => {
    //     if (idx) {
    //         if (!config[key][idx]) {
    //             config[key].push(ev?.target?.value);
    //         } else {
    //             config[key][idx] = ev?.target?.value;
    //         }
    //     } else {
    //         config[key] = ev?.target?.value;
    //     }
    // };

    let selectedTab = $state(0);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const onTabClicked = (ev: any) => selectedTab = ev.detail.selected;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let timeout: any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const updateCard = (key: string) => (ev: any) => {
        ev.stopPropagation();
        config[key] = ev.detail.config;
        // clearTimeout(timeout as unknown as number);
        // timeout = setTimeout(() => {
        //     fireEvent(self, 'config-changed',  {
        //         config: config[key]
        //     }, {
        //         bubbles: true,
        //         cancelable: true,
        //         composed: true // makes the event jump shadow DOM boundary
        //     });
        //     setTimeout(() => {
        //         valueChanged();
        //     }, 100) as unknown as number;
        // }, 5000) as unknown as number;
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const passEv = (func: (ev: any) => void) => (ev: any) => {
        func(ev);
    };

    let showTitleCardPicker = $state(false);


    let selectedChildChard = $state(0);
    let showAddCardPicker = $state(false);

    let cardPicker: HTMLElement|undefined = $state(undefined);

    $effect(() => {
        // hack assign lovelace for this shit to work by hand
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        if (cardPicker && (!cardPicker as any).lovelace) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (cardPicker as any).lovelace = lovelace;
        }
    });

</script>

<paper-tabs scrollable selected={selectedTab} oniron-activate={onTabClicked}>
    <paper-tab class={`${selectedTab === 0 ? 'tab-selected' : ''}`}> Layout </paper-tab>
    <paper-tab class={`${selectedTab !== 0 ? 'tab-selected' : ''}`}> Cards </paper-tab>
</paper-tabs>

{#if selectedTab === 0}
    <form class="content" oninput={valueChanged}>
        <!-- eslint-disable-next-line @typescript-eslint/no-unused-vars -->
        {#each Object.entries(configuratorElements) as [key, [type, extra]] (key)}
            {#if type === 'boolean' && (!extra?.cond || extra?.cond(config))}
                <ha-formfield label={extra?.label || key}>
                    <ha-switch
                        checked={config[key] ?? false}
                        configValue={config[key]}
                        oninput={() => {
                            config[key] = !config[key];
                        }}
                    ></ha-switch>
                </ha-formfield>
            {/if}
            {#if type === 'string' && (!extra?.cond || extra?.cond(config))}
                <ha-textfield
                    label={extra?.label || key}
                    value={config[key] ?? ''}
                    configValue={config[key]}
                    oninput={passEv((ev) => {
                        config[key] = ev?.target?.value;
                    })}
                ></ha-textfield>
            {/if}
            {#if type === 'card' && (!extra?.cond || extra?.cond(config))}
                <div class="row">
                    <ha-textfield
                        label={extra?.label || key}
                        value={config[key]?.type ?? ''}
                        configValue={config[key]}
                        readonly={true}
                    ></ha-textfield>

                    <!-- svelte-ignore a11y_click_events_have_key_events -->
                    <ha-icon-button onclick={() => (showTitleCardPicker = true)} role="button" tabindex="0">
                        {#if !config[key]}
                            <ha-icon icon="mdi:plus" ></ha-icon>
                        {:else}
                            <ha-icon icon="mdi:redo" ></ha-icon>
                        {/if}
                    </ha-icon-button>
                    {#if config[key]}

                        <!-- svelte-ignore a11y_click_events_have_key_events -->
                        <ha-icon-button role="button" tabindex="0"
                            onclick={() => {
                                config[key] = undefined;
                                valueChanged();
                            }}
                        >
                            <ha-icon icon="mdi:close" ></ha-icon>
                        </ha-icon-button>
                    {/if}
                </div>
                {#if showTitleCardPicker}
                    <div class="sub-panel">

                        <!-- svelte-ignore a11y_click_events_have_key_events -->
                        <mwc-button role="button" tabindex="0"
                            onclick={() => {
                                showTitleCardPicker = false;
                            }}>Cancel</mwc-button
                        >
                        <hui-card-picker
                            hass={hass}
                            lovelace={lovelace}
                            bind:this={cardPicker}
                            onconfig-changed={passEv((ev) => {
                                console.log('cardpicker-config-changed');
                                updateCard(key)(ev);
                                showTitleCardPicker = false;
                            })}
                        ></hui-card-picker>
                    </div>
                {:else if config[key]}
                    <div class="sub-panel">
                        <hui-card-element-editor
                            hass={hass}
                            lovelace={lovelace}
                            value={config[key]}
                            onconfig-changed={updateCard(key)}
                        ></hui-card-element-editor>
                    </div>
                {/if}
            {/if}
        {/each}
    </form>
{:else}
    <form class="content" oninput={valueChanged}>
        <div class="row">
            {#if !showAddCardPicker}
                <paper-tabs
                    scrollable
                    selected={selectedChildChard}
                    oniron-activate={passEv((ev) => {
                        selectedChildChard = ev.detail.selected;
                    })}
                >
                     <!--  eslint-disable-next-line @typescript-eslint/no-unused-vars -->
                    {#each config.cards || [] as card, i}
                        <paper-tab>{i + 1} {''}</paper-tab>
                    {/each}
                </paper-tabs>
                <paper-tabs id="add-card" oniron-activate={() => (showAddCardPicker = true)}>
                    <paper-tab>
                        <ha-icon icon="mdi:plus" ></ha-icon>
                    </paper-tab>
                </paper-tabs>
            {/if}
        </div>
        {#if config?.cards?.length && !showAddCardPicker}
            <div class="sub-panel">
                <!-- svelte-ignore a11y_click_events_have_key_events -->
                <mwc-button
                role="button" tabindex="0"
                    onclick={() => {
                        config.cards = config.cards?.filter((_, i) => i !== selectedChildChard);
                        selectedChildChard = 0;
                        valueChanged();
                    }}>Remove</mwc-button
                >
                <hui-card-element-editor
                    hass={hass}
                    lovelace={lovelace}
                    value={config.cards[selectedChildChard]}
                    onconfig-changed={passEv((ev) => {
                        ev.stopPropagation();
                        if (config.cards) {
                            config.cards[selectedChildChard] = ev.detail.config;
                            valueChanged();
                        }
                    })}
                ></hui-card-element-editor>
            </div>
        {/if}
        {#if showAddCardPicker}
            <div class="sub-panel">
                <!-- svelte-ignore a11y_click_events_have_key_events -->
                <mwc-button
                role="button" tabindex="0"
                    onclick={() => {
                        showAddCardPicker = false;
                        valueChanged();
                    }}>Cancel</mwc-button
                >
                <hui-card-picker
                    hass={hass}
                    lovelace={lovelace}
                    bind:this={cardPicker}
                    onconfig-changed={passEv((ev) => {
                        console.log('cardpicker-config-changed');
                        ev.stopPropagation();
                        if (!config.cards) {
                            config.cards = [];
                        }
                        config.cards?.push(ev.detail.config);
                        valueChanged();
                        showAddCardPicker = false;
                        selectedChildChard = config.cards.length - 1;
                    })}
                ></hui-card-picker>
            </div>
        {/if}
    </form>
{/if}

<style>
    .content {
        display: grid;
        gap: 1em;
        width: 100%;
    }
    ha-textfield {
        width: 100%;
    }
    paper-tabs {
        width: 100%;
        padding-bottom: 0.5em;
    }

    .row {
        display: flex;
        flex-direction: row;
        align-items: center;
    }

    .tab-selected {
        border-bottom: solid;
        background: #72727215;
    }

    .sub-panel {
        border: 1px solid;
        border-radius: 1em;
        padding: 1em;
    }
    .mwc-button {
        margin: 1em;
    }

    #add-card {
        width: fit-content;
    }
</style>
