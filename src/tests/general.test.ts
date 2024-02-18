import Load from "../load.ts";

describe("Math tests", () => {
  test("Load creation from string", () => {
    const load = Load.createFromString(
      "165 (-146.00857587448388,-26.079327004698502) (-280.35693899331966,-71.09447958190162)"
    );
    expect(load).toBeDefined();
    expect(load?.id).toBe(165);
    expect(load?.pickup[0]).toBe(-146.00857587448388);
    expect(load?.pickup[1]).toBe(-26.079327004698502);
    expect(load?.dropoff[0]).toBe(-280.35693899331966);
    expect(load?.dropoff[1]).toBe(-71.09447958190162);
    expect(load?.costToStart).toBeCloseTo(148.31937, 6);
    expect(load?.costToExecute).toBeCloseTo(141.6892608, 6);
    expect(load?.costFromEnd).toBeCloseTo(289.2307699, 6);
  });
});
