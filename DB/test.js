import fs from "fs"

const rawJson = fs.readFileSync("../scripts/DB-cleaning-scripts/cleaned_college_data.json","utf-8")
const jsonData = JSON.parse(rawJson);

console.log(jsonData[3500])