// Single source of truth — Alfred met à jour cette constante manuellement quand un palier est franchi
export const CURRENT_BUILDER_COUNT = 247;

const TIER_SIZE = 100;
const BASE_PRICE = 27;
const PRICE_INCREMENT = 10;

export function getCurrentTier(count: number = CURRENT_BUILDER_COUNT) {
  const tierIndex = Math.floor(count / TIER_SIZE);
  const currentPrice = BASE_PRICE + tierIndex * PRICE_INCREMENT;
  const nextPrice = currentPrice + PRICE_INCREMENT;
  const tierStart = tierIndex * TIER_SIZE;
  const tierEnd = (tierIndex + 1) * TIER_SIZE;
  const placesLeft = tierEnd - count;
  const placesTaken = count - tierStart;
  const progressPct = (placesTaken / TIER_SIZE) * 100;

  return {
    tierIndex,
    currentPrice,
    nextPrice,
    tierStart,
    tierEnd,
    placesLeft,
    placesTaken,
    progressPct,
    builderCount: count,
  };
}

const tier = getCurrentTier();

export const BLUEPRINT_PRICE = tier.currentPrice;
export const BLUEPRINT_PRICE_CENTS = BLUEPRINT_PRICE * 100;
export const BLUEPRINT_NEXT_PRICE = tier.nextPrice;
export const STRIKETHROUGH_PRICE = 297;

// Order Bumps fixes — non liés aux paliers
export const CLAUDE_OS_BUMP_PRICE = 37;
export const ACQUISITION_BUMP_PRICE = 27;

// Funnel Claude — Blueprint en OB, prix fixe indépendant des paliers
export const CLAUDE_FUNNEL_BLUEPRINT_PRICE = 27;
