import Load from "./load.ts";
import { MAX_DRIVER_COST } from "./constants.ts";

export default function algoNextClosest(
  loads: Array<Load>
): Array<Array<number>> {
  const drivers: Array<Array<number>> = [];
  let loadsRemaining = loads.length;
  let currentDriver: Array<number> | null = null;
  let driveCostRemaining: number = 0;

  while (loadsRemaining) {
    if (!currentDriver) {
      currentDriver = [];
      drivers.push(currentDriver);
      driveCostRemaining = MAX_DRIVER_COST;
    }

    // find the load with the closest pickup that hasn't been assigned
    let currentLoad = loads.reduce((acc: Load, cur: Load, idx: number) => {
      if (cur.assigned) {
        // skip loads that are already assigned
        return acc;
      }
      if (acc.assigned) {
        // handle case where the first element has been assigned
        return cur;
      } else {
        return cur.costToStart < acc.costToStart ? cur : acc;
      }
    });

    // assign the chosen load to the current driver
    currentLoad.assigned = true;
    loadsRemaining--;
    driveCostRemaining -= currentLoad.costToStart;
    driveCostRemaining -= currentLoad.costToExecute;
    currentDriver.push(currentLoad.id);

    // add loads until this driver runs out of cost
    while (loadsRemaining) {
      // search only those loads that we have enough remaining cost to complete
      // find the one that has the lowest cost to their pickup point
      let nextLoad: Load | undefined;
      let nextStartCost = Number.MAX_VALUE;
      loads.forEach((element: Load) => {
        if (element.assigned) {
          return;
        }
        let cost = element.costToExecute + element.costFromEnd;
        if (cost > driveCostRemaining) {
          return;
        }
        // opt: put off doing math as long as possible
        const costToStart = Math.sqrt(
          (currentLoad.dropoff[0] - element.pickup[0]) ** 2 +
            (currentLoad.dropoff[1] - element.pickup[1]) ** 2
        );
        cost += costToStart;
        if (cost > driveCostRemaining) {
          return;
        }
        if (costToStart < nextStartCost) {
          nextLoad = element;
          nextStartCost = costToStart;
        }
      });

      if (nextLoad) {
        // assign the next load to the current driver
        nextLoad.assigned = true;
        loadsRemaining--;
        driveCostRemaining -= nextStartCost;
        driveCostRemaining -= nextLoad.costToExecute;
        currentDriver.push(nextLoad.id);
        currentLoad = nextLoad;
      } else {
        // if no loads are acceptable, then close out this driver
        currentDriver = null;
        break;
      }
    }
  }

  return drivers;
}
