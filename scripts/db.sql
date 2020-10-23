CREATE SCHEMA `zoom`;

USE 'zoom';

CREATE TABLE `meeting` (
  `participants` int(11) DEFAULT NULL,
  `date` varchar(25) DEFAULT NULL,
  `class` varchar(45) DEFAULT NULL,
  `meetingID` varchar(45) NOT NULL,
  PRIMARY KEY (`meetingID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


CREATE TABLE `participants` (
  `meetingID` int(11) NOT NULL,
  `name` varchar(45) DEFAULT NULL,
  `joinTime` varchar(45) DEFAULT NULL,
  `leaveTime` varchar(45) DEFAULT NULL,
  `duration` int(11) DEFAULT NULL,
  `user_id` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`meetingID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

