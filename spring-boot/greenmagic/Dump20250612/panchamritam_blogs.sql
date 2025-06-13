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
-- Table structure for table `blogs`
--

DROP TABLE IF EXISTS `blogs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `blogs` (
  `blog_id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(200) DEFAULT NULL,
  `slug` varchar(255) DEFAULT NULL,
  `content` text,
  `excerpt` text,
  `featured_image` varchar(500) DEFAULT NULL,
  `gallery_images` json DEFAULT NULL,
  `status` enum('draft','published','scheduled','archived') DEFAULT 'draft',
  `published_at` timestamp NULL DEFAULT NULL,
  `scheduled_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `meta_title` varchar(60) DEFAULT NULL,
  `meta_description` varchar(160) DEFAULT NULL,
  `meta_keywords` varchar(255) DEFAULT NULL,
  `og_title` varchar(60) DEFAULT NULL,
  `og_description` varchar(160) DEFAULT NULL,
  `og_image` varchar(500) DEFAULT NULL,
  `reading_time` int DEFAULT '0',
  `view_count` int DEFAULT '0',
  `is_featured` tinyint(1) DEFAULT '0',
  `allow_comments` tinyint(1) DEFAULT '1',
  `tags` json DEFAULT NULL,
  `category_id` int DEFAULT NULL,
  `author_id` int DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`blog_id`),
  UNIQUE KEY `slug` (`slug`),
  KEY `author_id` (`author_id`),
  KEY `idx_slug` (`slug`),
  KEY `idx_status` (`status`),
  KEY `idx_published_at` (`published_at`),
  KEY `idx_category_id` (`category_id`),
  KEY `idx_is_featured` (`is_featured`),
  CONSTRAINT `blogs_ibfk_1` FOREIGN KEY (`author_id`) REFERENCES `users` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `blogs`
--

LOCK TABLES `blogs` WRITE;
/*!40000 ALTER TABLE `blogs` DISABLE KEYS */;
INSERT INTO `blogs` VALUES (2,'New Blog Post',NULL,'This is the content of the blog post. It can be a long text with formatting if needed.',NULL,NULL,NULL,'draft',NULL,NULL,'2025-05-28 09:37:09',NULL,NULL,NULL,NULL,NULL,NULL,0,0,0,1,NULL,NULL,2,'2025-04-23 06:36:33'),(3,'The Future of Natural Farming: A Sustainable Revolution','the-future-of-natural-farming-a-sustainable-revolution','<p data-start=\"408\" data-end=\"739\">Natural farming is more than just a trend&mdash;it\'s a return to age-old practices that align with nature. Unlike conventional farming, which relies heavily on synthetic fertilizers and pesticides, natural farming embraces organic methods, minimal soil disturbance, and the use of natural inputs like cow dung, compost, and green manure.</p>\n<p data-start=\"741\" data-end=\"935\">Farmers across the world are rediscovering the benefits of this sustainable approach. It reduces dependency on expensive chemical inputs, protects local ecosystems, and produces healthier crops.</p>\n<p data-start=\"937\" data-end=\"1105\">In India, pioneers like Subhash Palekar have advocated for Zero Budget Natural Farming (ZBNF), emphasizing low-cost farming techniques that benefit small-scale farmers.</p>\n<blockquote data-start=\"1107\" data-end=\"1175\">\n<p data-start=\"1109\" data-end=\"1175\">&ldquo;The best fertilizer is the farmer\'s footsteps.&rdquo; &ndash; Subhash Palekar</p>\n</blockquote>\n<p data-start=\"1177\" data-end=\"1315\">As global demand for clean and sustainable food grows, natural farming is set to play a crucial role in shaping the future of agriculture.</p>','Natural farming is transforming agriculture by promoting chemical-free, eco-friendly methods that restore soil health and biodiversity.','https://sortoutinnovation.com/images/update/home-page/hero-section/sortout-innovation-hero-image.webp',NULL,'published','2025-05-28 06:13:00',NULL,'2025-06-09 06:38:53','The Future of Natural Farming: A Sustainable Revolution','Explore how natural farming is changing the face of agriculture with eco-friendly practices and healthier produce.','natural farming, organic agriculture, sustainable farming, ZBNF','The Future of Natural Farming: A Sustainable Revolution','Discover how natural farming methods are revolutionizing agriculture sustainably and naturally.','https://sortoutinnovation.com/images/update/home-page/hero-section/sortout-innovation-hero-image.webp',1,71,1,1,NULL,1,11,'2025-05-28 11:43:47');
/*!40000 ALTER TABLE `blogs` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-06-12 15:06:41
