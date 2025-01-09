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
// Route Imports
import courseRoutes from "./routes/courseRoutes";
import userClerkRoutes from "./routes/userClerkRoutes";
import transactionRoutes from "./routes/transactionRoutes";
// App Config
dotenv.config();

const app = express();

const isProduction = process.env.NODE_ENV === "production";
if (!isProduction) {
  dynamoose.aws.ddb.local("http://localhost:8000");
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

// Server
const port = process.env.PORT || 3001;
if (!isProduction) {
  app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
  });
}
