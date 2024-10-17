import fs from "fs/promises";
import chalk from "chalk";

// Utility function to write LICENSE file
export const writeLicenseFile = async (filePath, content) => {
  try {
    await fs.writeFile(filePath, content, "utf8");
    console.log(chalk.greenBright("LICENSE file created successfully!"));
  } catch (error) {
    console.log(chalk.redBright("Error creating LICENSE file!"));
  }
};
