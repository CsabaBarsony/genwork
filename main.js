let nodeMaxId = 1;
let edgeMaxId = 1;
class Node {
    constructor(actions, generation, connections = []) {
        this.entry = actions.entry;
        this.exit = actions.exit;
        this.generation = generation;
        this.connections = connections.map((c) => {
            if(!(c.node instanceof Node)) {
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
let n1 = new Node({ entry: null, exit: null }, 0);
let dna = [
    {
        rounds: 1,
        type: 3,
        event: 1,
        entry: 1,
        exit: null
    },
    {
        rounds: 1,
        type: 1,
        event: 2,
        entry: 2,
        exit: 3
    },
    {
        rounds: 1,
        type: 2,
        event: 3,
        entry: null,
        exit: 2
    }
];
let generation = 0;
let nodes = [n1];
dna.forEach((word) => {
    for(let i = 0; i < word.rounds; i++) {
        generation++;
        nodes.forEach((parent) => {
            var connections = nodes.map((n) => {
                return {
                    node: n,
                    event: word.event
                };
            });
            if(word.type === 1) {
                nodes.push(new Node({ entry: word.entry, exit: word.exit }, generation, connections));
            }
            else if(word.type === 2) {
                nodes.push(new Node({ entry: word.entry, exit: word.exit }, generation, [{ node: parent, event: word.event }]));
            }
            else if(word.type === 3) {
                var newNode = new Node({ entry: word.entry, exit: word.exit }, generation);
                parent.addConnection({ node: newNode, event: word.event });
                nodes.push(newNode);
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
                id: '' + n.id + ', ' + c.node.id,
                source: n.id,
                target: c.node.id
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
let finishStates = 0;
nodes.forEach((n) => {
    if(n.connections.length === 0) finishStates++;
});
console.log('finish state ratio: ' + ((1 / (finishStates / nodes.length)) / nodes.length));
