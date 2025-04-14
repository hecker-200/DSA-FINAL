const canvas = document.getElementById("grid");
const ctx = canvas.getContext("2d");
const rows = 20;
const cols = 20;
const cellSize = 40;
let grid = [];
let startSet = false;
let startX, startY, endX, endY;
let animating = false;
let dijkstraPath = [];
let bfsPath = [];

// Create grid with default values
function createGrid() {
    grid = [];
    for (let i = 0; i < rows; i++) {
        let row = [];
        for (let j = 0; j < cols; j++) {
            row.push({
                x: j * cellSize,
                y: i * cellSize,
                visited: false,
                distance: Infinity,
                prev: null,
                wall: false
            });
            ctx.fillStyle = "#eee";
            ctx.fillRect(j * cellSize, i * cellSize, cellSize, cellSize);
            ctx.strokeStyle = "#333";
            ctx.strokeRect(j * cellSize, i * cellSize, cellSize, cellSize);
        }
        grid.push(row);
    }
}

// Generate a random maze
function generateMaze() {
    createGrid();
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            if (Math.random() < 0.35) { // 35% chance of wall
                grid[i][j].wall = true;
                ctx.fillStyle = "#555";
                ctx.fillRect(j * cellSize, i * cellSize, cellSize, cellSize);
            }
        }
    }
    startSet = false;
    animating = false;
}

// Visualize path with animation
async function tracePath(path) {
    for (let node of path) {
        ctx.fillStyle = "lightgreen";
        ctx.fillRect(node.x, node.y, cellSize, cellSize);
        await new Promise((r) => setTimeout(r, 50));  // Adjust delay for animation speed
    }
}

// // Dijkstra's Algorithm with animation
// async function dijkstra(startX, startY, endX, endY) {
//     let pq = [{ x: startX, y: startY, distance: 0 }];
//     grid[startY][startX].distance = 0;
//     let path = [];

//     while (pq.length > 0) {
//         pq.sort((a, b) => a.distance - b.distance);
//         let current = pq.shift();
//         let x = current.x;
//         let y = current.y;

//         // Visualize current node
//         if (!(x === startX && y === startY)) {
//             ctx.fillStyle = "lightblue";
//             ctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
//             await new Promise((r) => setTimeout(r, 10));
//         }

//         if (x === endX && y === endY) {
//             path = [];
//             let currentNode = grid[endY][endX];
//             while (currentNode) {
//                 path.push(currentNode);
//                 currentNode = currentNode.prev ? grid[currentNode.prev.y][currentNode.prev.x] : null;
//             }
//             path.reverse();
//             tracePath(path);
//             return path;
//         }

//         const directions = [
//             [0, -1], [0, 1], [-1, 0], [1, 0]
//         ];

//         for (let [dx, dy] of directions) {
//             let newX = x + dx;
//             let newY = y + dy;

//             if (newX >= 0 && newX < cols && newY >= 0 && newY < rows) {
//                 let neighbor = grid[newY][newX];
//                 let newDist = grid[y][x].distance + 1;

//                 if (!neighbor.wall && newDist < neighbor.distance) {
//                     neighbor.distance = newDist;
//                     neighbor.prev = { x, y };
//                     pq.push({ x: newX, y: newY, distance: newDist });
//                 }
//             }
//         }
//     }

//     alert("No path found!");
//     return path;
// }

// BFS Algorithm with animation
async function bfs(startX, startY, endX, endY) {
    let queue = [{ x: startX, y: startY }];
    grid[startY][startX].visited = true;
    let path = [];

    while (queue.length > 0) {
        let current = queue.shift();
        let x = current.x;
        let y = current.y;

        // Visualize current node
        if (!(x === startX && y === startY)) {
            ctx.fillStyle = "lightblue";
            ctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
            await new Promise((r) => setTimeout(r, 10));
        }

        if (x === endX && y === endY) {
            path = [];
            let currentNode = grid[endY][endX];
            while (currentNode) {
                path.push(currentNode);
                currentNode = currentNode.prev ? grid[currentNode.prev.y][currentNode.prev.x] : null;
            }
            path.reverse();
            tracePath(path);
            return path;
        }

        const directions = [
            [0, -1], [0, 1], [-1, 0], [1, 0]
        ];

        for (let [dx, dy] of directions) {
            let newX = x + dx;
            let newY = y + dy;

            if (newX >= 0 && newX < cols && newY >= 0 && newY < rows && !grid[newY][newX].visited && !grid[newY][newX].wall) {
                grid[newY][newX].visited = true;
                grid[newY][newX].prev = { x, y };
                queue.push({ x: newX, y: newY });
            }
        }
    }

    alert("No path found!");
    return path;
}

// DFS Algorithm with animation
async function dfs(startX, startY, endX, endY) {
    let stack = [{ x: startX, y: startY }];
    grid[startY][startX].visited = true;
    let path = [];

    while (stack.length > 0) {
        let current = stack.pop();
        let x = current.x;
        let y = current.y;

        // Visualize current node
        if (!(x === startX && y === startY)) {
            ctx.fillStyle = "lightblue";
            ctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
            await new Promise((r) => setTimeout(r, 10));
        }

        if (x === endX && y === endY) {
            path = [];
            let currentNode = grid[endY][endX];
            while (currentNode) {
                path.push(currentNode);
                currentNode = currentNode.prev ? grid[currentNode.prev.y][currentNode.prev.x] : null;
            }
            path.reverse();
            tracePath(path);
            return path;
        }

        const directions = [
            [0, -1], [0, 1], [-1, 0], [1, 0]
        ];

        for (let [dx, dy] of directions) {
            let newX = x + dx;
            let newY = y + dy;

            if (newX >= 0 && newX < cols && newY >= 0 && newY < rows && !grid[newY][newX].visited && !grid[newY][newX].wall) {
                grid[newY][newX].visited = true;
                grid[newY][newX].prev = { x, y };
                stack.push({ x: newX, y: newY });
            }
        }
    }

    alert("No path found!");
    return path;
}

// A* Algorithm with animation
async function aStar(startX, startY, endX, endY) {
    let openSet = [{ x: startX, y: startY }];
    let cameFrom = {};
    let gScore = {};
    let fScore = {};
    let path = [];

    // Initialize gScore and fScore
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            gScore[`${i},${j}`] = Infinity;
            fScore[`${i},${j}`] = Infinity;
        }
    }
    gScore[`${startY},${startX}`] = 0;
    fScore[`${startY},${startX}`] = heuristic(startX, startY, endX, endY);

    while (openSet.length > 0) {
        openSet.sort((a, b) => fScore[`${a.y},${a.x}`] - fScore[`${b.y},${b.x}`]);
        let current = openSet.shift();
        let x = current.x;
        let y = current.y;

        // Visualize current node
        if (!(x === startX && y === startY)) {
            ctx.fillStyle = "lightblue";
            ctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
            await new Promise((r) => setTimeout(r, 10));
        }

        if (x === endX && y === endY) {
            path = [];
            let currentNode = grid[endY][endX];
            while (currentNode) {
                path.push(currentNode);
                currentNode = currentNode.prev ? grid[currentNode.prev.y][currentNode.prev.x] : null;
            }
            path.reverse();
            tracePath(path);
            return path;
        }

        const directions = [
            [0, -1], [0, 1], [-1, 0], [1, 0]
        ];

        for (let [dx, dy] of directions) {
            let newX = x + dx;
            let newY = y + dy;

            if (newX >= 0 && newX < cols && newY >= 0 && newY < rows) {
                let neighbor = grid[newY][newX];
                if (!neighbor.wall) {
                    let tentativeGScore = gScore[`${y},${x}`] + 1;

                    if (tentativeGScore < gScore[`${newY},${newX}`]) {
                        cameFrom[`${newY},${newX}`] = { x, y };
                        gScore[`${newY},${newX}`] = tentativeGScore;
                        fScore[`${newY},${newX}`] = gScore[`${newY},${newX}`] + heuristic(newX, newY, endX, endY);
                        if (!openSet.some(node => node.x === newX && node.y === newY)) {
                            openSet.push({ x: newX, y: newY });
                        }
                    }
                }
            }
        }
    }

    alert("No path found!");
    return path;
}

function heuristic(x1, y1, x2, y2) {
    return Math.abs(x1 - x2) + Math.abs(y1 - y2);
}

// Function to handle Run BFS button click
function runBFS() {
    if (!startSet) {
        alert("Please set both start and end nodes!");
        return;
    }
    bfs(startX, startY, endX, endY).then((path) => {
        bfsPath = path;
    });
}

// Function to handle Run DFS button click
function runDFS() {
    if (!startSet) {
        alert("Please set both start and end nodes!");
        return;
    }
    dfs(startX, startY, endX, endY).then((path) => {
        dijkstraPath = path;  // You can use `dijkstraPath` to store the DFS path
    });
}

// Function to handle Run A* button click
function runAStar() {
    if (!startSet) {
        alert("Please set both start and end nodes!");
        return;
    }
    aStar(startX, startY, endX, endY).then((path) => {
        bfsPath = path;  // You can use `bfsPath` to store the A* path
    });
}


// Handle mouse clicks
canvas.addEventListener("click", (event) => {
    if (animating) return;
    const rect = canvas.getBoundingClientRect();
    const x = Math.floor((event.clientX - rect.left) / cellSize);
    const y = Math.floor((event.clientY - rect.top) / cellSize);

    if (!startSet) {
        startX = x;
        startY = y;
        ctx.fillStyle = "blue";
        startSet = true;
    } else {
        endX = x;
        endY = y;
        ctx.fillStyle = "red";
    }

    ctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
});

// Function to start pathfinding animation
function startPathfinding() {
    if (!startSet) {
        alert("Please set both start and end nodes!");
        return;
    }
    animating = true;
    dijkstra(startX, startY, endX, endY).then(() => {
        animating = false;
    });
}

// Generate maze button click event
document.getElementById("generate-maze").addEventListener("click", generateMaze);
document.getElementById("start-pathfinding").addEventListener("click", startPathfinding);
document.getElementById("run-bfs").addEventListener("click", runBFS);

generateMaze();


var TxtType = function(el, toRotate, period) {
    this.toRotate = toRotate;
    this.el = el;
    this.loopNum = 0;
    this.period = parseInt(period, 10) || 2000;
    this.txt = '';
    this.tick();
    this.isDeleting = false;
};

TxtType.prototype.tick = function() {
    var i = this.loopNum % this.toRotate.length;
    var fullTxt = this.toRotate[i];

    if (this.isDeleting) {
        this.txt = fullTxt.substring(0, this.txt.length - 1);
    } else {
        this.txt = fullTxt.substring(0, this.txt.length + 1);
    }

    this.el.innerHTML = '<span class="wrap">'+this.txt+'</span>';

    var that = this;
    var delta = 200 - Math.random() * 100;

    if (this.isDeleting) { delta /= 2; }

    if (!this.isDeleting && this.txt === fullTxt) {
        delta = this.period;
        this.isDeleting = true;
    } else if (this.isDeleting && this.txt === '') {
        this.isDeleting = false;
        this.loopNum++;
        delta = 500;
    }

    setTimeout(function() {
        that.tick();
    }, delta);
};

window.onload = function() {
    var elements = document.getElementsByClassName('typewrite');
    for (var i=0; i<elements.length; i++) {
        var toRotate = elements[i].getAttribute('data-type');
        var period = elements[i].getAttribute('data-period');
        if (toRotate) {
            new TxtType(elements[i], JSON.parse(toRotate), period);
        }
    }
    // INJECT CSS
    var css = document.createElement("style");
    css.type = "text/css";
    css.innerHTML = ".typewrite > .wrap { border-right: 0.08em solid #fff}";
    document.body.appendChild(css);
};

