var STEP = 100;
var triangles = [];

function setup() {
    createCanvas(windowWidth, windowHeight);
    maxArea = 0.5 * windowHeight * windowWidth;
    minArea = 1;
    slope = (1 - 0.25) / (maxArea - minArea);
    stroke("grey");
    halveGrid();
    recursiveSplitTris();
    drawTris();
}

function triangleGrid() {
    for (var x = 0; x < windowWidth; x += STEP) {
        for (var y = 0; y < windowHeight; y += STEP) {
            triangles.push({ a: { x: x, y: y }, b: { x: x + STEP, y: y }, c: { x: x, y: y + STEP } }); 
            triangles.push({ a: { x: x + STEP, y: y }, b: { x: x + STEP, y: y + STEP }, c: { x: x, y: y + STEP } });
        }
    }
}

function halveGrid() {
    triangles = [];
    triangles.push({ a: { x: 0, y: 0 }, b: { x: windowWidth, y: 0 }, c: { x: 0, y: windowHeight } });
    triangles.push({ a: { x: windowWidth, y: 0 }, b: { x: windowWidth, y: windowHeight }, c: { x: 0, y: windowHeight } });
}

function pointDist(p1, p2) {
    return dist(p1.x, p1.y, p2.x, p2.y);
}

function vertexIndexOppositeLongestSide(tri) {
    var points = [tri.a, tri.b, tri.c];
    var maxDist = -1;
    var point = -1;

    for (var i = 0; i <= points.length; i++) {
        d = pointDist(points[i % 3], points[(i + 1) % 3]);
        if (d > maxDist) {
            point = (i + 2) % 3;
            maxDist = d;
        }
    }
    return point;
}

function splitTriangle(tri) {
    var pointIndexToSplit = vertexIndexOppositeLongestSide(tri);
    var points = [tri.a, tri.b, tri.c];
    var split1 = points[(pointIndexToSplit + 1) % 3];
    var split2 = points[(pointIndexToSplit + 2) % 3];

    // Determine location of new shared point
    var pointAngle = atan2(split2.y - split1.y, split2.x - split1.x);
    var d = random() * pointDist(split1, split2);
    var newSharedPoint = {
        x: split1.x + cos(pointAngle) * d,
        y: split1.y + sin(pointAngle) * d
    };
    return [{ a: points[pointIndexToSplit], b: split1, c: newSharedPoint }, { a: newSharedPoint, b: split2, c: points[pointIndexToSplit] } ];
}

function randomSplit() {
    var newTriangles = [];
    triangles.forEach(function (t) {
        if (random() < 0.2) {
            newTriangles.push(t);
        } else {
            var tris = splitTriangle(t);
            tris.forEach(function (tri) {
                newTriangles.push(tri);
            });
        }
    });
    triangles = newTriangles;
}

function manySplit() {
    do {
        randomSplit();
    } while (random() < 0.8);
}

function recursiveSplit(t, depth) {
    if (random() < 0.15 || depth > 15) {
        return [t];
    }
    var newTris = [];
    var tris = splitTriangle(t);
    tris.forEach(function (tri) {
        (recursiveSplit(tri, depth + 1)).forEach(function (alsoTri) {
            newTris.push(alsoTri);
        });
    });
    return newTris;
}

function recursiveSplitTris() {
    var newTris = [];
    triangles.forEach(function (tri) {
        (recursiveSplit(tri, 0)).forEach(function (stillATri) {
            newTris.push(stillATri);
        });
    });
    triangles = newTris;
}

function triArea(t) {
    return abs((t.a.x*(t.b.y - t.c.y) + t.b.x*(t.c.y - t.a.y) + t.c.x*(t.a.y - t.b.y))/2);
}

function setFillBasedOnArea(t) {
    var area = triArea(t);
    //var relArea = 0 + slope * (area - minArea);
    var relArea = 0 + slope * (maxArea - area);
    //fill(100 * relArea, 255 * relArea, 200 * relArea);
    fill(200 - 100 * relArea, 100 - 255 * relArea, 200 - 255 * relArea);
}

function setFillBasedOnArea2(t) {
    var area = triArea(t);
    var relArea = area/maxArea;
    realArea = 1/relArea;
    fill(relArea, relArea, relArea);
}

function drawTris() {
    triangles.forEach(function (t) {
        setFillBasedOnArea(t);
        triangle(t.a.x, t.a.y, t.b.x, t.b.y, t.c.x, t.c.y);
    });
}
function mouseReleased() {
    clear();
    halveGrid();
    recursiveSplitTris();
    drawTris();
}