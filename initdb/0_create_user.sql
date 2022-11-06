CREATE USER 'dummy_user'@'%' IDENTIFIED WITH mysql_native_password BY 'dummy_password';
CREATE DATABASE pong;
GRANT ALL PRIVILEGES ON pong.* TO 'dummy_user'@'%';
