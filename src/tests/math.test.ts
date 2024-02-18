import Load from "../load.ts";

describe("Math tests", () => {
  test("Distance calculated from load", () => {
    const load1 = new Load(1, [8, 1], [4, 4]);
    expect(load1.costToExecute).toBe(5);

    const load2 = new Load(1, [4, 4], [8, 1]);
    expect(load2.costToExecute).toBe(5);

    const load3 = new Load(1, [-4, 4], [-8, 1]);
    expect(load3.costToExecute).toBe(5);
  });
});
