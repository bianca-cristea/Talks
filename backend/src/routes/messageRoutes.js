import {
  getUsers,
  sendMessage,
  getMessages,
} from "../controllers/messageController.js";
import express from "express";
import { authorize } from "../middleware/authorization.js";

const router = express.Router();

router.get("/users", authorize, getUsers);
router.post("/send-message/:id", authorize, sendMessage);
router.get("/get-messages/:id", authorize, getMessages);

export default router;
