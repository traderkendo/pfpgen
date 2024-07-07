const canvas = new fabric.Canvas('canvas');
const mainImageUrl = 'https://raw.githubusercontent.com/traderkendo/pfpgen/main/bobby.jpg'; // URL of the main image
const bobbyImageUrl = 'https://raw.githubusercontent.com/traderkendo/pfpgen/main/bobbybg.png'; // New URL for the $Bobby image

const imageUrls = [
    'https://raw.githubusercontent.com/traderkendo/pfpgen/main/images/FBI-removebg-preview.png',
    'https://raw.githubusercontent.com/traderkendo/pfpgen/main/images/afropainting.png',
    'https://raw.githubusercontent.com/traderkendo/pfpgen/main/images/afroreal.png',
    'https://raw.githubusercontent.com/traderkendo/pfpgen/main/images/apustaja.png',
    'https://raw.githubusercontent.com/traderkendo/pfpgen/main/images/blackcurly.png',
    'https://raw.githubusercontent.com/traderkendo/pfpgen/main/images/blackcurly2.png',
    'https://raw.githubusercontent.com/traderkendo/pfpgen/main/images/goku.png',
    'https://raw.githubusercontent.com/traderkendo/pfpgen/main/images/ssj.png',
    'https://raw.githubusercontent.com/traderkendo/pfpgen/main/images/ssgod.png',
    'https://raw.githubusercontent.com/traderkendo/pfpgen/main/images/strawhat.png',
    'https://raw.githubusercontent.com/traderkendo/pfpgen/main/images/wifhat.png',
    'https://raw.githubusercontent.com/traderkendo/pfpgen/main/images/blackdiorsnap.png',
    'https://raw.githubusercontent.com/traderkendo/pfpgen/main/images/brownglasses-removebg-preview.png',
    'https://raw.githubusercontent.com/traderkendo/pfpgen/main/images/cowboyhat-removebg-preview.png',
    'https://raw.githubusercontent.com/traderkendo/pfpgen/main/images/curlyhair.png',
    'https://raw.githubusercontent.com/traderkendo/pfpgen/main/images/diorbucket.png',
    'https://raw.githubusercontent.com/traderkendo/pfpgen/main/images/diorsnap.png',
    'https://raw.githubusercontent.com/traderkendo/pfpgen/main/images/eyebrows.png',
    'https://raw.githubusercontent.com/traderkendo/pfpgen/main/images/fendicap.png',
    'https://raw.githubusercontent.com/traderkendo/pfpgen/main/images/smoothbrain-removebg-preview.png',
    'https://raw.githubusercontent.com/traderkendo/pfpgen/main/images/guccicap.png',
    'https://raw.githubusercontent.com/traderkendo/pfpgen/main/images/monocle-removebg-preview.png',
    'https://raw.githubusercontent.com/traderkendo/pfpgen/main/images/hathat-removebg-preview.png',
    'https://raw.githubusercontent.com/traderkendo/pfpgen/main/images/irishhat-removebg-preview.png',
    'https://raw.githubusercontent.com/traderkendo/pfpgen/main/images/mustache-removebg-preview.png',
    'https://raw.githubusercontent.com/traderkendo/pfpgen/main/images/pinkglasses-removebg-preview.png',
    'https://raw.githubusercontent.com/traderkendo/pfpgen/main/images/pixelglasses-removebg-preview.png',
    'https://raw.githubusercontent.com/traderkendo/pfpgen/main/images/blueraygun-removebg-preview.png',
    'https://raw.githubusercontent.com/traderkendo/pfpgen/main/images/blueyellowgun-removebg-preview.png',
    'https://raw.githubusercontent.com/traderkendo/pfpgen/main/images/happybday-removebg-preview.png',
    'https://raw.githubusercontent.com/traderkendo/pfpgen/main/images/pinkraygun-removebg-preview.png',
    'https://raw.githubusercontent.com/traderkendo/pfpgen/main/images/BlackBackPack.png',
    'https://raw.githubusercontent.com/traderkendo/pfpgen/main/images/havocbat-removebg-preview.png',    
    'https://raw.githubusercontent.com/traderkendo/pfpgen/main/images/bbatton.png',
    'https://raw.githubusercontent.com/traderkendo/pfpgen/main/images/Axe%20G.png',
    'https://raw.githubusercontent.com/traderkendo/pfpgen/main/images/axe.png',
    'https://raw.githubusercontent.com/traderkendo/pfpgen/main/images/battonr.png',
    'https://raw.githubusercontent.com/traderkendo/pfpgen/main/images/boom.png',
    'https://raw.githubusercontent.com/traderkendo/pfpgen/main/images/boom2.png',
    'https://raw.githubusercontent.com/traderkendo/pfpgen/main/images/cannon.png',
    'https://raw.githubusercontent.com/traderkendo/pfpgen/main/images/cannonold.png',
    'https://raw.githubusercontent.com/traderkendo/pfpgen/main/images/cartcannon.png',
    'https://raw.githubusercontent.com/traderkendo/pfpgen/main/images/engbatton.png',
    'https://raw.githubusercontent.com/traderkendo/pfpgen/main/images/gbatton.png',
    'https://raw.githubusercontent.com/traderkendo/pfpgen/main/images/gbatton2.png',
    'https://raw.githubusercontent.com/traderkendo/pfpgen/main/images/oldboom.png',
    'https://raw.githubusercontent.com/traderkendo/pfpgen/main/images/oldcannon.png',
    'https://raw.githubusercontent.com/traderkendo/pfpgen/main/images/opensuitc.png',
    'https://raw.githubusercontent.com/traderkendo/pfpgen/main/images/pbatton.png',
    'https://raw.githubusercontent.com/traderkendo/pfpgen/main/images/pobatton.png',
    'https://raw.githubusercontent.com/traderkendo/pfpgen/main/images/pobatton2.png',
    'https://raw.githubusercontent.com/traderkendo/pfpgen/main/images/stick.png',
    'https://raw.githubusercontent.com/traderkendo/pfpgen/main/images/suitc.png',
    'https://raw.githubusercontent.com/traderkendo/pfpgen/main/images/woodboom.png',
    'https://raw.githubusercontent.com/traderkendo/pfpgen/main/images/sword-removebg-preview.png'
];

const imagesPerPage = 20;
let currentPage = 1;
let totalPages = Math.ceil(imageUrls.length / imagesPerPage);

document.getElementById('upload').addEventListener('change', handleUpload);
document.getElementById('addBobby').addEventListener('click', addBobbyImage);
document.getElementById('duplicate').addEventListener('click', duplicateImage);
document.getElementById('zoomIn').addEventListener('click', () => zoomImage(1.1));
document.getElementById('zoomOut').addEventListener('click', () => zoomImage(0.9));
document.getElementById('draw').addEventListener('click', toggleDrawingMode);
document.getElementById('colorPicker').addEventListener('change', updateBrushColor);
document.getElementById('sizeChanger').addEventListener('input', updateBrushSize);
document.getElementById('undo').addEventListener('click', undoAction);
document.getElementById('mirrorHorizontal').addEventListener('click', mirrorHorizontal);
document.getElementById('download').addEventListener('click', downloadImage);
document.getElementById('prevPage').addEventListener('click', () => changePage(-1));
document.getElementById('nextPage').addEventListener('click', () => changePage(1));

// Add event listener for delete key
document.addEventListener('keydown', function(event) {
    if (event.key === 'Delete' || event.key === 'Backspace') {
        const activeObject = canvas.getActiveObject();
        if (activeObject) {
            canvas.remove(activeObject);
            updateHistory(); // Add state to history
            updateLayerManager(); // Update layer manager
        }
    }
});

let history = [];
const maxHistorySize = 30;

// Function to adjust image to fit the frame
function adjustImageToFrame(img) {
    const scaleX = canvas.width / img.width;
    const scaleY = canvas.height / img.height;
    const scale = Math.min(scaleX, scaleY);
    img.set({
        scaleX: scale,
        scaleY: scale,
        left: (canvas.width - img.width * scale) / 2,
        top: (canvas.height - img.height * scale) / 2
    });
}

// Load initial image
fabric.Image.fromURL(mainImageUrl, function(img) {
    adjustImageToFrame(img);
    img.set({
        selectable: false,  // Make the main image static
        evented: false      // Prevent any interaction with the main image
    });
    console.log("Main image properties:", img.selectable, img.evented); // Log properties to verify
    canvas.add(img);
    updateHistory(); // Add initial state to history
    updateLayerManager(); // Update layer manager
    canvas.renderAll();
}, { crossOrigin: 'anonymous' }); // Ensure cross-origin requests are handled

function handleUpload(event) {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = function(f) {
        const data = f.target.result;
        fabric.Image.fromURL(data, function(img) {
            adjustImageToFrame(img);
            canvas.add(img);
            updateHistory(); // Add state to history
            updateLayerManager(); // Update layer manager
            canvas.renderAll();
        });
    };
    reader.readAsDataURL(file);
}

function addBobbyImage() {
    fabric.Image.fromURL(bobbyImageUrl, function(img) {
        adjustImageToFrame(img);
        canvas.add(img);
        updateHistory(); // Add state to history
        updateLayerManager(); // Update layer manager
        canvas.renderAll();
    }, { crossOrigin: 'anonymous' }); // Ensure cross-origin requests are handled
}

function duplicateImage() {
    const activeObject = canvas.getActiveObject();
    if (activeObject) {
        activeObject.clone(function(clone) {
            clone.set({ left: clone.left + 10, top: clone.top + 10 });
            canvas.add(clone);
            updateHistory(); // Add state to history
            updateLayerManager(); // Update layer manager
            canvas.renderAll();
        });
    }
}

function zoomImage(factor) {
    const activeObject = canvas.getActiveObject();
    if (activeObject) {
        activeObject.scaleX *= factor;
        activeObject.scaleY *= factor;
        activeObject.left *= factor;
        activeObject.top *= factor;
        activeObject.setCoords();
        updateHistory(); // Add state to history
        canvas.renderAll();
    }
}

function toggleDrawingMode() {
    canvas.isDrawingMode = !canvas.isDrawingMode;
    document.getElementById('draw').textContent = canvas.isDrawingMode ? 'Stop Drawing' : 'Draw';
}

function updateBrushColor(event) {
    const color = event.target.value;
    canvas.freeDrawingBrush.color = color;
}

function updateBrushSize(event) {
    const size = event.target.value;
    canvas.freeDrawingBrush.width = parseInt(size, 10);
}

function undoAction() {
    if (history.length > 1) {
        history.pop();
        const state = history[history.length - 1];
        canvas.loadFromJSON(state, function() {
            canvas.renderAll();
            updateLayerManager(); // Update layer manager
        });
    }
}

function mirrorHorizontal() {
    const activeObject = canvas.getActiveObject();
    if (activeObject && activeObject.type === 'image') {
        activeObject.set('flipX', !activeObject.flipX);
        updateHistory(); // Add state to history
        canvas.renderAll();
    }
}

function downloadImage() {
    const link = document.createElement('a');
    link.href = canvas.toDataURL({ format: 'png' });
    link.download = 'bobby.png';
    link.click();
}

function updateHistory() {
    const state = JSON.stringify(canvas);
    history.push(state);
    if (history.length > maxHistorySize) {
        history.shift(); // Remove the oldest state to maintain the max size
    }
}

function updateLayerManager() {
    const layerManager = document.getElementById('layerManager');
    layerManager.innerHTML = '';
    canvas.getObjects().forEach((obj, index) => {
        if (obj.type === 'image' || obj.type === 'group' || obj.type === 'polygon') {
            const layerItem = document.createElement('option');
            layerItem.textContent = `Layer ${index}`;
            layerItem.value = index;
            layerItem.addEventListener('click', () => {
                canvas.setActiveObject(obj);
                canvas.renderAll();
            });

            layerManager.appendChild(layerItem);
        }
    });

    // Make the layer manager sortable
    new Sortable(layerManager, {
        onEnd: function(evt) {
            const oldIndex = evt.oldIndex;
            const newIndex = evt.newIndex;

            if (oldIndex === newIndex) return;

            const objects = canvas.getObjects();
            const movedObject = objects[oldIndex];
            objects.splice(oldIndex, 1);
            objects.splice(newIndex, 0, movedObject);

            // Clear and re-add objects to canvas
            canvas.clear();
            objects.forEach((obj) => {
                canvas.add(obj);
            });
            canvas.renderAll();
            updateHistory(); // Update history after reordering
        }
    });
}

// Function to handle image selection
function handleImageSelect(event) {
    const selectedImage = event.target.src;
    fabric.Image.fromURL(selectedImage, function(img) {
        img.moveTo(canvas.getObjects().length - 1);
        canvas.add(img);
        updateHistory(); // Add state to history
        updateLayerManager(); // Update layer manager
        canvas.renderAll();
    }, { crossOrigin: 'anonymous' });
}

// Function to display images in the gallery
function displayImages() {
    const imageGallery = document.getElementById('imageGallery');
    imageGallery.innerHTML = '';
    const startIndex = (currentPage - 1) * imagesPerPage;
    const endIndex = Math.min(startIndex + imagesPerPage, imageUrls.length);
    for (let i = startIndex; i < endIndex; i++) {
        const img = document.createElement('img');
        img.src = imageUrls[i];
        img.alt = `Image ${i + 1}`;
        img.addEventListener('click', handleImageSelect);
        imageGallery.appendChild(img);
    }
}

// Function to change the page
function changePage(direction) {
    currentPage += direction;
    if (currentPage < 1) currentPage = 1;
    if (currentPage > totalPages) currentPage = totalPages;
    displayImages();
}

// Populate the image gallery on load
displayImages();

// Add event listeners to capture actions
canvas.on('object:added', function(obj) {
    if (obj.target && (obj.target.type === 'image' || obj.target.type === 'group' || obj.target.type === 'path')) {
        updateHistory();
        updateLayerManager();
    }
});
canvas.on('object:modified', updateHistory);
canvas.on('object:removed', updateHistory);

// Initialize history with the initial state
updateHistory();
