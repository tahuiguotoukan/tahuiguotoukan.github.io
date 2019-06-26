var xmlobj; //定义XMLHttpRequest对象
function CreateXMLHttpRequest()
{
    if(window.ActiveXObject)
    //如果当前浏览器支持Active Xobject，则创建ActiveXObject对象
    {
    //xmlobj = new ActiveXObject("Microsoft.XMLHTTP");
    try {
        xmlobj = new ActiveXObject("Msxml2.XMLHTTP");
        } catch (e) {
        try {
        xmlobj = new ActiveXObject("Microsoft.XMLHTTP");
            } catch (E) {
            xmlobj = false;
            }
            }
        }
    else if(window.XMLHttpRequest)
    //如果当前浏览器支持XMLHttp Request，则创建XMLHttpRequest对象
    {
    xmlobj = new XMLHttpRequest();
    }
}
function getCookie(){
    let cookie = document.cookie.split(';');
    let cookieArr = cookie.map((v) => {
        return v.split('=');
    })
    let token = '';
    for(let i = 0; i < cookieArr.length; i++){
        let item = cookieArr[i];
        if(item[0] === 'token'){
            token = item[1];
            break;
        }
    }
    return token;

}
function findPlayID(ind, num) {
    return 8014000 + ind*100 + num + 6;
}
function SubmitArticle(turnNum, ind, data, money,gameId=80) //主程序函数
{
  CreateXMLHttpRequest(); //创建对象
  var parm = data.map((v, i)=>{
      let betBean = 'betBean[' + i + '].';
      return betBean+'playId='+findPlayID(ind, v)+'&'+betBean+'odds=9.95&' + betBean+'rebate=0&'+betBean+'money='+money;
  }).join('&');
  parm += '&gameId='+gameId+'&totalNums='+data.length+'&totalMoney='+(data.length*money)+'&betSrc=0&turnNum='+turnNum+'&x-session-token='+getCookie();//构造URL参数
  //xmlobj.open("POST", "{dede:global.cfg_templeturl/}/../include/weather.php", true); //调用weather.php
  xmlobj.open("POST", "/lottery/bet.do", true); //调用weather.php
  xmlobj.setRequestHeader("cache-control","no-cache");
  xmlobj.setRequestHeader("contentType","text/html;charset=uft-8") //指定发送的编码
  xmlobj.setRequestHeader("Content-Type", "application/x-www-form-urlencoded;");  //设置请求头信息
  xmlobj.onreadystatechange = function () {
      console.error(arguments)
  };  //判断URL调用的状态值并处理
  xmlobj.send(parm); //设置为发送给服务器数据
}
