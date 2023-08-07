import express from "express";
import {
  createShed,
  saveDailyRecordByShed,
  getSheds,
  getRecordsByshed,
  eggProductionPercentageByShed,
  henMortalityPercentageByShed,
} from "../controllers/sheds";

const routes = express.Router();

/** READ */
routes.get("/sheds", getSheds); // the list of sheds and their initial data
routes.get("/records/:shedId", getRecordsByshed);
routes.get("/records/:shedId/production", eggProductionPercentageByShed); // can be used with query (?from = "date" &to="date")
routes.get("/records/:shedId/mortality", henMortalityPercentageByShed);

/** POST */
routes.post("/sheds", createShed);
routes.post("/records/:shedId", saveDailyRecordByShed);

/** UPDATE */

export default routes;
