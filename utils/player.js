export class Player {
    constructor(name, pid, socket, score, state) {
        this.name = name;
        this.pid = pid;
        this.socket = socket;
        this.score = score;
        this.state = state;
    }
}
