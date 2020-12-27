

<?php

$dbname = $_POST['dbnm'];
$konreitable = $_POST['tble'];
$krno = $_POST['krno'];
$krpw = $_POST['krpw'];

$envfilename = "../env/dbenv.txt";
$fp = fopen($envfilename, 'r');
fgets($fp);
$str = fgets($fp); $ary = explode(",", $str); $server = $ary[0];
$str = fgets($fp); $ary = explode(",", $str); $username = $ary[0];
$str = fgets($fp); $ary = explode(",", $str); $password = $ary[0];
fclose($fp);

$sqlslct = "SELECT * FROM ".$konreitable." WHERE (userno=".$krno.");";

$sqlkhn = "INSERT INTO ".$konreitable."";
$sqlkhn = $sqlkhn." (userno,username,password)";
$sqlkhn = $sqlkhn." VALUES (".$krno.",'".$krno."','".$krpw."');";

// 招待者テーブル作成
$gesttable = "ge".$krno;
$sqlgst = "CREATE TABLE `".$gesttblname."` (`id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY";
$sqlgst = $sqlgst.",`flag` INT NOT NULL,`tno` INT NOT NULL,`sno` INT NOT NULL";
$sqlgst = $sqlgst.",`name1` VARCHAR(24),`name2` VARCHAR(24),`yomi` VARCHAR(48)";
$sqlgst = $sqlgst.",`sama` VARCHAR(15),`kind` VARCHAR(30),`skind` VARCHAR(30)";
$sqlgst = $sqlgst.",`adrsno` VARCHAR(24),`adrs1` VARCHAR(90),`adrs2` VARCHAR(90)";
$sqlgst = $sqlgst.",`adrs3` VARCHAR(90),`telno` VARCHAR(24),`kt1` VARCHAR(60)";
$sqlgst = $sqlgst.",`kt2` VARCHAR(60),`kt3` VARCHAR(60),`kt4` VARCHAR(60)";
$sqlgst = $sqlgst.",`gno` INT NOT NULL,`sub1` VARCHAR(96),`sub2` VARCHAR(96)";
$sqlgst = $sqlgst.",`gift` VARCHAR(30),`dish` VARCHAR(30));";

$tablefilename = str_replace("ge", "tb", $gesttblname);
$sqltb = "CREATE TABLE `".$tablefilename."` (`id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY";
$sqltb = $sqltb.",`dx` INT NOT NULL,`dy` INT NOT NULL);";

$strtblname = str_replace("ge", "ss", $gesttblname);
$sqlstr = "CREATE TABLE `".$strtblname."` (`id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY";
$sqlstr = $sql.",`leftstr` VARCHAR(192),`rightstr` VARCHAR(192));";

if($mysql = mysql_pconnect($server,$username,$password)){
	mysql_select_db($dbname, $mysql);

	$rows = mysql_query($sqlslct, $mysql);
	$row = mysql_fetch_array($rows);
	if($row != NULL){
		mysql_close($mysql);
		echo "1,".$row[id].",";
		return;
	}
	$ret = mysql_query($sqlkhn, $mysql);
	if($ret == FALSE){
		mysql_close($mysql);
		echo "0,2";
		return;
	}
	$id = mysql_insert_id($mysql);
	
	$ret = mysql_query($sqlgst, $mysql);
	if($ret == FALSE){
		mysql_close($mysql);
		echo "0,3";
		return;
	}
	$ret = mysql_query($sqltb, $mysql);
	if($ret == FALSE){
		mysql_close($mysql);
		echo "0,4";
		return;
	}
	$ret = mysql_query($sqlstr, $mysql);
	if($ret == FALSE){
		mysql_close($mysql);
		echo "0,5";
		return;
	}

	$mysql_result = mysql_close($mysql);
	
	$folder = "../list/".$gesttable;
	if(!file_exists($folder)){
		mkdir($folder, 0777);
	}
	$retstr = "1,".$id.",";
}
}else{
	$retstr = "0,1,";
}
echo $retstr;
?>
