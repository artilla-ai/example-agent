import { SSTConfig } from "sst";
import { Agent } from "./stacks/Agent";

export default {
  config(_input) {
    return {
      name: "artilla-example-agent",
      region: "us-west-2",
    };
  },
  stacks(app) {
    app.stack(Agent);
  },
} satisfies SSTConfig;
