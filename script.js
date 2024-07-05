const canvas = new fabric.Canvas('canvas');
const mainImageUrl = 'https://raw.githubusercontent.com/traderkendo/pfpgen/main/bobby.jpg'; // URL of the main image

// Define the generator frame dimensions
const frameWidth = 500;
const frameHeight = 500;

document.getElementById('upload').addEventListener('change', handleUpload);
document.getElementById('addImage').addEventListener('click', addMainImage);
document.getElementById('duplicate').addEventListener('click', duplicateImage);
document.getElementById('zoomIn').addEventListener('click', () => zoomImage(1.1));
document.getElementById('zoomOut').addEventListener('click', () => zoomImage(0.9));
document.getElementById('draw').addEventListener('click', toggleDrawingMode);
document.getElementById('colorPicker').addEventListener('change', updateBrushColor);
document.getElementById('sizeChanger').addEventListener('input', updateBrushSize);
document.getElementById('undo').addEventListener('click', undoAction);
document.getElementById('accessoryDropdown').addEventListener('change', openAccessoryPage);
document.getElementById('randomAccessory').addEventListener('click', addRandomAccessory);

let history = [];
const maxHistorySize = 30;

const accessoryCreators = [
    createHair,
    createHat,
    createGlasses,
    createBeard
];

// Function to adjust image to fit the frame
function adjustImageToFrame(img) {
    const scaleX = frameWidth / img.width;
    const scaleY = frameHeight / img.height;
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

function addMainImage() {
    fabric.Image.fromURL(mainImageUrl, function(img) {
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
            const layerItem = document.createElement('div');
            layerItem.className = 'layer-item';
            layerItem.textContent = `Layer ${index}`;
            layerItem.addEventListener('click', () => {
                canvas.setActiveObject(obj);
                canvas.renderAll();
            });

            layerManager.appendChild(layerItem);
        }
    });
}

function openAccessoryPage(event) {
    const url = event.target.value;
    if (url) {
        window.open(url, '_blank');
    }
}

function addRandomAccessory() {
    const randomCreator = accessoryCreators[Math.floor(Math.random() * accessoryCreators.length)];
    randomCreator();
    updateHistory(); // Add state to history
    updateLayerManager(); // Update layer manager
    canvas.renderAll();
}

function createHair() {
    const hair = new fabric.Rect({
        left: 150,
        top: 50,
        fill: 'brown',
        width: 200,
        height: 50,
        selectable: true
    });
    canvas.add(hair);
}

function createHat() {
    const hat = new fabric.Triangle({
        left: 150,
        top: 50,
        fill: 'black',
        width: 200,
        height: 100,
        selectable: true
    });
    canvas.add(hat);
}

function createGlasses() {
    const glasses = new fabric.Group([
        new fabric.Rect({
            left: 0,
            top: 0,
            fill: 'black',
            width: 50,
            height: 30
        }),
        new fabric.Rect({
            left: 60,
            top: 0,
            fill: 'black',
            width: 50,
            height: 30
        }),
        new fabric.Rect({
            left: 50,
            top: 10,
            fill: 'black',
            width: 10,
            height: 10
        })
    ], {
        left: 150,
        top: 100,
        selectable: true
    });
    canvas.add(glasses);
}

function createBeard() {
    const beard = new fabric.Path('M 0 0 Q 50 100 100 0', {
        left: 150,
        top: 200,
        fill: 'black',
        selectable: true
    });
    canvas.add(beard);
}

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
