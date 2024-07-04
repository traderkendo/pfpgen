const canvas = new fabric.Canvas('canvas');
const mainImageUrl = 'https://raw.githubusercontent.com/traderkendo/pfpgen/main/bobby.jpg'; // URL of the main image

// Load initial image
fabric.Image.fromURL(mainImageUrl, function(img) {
    img.set({ left: 100, top: 100 });
    canvas.add(img);
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

canvas.on('object:modified', updateHistory);
canvas.on('object:added', updateHistory);

function handleUpload(event) {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = function(f) {
        const data = f.target.result;
        fabric.Image.fromURL(data, function(img) {
            canvas.add(img);
            canvas.renderAll();
        });
    };
    reader.readAsDataURL(file);
}

function addMainImage() {
    fabric.Image.fromURL(mainImageUrl, function(img) {
        canvas.add(img);
        canvas.renderAll();
    });
}

function duplicateImage() {
    const activeObject = canvas.getActiveObject();
    if (activeObject) {
        const clone = fabric.util.object.clone(activeObject);
        clone.set({ left: clone.left + 10, top: clone.top + 10 });
        canvas.add(clone);
        canvas.renderAll();
    }
}

function zoomImage(factor) {
    canvas.getObjects().forEach(obj => {
        obj.scaleX *= factor;
        obj.scaleY *= factor;
        obj.left *= factor;
        obj.top *= factor;
        obj.setCoords();
    });
    canvas.renderAll();
}

function distortImage() {
    const activeObject = canvas.getActiveObject();
    if (activeObject) {
        activeObject.set('skewX', 20);
        activeObject.set('skewY', 20);
        canvas.renderAll();
    }
}

let isCutting = false;

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
    const rect = new fabric.Rect({
        left: event.pointer.x,
        top: event.pointer.y,
        width: 1,
        height: 1,
        fill: 'rgba(0,0,0,0.3)',
        stroke: '#000',
        strokeDashArray: [5, 5]
    });
    canvas.add(rect);
    canvas.renderAll();

    canvas.on('mouse:move', function(moveEvent) {
        rect.set({ width: moveEvent.pointer.x - rect.left, height: moveEvent.pointer.y - rect.top });
        canvas.renderAll();
    });

    canvas.on('mouse:up', function() {
        canvas.off('mouse:move');
        canvas.off('mouse:up');
        finishCut(rect);
    });
}

function finishCut(rect) {
    const clipPath = rect.toObject();
    canvas.remove(rect);
    const activeObject = canvas.getActiveObject();
    if (activeObject) {
        activeObject.set({ clipPath: new fabric.Rect(clipPath) });
        canvas.renderAll();
    }
}

function toggleDrawingMode() {
    canvas.isDrawingMode = !canvas.isDrawingMode;
    document.getElementById('draw').textContent = canvas.isDrawingMode ? 'Stop Drawing' : 'Draw';
}

function undoAction() {
    if (history.length > 1) {
        history.pop();
        const state = history[history.length - 1];
        canvas.loadFromJSON(state, canvas.renderAll.bind(canvas));
    }
}

function updateHistory() {
    const state = JSON.stringify(canvas);
    history.push(state);
}

canvas.on('object:modified', updateHistory);
canvas.on('object:added', updateHistory);

// Initialize history with the initial state
updateHistory();
