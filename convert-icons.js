const fs = require("fs");
const path = require("path");

// This script will help convert SVG icons to PNG/ICO formats
// You need to install the required dependencies first:
// npm install sharp svg2img

async function convertIcons() {
  try {
    // Try to use sharp for PNG conversion
    const sharp = require("sharp");

    console.log("🎨 Converting SVG icons to PNG/ICO formats...\n");

    // Define conversions
    const conversions = [
      {
        input: "icon-192x192.svg",
        output: "icon-192x192.png",
        size: { width: 192, height: 192 },
      },
      {
        input: "icon-512x512.svg",
        output: "icon-512x512.png",
        size: { width: 512, height: 512 },
      },
      {
        input: "apple-touch-icon.svg",
        output: "apple-touch-icon.png",
        size: { width: 180, height: 180 },
      },
      {
        input: "favicon-new.svg",
        output: "favicon.ico",
        size: { width: 32, height: 32 },
      },
    ];

    // Process each conversion
    for (const conversion of conversions) {
      const inputPath = path.join(__dirname, "public", conversion.input);
      const outputPath = path.join(__dirname, "public", conversion.output);

      if (fs.existsSync(inputPath)) {
        try {
          await sharp(inputPath)
            .resize(conversion.size.width, conversion.size.height)
            .png()
            .toFile(outputPath);

          console.log(`✅ ${conversion.input} → ${conversion.output}`);
        } catch (err) {
          console.log(
            `❌ Failed to convert ${conversion.input}: ${err.message}`
          );
        }
      } else {
        console.log(`⚠️  ${conversion.input} not found`);
      }
    }

    console.log("\n🎉 Icon conversion complete!");
    console.log("\n📋 Next steps:");
    console.log("1. Check the public/ folder for new PNG/ICO files");
    console.log("2. Delete the SVG files if conversion was successful");
    console.log("3. Refresh your browser to test the icons");
    console.log('4. Try "Add to Home Screen" on mobile devices');
  } catch (error) {
    console.log("❌ Sharp library not found. Please install it first:");
    console.log("npm install sharp");
    console.log(
      "\nAlternatively, use online converters mentioned in ICON_CONVERSION_GUIDE.md"
    );
  }
}

// Alternative method using svg2img (fallback)
async function convertWithSvg2img() {
  try {
    const svg2img = require("svg2img");
    console.log("🎨 Using svg2img for conversion...\n");

    // Implementation for svg2img conversion
    // (This is a fallback method)
  } catch (error) {
    console.log("❌ svg2img library not found. Please use online converters.");
  }
}

// Run the conversion
if (require.main === module) {
  convertIcons().catch((err) => {
    console.error("Conversion failed:", err.message);
    console.log(
      "\n💡 Try using online converters from ICON_CONVERSION_GUIDE.md"
    );
  });
}

module.exports = { convertIcons };
