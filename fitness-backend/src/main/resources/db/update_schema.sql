USE fitness_db;

-- 5. 预约记录表 (关联会员与课程)
CREATE TABLE IF NOT EXISTS bookings
(
    id           BIGINT AUTO_INCREMENT PRIMARY KEY,
    member_id    BIGINT NOT NULL,
    course_id    BIGINT NOT NULL,
    status       VARCHAR(20) DEFAULT 'CONFIRMED', -- CONFIRMED, CANCELLED, COMPLETED
    booking_time TIMESTAMP   DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (member_id) REFERENCES members (id),
    FOREIGN KEY (course_id) REFERENCES courses (id)
);

-- 6. 营销-优惠券表
CREATE TABLE IF NOT EXISTS coupons
(
    id              BIGINT AUTO_INCREMENT PRIMARY KEY,
    code            VARCHAR(50)    NOT NULL UNIQUE,
    discount_amount DECIMAL(10, 2) NOT NULL,         -- 优惠金额
    min_spend       DECIMAL(10, 2) DEFAULT 0,        -- 最低消费门槛
    status          VARCHAR(20)    DEFAULT 'ACTIVE', -- ACTIVE, EXPIRED
    expire_date     TIMESTAMP
);

-- 7. 会员持有优惠券关联表
CREATE TABLE IF NOT EXISTS member_coupons
(
    id        BIGINT AUTO_INCREMENT PRIMARY KEY,
    member_id BIGINT NOT NULL,
    coupon_id BIGINT NOT NULL,
    is_used   BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (member_id) REFERENCES members (id),
    FOREIGN KEY (coupon_id) REFERENCES coupons (id)
);