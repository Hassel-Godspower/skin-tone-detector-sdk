import { analyzeSkinColor } from "../index.js";

console.log("Testing Skin Tone Detector...");
const sample = { r: 205, g: 150, b: 107 };
console.log(analyzeSkinColor(sample));

