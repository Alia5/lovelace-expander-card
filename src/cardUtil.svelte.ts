
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
import type { LovelaceCard, LovelaceCardConfig } from 'custom-card-helpers';

export interface CardUtil {

    createCardElement: (config: LovelaceCardConfig) => LovelaceCard;
}

let cardUtil: CardUtil|undefined = $state(undefined);
export const loadCardUtil = async (): Promise<CardUtil> => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    cardUtil = await (window as any).loadCardHelpers().then((v: any) => v);
    return cardUtil as CardUtil;
};

export const getCardUtil = () => {
    if (!cardUtil) {
        return loadCardUtil();
    }
    return cardUtil;
};

// export const cardUtil: Promise<CardUtil> = (() => ((window as any).loadCardHelpers() as Promise<any>).then((v) => v))();
