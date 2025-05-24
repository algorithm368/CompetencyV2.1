import express, { Application } from "express";
import cors from "cors";
import { routes } from "./routes";
import { createServer, Server } from "http";
import swaggerUi from "swagger-ui-express";
import swaggerJsdoc from "swagger-jsdoc";
import { swaggerOptions } from "./swagger/swaggerOptions";
import cookieParser from "cookie-parser";

const app: Application = express();
const httpServer: Server = createServer(app);

// Middleware
app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:5174"],
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// API routes
app.use("/api", routes);

app.use("/", (req, res) => {
  res.send("Hello, world!");
});

app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err);
  const status = err.status || 500;
  const message = err.message || "Internal server error";

  res.status(status).json({ error: message });
});

// Start server
const PORT: number = Number(process.env.PORT) || 3000;
httpServer.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
