// Get the canvas element and its context
const canvas = document.getElementById('drawingCanvas');
const ctx = canvas.getContext('2d');

// Variables to keep track of drawing state
let painting = false;

// Default pen size and color
let penSize = document.getElementById('pen-size').value;
let penColor = document.getElementById('pen-color').value;

// Function to get the mouse cursor's position relative to the canvas
function getCursorPosition(e) {
    const rect = canvas.getBoundingClientRect();
    return {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
    };
}

// Function to start drawing
function startPosition(e) {
    painting = true;
    draw(e); // Draw immediately when mouse is pressed
}

// Function to end drawing
function endPosition() {
    painting = false;
    ctx.beginPath(); // Reset the path to avoid continuous lines
}

// Function to draw on the canvas
function draw(e) {
    if (!painting) return;

    const pos = getCursorPosition(e);
    ctx.lineWidth = penSize;
    ctx.lineCap = 'round';
    ctx.strokeStyle = penColor;

    // Draw a line to the current mouse position
    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();
    ctx.beginPath(); // Start a new path
    ctx.moveTo(pos.x, pos.y); // Move the path to the current position
}

// Function to update pen size
document.getElementById('pen-size').addEventListener('input', function() {
    penSize = this.value;
    document.getElementById('pen-size-value').innerText = this.value;
});

// Function to update pen color
document.getElementById('pen-color').addEventListener('input', function() {
    penColor = this.value;
});

// Function to clear the canvas
function clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Clears the entire canvas
}

// Function to save the canvas as an image
document.getElementById('saveCanvas').addEventListener('click', function() {
    const dataURL = canvas.toDataURL('image/png'); // Convert canvas to image data URL
    const link = document.createElement('a'); // Create an anchor element
    link.href = dataURL;
    link.download = 'canvas-drawing.png'; // Set the download attribute with a file name
    link.click(); // Programmatically click the link to trigger the download
});

// Event listeners to handle drawing actions
canvas.addEventListener('mousedown', startPosition);
canvas.addEventListener('mouseup', endPosition);
canvas.addEventListener('mousemove', draw);

// Event listener to clear the canvas
document.getElementById('clearCanvas').addEventListener('click', clearCanvas);
