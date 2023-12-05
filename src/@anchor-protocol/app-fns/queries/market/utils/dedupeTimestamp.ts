import { JSDateTime } from "@libs/types";
import { format } from "date-fns";

export function dedupeTimestamp<Item>(
  data: Item[],
  timestampKey: keyof Item
): Item[] {
  const dedupedData: Item[] = [];
  const indicies: Map<string, number> = new Map();

  for (const item of data) {
    const timestamp: JSDateTime = item[timestampKey] as unknown as JSDateTime;

    if (!timestamp) {
      continue;
    }

    const dateString = format(timestamp, "yyyyMMdd");
    if (indicies.has(dateString)) {
      dedupedData[indicies.get(dateString)!] = item;
    } else {
      const nextIndex = dedupedData.push(item) - 1;
      indicies.set(dateString, nextIndex);
    }
  }

  return dedupedData;
}
