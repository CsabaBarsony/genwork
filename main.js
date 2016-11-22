let nodeMaxId = 1;
let edgeMaxId = 1;
class Node {
    constructor(connections = []) {
        this.connections = connections.map((c) => {
            if(!(c instanceof Node)) {
                throw new Error('Node constructor: connection is not a Node.');
            }
            return c;
        });
        this.id = 'n' + nodeMaxId++;
    }
    addConnection(connection) {
        let hasConnection = this.connections.some((c) => {
            return(Object.is(connection, c));
        });
        if(!hasConnection && !Object.is(connection, this)) {
            this.connections.push(connection);
        }
    }
}
let n1 = new Node();
let dna = [
    {
        rounds: 2,
        type: 1
    },
    {
        rounds: 1,
        type: 2
    }
];
let nodes = [n1];
dna.forEach((word) => {
    for(let i = 0; i < word.rounds; i++) {
        nodes.forEach((n) => {
            if(word.type === 1) {
                nodes.push(new Node(nodes));
            }
            else if(word.type === 2) {
                nodes.push(new Node([n]));
            }
        });
    }
});
// Display graph
let graph = [];
nodes.forEach((n) => {
    graph.push({
        data: {
            id: n.id
        }
    });
    n.connections.forEach((c) => {
        graph.push({
            data: {
                id: '' + n.id + ', ' + c.id,
                source: n.id,
                target: c.id
            }
        });
    });
});
let cy = cytoscape({
    container: document.getElementById('graph'),
    elements: graph,
    layout: {
        name: 'circle'
    },
    style: [
        {
            selector: 'node',
            style: {
                label: 'data(id)',
                size: 2
            }
        },
        {
            selector: 'edge',
            style: {
                'curve-style': 'bezier',
                'target-arrow-shape': 'triangle'
            }
        }
    ]
});
