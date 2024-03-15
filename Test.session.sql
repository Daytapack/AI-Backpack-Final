-- MySQL dump 10.13  Distrib 8.1.0, for macos13 (arm64)
--
-- Host: localhost    Database: BackPack
-- ------------------------------------------------------
-- Server version	8.1.0
​
/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;
​
--
-- Table structure for table `Apprenticeships`
--
​
DROP TABLE IF EXISTS `Apprenticeships`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Apprenticeships` (
  `ID` varchar(99) NOT NULL AUTO_INCREMENT,
  `Name` varchar(99) DEFAULT NULL,
  `Deadline` date DEFAULT NULL,
  `Wage` varchar(99) DEFAULT NULL,
  `Field` varchar(99) DEFAULT NULL,
  `Location` varchar(99) DEFAULT NULL,
  `Reqs` varchar(999) DEFAULT NULL,
  `Schedule` varchar(99) DEFAULT NULL,
  `Details` varchar(999) DEFAULT NULL,
  `Ed_Level` varchar(99) DEFAULT NULL,
  `URL` varchar(999) DEFAULT NULL,
  `Organization` varchar(99) DEFAULT NULL,
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
​
--
-- Table structure for table `Bootcamps`
--
​
DROP TABLE IF EXISTS `Bootcamps`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Bootcamps` (
  `ID` varchar(99) NOT NULL AUTO_INCREMENT,
  `Name` varchar(99) DEFAULT NULL,
  `Deadline` date DEFAULT NULL,
  `Field` varchar(99) DEFAULT NULL,
  `Certification` varchar(99) DEFAULT NULL,
  `Duration` varchar(99) DEFAULT NULL,
  `Pricing` varchar(99) DEFAULT NULL,
  `Schedule` varchar(99) DEFAULT NULL,
  `Details` varchar(999) DEFAULT NULL,
  `Location` varchar(99) DEFAULT NULL,
  `URL` varchar(999) DEFAULT NULL,
  `Organization` varchar(99) DEFAULT NULL,
  `Level` varchar(99) DEFAULT NULL,
  `Rating` varchar(99) DEFAULT NULL,
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB AUTO_INCREMENT=37 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
​
--
-- Table structure for table `Internships_Jobs`
--
​
DROP TABLE IF EXISTS `Internships_Jobs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Internships_Jobs` (
  `ID` varchar(99) NOT NULL AUTO_INCREMENT,
  `Name` varchar(99) DEFAULT NULL,
  `Deadline` date DEFAULT NULL,
  `Wage` varchar(99) DEFAULT NULL,
  `Benefits` varchar(999) DEFAULT NULL,
  `Job_Field` varchar(99) DEFAULT NULL,
  `Job_Type` varchar(99) DEFAULT NULL,
  `Schedule` varchar(99) DEFAULT NULL,
  `Location` varchar(99) DEFAULT NULL,
  `Details` varchar(999) DEFAULT NULL,
  `Ed_Level` varchar(99) DEFAULT NULL,
  `URL` varchar(999) DEFAULT NULL,
  `Company` varchar(99) DEFAULT NULL,
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB AUTO_INCREMENT=220 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
​
--
-- Table structure for table `Mentorships`
--
​
DROP TABLE IF EXISTS `Mentorships`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Mentorships` (
  `ID` varchar(99) NOT NULL AUTO_INCREMENT,
  `Name` varchar(99) DEFAULT NULL,
  `Deadline` date DEFAULT NULL,
  `Field` varchar(99) DEFAULT NULL,
  `Reqs` varchar(999) DEFAULT NULL,
  `Schedule` varchar(99) DEFAULT NULL,
  `Location` varchar(99) DEFAULT NULL,
  `Details` varchar(999) DEFAULT NULL,
  `URL` varchar(999) DEFAULT NULL,
  `Organization` varchar(99) DEFAULT NULL,
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
​
--
-- Table structure for table `Saved_Opportunities`
--
​
DROP TABLE IF EXISTS `Saved_Opportunities`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Saved_Opportunities` (
  `User_ID` varchar(99) NOT NULL,
  `Opp_ID` varchar(99) NOT NULL,
  `Opp_Type` varchar(99) DEFAULT NULL,
  `Saved_Date` date DEFAULT NULL,
  PRIMARY KEY (`User_ID`,`Opp_ID`),
  KEY `Opp_ID` (`Opp_ID`),
  CONSTRAINT `saved_opportunities_ibfk_1` FOREIGN KEY (`User_ID`) REFERENCES `Users` (`ID`),
  CONSTRAINT `saved_opportunities_ibfk_2` FOREIGN KEY (`Opp_ID`) REFERENCES `Internships_Jobs` (`ID`),
  CONSTRAINT `saved_opportunities_ibfk_3` FOREIGN KEY (`Opp_ID`) REFERENCES `Scholarships` (`ID`),
  CONSTRAINT `saved_opportunities_ibfk_4` FOREIGN KEY (`Opp_ID`) REFERENCES `Mentorships` (`ID`),
  CONSTRAINT `saved_opportunities_ibfk_5` FOREIGN KEY (`Opp_ID`) REFERENCES `Bootcamps` (`ID`),
  CONSTRAINT `saved_opportunities_ibfk_6` FOREIGN KEY (`Opp_ID`) REFERENCES `Apprenticeships` (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
​
--
-- Table structure for table `Scholarships`
--
​
DROP TABLE IF EXISTS `Scholarships`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Scholarships` (
  `ID` varchar(99) NOT NULL AUTO_INCREMENT,
  `Name` varchar(99) DEFAULT NULL,
  `Deadline` date DEFAULT NULL,
  `Field` varchar(999) DEFAULT NULL,
  `Background` varchar(99) DEFAULT NULL,
  `Award` varchar(99) DEFAULT NULL,
  `Reqs` varchar(999) DEFAULT NULL,
  `Schedule` varchar(99) DEFAULT NULL,
  `Amount` varchar(99) DEFAULT NULL,
  `Details` varchar(999) DEFAULT NULL,
  `Ed_Level` varchar(99) DEFAULT NULL,
  `URL` varchar(999) DEFAULT NULL,
  `Organization` varchar(99) DEFAULT NULL,
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB AUTO_INCREMENT=51 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
​
--
-- Table structure for table `Users`
--
​
DROP TABLE IF EXISTS `Users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Users` (
  `ID` varchar(99) NOT NULL AUTO_INCREMENT,
  `Name` varchar(99) DEFAULT NULL,
  `Password` varchar(99) DEFAULT NULL,
  `Ed_Level` varchar(99) DEFAULT NULL,
  `Field` varchar(99) DEFAULT NULL,
  `Bio` varchar(99) DEFAULT NULL,
  `Link_Acct` varchar(99) DEFAULT NULL,
  `Organization` varchar(99) DEFAULT NULL,
  `Location` varchar(99) DEFAULT NULL,
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;
​
/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
​
-- Dump completed on 2023-11-07 16:40:42