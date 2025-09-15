import { Request, Response, NextFunction } from "express";
import { BackupService } from "@Admin/services/backup/BackupService";
import fs from "fs";
import path from "path";
import "dotenv/config";

// Get database credentials and all possible database names from environment variables
const DB_HOST = process.env.DB_HOST as string;
const DB_USER = process.env.DB_USER as string;
const DB_PASS = process.env.DB_PASS as string;
const ALL_DATABASES = (process.env.DATABASES_TO_BACKUP || "").split(",");

// Create a single instance of the service
const backupService = new BackupService(DB_HOST, DB_USER, DB_PASS, "backups");

export class BackupController {
  /**
   * Endpoint to get the list of available databases for the frontend.
   * Method: GET /api/admin/backup/databases
   */
  static getAvailableDatabases(req: Request, res: Response) {
    if (!DB_HOST || !DB_USER || !DB_PASS) {
      return res.status(500).json({ message: "Database credentials are not configured on the server." });
    }
    res.status(200).json({ databases: ALL_DATABASES });
  }

  /**
   * Endpoint to create a backup based on user selection.
   * The list of databases is sent in the request body.
   * Method: POST /api/admin/backup
   */
  static async createBackup(req: Request, res: Response, next: NextFunction) {
    try {
      const { databases } = req.body;

      if (!databases || !Array.isArray(databases) || databases.length === 0) {
        return res.status(400).json({ message: "No databases selected for backup." });
      }

      console.log(`Starting backup for selected databases: ${databases.join(", ")}`);

      // Call the service method with the databases from the request body
      const backupFilePaths = await backupService.backupSelectedDatabases(databases);

      console.log("Database backups created successfully:", backupFilePaths);

      const backupFiles = backupFilePaths.map((filePath) => path.basename(filePath));

      // Set a timer to delete the backup files after 10 minutes if not downloaded
      backupFiles.forEach((filename) => {
        setTimeout(() => {
          backupService.deleteBackupFile(filename);
        }, 10 * 60 * 1000); // 10 minutes in milliseconds
      });

      res.status(200).json({
        message: "Database backup process completed.",
        backupFiles: backupFiles,
      });
    } catch (error) {
      console.error("Backup process error:", error);
      next(error);
    }
  }

  /**
   * Endpoint to download a specific backup file.
   * Method: GET /api/admin/backup/:filename
   */
  static async downloadBackup(req: Request, res: Response, next: NextFunction) {
    const { filename } = req.params;
    const backupDir = path.join(__dirname, "../../../../backups");
    const filePath = path.join(backupDir, filename);

    if (!filePath.startsWith(backupDir)) {
      return res.status(403).send("Forbidden");
    }

    try {
      if (fs.existsSync(filePath)) {
        res.download(filePath, (err) => {
          if (err) {
            console.error("File download error:", err);
            next(err);
          } else {
            // Clean up the file after successful download
            fs.unlink(filePath, (unlinkErr) => {
              if (unlinkErr) console.error("Error deleting file after download:", unlinkErr);
            });
          }
        });
      } else {
        res.status(404).send("File not found.");
      }
    } catch (err) {
      console.error("Unexpected download error:", err);
      next(err);
    }
  }
}
