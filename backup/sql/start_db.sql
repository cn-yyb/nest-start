/*
Navicat MySQL Data Transfer

Source Server         : mysql
Source Server Version : 80030
Source Host           : localhost:3306
Source Database       : start_db

Target Server Type    : MYSQL
Target Server Version : 80030
File Encoding         : 65001

Date: 2023-01-09 17:13:33
*/

SET FOREIGN_KEY_CHECKS=0;

-- ----------------------------
-- Table structure for chat_room
-- ----------------------------
DROP TABLE IF EXISTS `chat_room`;
CREATE TABLE `chat_room` (
  `chat_id` smallint NOT NULL AUTO_INCREMENT COMMENT '房间号',
  `chat_name` varchar(45) DEFAULT NULL COMMENT '群名称',
  `chat_avatar` varchar(200) DEFAULT NULL COMMENT '群头像',
  `owner` varchar(45) DEFAULT NULL COMMENT '群主ID（私聊默认未空）',
  `status` tinyint DEFAULT '0' COMMENT '房间状态：0 正常 | 1-禁言 | 2-封禁 ',
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  `deleted_at` datetime DEFAULT NULL,
  PRIMARY KEY (`chat_id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ----------------------------
-- Records of chat_room
-- ----------------------------
INSERT INTO `chat_room` VALUES ('1', null, null, null, '0', '2023-01-07 16:15:18', '2023-01-07 16:15:18', null);

-- ----------------------------
-- Table structure for contact
-- ----------------------------
DROP TABLE IF EXISTS `contact`;
CREATE TABLE `contact` (
  `contact_id` smallint NOT NULL AUTO_INCREMENT COMMENT '联系人编号',
  `uid` varchar(36) NOT NULL,
  `group_id` int DEFAULT NULL,
  `chat_id` smallint DEFAULT NULL,
  `friend_uid` char(36) DEFAULT NULL,
  `contact_name` varchar(45) DEFAULT NULL COMMENT '联系人昵称',
  `remark` varchar(45) DEFAULT NULL COMMENT '备注',
  `type` int DEFAULT '0' COMMENT '类型 0-私聊 | 1-群聊',
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  `deleted_at` datetime DEFAULT NULL,
  PRIMARY KEY (`contact_id`,`uid`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ----------------------------
-- Records of contact
-- ----------------------------
INSERT INTO `contact` VALUES ('2', '433fb276-c040-4c5f-9924-7fbb55e3863b', '1', '1', 'a4fd6633-f61f-49c1-9563-4115f2e725dd', null, null, '0', '2023-01-07 16:15:18', '2023-01-07 16:15:18', null);
INSERT INTO `contact` VALUES ('3', 'a4fd6633-f61f-49c1-9563-4115f2e725dd', '2', '1', '433fb276-c040-4c5f-9924-7fbb55e3863b', null, null, '0', '2023-01-07 16:15:18', '2023-01-07 16:15:18', null);

-- ----------------------------
-- Table structure for contact_group
-- ----------------------------
DROP TABLE IF EXISTS `contact_group`;
CREATE TABLE `contact_group` (
  `group_id` smallint NOT NULL AUTO_INCREMENT COMMENT '分组id',
  `uid` char(36) NOT NULL,
  `group_name` varchar(45) DEFAULT NULL COMMENT '分组名称',
  `group_order` int DEFAULT NULL COMMENT '分组排序',
  `type` int DEFAULT NULL COMMENT '分类类型：0-系统初始默认 | 1-系统默认 | 2-用户自定义 ',
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  `deleted_at` datetime DEFAULT NULL,
  PRIMARY KEY (`group_id`,`uid`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ----------------------------
-- Records of contact_group
-- ----------------------------
INSERT INTO `contact_group` VALUES ('1', 'a4fd6633-f61f-49c1-9563-4115f2e725dd', '我的好友', '-1', '0', '2023-01-07 15:57:40', '2023-01-07 15:57:40', null);
INSERT INTO `contact_group` VALUES ('2', '433fb276-c040-4c5f-9924-7fbb55e3863b', '我的好友', '-1', '0', '2023-01-07 15:58:45', '2023-01-07 15:58:45', null);

-- ----------------------------
-- Table structure for email_verify
-- ----------------------------
DROP TABLE IF EXISTS `email_verify`;
CREATE TABLE `email_verify` (
  `id` smallint NOT NULL AUTO_INCREMENT,
  `email` varchar(45) DEFAULT NULL COMMENT '验证邮箱',
  `verify_code` varchar(6) DEFAULT NULL COMMENT '验证码',
  `expiration_time` datetime DEFAULT NULL COMMENT '过期时间',
  `indate` int DEFAULT NULL COMMENT '有效期（标准时间戳）',
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  `deleted_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ----------------------------
-- Records of email_verify
-- ----------------------------
INSERT INTO `email_verify` VALUES ('1', '244175902@qq.com', '720498', '2023-01-07 16:27:22', '1800000', '2023-01-07 15:57:22', '2023-01-07 15:57:22', null);
INSERT INTO `email_verify` VALUES ('2', 'sdpzhong@163.com', '280303', '2023-01-07 16:28:32', '1800000', '2023-01-07 15:58:32', '2023-01-07 15:58:32', null);

-- ----------------------------
-- Table structure for message
-- ----------------------------
DROP TABLE IF EXISTS `message`;
CREATE TABLE `message` (
  `msg_id` smallint NOT NULL AUTO_INCREMENT COMMENT '消息编号',
  `sender_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '发送者uid',
  `receiver_id` char(36) DEFAULT NULL COMMENT '接收者uid(可为空)',
  `msg_type` int DEFAULT NULL COMMENT '0-文字 | 1-图片 | 2-音频 | 3-视频 | 4-emoji | 5-文件 | 6-分享链接 | 7- 定位位置 ',
  `content` varchar(255) DEFAULT NULL COMMENT '消息内容',
  `status` int DEFAULT '0' COMMENT '0-未读|1-已读|2-已撤回|3-已删除',
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  `deleted_at` datetime DEFAULT NULL,
  `chat_id` int DEFAULT NULL COMMENT '房间号',
  PRIMARY KEY (`msg_id`,`sender_id`)
) ENGINE=InnoDB AUTO_INCREMENT=33 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ----------------------------
-- Records of message
-- ----------------------------
INSERT INTO `message` VALUES ('1', '433fb276-c040-4c5f-9924-7fbb55e3863b', 'a4fd6633-f61f-49c1-9563-4115f2e725dd', null, 'hello world!!!', '0', '2023-01-07 16:16:44', '2023-01-07 16:16:44', null, '1');
INSERT INTO `message` VALUES ('2', '433fb276-c040-4c5f-9924-7fbb55e3863b', 'a4fd6633-f61f-49c1-9563-4115f2e725dd', null, 'hello world!!!', '0', '2023-01-07 16:16:50', '2023-01-07 16:16:50', null, '1');
INSERT INTO `message` VALUES ('3', 'a4fd6633-f61f-49c1-9563-4115f2e725dd', '433fb276-c040-4c5f-9924-7fbb55e3863b', null, 'hello world!!!', '0', '2023-01-07 16:16:57', '2023-01-07 16:16:57', null, '1');
INSERT INTO `message` VALUES ('4', '433fb276-c040-4c5f-9924-7fbb55e3863b', 'a4fd6633-f61f-49c1-9563-4115f2e725dd', null, 'hello world!!!', '0', '2023-01-07 16:17:02', '2023-01-07 16:17:02', null, '1');
INSERT INTO `message` VALUES ('5', '433fb276-c040-4c5f-9924-7fbb55e3863b', 'a4fd6633-f61f-49c1-9563-4115f2e725dd', null, 'hello world!!!', '0', '2023-01-07 16:18:29', '2023-01-07 16:18:29', null, '1');
INSERT INTO `message` VALUES ('6', '433fb276-c040-4c5f-9924-7fbb55e3863b', 'a4fd6633-f61f-49c1-9563-4115f2e725dd', null, 'hello world!!!', '0', '2023-01-07 16:19:48', '2023-01-07 16:19:48', null, '1');
INSERT INTO `message` VALUES ('7', '433fb276-c040-4c5f-9924-7fbb55e3863b', 'a4fd6633-f61f-49c1-9563-4115f2e725dd', null, 'hello world!!!', '0', '2023-01-07 16:19:57', '2023-01-07 16:19:57', null, '1');
INSERT INTO `message` VALUES ('8', '433fb276-c040-4c5f-9924-7fbb55e3863b', 'a4fd6633-f61f-49c1-9563-4115f2e725dd', null, 'hello world!!!', '0', '2023-01-07 16:20:17', '2023-01-07 16:20:17', null, '1');
INSERT INTO `message` VALUES ('9', 'a4fd6633-f61f-49c1-9563-4115f2e725dd', '433fb276-c040-4c5f-9924-7fbb55e3863b', null, 'hello world!!!', '0', '2023-01-07 16:20:27', '2023-01-07 16:20:27', null, '1');
INSERT INTO `message` VALUES ('10', 'a4fd6633-f61f-49c1-9563-4115f2e725dd', '433fb276-c040-4c5f-9924-7fbb55e3863b', null, 'hello world!!!', '0', '2023-01-07 16:20:29', '2023-01-07 16:20:29', null, '1');
INSERT INTO `message` VALUES ('11', 'a4fd6633-f61f-49c1-9563-4115f2e725dd', '433fb276-c040-4c5f-9924-7fbb55e3863b', null, 'hello world!!!', '0', '2023-01-07 16:20:34', '2023-01-07 16:20:34', null, '1');
INSERT INTO `message` VALUES ('12', '433fb276-c040-4c5f-9924-7fbb55e3863b', 'a4fd6633-f61f-49c1-9563-4115f2e725dd', null, 'hello world!!!', '0', '2023-01-07 16:20:41', '2023-01-07 16:20:41', null, '1');
INSERT INTO `message` VALUES ('13', '433fb276-c040-4c5f-9924-7fbb55e3863b', 'a4fd6633-f61f-49c1-9563-4115f2e725dd', null, 'hello world!!!', '0', '2023-01-07 16:21:08', '2023-01-07 16:21:08', null, '1');
INSERT INTO `message` VALUES ('14', '433fb276-c040-4c5f-9924-7fbb55e3863b', 'a4fd6633-f61f-49c1-9563-4115f2e725dd', null, 'hello world!!!', '0', '2023-01-07 16:21:13', '2023-01-07 16:21:13', null, '1');
INSERT INTO `message` VALUES ('15', '433fb276-c040-4c5f-9924-7fbb55e3863b', 'a4fd6633-f61f-49c1-9563-4115f2e725dd', null, 'hello world!!!', '0', '2023-01-07 16:21:52', '2023-01-07 16:21:52', null, '1');
INSERT INTO `message` VALUES ('16', '433fb276-c040-4c5f-9924-7fbb55e3863b', 'a4fd6633-f61f-49c1-9563-4115f2e725dd', null, 'hello world!!!', '0', '2023-01-07 16:23:53', '2023-01-07 16:23:53', null, '1');
INSERT INTO `message` VALUES ('17', '433fb276-c040-4c5f-9924-7fbb55e3863b', 'a4fd6633-f61f-49c1-9563-4115f2e725dd', null, 'hello world!!!', '0', '2023-01-07 16:24:06', '2023-01-07 16:24:06', null, '1');
INSERT INTO `message` VALUES ('18', '433fb276-c040-4c5f-9924-7fbb55e3863b', 'a4fd6633-f61f-49c1-9563-4115f2e725dd', null, 'hello world!!!', '0', '2023-01-07 16:25:52', '2023-01-07 16:25:52', null, '1');
INSERT INTO `message` VALUES ('19', '433fb276-c040-4c5f-9924-7fbb55e3863b', 'a4fd6633-f61f-49c1-9563-4115f2e725dd', null, 'hello world!!!', '0', '2023-01-07 16:26:46', '2023-01-07 16:26:46', null, '1');
INSERT INTO `message` VALUES ('20', '433fb276-c040-4c5f-9924-7fbb55e3863b', 'a4fd6633-f61f-49c1-9563-4115f2e725dd', null, '啦啦啦啦啦啦!!!', '0', '2023-01-07 16:27:19', '2023-01-07 16:27:19', null, '1');
INSERT INTO `message` VALUES ('21', '433fb276-c040-4c5f-9924-7fbb55e3863b', 'a4fd6633-f61f-49c1-9563-4115f2e725dd', null, '啦啦啦!!!我是sdpzhong', '0', '2023-01-07 16:28:23', '2023-01-07 16:28:23', null, '1');
INSERT INTO `message` VALUES ('22', 'a4fd6633-f61f-49c1-9563-4115f2e725dd', '433fb276-c040-4c5f-9924-7fbb55e3863b', null, '我是admin!!!', '0', '2023-01-07 16:28:27', '2023-01-07 16:28:27', null, '1');
INSERT INTO `message` VALUES ('23', '433fb276-c040-4c5f-9924-7fbb55e3863b', 'a4fd6633-f61f-49c1-9563-4115f2e725dd', null, '啦啦啦!!!我是sdpzhong', '0', '2023-01-07 16:30:18', '2023-01-07 16:30:18', null, '1');
INSERT INTO `message` VALUES ('24', 'a4fd6633-f61f-49c1-9563-4115f2e725dd', '433fb276-c040-4c5f-9924-7fbb55e3863b', null, '我是admin!!!', '0', '2023-01-07 16:30:21', '2023-01-07 16:30:21', null, '1');
INSERT INTO `message` VALUES ('25', '433fb276-c040-4c5f-9924-7fbb55e3863b', 'a4fd6633-f61f-49c1-9563-4115f2e725dd', null, '啦啦啦!!!我是sdpzhong', '0', '2023-01-07 16:30:32', '2023-01-07 16:30:32', null, '1');
INSERT INTO `message` VALUES ('26', 'a4fd6633-f61f-49c1-9563-4115f2e725dd', '433fb276-c040-4c5f-9924-7fbb55e3863b', null, '我是admin!!!', '0', '2023-01-07 16:31:23', '2023-01-07 16:31:23', null, '1');
INSERT INTO `message` VALUES ('27', '433fb276-c040-4c5f-9924-7fbb55e3863b', 'a4fd6633-f61f-49c1-9563-4115f2e725dd', null, '啦啦啦!!!我是sdpzhong', '0', '2023-01-07 16:31:27', '2023-01-07 16:31:27', null, '1');
INSERT INTO `message` VALUES ('28', 'a4fd6633-f61f-49c1-9563-4115f2e725dd', '433fb276-c040-4c5f-9924-7fbb55e3863b', null, '我是admin!!!', '0', '2023-01-07 16:33:48', '2023-01-07 16:33:48', null, '1');
INSERT INTO `message` VALUES ('29', '433fb276-c040-4c5f-9924-7fbb55e3863b', 'a4fd6633-f61f-49c1-9563-4115f2e725dd', null, '啦啦啦!!!我是sdpzhong', '0', '2023-01-07 16:41:34', '2023-01-07 16:41:34', null, '1');
INSERT INTO `message` VALUES ('30', 'a4fd6633-f61f-49c1-9563-4115f2e725dd', '433fb276-c040-4c5f-9924-7fbb55e3863b', null, '我是admin!!!', '0', '2023-01-07 16:42:18', '2023-01-07 16:42:18', null, '1');
INSERT INTO `message` VALUES ('31', 'a4fd6633-f61f-49c1-9563-4115f2e725dd', '433fb276-c040-4c5f-9924-7fbb55e3863b', null, '我是admin!!!', '0', '2023-01-07 17:31:55', '2023-01-07 17:31:55', null, '1');
INSERT INTO `message` VALUES ('32', 'a4fd6633-f61f-49c1-9563-4115f2e725dd', '433fb276-c040-4c5f-9924-7fbb55e3863b', null, '我是admin!!!', '0', '2023-01-09 14:14:21', '2023-01-09 14:14:21', null, '1');

-- ----------------------------
-- Table structure for users
-- ----------------------------
DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
  `user_id` smallint NOT NULL AUTO_INCREMENT COMMENT '用户ID',
  `uid` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL COMMENT '用户uuid',
  `account_name` varchar(24) DEFAULT NULL COMMENT '用户账号',
  `nick_name` varchar(45) DEFAULT NULL COMMENT '昵称',
  `real_name` varchar(20) DEFAULT NULL COMMENT '真实姓名',
  `password` char(32) DEFAULT NULL COMMENT '密码',
  `password_salt` char(6) DEFAULT NULL COMMENT '密码盐',
  `email` varchar(45) DEFAULT NULL COMMENT '邮箱',
  `mobile` varchar(15) DEFAULT NULL COMMENT '手机号码',
  `role` tinyint DEFAULT '3' COMMENT '用户角色：0-超级管理员|1-管理员|2-开发&测试&运营|3-普通用户（只能查看）',
  `status` tinyint DEFAULT '0' COMMENT '状态：0- 禁用|1-正常|2-注销',
  `bio` varchar(255) DEFAULT NULL,
  `gender` tinyint DEFAULT '-1' COMMENT '性别 0-女 | 1-男 | -1 未知',
  `birthday` varchar(10) DEFAULT NULL,
  `city` varchar(40) DEFAULT NULL COMMENT '城市',
  `province` varchar(30) DEFAULT NULL COMMENT '省份',
  `address` varchar(40) DEFAULT NULL COMMENT '详细地址',
  `sign` varchar(120) DEFAULT NULL COMMENT '签名',
  `avatar` varchar(120) DEFAULT NULL COMMENT '用户头像',
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  `deleted_at` datetime DEFAULT NULL,
  PRIMARY KEY (`user_id`,`uid`),
  KEY `idx_m` (`mobile`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='后台用户表';

-- ----------------------------
-- Records of users
-- ----------------------------
INSERT INTO `users` VALUES ('1', 'a4fd6633-f61f-49c1-9563-4115f2e725dd', 'admin', 'admin', null, 'PMAFdYUUtu7y/69PPIS+ZQ==', 'eaNW', '244175902@qq.com', null, '3', '0', null, '1', '1999-04-10', null, null, null, null, null, '2023-01-07 15:57:40', '2023-01-07 15:57:40', null);
INSERT INTO `users` VALUES ('2', '433fb276-c040-4c5f-9924-7fbb55e3863b', 'sdpzhong', 'sdpzhong', null, 'ab0frvahnhabarXMB1TpYg==', 'ji2C', 'sdpzhong@163.com', null, '3', '0', null, '1', '1999-04-10', null, null, null, null, null, '2023-01-07 15:58:45', '2023-01-07 15:58:45', null);

-- ----------------------------
-- Table structure for user_apply
-- ----------------------------
DROP TABLE IF EXISTS `user_apply`;
CREATE TABLE `user_apply` (
  `id` smallint NOT NULL AUTO_INCREMENT,
  `apply_uid` char(36) DEFAULT NULL,
  `friend_uid` char(36) DEFAULT NULL,
  `verify_msg` varchar(200) DEFAULT NULL,
  `status` int DEFAULT '0' COMMENT '0-未读 | 1-同意 | 2-不同意',
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  `deleted_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ----------------------------
-- Records of user_apply
-- ----------------------------
INSERT INTO `user_apply` VALUES ('1', 'e67f9e9c-c7e8-42b4-aa4d-549eb66cf3e7', 'a4fd6633-f61f-49c1-9563-4115f2e725dd', '添加为好友', '1', '2023-01-07 16:03:12', '2023-01-07 16:03:29', null);
INSERT INTO `user_apply` VALUES ('2', '433fb276-c040-4c5f-9924-7fbb55e3863b', 'a4fd6633-f61f-49c1-9563-4115f2e725dd', '添加为好友', '1', '2023-01-07 16:15:09', '2023-01-07 16:15:18', null);

-- ----------------------------
-- Table structure for user_blacklist
-- ----------------------------
DROP TABLE IF EXISTS `user_blacklist`;
CREATE TABLE `user_blacklist` (
  `id` smallint NOT NULL AUTO_INCREMENT,
  `uid` char(36) DEFAULT NULL,
  `target_uid` char(36) DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  `deleted_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ----------------------------
-- Records of user_blacklist
-- ----------------------------
