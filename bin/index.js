#!/usr/bin/env node

import { program } from "commander";
import chalk from "chalk";
import inquirer from "inquirer";
import figlet from "figlet";
import { writeLicenseFile } from "../utils/file.js";
import {
  generateMITLicense,
  generateApacheLicense,
  LICENSES,
} from "../templates/licenses.js";
import path from "path";
import { z } from "zod";

// Define Zod schemas for validation
const nameSchema = z.string().min(1, { message: "Name cannot be empty." });
const yearSchema = z
  .string()
  .regex(/^\d{4}$/, { message: "Year must be a 4-digit number." });
const choiceSchema = z.enum([LICENSES.MIT, LICENSES.APACHE]);

program.version("1.0.0").description("My Node CLI");

program.action(() => {
  console.log(
    chalk.greenBright(figlet.textSync("Celing", { horizontalLayout: "full" }))
  );

  inquirer
    .prompt([
      {
        type: "input",
        name: "name",
        message: "What is your name?",
      },
      {
        type: "list",
        name: "choice",
        message: "Choose an option:",
        choices: [LICENSES.MIT, LICENSES.APACHE],
      },
      {
        type: "input",
        name: "year",
        message: "Current year?",
      },
      {
        type: "confirm",
        name: "confirm",
        message: "Are you sure?",
      },
    ])
    .then(async (result) => {
      if (result.confirm === false) {
        console.log(chalk.redBright("Exiting..."));
        return;
      }

      // Validate user inputs with Zod
      try {
        nameSchema.parse(result.name);
        choiceSchema.parse(result.choice);
        yearSchema.parse(result.year);
      } catch (error) {
        console.log(
          chalk.redBright(error.errors.map((e) => e.message).join("\n"))
        );
        return;
      }

      const filePath = path.join(process.cwd(), "LICENSE");
      const { name, year, choice } = result;

      let licenseContent;
      if (choice === LICENSES.MIT) {
        licenseContent = generateMITLicense(name, year);
      } else if (choice === LICENSES.APACHE) {
        licenseContent = generateApacheLicense(name, year);
      }

      if (licenseContent) {
        await writeLicenseFile(filePath, licenseContent);
      }
    });
});

program.parse(process.argv);
