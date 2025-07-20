import cron from "node-cron";
import { updateStatus } from "../utils/updateStatus.js";

const runStatusUpdate = async () => {
  try {
    await updateStatus;
    console.log("Event statuses updated successfully.");
  } catch (error) {
    console.error("Error updating event statuses:", error.message);
  }
};

cron.schedule("*/5 * * * *", () => {
  console.log("Running scheduled event status update...");
  runStatusUpdate();
});
