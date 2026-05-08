import 'dotenv/config'
import express from "express";
import cors from "cors";
import { clerkMiddleware } from "@clerk/express";
import { serve } from "inngest/express";

import { inngest, functions } from "./inngest/index.js";

const app = express();

app.use(express.json());
app.use(cors());

/* INNGEST PRIMEIRO */
app.use(
  "/api/inngest",
  serve({
    client: inngest,
    functions,
  })
);

/* CLERK DEPOIS */
app.use(clerkMiddleware());

app.get("/", (req, res) => {
  res.send("Servidor Online");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Servidor online na porta ${PORT}`);
});