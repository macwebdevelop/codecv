--- load with 
--- sqlite3 database.db < schema.sql

CREATE TABLE user (
	userName VARCHAR(50) PRIMARY KEY NOT NULL,
	userPassword VARCHAR(50) NOT NULL,
	userEmail VARCHAR(50) NOT NULL
);


#CREATE TABLE counter (
#	counterName VARCHAR(20) PRIMARY KEY,
#	counterValue INTEGER DEFAULT 0
#);
