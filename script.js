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
document.getElementById('cut').addEventListener('click', startCut);
document.getElementById('erase').addEventListener('click', () => toggleDrawingMode('erase'));
document.getElementById('draw').addEventListener('click', () => toggleDrawingMode('draw'));
document.getElementById('undo').addEventListener('click', undoAction);

let history = [];
const maxHistorySize = 30;

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

function toggleDrawingMode(mode) {
    if (mode === 'draw') {
        if (canvas.isDrawingMode) {
            canvas.isDrawingMode = false;
            document.getElementById('draw').textContent = 'Draw';
        } else {
            canvas.freeDrawingBrush = new fabric.PencilBrush(canvas);
            canvas.freeDrawingBrush.color = 'black';
            canvas.freeDrawingBrush.width = 2;
            canvas.isDrawingMode = true;
            document.getElementById('draw').textContent = 'Stop Drawing';
            document.getElementById('erase').textContent = 'Erase';
        }
    } else if (mode === 'erase') {
        if (canvas.isDrawingMode && canvas.freeDrawingBrush.color === 'white') {
            canvas.isDrawingMode = false;
            document.getElementById('erase').textContent = 'Erase';
        } else {
            canvas.freeDrawingBrush = new fabric.PencilBrush(canvas);
            canvas.freeDrawingBrush.color = 'white'; // Assuming the canvas background is white
            canvas.freeDrawingBrush.width = 10;
            canvas.isDrawingMode = true;
            document.getElementById('erase').textContent = 'Stop Erasing';
            document.getElementById('draw').textContent = 'Draw';
        }
    }
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
        if (obj.type === 'image') {
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
canvas.on('object:added', function(obj) {
    if (obj.target && obj.target.type === 'image') {
        updateHistory();
        updateLayerManager();
    } else if (obj.target && obj.target.type === 'path') {
        updateHistory();
    }
});
canvas.on('object:modified', updateHistory);
canvas.on('object:removed', updateHistory);

// Initialize history with the initial state
updateHistory();
