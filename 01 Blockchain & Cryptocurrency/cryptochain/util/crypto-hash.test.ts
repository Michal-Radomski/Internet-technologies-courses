import { describe, expect, it } from "@jest/globals";

import cryptoHash from "./crypto-hash";
import { DataI, ObjectI } from "../Interfaces";

describe("cryptoHash()", (): void => {
  it("generates a SHA-256 hashed output", (): void => {
    expect(cryptoHash("foo")).not.toEqual("2c26b46b68ffc68ff99b453c1d30413413422d706483bfa0f98a5e886266e7ae");
    expect(cryptoHash("foo")).toEqual("b2213295d564916f89a6a42455567c87c3f480fcd7a1c15e220f17d7169a790b");
  });

  it("produces the same hash with the same input arguments in any order", (): void => {
    expect(cryptoHash("one", "two", "three")).toEqual(cryptoHash("three", "one", "two"));
  });

  it("produces a unique hash when the properties have changed on an input", (): void => {
    const foo = {} as DataI;
    const originalHash: string = cryptoHash(foo);
    (foo as ObjectI)["a" as keyof ObjectI] = "a";

    expect(cryptoHash(foo)).not.toEqual(originalHash);
  });
});
