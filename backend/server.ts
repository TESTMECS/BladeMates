import express from "express";

const app = express();
//Setup Routes, Middleware...
app.get("/", (_: express.Request, res: express.Response) => {
  res.send("Hello World! This is a simple Express server. Another one");
});

export default app;
