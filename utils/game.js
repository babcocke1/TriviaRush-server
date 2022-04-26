const playerToGame = new Map();
const gidToGame = new Map();

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}
  
const createQuestion = (id) => {
    answer = getRandomInt(4) + 1
    question = {questionText: "choose " + answer + ":"};
    question.id = id
    answers = [
        { answer: 1, correct: false},
        { answer: 2, correct: false},
        { answer: 3, correct: false},
        { answer: 4, correct: false}
    ]
    question.playerAnswers = [0,0]
    question.active = false;
    answers[answer-1].correct = true;
    question.answers = answers;
    // console.log(question);
    return question;
}


class Game {
    constructor(p1,p2,io) {
        
        //passing socketio server instance
        this.io = io;
        // initialize scores
        p1.score = 0;
        p2.score = 0;
        // //initialize sockets
        p1.socket = this.io.sockets.sockets.get(p1.pid);
        p2.socket = this.io.sockets.sockets.get(p2.pid);
        //add players
        this.p1 = p1;
        this.p2 = p2;
        
        // create and add unique game id
        const pids = [p1.pid, p2.pid].sort();
        this.gid = pids[0] + pids[1];
        
        // map player id to game
        playerToGame.set(p1.pid,this);
        playerToGame.set(p2.pid,this);
        
        // map game id to game
        gidToGame.set(this.gid, this);

        // this.questions 
        this.questions = new Map()
        for (const i of Array(9).keys()) {
            this.questions.set(i, createQuestion(i));
        } 
        this.currentQuestion = 0
        this.isActive = true;
        console.log(this.questions.get(0));
    }
    startGame() {
        this.p1.socket.join(this.gid) 
        this.p2.socket.join(this.gid)
        console.log(this.p1.socket.id)
        console.log(this.p2.socket.id)
        this.io.to(this.gid).emit("start", "");
        this.gameBehavior();
        setTimeout(this.sendQuestion.bind(this), 4000);
    }
    sendQuestion() {
        // console.log(this.io);
        question = this.questions.get(this.currentQuestion);
        question.active = true;
        this.io.to(this.gid).emit("question", question);
        setTimeout(this.finishQuestion.bind(this), 15000, question);
    }
    gameBehavior() {
        this.p1.socket.on("answer", (answer) => this.handleAnswer(answer, this.p1, 0));
        this.p2.socket.on("answer", (answer) => this.handleAnswer(answer, this.p2, 1));
        console.log("executed");
    }
    handleAnswer(playerResponse, player, playerNumber) {
        const q = this.questions.get(playerResponse.questionId);
        const result = {};
        console.log("wtf")
        if (!q.active) 
            return;
        
        result.millis = Date.now();
        result.player = player;
        console.log(player.score);
        console.log(playerResponse)
        // console.log(q.answers)

        console.log(q.answers[playerResponse.playerChoice]);

        if (q.answers[playerResponse.playerChoice].correct) 
            result.correct = true;
        else 
            result.correct = false;

        q.playerAnswers[playerNumber] = result;
        
        console.log(q.questionText);
        console.log(q.playerAnswers);
        if (q.playerAnswers[0] !== 0 &&
            q.playerAnswers[1] !== 0) {
                this.finishQuestion(question);
            }
        // check if answer is correct
        // record answer time
        // check if second answer
        //    yes: finishQuestion
        //    no: record answer
        // check if question is still active
    }
    //called when both players have answered and at timeout
    finishQuestion(question) {
        const points = [0,0]
        console.log("finishing Question");

        // there is probably a very unlikely concurrency issue here.
        // if call from setTimeout interrups inbetween this if statement 
        // and question.active = false; below it would likely be bad
        if (!question.active) {
            return;
        }
        question.active = false;
        let p1Result = question.playerAnswers[0];
        let p2Result = question.playerAnswers[1];
        if (p1Result == 0 && p2Result == 0) 
            ;// do nothing
        else if (p1Result == 0) {
            if (p2Result.correct === true) {
                ++this.p2.score;
            }
        }
        else if (p2Result == 0) {
            if (p1Result.correct === true) {
                ++this.p1.score;
            }
        }
        else if (p1Result.correct === true && p2Result.correct === true){
            // tie should never occur as nodejs runs on one thread 
            // if answers are received and processed in same milli
            // let p2 have the point I guess 
            if (p1Result.millis < p2Result.millis) 
                ++this.p1.score;
            else 
                ++this.p2.score;
        }
        else {
            if (p1Result.correct === true) {
                ++this.p1.score;
            }
            if (p2Result.correct === true) {
                ++this.p2.score;
            }
        }

        ++this.currentQuestion;
        // send score update
        this.sendScores();
        
        setTimeout(this.sendQuestion.bind(this), 2000);
    }
    sendScores() {
        console.log("send scores")
        let score = {you: this.p1.score, opponent: this.p2.score}
        this.p1.socket.emit("score", score);
        score = {you: this.p2.score, opponent: this.p1.score}
        this.p2.socket.emit("score", score);
    }

}

module.exports = Game;