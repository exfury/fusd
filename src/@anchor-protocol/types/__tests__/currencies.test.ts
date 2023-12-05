import { Luna, NoMicro, u } from "@anchor-protocol/types";
import { Big, BigSource } from "big.js";

describe("types/currencies", () => {
  test("type casting of nominal types", () => {
    const currency: u<Luna> = "100" as u<Luna>;

    // Can type cast to its physical type
    const str: string = currency;

    // BigSource is an union type = string | number | Big
    // Can type cast from uLuna<string> to uLuna<string | number | Big>
    const uLunaBigSource: u<Luna<BigSource>> = currency;

    // @ts-expect-error Can not type cast from uLuna<string> to Luna<string | number | Big>
    const lunaBigSource: Luna<BigSource> & NoMicro = currency;

    expect(new Set([currency, str, uLunaBigSource, lunaBigSource]).size).toBe(
      1
    );

    function fn1(amount: string) {1}

    function fn2(amount: u<Luna>) {1}

    function fn3(amount: u<Luna<BigSource>>) {1}

    function fn4(amount: u<Luna<Big>>) {1}

    function fn5(amount: Luna & NoMicro) {1}

    fn1(currency);
    fn2(currency);
    fn3(currency);
    // @ts-expect-error : Currency is not assignable to u<Luna<Big>>
    fn4(currency);
    // @ts-expect-error : Currency is not assignable to the Luna & NoMicro type, it's micro
    fn5(currency);

    const source: u<Luna<BigSource>> = "100" as u<Luna<BigSource>>;

    // @ts-expect-error : source is not castable to string 
    const str2: string = source; 

    // @ts-expect-error : source is not castable to uLuna because its associated type is string
    const uLunaString2: u<Luna> = source;

    // @ts-expect-error : source is micro
    const lunaBigSource2: Luna<BigSource> & NoMicro = source;

    expect(new Set([source, str2, uLunaString2, lunaBigSource2]).size).toBe(1);
  });
});
