import { Luna, u } from "@libs/types";
import { GasPrice } from "../models/gasPrice";

let cache: any = null;

export async function gasPriceQuery(
  gasPriceEndpoint: string
): Promise<GasPrice> {
  if (cache) {
    return cache;
  }

  const gasPrice = await fetch(gasPriceEndpoint).then((res) => res.json());
  cache = gasPrice;

  return gasPrice;
}
