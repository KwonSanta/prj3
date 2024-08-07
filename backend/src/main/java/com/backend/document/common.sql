CREATE DATABASE spaceHub;
use spaceHub;

DROP TABLE MEMBER;
SET FOREIGN_KEY_CHECKS = 0;
SET FOREIGN_KEY_CHECKS = 1;

-- MEMBER 테이블
CREATE TABLE MEMBER
(
    MEMBER_ID     INT AUTO_INCREMENT PRIMARY KEY,
    EMAIL         VARCHAR(50)                           NOT NULL,
    PASSWORD      VARCHAR(100)                          NOT NULL,
    NICKNAME      VARCHAR(50)                           NOT NULL,
    MOBILE        VARCHAR(20)                           NULL,
    AUTH          VARCHAR(20)                           NULL,
    PROVIDER      VARCHAR(20)                           NULL,
    PROVIDER_ID   VARCHAR(50)                           NULL,
    INPUT_DT      TIMESTAMP DEFAULT CURRENT_TIMESTAMP() NULL,
    UPDATE_DT     TIMESTAMP DEFAULT CURRENT_TIMESTAMP() NULL ON UPDATE CURRENT_TIMESTAMP(),
    AUTH_NAME     ENUM ('ADMIN', 'HOST', 'USER')        NULL,
    WITHDRAWN     CHAR      DEFAULT 'N'                 NULL,
    NAVER_ID      VARCHAR(300)                          NULL,
    PROFILE_IMAGE VARCHAR(100)                          NULL,
    PROFILE_NAME  VARCHAR(300)                          NULL,
    CONSTRAINT EMAIL UNIQUE (EMAIL)
);

CREATE TABLE HOST
(
    HOST_ID         INT AUTO_INCREMENT PRIMARY KEY,
    MEMBER_ID       INT                                   NOT NULL,
    ACCOUNT_NUMBER  VARCHAR(50)                           NULL,
    INPUT_DT        TIMESTAMP DEFAULT CURRENT_TIMESTAMP() NULL,
    UPDATE_DT       TIMESTAMP DEFAULT CURRENT_TIMESTAMP() NULL ON UPDATE CURRENT_TIMESTAMP(),
    BANK_NAME       VARCHAR(300)                          NULL,
    BUSINESS_NUMBER VARCHAR(25)                           NULL,
    BUSINESS_NAME   VARCHAR(40)                           NULL,
    REP_NAME        VARCHAR(11)                           NULL,
    CONSTRAINT HOST_IBFK_1 FOREIGN KEY (MEMBER_ID) REFERENCES MEMBER (MEMBER_ID)
);

CREATE INDEX MEMBER_ID ON HOST (MEMBER_ID);


-- TYPE_LIST 테이블
CREATE TABLE TYPE_LIST
(
    TYPE_LIST_ID INT PRIMARY KEY AUTO_INCREMENT,
    NAME         VARCHAR(255),
    IS_ACTIVE    BOOLEAN DEFAULT TRUE
);

-- OPTION_LIST 테이블
CREATE TABLE OPTION_LIST
(
    OPTION_LIST_ID INT PRIMARY KEY AUTO_INCREMENT,
    NAME           VARCHAR(255),
    IS_ACTIVE      BOOLEAN DEFAULT TRUE
);

-- SPACE 테이블
CREATE TABLE SPACE
(
    SPACE_ID       INT PRIMARY KEY AUTO_INCREMENT,
    MEMBER_ID      INT NOT NULL,
    TYPE_LIST_ID   INT NOT NULL,
    TITLE          VARCHAR(100),
    SUB_TITLE      VARCHAR(200),
    ZONECODE       VARCHAR(100),
    ADDRESS        VARCHAR(200),
    DETAIL_ADDRESS VARCHAR(200),
    EXTRA_ADDRESS  VARCHAR(200),
    LATITUDE       DECIMAL(14, 10),
    LONGITUDE      DECIMAL(14, 10),
    INTRODUCE      TEXT,
    FACILITY       TEXT,
    NOTICE         TEXT,
    PRICE          INT,
    CAPACITY       INT,
    FLOOR          INT,
    PARKING_SPACE  INT,
    INPUT_DT       TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UPDATE_DT      TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (MEMBER_ID) REFERENCES MEMBER (MEMBER_ID),
    FOREIGN KEY (TYPE_LIST_ID) REFERENCES TYPE_LIST (TYPE_LIST_ID)
);


-- SPACE_OPTION 테이블
CREATE TABLE SPACE_CONFIG
(
    SPACE_CONFIG_ID INT AUTO_INCREMENT PRIMARY KEY,
    SPACE_ID        INT NOT NULL,
    OPTION_ID       INT NOT NULL,
    FOREIGN KEY (SPACE_ID) REFERENCES SPACE (SPACE_ID),
    FOREIGN KEY (OPTION_ID) REFERENCES OPTION_LIST (OPTION_LIST_ID)
);


-- RESERVATION 테이블
CREATE TABLE RESERVATION
(
    RESERVATION_ID INT PRIMARY KEY AUTO_INCREMENT,
    SPACE_ID       INT NOT NULL,
    MEMBER_ID      INT NOT NULL,
    TOTAL_PRICE    INT NOT NULL,
    START_DATE     DATE,
    END_DATE       DATE,
    START_TIME     TIME,
    END_TIME       TIME,
    STATUS         ENUM ('APPLY', 'ACCEPT', 'CANCEL', 'COMPLETE_PAYMENT'),
    INPUT_DT       TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UPDATE_DT      TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (SPACE_ID) REFERENCES SPACE (SPACE_ID),
    FOREIGN KEY (MEMBER_ID) REFERENCES MEMBER (MEMBER_ID)
);

-- PAID 테이블
CREATE TABLE PAID
(
    PAID_ID        INT PRIMARY KEY AUTO_INCREMENT,
    SPACE_ID       INT NOT NULL,
    RESERVATION_ID INT NOT NULL,
    MEMBER_ID      INT NOT NULL,
    TOTAL_PRICE    DECIMAL(10, 2),
    INPUT_DT       TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UPDATE_DT      TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (SPACE_ID) REFERENCES SPACE (SPACE_ID),
    FOREIGN KEY (MEMBER_ID) REFERENCES MEMBER (MEMBER_ID),
    FOREIGN KEY (RESERVATION_ID) REFERENCES RESERVATION (RESERVATION_ID)
);
-- COMMENT 테이블
CREATE TABLE COMMENT
(
    COMMENT_ID INT PRIMARY KEY AUTO_INCREMENT,
    MEMBER_ID  INT         NOT NULL,
    PARENT_ID  INT,
    DIVISION   VARCHAR(10) NOT NULL,
    CONTENT    TEXT,
    INPUT_DT   TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UPDATE_DT  TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (MEMBER_ID) REFERENCES MEMBER (MEMBER_ID)
);

-- COMMENT_RE 테이블
CREATE TABLE COMMENT_RE
(
    COMMENT_RE_ID INT PRIMARY KEY AUTO_INCREMENT,
    MEMBER_ID     INT NOT NULL,
    TARGET_ID     INT NOT NULL,
    COMMENT_ID    INT NOT NULL,
    CONTENT       TEXT,
    INPUT_DT      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UPDATE_DT     TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (MEMBER_ID) REFERENCES MEMBER (MEMBER_ID),
    FOREIGN KEY (COMMENT_ID) REFERENCES COMMENT (COMMENT_ID)
);

-- BOARD 테이블
CREATE TABLE BOARD
(
    BOARD_ID    INT PRIMARY KEY AUTO_INCREMENT,
    MEMBER_ID   INT NOT NULL,
    CATEGORY_ID INT NOT NULL,
    TITLE       VARCHAR(100),
    CONTENT     TEXT,
    INPUT_DT    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UPDATE_DT   TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    VIEWS       INT       DEFAULT 0,
    FOREIGN KEY (MEMBER_ID) REFERENCES MEMBER (MEMBER_ID),
    FOREIGN KEY (CATEGORY_ID) REFERENCES CATEGORY (CATEGORY_ID)
);
-- CATEGORY 테이블
CREATE TABLE CATEGORY
(
    CATEGORY_ID   INT PRIMARY KEY AUTO_INCREMENT,
    CATEGORY_NAME VARCHAR(50),
    INPUT_DT      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UPDATE_DT     TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);


-- FILE 테이블
CREATE TABLE FILE
(
    FILE_ID   INT PRIMARY KEY AUTO_INCREMENT,
    PARENT_ID INT NOT NULL,
    DIVISION  VARCHAR(10),
    FILE_NAME VARCHAR(100),
    INPUT_DT  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UPDATE_DT TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- LIKE 테이블
CREATE TABLE LIKES
(
    LIKES_ID  INT PRIMARY KEY AUTO_INCREMENT,
    BOARD_ID  INT NOT NULL,
    MEMBER_ID INT NOT NULL,
    INPUT_DT  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UPDATE_DT TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (BOARD_ID) REFERENCES BOARD (BOARD_ID),
    FOREIGN KEY (MEMBER_ID) REFERENCES MEMBER (MEMBER_ID)
);

CREATE TABLE FAVORITES
(
    FAVORITES_ID INT PRIMARY KEY AUTO_INCREMENT,
    MEMBER_ID    INT NOT NULL,
    SPACE_ID     INT NOT NULL,
    INPUT_DT     TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UPDATE_DT    TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (MEMBER_ID) REFERENCES MEMBER (MEMBER_ID),
    FOREIGN KEY (SPACE_ID) REFERENCES SPACE (SPACE_ID),
    UNIQUE (MEMBER_ID, SPACE_ID)
);

