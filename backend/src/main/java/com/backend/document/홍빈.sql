#홍빈

DROP TABLE AUTH;

ALTER TABLE MEMBER
    ADD COLUMN AUTH_NAME ENUM ('ADMIN', 'HOST', 'USER');

ALTER TABLE MEMBER
    ADD COLUMN WITHDRAWN CHAR(1) DEFAULT 'N';





ALTER TABLE MEMBER
   ADD COLUMN NAVER_ID VARCHAR(3000);

ALTER TABLE MEMBER
   ADD COLUMN SRC VARCHAR(3000);


ALTER TABLE BOARD
    ADD COLUMN CATEGORY ENUM ('NOTICE', 'FAQ');

ALTER TABLE HOST
    ADD COLUMN EMAIL VARCHAR(50)  NOT NULL UNIQUE,
    ADD COLUMN PASSWORD VARCHAR(100) NOT NULL,
    ADD COLUMN NICKNAME  VARCHAR(50)  NOT NULL,
    ADD COLUMN MOBILE  VARCHAR(20),
    ADD COLUMN PROFILE_IMAGE VARCHAR(100),
    ADD COLUMN AUTH VARCHAR(20),
    ADD COLUMN AUTH_NAME ENUM ('HOST'),
    ADD COLUMN WITHDRAWN CHAR(1) DEFAULT 'N';

SELECT*
FROM HOST;

SELECT *
FROM CATEGORY;

SELECT*
FROM FILE;


ALTER TABLE HOST
    DROP COLUMN EMAIL ,
    DROP COLUMN PASSWORD ,
    DROP COLUMN NICKNAME,
    DROP COLUMN MOBILE ,
    DROP COLUMN PROFILE_IMAGE,
    DROP COLUMN AUTH,
    DROP COLUMN AUTH_NAME ,
    DROP COLUMN WITHDRAWN ;

ALTER TABLE HOST
    ADD COLUMN BANK_NAME VARCHAR(300);


SELECT*
FROM HOST;

ALTER TABLE HOST
   ADD COLUMN BUSINESS_NUMBER VARCHAR(25),
   ADD COLUMN BUSINESS_NAME VARCHAR(40),
   ADD COLUMN REP_NAME VARCHAR(11);

ALTER TABLE MEMBER
  DROP COLUMN SRC;

ALTER TABLE MEMBER
    ADD COLUMN PROFILE_NAME VARCHAR(300);

