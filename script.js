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
document.getElementById('lassoTool').addEventListener('click', toggleLassoTool);
document.getElementById('draw').addEventListener('click', toggleDrawingMode);
document.getElementById('colorPicker').addEventListener('change', updateBrushColor);
document.getElementById('undo').addEventListener('click', undoAction);

let history = [];
const maxHistorySize = 30;
let lassoToolEnabled = false;

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

function toggleLassoTool() {
    lassoToolEnabled = !lassoToolEnabled;
    if (lassoToolEnabled) {
        enableLassoTool();
    } else {
        disableLassoTool();
    }
}

function enableLassoTool() {
    const lasso = d3.lasso()
        .items(d3.selectAll('.fabric-object'))
        .closePathDistance(100)
        .closePathSelect(true)
        .hoverSelect(true)
        .area(d3.select('canvas'))
        .on('start', lassoStart)
        .on('draw', lassoDraw)
        .on('end', lassoEnd);

    d3.select('canvas').call(lasso);

    document.getElementById('lassoTool').textContent = 'Stop Lasso Tool';
}

function disableLassoTool() {
    document.getElementById('lassoTool').textContent = 'Lasso Tool';
    // Remove lasso event listeners
    d3.select('canvas').on('.drag', null);
}

function lassoStart() {
    console.log('Lasso started');
}

function lassoDraw() {
    console.log('Lasso drawing');
}

function lassoEnd() {
    const selectedItems = d3.selectAll('.lasso .possible');
    selectedItems.each(function(d) {
        const obj = d3.select(this).datum();
        canvas.remove(canvas.getObjects()[obj.index]);
    });
    updateHistory();
    updateLayerManager();
    canvas.renderAll();
}

function toggleDrawingMode() {
    canvas.isDrawingMode = !canvas.isDrawingMode;
    document.getElementById('draw').textContent = canvas.isDrawingMode ? 'Stop Drawing' : 'Draw';
}

function updateBrushColor(event) {
    const color = event.target.value;
    canvas.freeDrawingBrush.color = color;
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
