import { defineCliConfig } from "sanity/cli";
import { dataset, projectId } from "./env";

export default defineCliConfig({
  api: { projectId, dataset },
  studioHost: "pierreetiennecallies",
  deployment: { appId: "n1rz09pysj8f5x2p1h24ifna", autoUpdates: true },
});
