import type {Campaign} from '@/content/schema';

function monthDayValue({month, day}: {month: number; day: number}): number {
  return month * 100 + day;
}

/**
 * True when `date` falls inside a campaign's recurring month/day window.
 * A window where `end` sorts before `start` (e.g. Dec 26 -> Jan 15) wraps
 * across New Year's, so it's checked as two open ends instead of one range.
 */
export function isCampaignActive(campaign: Campaign, date: Date): boolean {
  const today = monthDayValue({month: date.getMonth() + 1, day: date.getDate()});
  const start = monthDayValue(campaign.start);
  const end = monthDayValue(campaign.end);

  if (start <= end) return today >= start && today <= end;
  return today >= start || today <= end;
}

/**
 * The campaign whose window contains `date`, or null when none is active.
 * When windows overlap, the first match in `campaigns` order wins — keep
 * the list free of overlapping windows to avoid relying on that order.
 */
export function getActiveCampaign(campaigns: Campaign[], date: Date = new Date()): Campaign | null {
  return campaigns.find((campaign) => isCampaignActive(campaign, date)) ?? null;
}
