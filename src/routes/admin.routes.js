import { Router } from "express";
import {
  createEvent,
  getAdminList,
  getDetails,
} from "../controllers/admin.controller.js";

const router = Router();

router.get("/congress/details", getDetails);

router.get("/admin/list", getAdminList);

router.post("/admin/create-event", createEvent);

export default router;
