// src/index.ts
import express, { Request, Response } from "express";
import bodyParser from "body-parser";
import cors from "cors";

const app: express.Application = express();
const port = 3000;

app.use(express.text());
app.use(bodyParser.json());
app.use(cors());
app.listen(port, () => {
  console.log(`server is listening on ${port}`);
});

app.get("/", (req: Request, res: Response): void => {
  res.send("Welcome to Manish Gandotra testing domain");
});
