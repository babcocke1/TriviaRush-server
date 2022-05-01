const playerToGame = new Map();
const gidToGame = new Map();
const pool = require("./database")
function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}
  
const createQuestion = (id) => {
    // pool.query('SELECT NOW()', (err, res) => {
    //     console.log(err, res);
    //   })
    // console.log(res);
    // await pool.end()

    answer = getRandomInt(4) + 1
    question = {questionText: "choose " + answer + ":"};
    question.id = id;
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
        // start with empty object so this.questions[5] = question #5
        this.questions = [{}];
        this.currentQuestion = 0;
        this.isActive = true;
    }
    startGame() {
        if (!this.isActive) return;
        this.p1.socket.join(this.gid) 
        this.p2.socket.join(this.gid)
        console.log(this.p1.socket.id)
        console.log(this.p2.socket.id)
        this.gameBehavior();
        this.currentQuestion = 1;
        this.sendQuestion(true);
        
    }
    getQuestion() {
        if (!this.isActive) return;
        let question = createQuestion(this.currentQuestion);
        let clientQuestion = {
            you: {name: this.p1.name, score: this.p1.score},
            opponent: {name: this.p2.name, score: this.p2.score},
            text: question.questionText,
            answers: question.answers,
            number: question.id
        }
        this.questions.push(question);
        return clientQuestion;
    }
    sendQuestion(first) {
        if (!this.isActive) return;
        // console.log(this.io);
        if (this.currentQuestion >= 20) {
            this.endGame(3) ;
            return
        }
        let clientQuestion = this.getQuestion();
        console.log(clientQuestion);
        console.log(this.questions);
        let question = this.questions[clientQuestion.number]
        console.log(question);
        question.active = true;
        
        if (first) {
            this.p1.socket.emit("startgame", clientQuestion);
            let temp = clientQuestion.you
            clientQuestion.you = clientQuestion.opponent;
            clientQuestion.opponent = temp;
            this.p2.socket.emit("startgame", clientQuestion);
        }
        else {
            this.p1.socket.emit("question", clientQuestion);
            let temp = clientQuestion.you
            clientQuestion.you = clientQuestion.opponent;
            clientQuestion.opponent = temp;
            this.p2.socket.emit("question", clientQuestion);
        }
        
        setTimeout(this.finishQuestion.bind(this), 25000, question);
    }
    gameBehavior() {
        if (!this.isActive) return;
        this.p1.socket.on("answer", (answer) => this.handleAnswer(answer, this.p1, 0));
        this.p2.socket.on("answer", (answer) => this.handleAnswer(answer, this.p2, 1));
        console.log("executed");
    }
    handleAnswer(playerResponse, player, playerNumber) {
        if (!this.isActive) return;
        console.log("answer rxd")
        if (!this.isActive) {
            socket.emit("game_disconnected")
        }
        const q = this.questions[playerResponse.number];
        const result = {};
        if (!q.active) 
            return;
        
        result.millis = Date.now();
        result.player = player;
        console.log(player.score);
        console.log(playerResponse)
        // console.log(q.answers)
        console.log(q.answers[playerResponse.playerChoice])
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
        if (!this.isActive) return;
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
        if (this.p1.score == 5) {
            this.endGame(1);
        }
        else if (this.p2.score == 5) {
            this.endGame(2);
        }

        this.sendScores();
        
        setTimeout(this.sendQuestion.bind(this), 2000);
    }
    sendScores() {
        if (!this.isActive) return;
        console.log("send scores")
        let score = {you: {
            name: this.p1.name, score: this.p1.score
        }, opponent: {
            name: this.p2.name, score: this.p2.score
        }}
        this.p1.socket.emit("score", score);
        score = {you: {
            name: this.p2.name, score: this.p2.score
        }, opponent: {
            name: this.p1.name, score: this.p1.score
        }}
        this.p2.socket.emit("score", score);
    }
    endGame(winner) {
        this.isActive = false;
        if (winner == 1) {
            this.p1.socket.emit("gameover", {text:"win"});
            this.p2.socket.emit("gameover", {text:"lose"});
        }
        else if (winner == 2) {
            this.p2.socket.emit("gameover", {text:"win"});
            this.p1.socket.emit("gameover", {text:"lose"});
        }
        else {
            this.p1.socket.disconnect();
            this.p2.socket.disconnect();
        }

    }
}

module.exports = Game; 