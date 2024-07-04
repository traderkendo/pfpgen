const canvas = new fabric.Canvas('canvas');
const pica = window.pica();

document.getElementById('upload').addEventListener('change', handleUpload);
document.getElementById('duplicate').addEventListener('click', duplicateImage);
document.getElementById('removeBackground').addEventListener('click', removeBackground);
document.getElementById('zoomIn').addEventListener('click', () => zoomImage(1.1));
document.getElementById('zoomOut').addEventListener('click', () => zoomImage(0.9));
document.getElementById('distort').addEventListener('click', distortImage);
document.getElementById('cut').addEventListener('click', cutImage);
document.getElementById('draw').addEventListener('click', toggleDrawingMode);

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

function duplicateImage() {
    const activeObject = canvas.getActiveObject();
    if (activeObject) {
        const clone = fabric.util.object.clone(activeObject);
        clone.set({ left: clone.left + 10, top: clone.top + 10 });
        canvas.add(clone);
        canvas.renderAll();
    }
}

function removeBackground() {
    const activeObject = canvas.getActiveObject();
    if (activeObject && activeObject.getSrc) {
        const imgElement = new Image();
        imgElement.src = activeObject.getSrc();
        imgElement.onload = function() {
            pica.removeBackground(imgElement).then(result => {
                fabric.Image.fromURL(result.toDataURL(), function(img) {
                    canvas.remove(activeObject);
                    canvas.add(img);
                    canvas.renderAll();
                });
            });
        };
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

function cutImage() {
    const activeObject = canvas.getActiveObject();
    if (activeObject) {
        canvas.remove(activeObject);
    }
}

function toggleDrawingMode() {
    canvas.isDrawingMode = !canvas.isDrawingMode;
    document.getElementById('draw').textContent = canvas.isDrawingMode ? 'Stop Drawing' : 'Draw';
}

canvas.on('mouse:down', function() {
    if (!canvas.isDrawingMode) return;
    canvas.on('mouse:move', function(event) {
        const pointer = canvas.getPointer(event.e);
        const points = [pointer.x, pointer.y, pointer.x + 2, pointer.y + 2];
        const line = new fabric.Line(points, {
            strokeWidth: 2,
            fill: '#000',
            stroke: '#000',
            originX: 'center',
            originY: 'center'
        });
        canvas.add(line);
    });
});

canvas.on('mouse:up', function() {
    canvas.off('mouse:move');
});
