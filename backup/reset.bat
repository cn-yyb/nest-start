@ECHO OFF 

SET user=root
SET database=start_db
SET rootPath=%~dp0
SET sqlfile=./sql/start_db.sql

:: run
mysql -f -u%user% -p -D%database% < %rootPath%%sqlfile% --default-character-set=utf8

ECHO Database reset success!
PAUSE

@ECHO Done!