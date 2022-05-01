
CREATE TABLE IF NOT EXISTS questions (
    qid serial PRIMARY KEY,
    question VARCHAR(50) UNIQUE NOT NULL,
    answer1 VARCHAR(50),
    correct1 bool,
    answer2 VARCHAR(50),
    correct2 bool,
    answer3 VARCHAR(50),
    correct3 bool,
    answer4 VARCHAR(50),
    correct4 bool    
);
INSERT INTO questions (question, answer1, correct1, answer2,
            correct2, answer3, correct3, answer4, correct4) 
VALUES 
('What is a computer','"a computer', true, 'w', false,'w', false,'w', false);