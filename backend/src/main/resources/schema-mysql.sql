-- quiz 表
CREATE TABLE if not exists `quiz` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(60) NOT NULL,
  `description` varchar(200) NOT NULL,
  `start_date` date DEFAULT NULL,
  `end_date` date DEFAULT NULL,
  `is_published` tinyint DEFAULT '0',
  `user_account` varchar(45) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- question 表
CREATE TABLE `question` (
  `quiz_id` int NOT NULL,
  `quest_id` int NOT NULL,
  `question_title` varchar(45) NOT NULL,
  `type` varchar(45) NOT NULL,
  `options` varchar(200) DEFAULT 'null',
  PRIMARY KEY (`quiz_id`,`quest_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- feedback 表
CREATE TABLE `feedback` (
  `user_name` varchar(20) NOT NULL,
  `email` varchar(45) NOT NULL,
  `age` int DEFAULT '0',
  `quiz_id` int NOT NULL,
  `question_id` int NOT NULL,
  `answers` varchar(200) DEFAULT 'null',
  `fillin_time` datetime DEFAULT NULL,
  `gender` varchar(5) DEFAULT 'null',
  PRIMARY KEY (`email`,`quiz_id`,`question_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- user 表
CREATE TABLE `user` (
  `account` varchar(45) NOT NULL,
  `password` varchar(60) NOT NULL,
  `email` varchar(45) NOT NULL,
  PRIMARY KEY (`account`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;