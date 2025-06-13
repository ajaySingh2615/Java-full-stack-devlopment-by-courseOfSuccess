-- MySQL dump 10.13  Distrib 8.0.42, for Win64 (x86_64)
--
-- Host: localhost    Database: panchamritam
-- ------------------------------------------------------
-- Server version	8.0.42

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `orders`
--

DROP TABLE IF EXISTS `orders`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `orders` (
  `order_id` int NOT NULL AUTO_INCREMENT,
  `user_id` int DEFAULT NULL,
  `address_id` int DEFAULT NULL,
  `total_price` decimal(10,2) DEFAULT NULL,
  `status` varchar(50) DEFAULT NULL,
  `payment_method` varchar(50) DEFAULT 'Cash on Delivery',
  `order_date` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `subtotal` decimal(10,2) NOT NULL DEFAULT '0.00',
  `total_tax` decimal(10,2) NOT NULL DEFAULT '0.00',
  `payment_id` varchar(255) DEFAULT NULL,
  `payment_status` enum('pending','processing','completed','failed','refunded') DEFAULT 'pending',
  `payment_gateway` varchar(50) DEFAULT NULL,
  `payment_transaction_id` varchar(255) DEFAULT NULL,
  `payment_amount` decimal(10,2) DEFAULT NULL,
  `payment_currency` varchar(3) DEFAULT 'INR',
  `payment_details` json DEFAULT NULL,
  `razorpay_order_id` varchar(255) DEFAULT NULL,
  `razorpay_payment_id` varchar(255) DEFAULT NULL,
  `razorpay_signature` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`order_id`),
  KEY `user_id` (`user_id`),
  KEY `address_id` (`address_id`),
  CONSTRAINT `orders_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`),
  CONSTRAINT `orders_ibfk_2` FOREIGN KEY (`address_id`) REFERENCES `addresses` (`address_id`)
) ENGINE=InnoDB AUTO_INCREMENT=22 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `orders`
--

LOCK TABLES `orders` WRITE;
/*!40000 ALTER TABLE `orders` DISABLE KEYS */;
INSERT INTO `orders` VALUES (1,3,2,6.98,'processing','Cash on Delivery','2025-04-22 11:33:30',0.00,0.00,NULL,'pending',NULL,NULL,NULL,'INR',NULL,NULL,NULL,NULL),(2,11,7,2137.86,'pending','cod','2025-05-08 10:24:36',1998.00,139.86,NULL,'pending',NULL,NULL,NULL,'INR',NULL,NULL,NULL,NULL),(3,12,6,2137.86,'pending','cod','2025-05-09 04:56:03',1998.00,139.86,NULL,'pending',NULL,NULL,NULL,'INR',NULL,NULL,NULL,NULL),(4,12,6,4275.72,'pending','cod','2025-05-09 10:58:59',3996.00,279.72,NULL,'pending',NULL,NULL,NULL,'INR',NULL,NULL,NULL,NULL),(5,11,7,996.00,'pending','cod','2025-05-10 06:07:59',996.00,0.00,NULL,'pending',NULL,NULL,NULL,'INR',NULL,NULL,NULL,NULL),(6,12,6,100.00,'pending','cod','2025-05-10 07:04:00',100.00,0.00,NULL,'pending',NULL,NULL,NULL,'INR',NULL,NULL,NULL,NULL),(7,12,6,2137.86,'pending','cod','2025-05-12 05:03:59',1998.00,139.86,NULL,'pending',NULL,NULL,NULL,'INR',NULL,NULL,NULL,NULL),(8,12,6,10.00,'pending','cod','2025-05-12 05:15:10',10.00,0.00,NULL,'pending',NULL,NULL,NULL,'INR',NULL,NULL,NULL,NULL),(9,12,6,10.00,'pending','cod','2025-05-12 05:25:58',10.00,0.00,NULL,'pending',NULL,NULL,NULL,'INR',NULL,NULL,NULL,NULL),(10,12,6,1068.93,'pending','cod','2025-05-12 06:30:54',999.00,69.93,NULL,'pending',NULL,NULL,NULL,'INR',NULL,NULL,NULL,NULL),(11,12,6,249.00,'pending','cod','2025-05-12 06:38:04',249.00,0.00,NULL,'pending',NULL,NULL,NULL,'INR',NULL,NULL,NULL,NULL),(12,12,6,1068.93,'pending','cod','2025-05-12 07:17:59',999.00,69.93,NULL,'pending',NULL,NULL,NULL,'INR',NULL,NULL,NULL,NULL),(13,12,6,498.00,'pending','cod','2025-05-12 10:41:10',498.00,0.00,NULL,'pending',NULL,NULL,NULL,'INR',NULL,NULL,NULL,NULL),(14,12,9,1068.93,'pending','cod','2025-05-12 12:39:20',999.00,69.93,NULL,'pending',NULL,NULL,NULL,'INR',NULL,NULL,NULL,NULL),(15,12,6,1068.93,'pending','cod','2025-05-13 05:07:39',999.00,69.93,NULL,'pending',NULL,NULL,NULL,'INR',NULL,NULL,NULL,NULL),(16,11,7,1068.93,'pending','cod','2025-05-16 09:46:13',999.00,69.93,NULL,'pending',NULL,NULL,NULL,'INR',NULL,NULL,NULL,NULL),(17,11,7,1068.93,'pending','cod','2025-05-16 10:05:59',999.00,69.93,NULL,'pending',NULL,NULL,NULL,'INR',NULL,NULL,NULL,NULL),(18,11,7,2137.86,'pending','cod','2025-06-02 10:49:07',1998.00,139.86,NULL,'pending',NULL,NULL,NULL,'INR',NULL,NULL,NULL,NULL),(19,12,6,2137.86,'pending','cod','2025-06-02 11:18:18',1998.00,139.86,NULL,'pending',NULL,NULL,NULL,'INR',NULL,NULL,NULL,NULL),(20,11,7,2137.86,'pending','cod','2025-06-07 20:01:35',1998.00,139.86,NULL,'pending',NULL,NULL,NULL,'INR',NULL,NULL,NULL,NULL),(21,11,7,1068.93,'pending','cod','2025-06-09 10:05:10',999.00,69.93,NULL,'pending',NULL,NULL,NULL,'INR',NULL,NULL,NULL,NULL);
/*!40000 ALTER TABLE `orders` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-06-12 15:06:40
