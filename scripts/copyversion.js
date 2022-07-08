import * as fs from "node:fs";

// Copy npm package version to the MSFS package definition
const newVersion = process.env.npm_package_version;
const filename = "project/PackageDefinitions/hallidave-tool-landing.xml";
const contents = fs.readFileSync(filename, "utf8");
const newContent = contents.replace(
    /<AssetPackage Version=".+"/,
    '<AssetPackage Version="' + newVersion + '"');
fs.writeFileSync(filename, newContent, "utf8");
