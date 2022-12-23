
import type { LovelaceCard, LovelaceCardConfig } from 'custom-card-helpers';

export interface CardUtil {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    createCardElement: (config: LovelaceCardConfig) => LovelaceCard;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const cardUtil: Promise<CardUtil> = (() => ((window as any).loadCardHelpers() as Promise<any>).then((v) => v))();
