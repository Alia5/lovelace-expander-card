import type { LovelaceCardConfig } from 'custom-card-helpers';

export interface ExpanderConfig {
    clear?: boolean;
    cards?: { type: string }[];
    gap: string;
    padding: string;
    title: string;
    'title-card'?: LovelaceCardConfig;
    'title-card-padding'?: string;
    'title-card-button-overlay'?: false;
    'overlay-margin'?: string;
    'child-padding'?: string;
    expanded?: boolean;
    'button-background': string;
}
