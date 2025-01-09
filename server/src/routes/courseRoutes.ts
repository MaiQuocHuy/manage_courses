import express from "express";

import {
  listCourses,
  getCourse,
  createCourse,
  deleteCourse,
  updateCourse,
} from "../controllers/courseController";
import { requireAuth } from "@clerk/express";
import multer from "multer";

const router = express.Router();
const upload = multer({
  storage: multer.memoryStorage(),
});

router.get("/", listCourses);
router.post("/", requireAuth(), createCourse);

router.get("/:courseId", getCourse);
router.put("/:courseId", requireAuth(), upload.single("image"), updateCourse);
router.delete("/:courseId", requireAuth(), deleteCourse);

export default router;
