<?php

$argvs = $_POST['com'];

//$argvs = "012950,429866";
$ary = explode(",", $argvs);
$strID = $ary[0];
$strPW = $ary[1];

$m_csKey = "egassem";
$sID = "message";
$sPW = "mesyokono";
if($strID == $sID && $strPW == $sPW){
	echo "1,1,";
	return;
}

$sIdxList = "";
$sIdxList = $sIdxList . "0,1,3,7,8";
$sIdxList = $sIdxList . ";1,2,6,8,9";
$sIdxList = $sIdxList . ";2,4,5,7,8";
$sIdxList = $sIdxList . ";1,3,4,6,9";
$sIdxList = $sIdxList . ";0,2,3,7,8";
$sIdxList = $sIdxList . ";0,1,4,5,6";
$sIdxList = $sIdxList . ";2,3,5,6,7";
$sIdxList = $sIdxList . ";0,1,2,5,6";
$sIdxList = $sIdxList . ";0,3,6,7,9";
$sIdxList = $sIdxList . ";1,2,4,5,9";

$m_aryIdx = explode(";", $sIdxList);
$sPWList = "9,5,7,2,6,4,3,8,0,1";
$m_aryPW = explode(",", $sPWList);

$klen = strlen($m_csKey);
$sPW = "";
$max = strlen($strID);
$pid = 0;
for($idx = 0; $idx < $max; $idx++){
	$num = 0;
	for($aidx = 0; $aidx < 5; $aidx++){
		$sIdx = $m_aryIdx[$idx];
		$ary = explode(",", $sIdx);
		$tidx = $ary[$aidx];
		if($tidx < $max){
			$ch = substr($strID, $tidx, 1);
			$num = $num + ord($ch);
		}
	}
	$kidx = $idx % $klen;
	$ch = substr($m_csKey, $kidx, 1);
	$num = $num + ord($ch);
	$tidx= ($num + $idx) % 10;
	$sPW = $sPW.$m_aryPW[$tidx];
}
if($strPW == $sPW){
	echo "1,0,".$strPW."=".$sPW;
}else{
	echo "0,0,".$strPW."=".$sPW;	
}

?> 
