//

function fncCreateDB()
{
	var data = "";
	var fnc = fncCreateDBCallback;

	data = "dbnm="+m_szHotelDB;
	sendRequest("POST","initdb.php",data,false,fnc);
}
function fncCreateDBCallback(xmlhttp)
{
	var retstr = "";
	var ary = new Array();
	var data = "";
	var fnc = fncCreateKubunTblCallback;

	retstr = xmlhttp.responseText;
	ary = retstr.split(",");
	if(ary[0] == "0"){
		alert("データベース"+m_szHotelDB+"の初期化に失敗しました");
		return;
	}

	data = "dbnm="+m_szHotelDB;
	data = data + "&tble=kubun";
	data = data + "&fild=no,name";
	data = data + "&type=20,48";
	sendRequest("POST","inittbl.php",data,false,fnc);
}
function fncCreateKubunTblCallback(xmlhttp)
{
	var retstr = "";
	var ary = new Array();
	var data = "";
	var fnc = fncCreateRenmeiTblCallback;

	retstr = xmlhttp.responseText;
	ary = retstr.split(",");
	if(ary[0] == "0"){
		alert("区分テーブルの作成に失敗しました");
		return;
	}

	data = "dbnm="+m_szHotelDB;
	data = data + "&tble=renmei";
	data = data + "&fild=name";
	data = data + "&type=48";
	sendRequest("POST","inittbl.php",data,false,fnc);
}

function fncCreateRenmeiTblCallback(xmlhttp)
{
	var retstr = "";
	var ary = new Array();
	var data = "";
	var fnc = fncCreateKaijyouTblCallback;

	retstr = xmlhttp.responseText;
	ary = retstr.split(",");
	if(ary[0] == "0"){
		alert("連名区分テーブルの作成に失敗しました");
		return;
	}

	data = "dbnm="+m_szHotelDB;
	data = data + "&tble=kaijyou";
	data = data + "&fild=name";
	data = data + "&type=96";
	sendRequest("POST","inittbl.php",data,false,fnc);
}
function fncCreateKaijyouTblCallback(xmlhttp)
{
	var retstr = "";
	var ary = new Array();
	var data = "";
	var fild = "";
	var type = "";
	var fnc = fncCreateKihonTblCallback;

	retstr = xmlhttp.responseText;
	ary = retstr.split(",");
	if(ary[0] == "0"){
		alert("会場テーブルの作成に失敗しました");
		return;
	}
	data = "dbnm="+m_szHotelDB;
	data = data + "&tble="+m_szKonreiTable;
	fild = "flag,userno";
	type = "0,0";
	fild = fild + ",username,password,dbname,tablelayout";
	type = type + ",6,32,16,16";
	fild = fild + ",kihonlockflag,gestlockflag,sitlockflag";
	type = type + ",0,0,0";
	fild = fild + ",kyosiki,hirouen,kaijyou,mukotori";
	type = type + ",1,1,96,0";
	fild = fild + ",sinrozoku,sinroname1,sinroname2";
	type = type + ",12,18,18";
	fild = fild + ",sinpuzoku,sinpuname1,sinpuname2";
	type = type + ",12,18,18";
	fild = fild + ",sinrodish,sinpudish,sinrosub,sinpusub";
	type = type + ",48,48,96,96";
	fild = fild + ",paperlocate,papersize,ryoukekind,tablekind";
	type = type + ",18,12,48,24";
	fild = fild + ",textsize,takasagokind,nametype";
	type = type + ",12,48,12";
	fild = fild + ",flag1,flag2";
	type = type + ",0,0";
	fild = fild + ",lefttext,righttext";
	type = type + ",96,96";
	fild = fild + ",tableposition";  //x1_y1:x2_y2:
	type = type + ",255";
	data = data + "&fild="+fild+"&type="+type;
	sendRequest("POST","inittbl.php",data,false,fnc);
}
function fncCreateKihonTblCallback(xmlhttp)
{
	var retstr = "";
	var ary = new Array();
	var data = "";
	var fnc = fncSetDataKubunTblCallback;

	retstr = xmlhttp.responseText;
	ary = retstr.split(",");
	if(ary[0] == "0"){
		alert("婚礼テーブルの作成に失敗しました");
		return;
	}

	data = "dbnm="+m_szHotelDB;
	data = data + "&tble=kubun";
	data = data + "&fild=no,name";
	data = data + "&type=20,48";
	data = data + "&file="+m_szHotelDB+"/kubun.txt";
	sendRequest("POST","setdata.php",data,false,fnc);
}
function fncSetDataKubunTblCallback(xmlhttp)
{
	var retstr = "";
	var ary = new Array();
	var data = "";
	var fnc = fncSetDataRenmeiTblCallback;

	retstr = xmlhttp.responseText;
	ary = retstr.split(",");
	if(ary[0] == "0"){
		alert("区分テーブルの初期化に失敗しました");
		return;
	}

	data = "dbnm="+m_szHotelDB;
	data = data + "&tble=renmei";
	data = data + "&fild=name";
	data = data + "&type=48";
	data = data + "&file="+m_szHotelDB+"/renmei.txt";
	sendRequest("POST","setdata.php",data,false,fnc);
}
function fncSetDataRenmeiTblCallback(xmlhttp)
{
	var retstr = "";
	var ary = new Array();
	var data = "";
	var fnc = fncSetDataKaijyouTblCallback;
	
	retstr = xmlhttp.responseText;
	ary = retstr.split(",");
	if(ary[0] == "0"){
		alert("連名区分テーブルの初期化に失敗しました");
		return;
	}

	data = "dbnm="+m_szHotelDB;
	data = data + "&tble=kaijyou";
	data = data + "&fild=name";
	data = data + "&type=96";
	data = data + "&file="+m_szHotelDB+"/kaijyou.txt";
	sendRequest("POST","setdata.php",data,false,fnc);
}
function fncSetDataKaijyouTblCallback(xmlhttp)
{
	var retstr = "";
	var ary = new Array();

	retstr = xmlhttp.responseText;
	ary = retstr.split(",");
	if(ary[0] == "0"){
		alert("会場テーブルの初期化に失敗しました");
		return;
	}
	alert("データベース"+m_szHotelDB+"の初期化を行いました");
}

