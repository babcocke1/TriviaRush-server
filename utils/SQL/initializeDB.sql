
drop table if exists questions;
CREATE TABLE IF NOT EXISTS questions (
    qid serial PRIMARY KEY,
    question VARCHAR(200) UNIQUE NOT NULL,
    answer1 VARCHAR(200),
    correct1 bool,
    answer2 VARCHAR(200),
    correct2 bool,
    answer3 VARCHAR(200),
    correct3 bool,
    answer4 VARCHAR(200),
    correct4 bool    
);
INSERT INTO questions(question, answer1, correct1, answer2, correct2, answer3, correct3, answer4, correct4)

VALUES
('What is the tallest mountain in the world', 'Mount Everest', true, 'Mount Kilimanjaro', false, 'Mount Fuji', false, 'Glassford Hill', false),
('What country has the highest population', 'United States', false, 'Russia', false, 'China', true, 'United Kingdom', false),
('Which is an Olympic event', 'Boxing', true, 'Breakdancing', false, 'Football', false, 'Kickball', false),
('Which state is a peninsula', 'Arizona', false, 'California', false, 'Maine', false, 'Florida', true),
('What pro basketball team plays in Phoenix', 'Suns', true, 'Bucks', false, 'Lakers', false, 'Heat', false),
('What is the longest river in Africa', 'The Nile', true, 'Mississippi River', false, 'The Ganges', false, 'The Amazon River', false),
('What is the smallest country in the world', 'Liechtenstein', false, 'Monaco', false, 'The Vatican City', true, 'San Marino', false),
('How long is a marathon', '26.2 miles', true, '25.5 miles', false, '26.8 miles', false, '22.6 miles', false),
('How many players are on the field for a team in soccer', '5', false, '11', true, '12', false, '6', false),
('What planet is closest to the Earth', 'Venus', true, 'Mars', false, 'Mercury', false, 'Jupiter', false),
('What is the largest city in the world', 'Delhi', false, 'Shanghai', false, 'Mexico City', false, 'Tokyo', true),
('How often is the world cup held', 'Every 2 yrs', false, 'Every 4 yrs', true, 'Every 5 yrs', false, 'Every 6 yrs', false),
('In what ocean is the Bermuda Triangle located', 'Atlantic', true, 'Pacific', false, 'Idian', false, 'Arctic', false),
('Who holds the record for the fastest sprint', 'Usain Bolt', true, 'Tyson Gay', false, 'Yohan Blake', false, 'Asafa Powell', false),
('How many time zones are in Russia', '8', false, '10', false, '11', true, '14', false),
('Where can the Amazon Rainforest be found', 'Argentina', false, 'Colombia', true, 'Costa Rica', false, 'Uruguay', false),
('Which NBA player has won the most championships', 'Bill Russell', true, 'Lebron James', false, 'Micheal Jordan', false, 'Wilt Chamberlain', false),
('Which Arizona sports team has won a championship most recent', 'Suns', false, 'Diamondbacks', false, 'Cardinals', false, 'Mercury', true),
('Where can Machu Picchu be found', 'Peru', true, 'Chile', false, 'Brazil', false, 'Colombia', false),
('Who created the programming language C++?', 'John Travolta', false, 'Rich Hickey', false, 'James Gosling', false, 'Bjarne Stroustrup', true),
('Which popular company designed the first CPU?', 'Acer', false, 'Qualcomm', false, 'Intel Corporations', true, 'Advanced Micro Devices', false),
('Which of these is an input device?', 'Printer', false, 'Mouse', true, 'Monitor', false, 'None of the above', false),
('The first computers were programmed using', 'Basic', false, 'Cobol', false, 'machine language', true, 'Fortran', false),
('RAM stands for?', 'Randomized accessed memory', false, 'Random access memory', true, 'Read-only memory', false, 'Reliable ageless memory', false),
('Which of the following is not a computer language?', 'Basic', false, 'Algol', false, 'Fortran', false, 'Speak', true),
('How do you pronounce SCSI?', 'sucksy', false, 'sicksy', false, 'scuzzy', true, 'ess cee ess eye', false),
('Which is bigger?', 'double', true, 'long', false, 'float', false, 'char', false),
('What does the “D” in “DRAM” stand for?', 'Dynamic', true, 'Digital', false, 'Distinctive', false, 'Dysfunctional', false),
('What do you use to indicated that the program executed successfully? (C++)', 'return 1', false, 'getLost', false, 'break', false, 'return 0', true),
('Who won the NBA MVP in 2021', 'Lebron James', false, 'Nikola Jokic', true, 'Kevin Durant', false, 'Giannis Antetokounmpo', false);