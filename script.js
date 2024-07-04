const canvas = new fabric.Canvas('canvas');
const mainImageUrl = 'https://raw.githubusercontent.com/traderkendo/pfpgen/main/bobby.jpg'; // URL of the main image

// Define the frame dimensions
const frameWidth = 400;
const frameHeight = 400;

// Add a frame
const frame = new fabric.Rect({
    left: 50,
    top: 50,
    width: frameWidth,
    height: frameHeight,
    fill: 'transparent',
    stroke: '#000',
    strokeWidth: 2,
    selectable: false
});
canvas.add(frame);

// Load initial image
fabric.Image.fromURL(mainImageUrl, function(img) {
    img.set({ left: 50, top: 50, scaleX: frameWidth / img.width, scaleY: frameHeight / img.height });
    canvas.add(img);
    updateHistory(); // Add initial state to history
    updateLayerManager(); // Update layer manager
    canvas.renderAll();
});

document.getElementById('upload').addEventListener('change', handleUpload);
document.getElementById('addImage').addEventListener('click', addMainImage);
document.getElementById('duplicate').addEventListener('click', duplicateImage);
document.getElementById('zoomIn').addEventListener('click', () => zoomImage(1.1));
document.getElementById('zoomOut').addEventListener('click', () => zoomImage(0.9));
document.getElementById('distort').addEventListener('click', distortImage);
document.getElementById('cut').addEventListener('click', startCut);
document.getElementById('draw').addEventListener('click', toggleDrawingMode);
document.getElementById('undo').addEventListener('click', undoAction);

let history = [];
const maxHistorySize = 30;

function handleUpload(event) {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = function(f) {
        const data = f.target.result;
        fabric.Image.fromURL(data, function(img) {
            img.set({ left: 50, top: 50, scaleX: frameWidth / img.width, scaleY: frameHeight / img.height });
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
        img.set({ left: 50, top: 50, scaleX: frameWidth / img.width, scaleY: frameHeight / img.height });
        canvas.add(img);
        updateHistory(); // Add state to history
        updateLayerManager(); // Update layer manager
        canvas.renderAll();
    });
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
    canvas.getObjects().forEach(obj => {
        if (obj !== frame) { // Don't zoom the frame
            obj.scaleX *= factor;
            obj.scaleY *= factor;
            obj.left *= factor;
            obj.top *= factor;
            obj.setCoords();
        }
    });
    updateHistory(); // Add state to history
    canvas.renderAll();
}

function distortImage() {
    const activeObject = canvas.getActiveObject();
    if (activeObject) {
        activeObject.set('skewX', 20);
        activeObject.set('skewY', 20);
        updateHistory(); // Add state to history
        canvas.renderAll();
    }
}

let isCutting = false;
let cutRect = null;

function startCut() {
    if (!isCutting) {
        canvas.selection = false;
        canvas.forEachObject(obj => obj.selectable = false);
        canvas.on('mouse:down', initiateCut);
    } else {
        canvas.selection = true;
        canvas.forEachObject(obj => obj.selectable = true);
        canvas.off('mouse:down', initiateCut);
    }
    isCutting = !isCutting;
}

function initiateCut(event) {
    if (cutRect) {
        canvas.remove(cutRect);
    }
    cutRect = new fabric.Rect({
        left: event.pointer.x,
        top: event.pointer.y,
        width: 1,
        height: 1,
        fill: 'rgba(0,0,0,0.3)',
        stroke: '#000',
        strokeDashArray: [5, 5]
    });
    canvas.add(cutRect);
    canvas.renderAll();

    canvas.on('mouse:move', resizeCutRect);
    canvas.on('mouse:up', finishCut);
}

function resizeCutRect(event) {
    if (cutRect) {
        cutRect.set({ width: event.pointer.x - cutRect.left, height: event.pointer.y - cutRect.top });
        canvas.renderAll();
    }
}

function finishCut() {
    canvas.off('mouse:move', resizeCutRect);
    canvas.off('mouse:up', finishCut);
    applyCut();
}

function applyCut() {
    const clipPath = cutRect.toObject();
    canvas.remove(cutRect);
    const activeObject = canvas.getActiveObject();
    if (activeObject) {
        activeObject.set({ clipPath: new fabric.Rect(clipPath) });
        updateHistory(); // Add state to history
        canvas.renderAll();
    }
    cutRect = null;
}

function toggleDrawingMode() {
    canvas.isDrawingMode = !canvas.isDrawingMode;
    document.getElementById('draw').textContent = canvas.isDrawingMode ? 'Stop Drawing' : 'Draw';
    if (canvas.isDrawingMode) {
        canvas.on('path:created', updateHistory); // Add state to history after drawing
    } else {
        canvas.off('path:created', updateHistory);
    }
}

function undoAction() {
    if (history.length > 1) {
        history.pop();
        const state = history[history.length - 1];
        canvas.loadFromJSON(state, () => {
            canvas.renderAll.bind(canvas);
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
        if (obj !== frame && obj.type === 'image') {
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

// Add event listeners to capture actions
canvas.on('object:added', obj => {
    if (obj.target.type === 'image') {
        updateHistory();
        updateLayerManager();
    }
});
canvas.on('object:modified', updateHistory);
canvas.on('object:removed', updateHistory);

// Initialize history with the initial state
updateHistory();
