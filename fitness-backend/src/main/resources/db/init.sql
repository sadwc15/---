CREATE DATABASE IF NOT EXISTS fitness_db;
USE fitness_db;

-- 1. 会员表
CREATE TABLE IF NOT EXISTS members (
                                       id BIGINT AUTO_INCREMENT PRIMARY KEY,
                                       name VARCHAR(100) NOT NULL,
                                       phone VARCHAR(20) NOT NULL UNIQUE,
                                       avatar VARCHAR(255),
                                       balance DECIMAL(10, 2) DEFAULT 0.00,
                                       level INT DEFAULT 0,
                                       created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. 教练表
CREATE TABLE IF NOT EXISTS coaches (
                                       id BIGINT AUTO_INCREMENT PRIMARY KEY,
                                       name VARCHAR(100) NOT NULL,
                                       expertise VARCHAR(255), -- 专长
                                       bio TEXT,
                                       avatar VARCHAR(255)
);

-- 3. 课程表
CREATE TABLE IF NOT EXISTS courses (
                                       id BIGINT AUTO_INCREMENT PRIMARY KEY,
                                       title VARCHAR(100) NOT NULL,
                                       description TEXT,
                                       type VARCHAR(20) NOT NULL, -- GROUP, PRIVATE
                                       price DECIMAL(10, 2) NOT NULL,
                                       capacity INT NOT NULL,
                                       start_time TIMESTAMP NOT NULL,
                                       coach_id BIGINT,
                                       FOREIGN KEY (coach_id) REFERENCES coaches(id)
);

-- 4. 订单表
CREATE TABLE IF NOT EXISTS orders (
                                      id BIGINT AUTO_INCREMENT PRIMARY KEY,
                                      member_id BIGINT NOT NULL,
                                      course_id BIGINT NOT NULL,
                                      amount DECIMAL(10, 2) NOT NULL,
                                      status VARCHAR(20) DEFAULT 'PENDING', -- PENDING, PAID, CANCELLED
                                      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                                      FOREIGN KEY (member_id) REFERENCES members(id),
                                      FOREIGN KEY (course_id) REFERENCES courses(id)
);