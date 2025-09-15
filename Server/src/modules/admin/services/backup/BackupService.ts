import { exec } from "child_process";
import path from "path";
import fs from "fs";
import { promisify } from "util";

const execPromise = promisify(exec);
const unlinkPromise = promisify(fs.unlink);

export class BackupService {
  private dbHost: string;
  private dbUser: string;
  private dbPass: string;
  private backupDir: string;

  constructor(dbHost: string, dbUser: string, dbPass: string, backupDir: string = "backups") {
    this.dbHost = dbHost;
    this.dbUser = dbUser;
    this.dbPass = dbPass;
    this.backupDir = path.join(__dirname, "..", "..", "..", "..", backupDir);

    if (!fs.existsSync(this.backupDir)) {
      fs.mkdirSync(this.backupDir, { recursive: true });
    }
  }

  private async backupDatabase(dbName: string): Promise<string> {
    const timestamp = new Date().toISOString().replace(/:/g, "-");
    const filename = `${dbName}_${timestamp}.sql`;
    const filepath = path.join(this.backupDir, filename);

    const command = `mysqldump --opt -h${this.dbHost} -u${this.dbUser} -p"${this.dbPass}" ${dbName} > "${filepath}"`;

    try {
      const { stderr } = await execPromise(command);
      if (stderr) {
        console.warn(`Warning for ${dbName} backup: ${stderr}`);
      }
      console.log(`Successfully backed up ${dbName} to ${filepath}`);
      return filepath;
    } catch (error) {
      console.error(`Error backing up ${dbName}: ${error}`);
      throw new Error(`Failed to back up database ${dbName}`);
    }
  }
  /**
   * Backs up a list of specified databases.
   * @param databases An array of database names to back up.
   * @returns A Promise that resolves with an array of filepaths for the backups.
   */

  public async backupSelectedDatabases(databases: string[]): Promise<string[]> {
    const backupPromises = databases.map((dbName) => this.backupDatabase(dbName));
    return Promise.all(backupPromises);
  }
  /**
   * Deletes a specific backup file.
   * @param filename The name of the file to delete.
   */

  public async deleteBackupFile(filename: string): Promise<void> {
    const filePath = path.join(this.backupDir, filename);
    try {
      if (fs.existsSync(filePath)) {
        await unlinkPromise(filePath);
        console.log(`Successfully deleted backup file: ${filename}`);
      } else {
        console.warn(`Attempted to delete file that does not exist: ${filename}`);
      }
    } catch (error) {
      console.error(`Error deleting backup file ${filename}:`, error);
      throw new Error(`Failed to delete backup file ${filename}`);
    }
  }
}
