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
<svelte:options tag="tag-name-editor" />

<script lang="ts">
    /* eslint-disable prettier/prettier */
    import { fireEvent, type HomeAssistant } from 'custom-card-helpers';

    // hack get reference to own component
    import { get_current_component } from 'svelte/internal';
    import type { ExpanderConfig } from './configtype';
    const thisComponent = get_current_component();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let config: Partial<ExpanderConfig> & Record<string, any> = {};

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

    export let hass: HomeAssistant;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    export let lovelace: any;

    const valueChanged = (): void => {
        fireEvent(thisComponent, 'config-changed', { config: config }, {
            bubbles: true,
            cancelable: false,
            composed: true // makes the event jump shadow DOM boundary
        });

    };

    // Home Assistant will call this with the config object!
    // leave export let otherwise hass wil thro errors....
    // eslint-disable-next-line svelte/no-unused-svelte-ignore
    // svelte-ignore unused-export-let
    export let setConfig = (conf = {}) => {
        config = { ...config, ...conf };
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

    let selectedTab = 0;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const onTabClicked = (ev: any) => selectedTab = ev.detail.selected;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let timeout: any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const updateCard = (key: string) => (ev: any) => {
        ev.stopPropagation();
        config[key] = ev.detail.config;
        clearTimeout(timeout as unknown as number);
        timeout = setTimeout(() => {
            fireEvent(thisComponent, 'config-changed',  {
                config: config[key]
            }, {
                bubbles: true,
                cancelable: true,
                composed: true // makes the event jump shadow DOM boundary
            });
            setTimeout(() => {
                valueChanged();
            }, 100) as unknown as number;
        }, 5000) as unknown as number;
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const passEv = (func: (ev: any) => void) => (ev: any) => {
        func(ev);
    };

    let showTitleCardPicker = false;


    let selectedChildChard = 0;
    let showAddCardPicker = false;
        /* eslint-enable prettier/prettier */
</script>

<paper-tabs scrollable selected={selectedTab} on:iron-activate={onTabClicked}>
    <paper-tab class={`${selectedTab === 0 ? 'tab-selected' : ''}`}> Layout </paper-tab>
    <paper-tab class={`${selectedTab !== 0 ? 'tab-selected' : ''}`}> Cards </paper-tab>
</paper-tabs>

{#if selectedTab === 0}
    <form class="content" on:input={valueChanged}>
        <!-- eslint-disable-next-line @typescript-eslint/no-unused-vars -->
        {#each Object.entries(configuratorElements) as [key, [type, extra]] (key)}
            {#if type === 'boolean' && (!extra?.cond || extra?.cond(config))}
                <ha-formfield label={extra?.label || key}>
                    <ha-switch
                        checked={config[key] ?? false}
                        configValue={config[key]}
                        on:input={() => {
                            config[key] = !config[key];
                        }}
                    />
                </ha-formfield>
            {/if}
            {#if type === 'string' && (!extra?.cond || extra?.cond(config))}
                <ha-textfield
                    label={extra?.label || key}
                    value={config[key] ?? ''}
                    configValue={config[key]}
                    on:input={passEv((ev) => {
                        config[key] = ev?.target?.value;
                    })}
                />
            {/if}
            {#if type === 'card' && (!extra?.cond || extra?.cond(config))}
                <div class="row">
                    <ha-textfield
                        label={extra?.label || key}
                        value={config[key]?.type ?? ''}
                        configValue={config[key]}
                        readonly={true}
                    />
                    <!-- eslint-disable-next-line svelte/no-unused-svelte-ignore -->
                    <!-- svelte-ignore a11y-click-events-have-key-events -->
                    <ha-icon-button on:click={() => (showTitleCardPicker = true)}>
                        {#if !config[key]}
                            <ha-icon icon="mdi:plus" />
                        {:else}
                            <ha-icon icon="mdi:redo" />
                        {/if}
                    </ha-icon-button>
                    {#if config[key]}
                        <!-- eslint-disable-next-line svelte/no-unused-svelte-ignore -->
                        <!-- svelte-ignore a11y-click-events-have-key-events -->
                        <ha-icon-button
                            on:click={() => {
                                config[key] = undefined;
                                valueChanged();
                            }}
                        >
                            <ha-icon icon="mdi:close" />
                        </ha-icon-button>
                    {/if}
                </div>
                {#if showTitleCardPicker}
                    <div class="sub-panel">
                        <!-- eslint-disable-next-line svelte/no-unused-svelte-ignore -->
                        <!-- svelte-ignore a11y-click-events-have-key-events -->
                        <mwc-button
                            on:click={() => {
                                showTitleCardPicker = false;
                            }}>Cancel</mwc-button
                        >
                        <hui-card-picker
                            {hass}
                            {lovelace}
                            on:config-changed={passEv((ev) => {
                                updateCard(key)(ev);
                                showTitleCardPicker = false;
                            })}
                        />
                    </div>
                {:else if config[key]}
                    <div class="sub-panel">
                        <hui-card-element-editor
                            {hass}
                            value={config[key]}
                            {lovelace}
                            on:config-changed={updateCard(key)}
                        />
                    </div>
                {/if}
            {/if}
        {/each}
    </form>
{:else}
    <form class="content" on:input={valueChanged}>
        <div class="row">
            {#if !showAddCardPicker}
                <paper-tabs
                    scrollable
                    selected={selectedChildChard}
                    on:iron-activate={passEv((ev) => {
                        selectedChildChard = ev.detail.selected;
                    })}
                >
                    {#each config.cards || [] as card, i}
                        <paper-tab>{i + 1} {void card || ''}</paper-tab>
                    {/each}
                </paper-tabs>
                <paper-tabs id="add-card" on:iron-activate={() => (showAddCardPicker = true)}>
                    <paper-tab>
                        <ha-icon icon="mdi:plus" />
                    </paper-tab>
                </paper-tabs>
            {/if}
        </div>
        {#if config?.cards?.length && !showAddCardPicker}
            <div class="sub-panel">
                <!-- eslint-disable-next-line svelte/no-unused-svelte-ignore -->
                <!-- svelte-ignore a11y-click-events-have-key-events -->
                <mwc-button
                    on:click={() => {
                        config.cards = config.cards?.filter((_, i) => i !== selectedChildChard);
                        selectedChildChard = 0;
                        valueChanged();
                    }}>Remove</mwc-button
                >
                <hui-card-element-editor
                    {hass}
                    value={config.cards[selectedChildChard]}
                    {lovelace}
                    on:config-changed={passEv((ev) => {
                        ev.stopPropagation();
                        if (config.cards) {
                            config.cards[selectedChildChard] = ev.detail.config;
                            valueChanged();
                        }
                    })}
                />
            </div>
        {/if}
        {#if showAddCardPicker}
            <div class="sub-panel">
                <!-- eslint-disable-next-line svelte/no-unused-svelte-ignore -->
                <!-- svelte-ignore a11y-click-events-have-key-events -->
                <mwc-button
                    on:click={() => {
                        showAddCardPicker = false;
                        valueChanged();
                    }}>Cancel</mwc-button
                >
                <hui-card-picker
                    {hass}
                    {lovelace}
                    on:config-changed={passEv((ev) => {
                        ev.stopPropagation();
                        if (!config.cards) {
                            config.cards = [];
                        }
                        config.cards?.push(ev.detail.config);
                        valueChanged();
                        showAddCardPicker = false;
                        selectedChildChard = config.cards.length - 1;
                    })}
                />
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
