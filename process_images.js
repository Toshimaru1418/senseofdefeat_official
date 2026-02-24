import { Jimp } from "jimp";
import path from "path";
import { fileURLToPath } from "url";

async function makeTransparent(inputPath, outputPath) {
  try {
    const image = await Jimp.read(inputPath);

    // Iterate over every pixel
    image.scan(
      0,
      0,
      image.bitmap.width,
      image.bitmap.height,
      function (x, y, idx) {
        const red = this.bitmap.data[idx + 0];
        const green = this.bitmap.data[idx + 1];
        const blue = this.bitmap.data[idx + 2];

        // If the pixel is mostly white, make it transparent
        if (red > 230 && green > 230 && blue > 230) {
          this.bitmap.data[idx + 3] = 0; // Alpha channel
        }
      }
    );

    // Optional: autocrop to remove transparent borders
    image.autocrop();

    await image.write(outputPath);
    console.log(`Processed ${inputPath} -> ${outputPath}`);
  } catch (error) {
    console.error(`Error processing ${inputPath}:`, error);
  }
}

const args = process.argv.slice(2);
const in1 = args[0];
const out1 = args[1];
const in2 = args[2];
const out2 = args[3];

Promise.all([makeTransparent(in1, out1), makeTransparent(in2, out2)]).then(() =>
  process.exit(0)
);
