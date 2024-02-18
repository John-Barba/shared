export type Point = [number, number];

// create a Point from a string, where the string is like
// (-9.100071078494038,-48.89301103772511)
export function parsePoint(inData: string): Point | null {
  if (!inData.startsWith("(") || !inData.endsWith(")")) {
    console.error("Bad format for point");
    return null;
  }
  const values = inData.slice(1, -1).split(",");

  const xVal = parseFloat(values[0]);
  if (isNaN(xVal)) {
    console.error("Unable to parse x value for Point");
    return null;
  }

  const yVal = parseFloat(values[1]);
  if (isNaN(yVal)) {
    console.error("Unable to parse y value for Point");
    return null;
  }

  return [xVal, yVal];
}
