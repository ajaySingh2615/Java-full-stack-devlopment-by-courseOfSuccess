-- MySQL dump 10.13  Distrib 8.0.42, for Win64 (x86_64)
--
-- Host: localhost    Database: greenmagic
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
-- Table structure for table `products`
--

DROP TABLE IF EXISTS `products`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `products` (
  `product_id` int NOT NULL AUTO_INCREMENT,
  `barcode` varchar(50) DEFAULT NULL,
  `brand` varchar(100) DEFAULT NULL,
  `cost_price` decimal(10,2) DEFAULT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `delivery_time_estimate` varchar(50) DEFAULT NULL,
  `description` text,
  `dimensions` varchar(50) DEFAULT NULL,
  `eco_friendly` bit(1) DEFAULT NULL,
  `eco_friendly_details` varchar(255) DEFAULT NULL,
  `free_shipping` bit(1) DEFAULT NULL,
  `gallery_images` json DEFAULT NULL,
  `image_url` varchar(255) DEFAULT NULL,
  `ingredients` text,
  `is_best_seller` bit(1) DEFAULT NULL,
  `is_branded` bit(1) DEFAULT NULL,
  `is_cod_available` bit(1) DEFAULT NULL,
  `is_featured` bit(1) DEFAULT NULL,
  `is_new_arrival` bit(1) DEFAULT NULL,
  `is_packaged` bit(1) DEFAULT NULL,
  `is_returnable` bit(1) DEFAULT NULL,
  `meta_description` varchar(255) DEFAULT NULL,
  `meta_title` varchar(100) DEFAULT NULL,
  `min_stock_alert` int DEFAULT NULL,
  `name` varchar(100) DEFAULT NULL,
  `package_size` varchar(50) DEFAULT NULL,
  `price` decimal(10,2) DEFAULT NULL,
  `quantity` int DEFAULT NULL,
  `rating` decimal(2,1) DEFAULT NULL,
  `regular_price` decimal(10,2) DEFAULT NULL,
  `review_count` int DEFAULT NULL,
  `shelf_life` varchar(50) DEFAULT NULL,
  `shipping_time` varchar(50) DEFAULT NULL,
  `short_description` varchar(255) DEFAULT NULL,
  `sku` varchar(50) DEFAULT NULL,
  `slug` varchar(100) DEFAULT NULL,
  `status` enum('ACTIVE','DRAFT','INACTIVE') DEFAULT NULL,
  `storage_instructions` text,
  `subcategory_id` int DEFAULT NULL,
  `tags` varchar(255) DEFAULT NULL,
  `unit_of_measurement` varchar(20) DEFAULT NULL,
  `usage_instructions` text,
  `video_url` varchar(255) DEFAULT NULL,
  `warranty_period` int DEFAULT NULL,
  `weight_for_shipping` decimal(10,2) DEFAULT NULL,
  `category_id` int DEFAULT NULL,
  `created_by` int DEFAULT NULL,
  `custom_gst_rate_id` int DEFAULT NULL,
  `hsn_code_id` int DEFAULT NULL,
  PRIMARY KEY (`product_id`),
  KEY `idx_products_slug` (`slug`),
  KEY `idx_products_subcategory` (`subcategory_id`),
  KEY `idx_products_barcode` (`barcode`),
  KEY `FKog2rp4qthbtt2lfyhfo32lsw9` (`category_id`),
  KEY `FKl0lce8i162ldn9n01t2a6lcix` (`created_by`),
  KEY `FKp0bx946n4dh78lvbg6dvgipkp` (`custom_gst_rate_id`),
  KEY `FK40ye3y62m5rfuj8wxxgsh1k0n` (`hsn_code_id`),
  CONSTRAINT `FK40ye3y62m5rfuj8wxxgsh1k0n` FOREIGN KEY (`hsn_code_id`) REFERENCES `hsn_codes` (`hsn_id`),
  CONSTRAINT `FKl0lce8i162ldn9n01t2a6lcix` FOREIGN KEY (`created_by`) REFERENCES `users` (`user_id`),
  CONSTRAINT `FKog2rp4qthbtt2lfyhfo32lsw9` FOREIGN KEY (`category_id`) REFERENCES `categories` (`category_id`),
  CONSTRAINT `FKp0bx946n4dh78lvbg6dvgipkp` FOREIGN KEY (`custom_gst_rate_id`) REFERENCES `gst_rates` (`rate_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `products`
--

LOCK TABLES `products` WRITE;
/*!40000 ALTER TABLE `products` DISABLE KEYS */;
/*!40000 ALTER TABLE `products` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-06-13 17:13:53
