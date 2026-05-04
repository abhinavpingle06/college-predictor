import { schemaDB } from "./schema.js";

console.log("Task Execution Started")

async function main() {
    await schemaDB();  
    console.log("Task Successfully Executed");
}

main();