import { Point, parsePoint } from "./point.ts";

// represents a unit of work.  cargo needs to be moved from the pickup point to the dropoff point
export default class Load {
  id: number;
  pickup: Point;
  dropoff: Point;
  readonly costToExecute: number; // distance from start to end
  readonly costToStart: number; // distance from depot to start
  readonly costFromEnd: number; // distance from end to depot
  assigned: boolean;

  public constructor(id: number, pickup: Point, dropoff: Point) {
    this.id = id;
    this.pickup = pickup;
    this.dropoff = dropoff;
    this.assigned = false;
    this.costToExecute = Math.sqrt(
      (pickup[0] - dropoff[0]) ** 2 + (pickup[1] - dropoff[1]) ** 2
    );
    this.costToStart = Math.sqrt(pickup[0] ** 2 + pickup[1] ** 2);
    this.costFromEnd = Math.sqrt(dropoff[0] ** 2 + dropoff[1] ** 2);
  }

  // takes a line and returns a Load object from it
  // loadNumber pickup dropoff
  // ex input: 117 (6.675053857348449,-3.690487305469242) (95.56382562156371,-113.90654034983525)
  public static createFromString(line: string): Load | null {
    const params = line.split(" ");
    if (params.length != 3) {
      console.error(`Line does not contain 3 tokens`);
      return null;
    }

    const loadNumber = parseInt(params[0], 10);
    if (isNaN(loadNumber)) {
      console.error("Unable to parse loadNumber");
    }

    const pickup = parsePoint(params[1]);
    if (!pickup) {
      console.error("Unable to parse pickup point");
      return null;
    }

    const dropoff = parsePoint(params[2]);
    if (!dropoff) {
      console.error("Unable to parse dropoff point");
      return null;
    }

    const load = new Load(loadNumber, pickup, dropoff);
    return load;
  }
}
