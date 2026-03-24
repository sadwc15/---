-- 1. 先创建数据库（如果已存在则不会重复创建）
CREATE DATABASE IF NOT EXISTS fitness_db DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- 2. 选择要操作的数据库（核心！必须执行）
USE fitness_db;

/*
 Navicat Premium Data Transfer

 Source Server         : test
 Source Server Type    : MySQL
 Source Server Version : 80032
 Source Host           : localhost:3306
 Source Schema         : fitness_db

 Target Server Type    : MySQL
 Target Server Version : 80032
 File Encoding         : 65001

 Date: 16/03/2026 23:08:34
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for admins
-- ----------------------------
DROP TABLE IF EXISTS `admins`;
CREATE TABLE `admins`  (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `addtime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `password` varchar(255) CHARACTER SET gb2312 COLLATE gb2312_chinese_ci NULL DEFAULT NULL,
  `role` varchar(255) CHARACTER SET gb2312 COLLATE gb2312_chinese_ci NULL DEFAULT NULL,
  `username` varchar(255) CHARACTER SET gb2312 COLLATE gb2312_chinese_ci NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 2 CHARACTER SET = gb2312 COLLATE = gb2312_chinese_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of admins
-- ----------------------------
INSERT INTO `admins` VALUES (1, '2026-01-05 18:54:01', 'admin', 'ADMIN', 'admin');

-- ----------------------------
-- Table structure for bookings
-- ----------------------------
DROP TABLE IF EXISTS `bookings`;
CREATE TABLE `bookings`  (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `member_id` bigint NOT NULL,
  `course_id` bigint NOT NULL,
  `status` int NULL DEFAULT 0,
  `booking_time` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `session_status` int NULL DEFAULT 0,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `member_id`(`member_id` ASC) USING BTREE,
  INDEX `course_id`(`course_id` ASC) USING BTREE,
  CONSTRAINT `bookings_ibfk_1` FOREIGN KEY (`member_id`) REFERENCES `members` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `bookings_ibfk_2` FOREIGN KEY (`course_id`) REFERENCES `courses` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 24 CHARACTER SET = utf8mb3 COLLATE = utf8mb3_general_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of bookings
-- ----------------------------
INSERT INTO `bookings` VALUES (1, 2, 21, 2, NULL, 0);
INSERT INTO `bookings` VALUES (2, 2, 11, 2, NULL, 0);
INSERT INTO `bookings` VALUES (3, 2, 21, 1, NULL, 0);
INSERT INTO `bookings` VALUES (5, 2, 1, 1, NULL, 0);
INSERT INTO `bookings` VALUES (6, 2, 1, 1, NULL, 0);
INSERT INTO `bookings` VALUES (7, 2, 1, 1, NULL, 0);
INSERT INTO `bookings` VALUES (8, 2, 4, 1, '2025-12-04 07:52:39', 0);
INSERT INTO `bookings` VALUES (9, 4, 1, 1, '2025-12-05 00:43:38', 0);
INSERT INTO `bookings` VALUES (10, 4, 4, 1, '2025-12-05 00:44:39', 0);
INSERT INTO `bookings` VALUES (11, 7, 1, 1, '2025-12-09 09:03:53', 0);
INSERT INTO `bookings` VALUES (12, 7, 4, 1, '2025-12-09 09:04:59', 0);
INSERT INTO `bookings` VALUES (14, 8, 10, 1, '2025-12-09 09:20:48', 0);
INSERT INTO `bookings` VALUES (15, 9, 4, 1, '2025-12-20 17:07:20', 0);
INSERT INTO `bookings` VALUES (16, 9, 22, 1, '2025-12-20 17:07:40', 0);
INSERT INTO `bookings` VALUES (17, 9, 1, 1, '2025-12-20 17:07:58', 0);
INSERT INTO `bookings` VALUES (18, 2, 22, 1, '2025-12-24 02:18:42', 0);
INSERT INTO `bookings` VALUES (19, 2, 23, 1, '2026-03-12 14:14:04', 2);
INSERT INTO `bookings` VALUES (20, 1, 19, 1, '2026-03-14 04:34:20', 2);
INSERT INTO `bookings` VALUES (21, 1, 11, 1, '2026-03-15 04:48:15', 2);
INSERT INTO `bookings` VALUES (22, 2, 19, 1, '2026-03-14 09:04:14', 1);
INSERT INTO `bookings` VALUES (23, 2, 20, 1, '2026-03-16 14:52:33', 2);

-- ----------------------------
-- Table structure for class_records
-- ----------------------------
DROP TABLE IF EXISTS `class_records`;
CREATE TABLE `class_records`  (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `booking_id` bigint NOT NULL,
  `content` text CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NULL,
  `mood` varchar(50) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NULL DEFAULT NULL,
  `record_time` datetime NULL DEFAULT CURRENT_TIMESTAMP,
  `images` varchar(1024) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 8 CHARACTER SET = utf8mb3 COLLATE = utf8mb3_general_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of class_records
-- ----------------------------
INSERT INTO `class_records` VALUES (1, 3, '非常棒的一节课！原本担心的膝盖问题完全没有出现，发力感找得很准。', '非常专注', '2025-12-03 02:04:04', 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=500');
INSERT INTO `class_records` VALUES (2, 4, '111', '进步明显', '2025-12-03 02:51:33', 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=500');
INSERT INTO `class_records` VALUES (3, 7, 'hao ', '非常专注', '2025-12-04 07:54:40', NULL);
INSERT INTO `class_records` VALUES (4, 5, '111111111', '状态爆棚', '2025-12-04 07:54:48', NULL);
INSERT INTO `class_records` VALUES (5, 6, '1234567', '非常专注', '2025-12-04 07:54:31', 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=500');
INSERT INTO `class_records` VALUES (6, 12, '111111', '稍显疲惫', '2025-12-09 09:07:03', 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=500');
INSERT INTO `class_records` VALUES (7, 13, '不错', '非常专注', '2025-12-09 09:23:31', 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=500');

-- ----------------------------
-- Table structure for coaches
-- ----------------------------
DROP TABLE IF EXISTS `coaches`;
CREATE TABLE `coaches`  (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `name` varchar(100) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL,
  `expertise` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NULL DEFAULT NULL,
  `bio` text CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NULL,
  `avatar` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NULL DEFAULT NULL,
  `phone` varchar(20) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NULL DEFAULT NULL,
  `password` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NULL DEFAULT '123456',
  `last_login_time` datetime(6) NULL DEFAULT NULL,
  `login_count` int NULL DEFAULT NULL,
  `tags` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NULL DEFAULT '耐心|专业|负责',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 10 CHARACTER SET = utf8mb3 COLLATE = utf8mb3_general_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of coaches
-- ----------------------------
INSERT INTO `coaches` VALUES (1, 'Tony老师', '增肌塑形', '拥有10年健身房教学经验，擅长快速改变体态。', 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=200', '13900001111', '123456', '2026-03-16 14:53:34.040000', 22, '乐观|勤勉|积极');
INSERT INTO `coaches` VALUES (2, 'Lucy', '瑜伽/普拉提', '国际RYT200认证瑜伽导师，专注于身心疗愈。', 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200', '13900002222', '1234567', '2025-12-04 10:09:30.508049', 2, '美丽自信|敦敦教诲');
INSERT INTO `coaches` VALUES (3, 'Mike', '拳击格斗', '前职业泰拳手，带你体验高强度的热血格斗。', 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=200', '13900003333', '123456', '2026-03-14 06:08:59.279617', 1, '肌肉猛男|耐心细致|负责');
INSERT INTO `coaches` VALUES (6, '王牌格斗-Mike', '泰拳/散打', '前职业拳手，主要教授实战防身技巧。', 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200', '13900004444', '123456', NULL, NULL, '实战派|严厉|防身术');
INSERT INTO `coaches` VALUES (8, '增肌狂魔-Jack', '健美/力量', '擅长三大项力量提升，帮助瘦人增肌。', 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=200', '13900006666', '123456', NULL, NULL, '力量|硬核|饮食');
INSERT INTO `coaches` VALUES (9, '减脂专家-Vicky', 'HIIT/有氧', '带你快乐暴汗，高效燃脂。', 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200', '13900007777', '123456', NULL, NULL, '活力|热情|高效');

-- ----------------------------
-- Table structure for coupons
-- ----------------------------
DROP TABLE IF EXISTS `coupons`;
CREATE TABLE `coupons`  (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `code` varchar(50) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL,
  `discount_amount` double NULL DEFAULT NULL,
  `min_spend` double NULL DEFAULT NULL,
  `status` varchar(20) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NULL DEFAULT 'ACTIVE',
  `expire_date` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `code`(`code` ASC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 3 CHARACTER SET = utf8mb3 COLLATE = utf8mb3_general_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of coupons
-- ----------------------------
INSERT INTO `coupons` VALUES (1, 'NEWUSER20', 20, 0, 'ACTIVE', '2026-12-31 23:59:59');
INSERT INTO `coupons` VALUES (2, 'VIP50', 50, 0, 'ACTIVE', '2026-12-31 23:59:59');

-- ----------------------------
-- Table structure for courses
-- ----------------------------
DROP TABLE IF EXISTS `courses`;
CREATE TABLE `courses`  (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `title` varchar(100) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL,
  `description` text CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NULL,
  `type` enum('PRIVATE','GROUP','CAMP') CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NULL DEFAULT NULL,
  `price` double NULL DEFAULT NULL,
  `capacity` int NOT NULL,
  `start_time` timestamp NOT NULL,
  `coach_id` bigint NULL DEFAULT NULL,
  `image` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NULL DEFAULT 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=300',
  `duration` int NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `coach_id`(`coach_id` ASC) USING BTREE,
  CONSTRAINT `courses_ibfk_1` FOREIGN KEY (`coach_id`) REFERENCES `coaches` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 33 CHARACTER SET = utf8mb3 COLLATE = utf8mb3_general_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of courses
-- ----------------------------
INSERT INTO `courses` VALUES (1, '晨间唤醒瑜伽', NULL, 'PRIVATE', 49, 1, '2025-12-03 08:00:00', 2, 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=300', 60);
INSERT INTO `courses` VALUES (4, '已满员的热门课', '这是一节用来测试满员逻辑的课程。', 'CAMP', 9, 0, '2025-12-03 10:00:00', 1, 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=300', 10);
INSERT INTO `courses` VALUES (10, '格斗体能训练', '释放压力，燃烧卡路里', 'GROUP', 89, 10, '2025-12-01 05:00:24', 3, 'https://images.unsplash.com/photo-1599058945522-28d584b6f0ff?w=300', NULL);
INSERT INTO `courses` VALUES (11, '核心力量进阶', '打造钢铁腹肌', 'PRIVATE', 69, 15, '2026-03-15 16:00:00', 1, 'http://tmp/RQNl7MUkOFsO35bd7db888ab861f990ba612544f0268.png', 80);
INSERT INTO `courses` VALUES (12, '流瑜伽 Flow', '身心舒展', 'GROUP', 79, 12, '2025-12-02 05:00:24', 2, 'https://images.unsplash.com/photo-1588286840104-8957b019727f?w=300', NULL);
INSERT INTO `courses` VALUES (13, '燃脂搏击操', '跟着音乐节奏出拳', 'GROUP', 59, 20, '2025-12-02 14:00:24', 3, 'https://images.unsplash.com/photo-1544367563-12123d8965cd?w=300', NULL);
INSERT INTO `courses` VALUES (18, 'Mike·泰拳一对一', '泰拳实战教学，提升爆发力', 'PRIVATE', 400, 0, '2025-11-29 19:36:29', 6, 'https://images.unsplash.com/photo-1599058945522-28d584b6f0ff?w=300', NULL);
INSERT INTO `courses` VALUES (19, 'Anna·瑜伽私教', '一对一纠正体式，深度拉伸', 'PRIVATE', 350, 1, '2025-11-29 19:36:29', 1, 'https://images.unsplash.com/photo-1588286840104-8957b019727f?w=300', NULL);
INSERT INTO `courses` VALUES (20, 'Jack·力量增肌课', '突破平台期，打造麒麟臂', 'PRIVATE', 300, 1, '2025-11-29 19:36:29', 8, 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=300', NULL);
INSERT INTO `courses` VALUES (21, 'Vicky·极速燃脂', '全身循环训练，快速减重', 'PRIVATE', 280, 0, '2025-11-29 19:36:29', 9, 'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=300', NULL);
INSERT INTO `courses` VALUES (22, '跑步', NULL, 'PRIVATE', 38, 1, '2025-12-01 02:00:00', 2, 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=300', NULL);
INSERT INTO `courses` VALUES (23, '课程1', '课程1测试功能', 'PRIVATE', 50, 1, '2025-12-04 16:00:00', 1, 'http://tmp/luBUTxfiPMeYb9fe307b62e5a77bae2d622389edae09.png', 20);
INSERT INTO `courses` VALUES (26, '测试课程', '测试内容', 'PRIVATE', 9.99, 1, '2026-03-15 00:00:00', 1, 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=500', 60);

-- ----------------------------
-- Table structure for favorites
-- ----------------------------
DROP TABLE IF EXISTS `favorites`;
CREATE TABLE `favorites`  (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `member_id` bigint NOT NULL,
  `target_id` bigint NOT NULL,
  `type` varchar(20) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL,
  `create_time` datetime NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 9 CHARACTER SET = utf8mb3 COLLATE = utf8mb3_general_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of favorites
-- ----------------------------
INSERT INTO `favorites` VALUES (1, 2, 1, 'PRODUCT', '2025-12-02 06:59:37');
INSERT INTO `favorites` VALUES (2, 2, 2, 'PRODUCT', '2025-12-02 06:59:38');
INSERT INTO `favorites` VALUES (3, 4, 1, 'PRODUCT', '2025-12-05 00:42:54');
INSERT INTO `favorites` VALUES (4, 7, 1, 'PRODUCT', '2025-12-09 09:05:37');
INSERT INTO `favorites` VALUES (5, 8, 1, 'PRODUCT', '2025-12-09 09:19:02');
INSERT INTO `favorites` VALUES (6, 8, 2, 'PRODUCT', '2025-12-09 09:19:03');
INSERT INTO `favorites` VALUES (7, 8, 3, 'PRODUCT', '2025-12-09 09:19:05');
INSERT INTO `favorites` VALUES (8, 2, 1, 'PRODUCT', '2025-12-24 02:19:41');

-- ----------------------------
-- Table structure for member_coupons
-- ----------------------------
DROP TABLE IF EXISTS `member_coupons`;
CREATE TABLE `member_coupons`  (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `member_id` bigint NOT NULL,
  `coupon_id` bigint NOT NULL,
  `is_used` tinyint(1) NULL DEFAULT 0,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `member_id`(`member_id` ASC) USING BTREE,
  INDEX `coupon_id`(`coupon_id` ASC) USING BTREE,
  CONSTRAINT `member_coupons_ibfk_1` FOREIGN KEY (`member_id`) REFERENCES `members` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `member_coupons_ibfk_2` FOREIGN KEY (`coupon_id`) REFERENCES `coupons` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8mb3 COLLATE = utf8mb3_general_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of member_coupons
-- ----------------------------

-- ----------------------------
-- Table structure for member_profile
-- ----------------------------
DROP TABLE IF EXISTS `member_profile`;
CREATE TABLE `member_profile`  (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `member_id` bigint NOT NULL COMMENT '关联 members 表',
  `birthday` date NULL DEFAULT NULL COMMENT '生日',
  `gender` tinyint NULL DEFAULT NULL COMMENT '性别 0未知 1男 2女',
  `address` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '详细地址',
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `uk_member_id`(`member_id` ASC) USING BTREE,
  CONSTRAINT `fk_member_profile_member_id` FOREIGN KEY (`member_id`) REFERENCES `members` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci COMMENT = '会员扩展信息表' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of member_profile
-- ----------------------------
INSERT INTO `member_profile` VALUES (2, 1, '2026-03-16', 2, 'xxxx');
INSERT INTO `member_profile` VALUES (3, 2, '2026-03-16', 2, '我到');
INSERT INTO `member_profile` VALUES (4, 3, '2026-03-16', 0, 'dwasdwa');

-- ----------------------------
-- Table structure for members
-- ----------------------------
DROP TABLE IF EXISTS `members`;
CREATE TABLE `members`  (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `name` varchar(100) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL,
  `phone` varchar(20) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL,
  `avatar` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NULL DEFAULT NULL,
  `balance` double NULL DEFAULT NULL,
  `level` int NULL DEFAULT 0,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `password` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NULL DEFAULT '123456',
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `phone`(`phone` ASC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 10 CHARACTER SET = utf8mb3 COLLATE = utf8mb3_general_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of members
-- ----------------------------
INSERT INTO `members` VALUES (1, '土豪用户', '13800008888', 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200', 9675, 2, '2025-11-29 10:14:09', '123456');
INSERT INTO `members` VALUES (2, '健身小白', '13800001111', 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200', 8992, 0, '2025-11-29 10:14:09', '123456');
INSERT INTO `members` VALUES (3, '健身达人', '13800002222', 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=300', 420, 1, '2025-11-29 10:14:09', '123456');
INSERT INTO `members` VALUES (4, '铁哥', '13800003333', NULL, 8808, 0, '2025-12-05 00:41:50', '123456');
INSERT INTO `members` VALUES (5, '大猩猩', '13800004444', NULL, 41, 0, '2025-12-05 07:48:51', '123456');
INSERT INTO `members` VALUES (6, '小猩猩', '13800005555', NULL, 1000, 0, '2025-12-05 07:53:09', '123456');
INSERT INTO `members` VALUES (7, '小明', '13800006666', NULL, 100, 0, '2025-12-09 09:02:03', '123456');
INSERT INTO `members` VALUES (8, '小李1', '13800007777', NULL, 512, 0, '2025-12-09 09:16:25', '123456');
INSERT INTO `members` VALUES (9, '2222', '13800009999', NULL, 9700, 0, '2025-12-20 17:02:28', '123456');

-- ----------------------------
-- Table structure for news
-- ----------------------------
DROP TABLE IF EXISTS `news`;
CREATE TABLE `news`  (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `title` varchar(200) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL,
  `content` text CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NULL,
  `publish_time` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `image` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 12 CHARACTER SET = utf8mb3 COLLATE = utf8mb3_general_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of news
-- ----------------------------
INSERT INTO `news` VALUES (1, '新店开业大酬宾', '所有课程8折优惠...', '2025-11-29 11:12:52', 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=300');
INSERT INTO `news` VALUES (2, '夏季减脂训练营报名中', '21天极速蜕变...', '2025-11-29 11:12:52', 'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=300');
INSERT INTO `news` VALUES (3, '健身科普：为什么你天天练却没有腹肌？', '很多人认为只要做卷腹就能练出腹肌，其实这是最大的误区。腹肌的显露主要取决于体脂率... 点击查看完整饮食计划。', '2025-11-29 18:48:29', 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=300');
INSERT INTO `news` VALUES (4, '会员福利：本周五“瑜伽之夜”免费体验', '为了感谢大家的支持，本周五晚8点，我们将邀请国际认证瑜伽大师... 名额有限，先到先得！', '2025-11-29 18:48:29', 'https://images.unsplash.com/photo-1599901860904-17e6ed7083a0?w=300');
INSERT INTO `news` VALUES (5, '冬季营业时间调整通知', '尊敬的会员您好，受季节影响，从12月1日起，闭馆时间调整为22:30...', '2025-11-29 18:48:29', 'https://images.unsplash.com/photo-1554284126-aa88f22d8b74?w=300');
INSERT INTO `news` VALUES (6, '健身科普：为什么你天天练却没有腹肌？', '很多人认为只要做卷腹就能练出腹肌，其实这是最大的误区。腹肌的显露主要取决于体脂率... 点击查看完整饮食计划。', '2025-11-29 19:00:24', 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=300');
INSERT INTO `news` VALUES (7, '会员福利：本周五“瑜伽之夜”免费体验', '为了感谢大家的支持，本周五晚8点，我们将邀请国际认证瑜伽大师... 名额有限，先到先得！', '2025-11-29 19:00:24', 'https://images.unsplash.com/photo-1599901860904-17e6ed7083a0?w=300');

-- ----------------------------
-- Table structure for order_receiver
-- ----------------------------
DROP TABLE IF EXISTS `order_receiver`;
CREATE TABLE `order_receiver`  (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `product_orders_id` bigint NOT NULL COMMENT '关联product_orders表的订单ID',
  `name` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '收货人姓名',
  `phone` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '收货人手机号',
  `address` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '收货地址',
  `create_time` datetime NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `uk_order_id`(`product_orders_id` ASC) USING BTREE,
  CONSTRAINT `fk_order_receiver_product_orders` FOREIGN KEY (`product_orders_id`) REFERENCES `product_orders` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci COMMENT = '订单收货信息表' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of order_receiver
-- ----------------------------
INSERT INTO `order_receiver` VALUES (1, 10, 'xxx', '13800008888', 'sdasdasd', '2026-03-16 14:38:18');
INSERT INTO `order_receiver` VALUES (2, 11, 'xxx', '13800008888', 'sdasdasd', '2026-03-16 14:38:42');
INSERT INTO `order_receiver` VALUES (3, 12, 'xxx', '13800008888', 'sdasdasd', '2026-03-16 14:40:02');
INSERT INTO `order_receiver` VALUES (4, 13, 'xxx', '13800008888', 'sdasdasd', '2026-03-16 14:42:56');
INSERT INTO `order_receiver` VALUES (5, 14, 'xxx', '13800008888', 'sdasdasd', '2026-03-16 14:44:17');
INSERT INTO `order_receiver` VALUES (6, 15, 'xxx', '13800002222', 'xxxx', '2026-03-16 14:47:27');
INSERT INTO `order_receiver` VALUES (7, 16, 'jdwioa', '13800001111', 'sasdojwia', '2026-03-16 14:51:23');
INSERT INTO `order_receiver` VALUES (8, 17, 'kkk', '13800001111', '户撒大苏打', '2026-03-16 14:52:23');

-- ----------------------------
-- Table structure for orders
-- ----------------------------
DROP TABLE IF EXISTS `orders`;
CREATE TABLE `orders`  (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `member_id` bigint NOT NULL,
  `course_id` bigint NOT NULL,
  `amount` double NULL DEFAULT NULL,
  `status` varchar(20) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NULL DEFAULT 'PENDING',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `member_id`(`member_id` ASC) USING BTREE,
  INDEX `course_id`(`course_id` ASC) USING BTREE,
  CONSTRAINT `orders_ibfk_1` FOREIGN KEY (`member_id`) REFERENCES `members` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `orders_ibfk_2` FOREIGN KEY (`course_id`) REFERENCES `courses` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8mb3 COLLATE = utf8mb3_general_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of orders
-- ----------------------------

-- ----------------------------
-- Table structure for product_orders
-- ----------------------------
DROP TABLE IF EXISTS `product_orders`;
CREATE TABLE `product_orders`  (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `member_id` bigint NOT NULL,
  `product_id` bigint NOT NULL,
  `product_name` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NULL DEFAULT NULL,
  `price` double NULL DEFAULT NULL,
  `image` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NULL DEFAULT NULL,
  `create_time` datetime NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 14 CHARACTER SET = utf8mb3 COLLATE = utf8mb3_general_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of product_orders
-- ----------------------------
INSERT INTO `product_orders` VALUES (1, 2, 1, '蛋白粉', 399, 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=300', '2025-12-03 01:07:53');
INSERT INTO `product_orders` VALUES (2, 2, 1, '蛋白粉', 399, 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=300', '2025-12-03 01:08:17');
INSERT INTO `product_orders` VALUES (3, 2, 1, '蛋白粉', 88, 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=300', '2025-12-04 03:46:27');
INSERT INTO `product_orders` VALUES (4, 2, 2, '瑜伽垫', 89, 'https://images.unsplash.com/photo-1599901860904-17e6ed7083a0?w=300', '2025-12-04 04:04:41');
INSERT INTO `product_orders` VALUES (5, 2, 3, '大容量运动水杯', 59, 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=300', '2025-12-04 05:24:27');
INSERT INTO `product_orders` VALUES (6, 7, 1, '蛋白粉', 70, 'https://images.unsplash.com/photo-1693996046865-19217d179161?w=700&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8cHJvdGVpbiUyMHNoYWtlfGVufDB8fDB8fHww', '2025-12-09 09:05:47');
INSERT INTO `product_orders` VALUES (7, 8, 1, '蛋白粉', 80, 'https://images.unsplash.com/photo-1693996046865-19217d179161?w=700&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8cHJvdGVpbiUyMHNoYWtlfGVufDB8fDB8fHww', '2025-12-09 09:19:22');
INSERT INTO `product_orders` VALUES (8, 2, 1, '蛋白粉', 80, 'https://images.unsplash.com/photo-1693996046865-19217d179161?w=700&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8cHJvdGVpbiUyMHNoYWtlfGVufDB8fDB8fHww', '2026-03-16 14:09:42');
INSERT INTO `product_orders` VALUES (9, 1, 1, '蛋白粉', 80, 'https://images.unsplash.com/photo-1693996046865-19217d179161?w=700&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8cHJvdGVpbiUyMHNoYWtlfGVufDB8fDB8fHww', '2026-03-16 14:31:53');
INSERT INTO `product_orders` VALUES (10, 1, 1, '蛋白粉', 80, 'https://images.unsplash.com/photo-1693996046865-19217d179161?w=700&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8cHJvdGVpbiUyMHNoYWtlfGVufDB8fDB8fHww', '2026-03-16 14:38:18');
INSERT INTO `product_orders` VALUES (11, 1, 2, '瑜伽垫', 89, 'https://images.unsplash.com/photo-1591291621164-2c6367723315?w=700&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8eW9nYSUyMG1hdHxlbnwwfHwwfHx8MA%3D%3D', '2026-03-16 14:38:42');
INSERT INTO `product_orders` VALUES (12, 4, 1, '蛋白粉', 80, 'https://images.unsplash.com/photo-1693996046865-19217d179161?w=700&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8cHJvdGVpbiUyMHNoYWtlfGVufDB8fDB8fHww', '2026-03-16 14:40:02');
INSERT INTO `product_orders` VALUES (13, 2, 3, '大容量运动水杯', 59, 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=300', '2026-03-16 14:42:56');
INSERT INTO `product_orders` VALUES (14, 5, 3, '大容量运动水杯', 59, 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=300', '2026-03-16 14:44:17');
INSERT INTO `product_orders` VALUES (15, 3, 1, '蛋白粉', 80, 'https://images.unsplash.com/photo-1693996046865-19217d179161?w=700&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8cHJvdGVpbiUyMHNoYWtlfGVufDB8fDB8fHww', '2026-03-16 14:47:27');
INSERT INTO `product_orders` VALUES (16, 2, 4, '家用哑铃组合', 129, 'https://images.unsplash.com/photo-1638536532686-d610adfc8e5c?w=300', '2026-03-16 14:51:23');
INSERT INTO `product_orders` VALUES (17, 2, 2, '瑜伽垫', 89, 'https://images.unsplash.com/photo-1591291621164-2c6367723315?w=700&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8eW9nYSUyMG1hdHxlbnwwfHwwfHx8MA%3D%3D', '2026-03-16 14:52:23');

-- ----------------------------
-- Table structure for products
-- ----------------------------
DROP TABLE IF EXISTS `products`;
CREATE TABLE `products`  (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `name` varchar(100) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL,
  `price` double NULL DEFAULT NULL,
  `image` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NULL DEFAULT NULL,
  `description` text CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NULL,
  `stock` int NULL DEFAULT 100,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 17 CHARACTER SET = utf8mb3 COLLATE = utf8mb3_general_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of products
-- ----------------------------
INSERT INTO `products` VALUES (1, '蛋白粉', 80, 'https://images.unsplash.com/photo-1693996046865-19217d179161?w=700&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8cHJvdGVpbiUyMHNoYWtlfGVufDB8fDB8fHww', '增肌必备', 74);
INSERT INTO `products` VALUES (2, '瑜伽垫', 89, 'https://images.unsplash.com/photo-1591291621164-2c6367723315?w=700&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8eW9nYSUyMG1hdHxlbnwwfHwwfHx8MA%3D%3D', '防滑加厚', 97);
INSERT INTO `products` VALUES (3, '大容量运动水杯', 59, 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=300', '2L超大容量，食品级材质', 197);
INSERT INTO `products` VALUES (4, '家用哑铃组合', 129, 'https://images.unsplash.com/photo-1638536532686-d610adfc8e5c?w=300', '可调节重量，防滑设计', 49);
INSERT INTO `products` VALUES (5, '乳清蛋白粉 (巧克力味)', 200, 'https://images.unsplash.com/photo-1593095948071-474c5cc2989d?w=300', '进口原料，高纯度分离乳清蛋白，增肌首选。', 50);
INSERT INTO `products` VALUES (6, '防滑运动手套', 45, 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=300', '透气防磨，保护手掌，大重量训练必备。', 200);
INSERT INTO `products` VALUES (7, '筋膜枪 Pro版', 599, 'https://images.unsplash.com/photo-1611908200005-b898ddde09cf?w=700&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8TWFzc2FnZSUyMGd1bnxlbnwwfHwwfHx8MA%3D%3D', '深层肌肉放松，超长续航，静音降噪。', 30);
INSERT INTO `products` VALUES (8, '男士速干紧身衣', 129, 'https://plus.unsplash.com/premium_photo-1726403133956-849d7a587da8?w=700&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8YXRobGV0aWMlMjB3ZWFyfGVufDB8fDB8fHww', '吸汗排湿，高弹力面料，展现肌肉线条。', 100);

SET FOREIGN_KEY_CHECKS = 1;
