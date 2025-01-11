import express from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import * as dynamoose from "dynamoose";
import {
  clerkMiddleware,
  createClerkClient,
  requireAuth,
} from "@clerk/express";
import serverless from "serverless-http";
import seed from "./seed/seedDynamodb";
// Route Imports
import courseRoutes from "./routes/courseRoutes";
import userClerkRoutes from "./routes/userClerkRoutes";
import transactionRoutes from "./routes/transactionRoutes";
import userCourseProgressRoutes from "./routes/userCourseProgressRoute";
// App Config
dotenv.config();

const app = express();

const isProduction = process.env.NODE_ENV === "production";
if (!isProduction) {
  dynamoose.aws.ddb.local();
}

export const clerkClient = createClerkClient({
  secretKey: process.env.CLERK_SECRET_KEY,
});

app.use(bodyParser.json());
app.use(cors());
app.use(helmet());
app.use(morgan("common"));
app.use(express.json());
app.use(
  helmet.crossOriginResourcePolicy({
    policy: "cross-origin",
  })
);
app.use(bodyParser.urlencoded({ extended: true }));
app.use(clerkMiddleware());
// Routes
app.get("/", (req, res) => {
  res.status(200).send("Hello World");
});
app.use("/courses", courseRoutes);
app.use("/users/clerk", requireAuth(), userClerkRoutes);
app.use("/transactions", requireAuth(), transactionRoutes);
app.use("/users/course-progress", requireAuth(), userCourseProgressRoutes);
// Server
const port = process.env.PORT || 3001;
if (!isProduction) {
  app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
  });
}

// aws production environment
const serverlessApp = serverless(app);
export const handler = async (event: any, context: any) => {
  if (event.action === "seed") {
    await seed();
    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Data seeded successfully" }),
    };
  } else {
    return serverlessApp(event, context);
  }
};
