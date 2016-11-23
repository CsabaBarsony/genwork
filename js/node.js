/**
 * @global
 */

class Node {
    constructor(actions, generation, connections = []) {
        this.entry = actions.entry;
        this.exit = actions.exit;
        this.generation = generation;
        connections.forEach((c) => {
            if(!c.node || !c.event || !(c.node instanceof Node)) {
                throw new Error('Node constructor: connection is not a Node.');
            }
        });
        this.connections = connections;
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
