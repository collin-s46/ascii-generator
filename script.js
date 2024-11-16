const urlInput = document.getElementById("url-input");
const generateBtn = document.getElementById("generate-btn");
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const asciiOutput = document.getElementById("ascii-output");

// Characters used for ASCII art, ordered by brightness
const ASCII_CHARS = "@%#*+=-:. ";

// Convert image data to ASCII
function imageToAscii(imageData, cols, rows) {
    const { data, width, height } = imageData;

    // Calculate the scale factor to match the specified columns and rows
    const xScale = width / cols;
    const yScale = height / rows;

    let ascii = "";

    for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
            const srcX = Math.floor(x * xScale);
            const srcY = Math.floor(y * yScale);
            const index = (srcY * width + srcX) * 4;

            const r = data[index];
            const g = data[index + 1];
            const b = data[index + 2];
            const avg = (r + g + b) / 3;

            const char = ASCII_CHARS[Math.floor((avg / 255) * (ASCII_CHARS.length - 1))];
            ascii += char;
        }
        ascii += "\n";
    }

    return ascii;
}

// Fetch and process the image from a URL
function fetchAndProcessImage(url) {
    const img = new Image();
    img.crossOrigin = "anonymous"; // Allow cross-origin images
    img.src = url;

    img.onload = () => {
        const textareaHeight = 715; // Fixed height of the textarea in pixels
        const charHeight = 16; // Approximate height of a monospace character in pixels
        const rows = Math.floor(textareaHeight / charHeight);

        // Maintain the aspect ratio
        const aspectRatio = img.width / img.height;
        const cols = Math.floor(rows * aspectRatio);

        canvas.width = img.width;
        canvas.height = img.height;

        // Draw the image to the canvas
        ctx.drawImage(img, 0, 0);

        // Resize image data to match the desired columns and rows
        const imageData = ctx.getImageData(0, 0, img.width, img.height);
        const ascii = imageToAscii(imageData, cols, rows);

        asciiOutput.value = ascii;
    };

    img.onerror = () => {
        alert("Failed to load image. Please check the URL and try again.");
    };
}

// Add event listener to the button
generateBtn.addEventListener("click", () => {
    const url = urlInput.value.trim();
    if (url) {
        fetchAndProcessImage(url);
    } else {
        alert("Please enter a valid image URL.");
    }
});
