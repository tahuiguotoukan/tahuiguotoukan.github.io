//第一期开奖之后才能开始启动
var every_day_money = [];
var every_plan_win = [];
var startTime = 20200301;
var endTime = 20200331;
function openListener ()
{
    if(test)
    {
        every_day_money = [];
        every_plan_win = [];
        testFun(startTime);
        
        
    }
    else
    {
        listen_timer = setInterval(() => {
            cur_issue = document.querySelectorAll('.turn-num .tc')[1].innerText;
            let now_open = document.querySelectorAll('.turn-num .tc')[0].innerText;
            if(now_open && now_open != pre_issue)
            {
                //开奖
                pre_issue = now_open;
                let code = getNums();
                record_arr.unshift(code);
                update();
            }
        }, 300);
    }
    
}
function testFun (d)
{
    initData();
    dateStr = d+'';
    getHistory()
    .then((arr) => {
        for(let i = arr.length - 1; i >= 0; i--)
        {
            let v = arr[i];
            now_open = v.turnNum.substr(v.turnNum.length - 4);
            cur_issue = (now_open*1+1)+'';
            if(now_open && now_open != pre_issue)
            {
                //开奖
                pre_issue = now_open;
                let code = v.openNum.split(',');
                record_arr.unshift(code.map((v)=>{return v*1}));
                update();
            }
        }
        let w = 0;
        let e = [];
        for(let k in plan_record)
        {
            let item = plan_record[k];
            w += item.win[item.win.length - 1];
            e.push(parseInt(item.win[item.win.length - 1]));
        }
        every_day_money.push(parseInt(w*10)/10);
        every_plan_win.push(e);
        d = d+1;
        if(d <= endTime)
        {
            testFun(d);
        }
        else
        {
            console.log(every_day_money);
            let w = 0;
            every_day_money.forEach(v => w+=v);
            console.log('this month win money total ' + w);
            console.log(every_plan_win);
            return;
        }
    })
    .catch(() => {

    })
}
function startRecord ()
{
    initData();
    getHistory()
    .then((arr) => {
        arr.forEach((v, i) => {
            record_arr.push(v.openNum.split(',').map(v => v*1));
            if(i === 0)
            {
                now_open = v.turnNum.substr(v.turnNum.length - 4);
                pre_issue = now_open;
            }
        })
        openListener()
    })
    .catch(() => {

    })
    
}
function initData ()
{
    //初始化参数
    window.test = false;
    window.gameId = 56;
    window.beishu =1;
    window.initMoney = 423;
    window.winMoney = 2.95*beishu*3;
    window.record_arr = [];
    window.record_obj = {};
    window.listen_timer = null;
    window.pre_issue = 0;
    window.cur_issue = 0;
    window.plan_record = {
        // planA: {
        //     record: [],
        //     current: []
        // },
        // planB: {
        //     record: [],
        //     current: []
        // }
    };
    window.url = 'https://www.rgcp96.com';
    
    let d = new Date();
    let m = d.getMonth() + 1;
    m = m >= 10 ? m + '' : '0' + m;
    let y = d.getFullYear() + '';
    let n = d.getDate();
    n = n >= 10 ? n + '' : '0' + n;
    window.dateStr = y+m+n;
}
function getNums ()
{
    let list = [];
    let node_list = document.querySelectorAll('.Nums>div>span');
    if(node_list)
    {
        node_list.forEach((v) => {
            list.push(v.className.split('-')[1]*1);
        })
    }
    return list;
}
function compareCode (plan_name, newPlanFun)
{
    let plan = plan_record[plan_name];
    let record = plan.record;
    let current = plan.current;
    if(current.length > 0)
    {
        //先兑奖
        let plan_current = current[current.length - 1];
        let plan_code = plan_current.code;
        let plan_position = plan_current.position;
        let open_code = record_arr[0][plan_position];
        if(plan_code.indexOf(open_code) > -1)  //中奖
        {
            //status: 0-追号中， 1-已中奖， 2-未中奖， 3-失败
            plan_current.status = 1;
            record.push(current);
            plan.current = [];
            //开始新计划
            newPlanFun && newPlanFun();
        }
        else //未中奖，继续追
        {
            if(current.length >= plan.m_arr.length)
            {
                plan.isCanBuy = false;
            }
            plan_current.status = 2;
            current.push({
                issue: cur_issue,
                code: plan_current.code,
                position: plan_current.position,
                status: 0
            });
        }
    }
    else
    {
        //开始新计划
        newPlanFun && newPlanFun();
    }
}
function update ()
{
    //开奖之后刷新计划
//     planA();
    planE();
    //...
    showPlan();
    if(!test)
    {
        buyPlan();
    }

}
function planA ()
{
    let plan_name = 'planA';
    initPlandata(plan_name, [1, 3, 7, 15, 31, 63, 127, 256]);
    compareCode(plan_name, StartnewPlanA);
};
function StartnewPlanA()
{
    let plan = plan_record['planA'];
    let current = plan.current;
    let record = plan.record;
    let m = getPlanWinMoney(record, plan.m_arr);
    let len = 5;
    plan.win.push(m);
//     if(m > 10000 || !plan.isCanBuy || cur_issue.substr(cur_issue.length - 3)*1 > 170) return;
    if(record_arr.length >= 20)
    {
        for(let i = 0; i < 10; i++)
        {
            let num = {
                1: 0,
                2: 0,
                3: 0,
                4: 0,
                5: 0,
                6: 0,
                7: 0,
                8: 0,
                9: 0,
                10: 0
            }
            for(let j = 0; j < 20; j++)
            {
                let c = record_arr[j][i];
                
                num[c]++;
                
            }
            let arr = [];
            for(let k in num)
            {
                arr.push({count: num[k], code: k});                
            }
            arr.sort((a, b) => {
                return a.count - b.count;
            })
            let min = arr[0].code;
            let max = arr[arr.length - 1].code;
            if(
                record_arr[0][i] !== 1 
                && record_arr[0][i] !== 10 
                && (Math.abs(record_arr[0][i] - record_arr[1][i]) > 2 && Math.abs(record_arr[0][i] - record_arr[1][i]) < 3)
            )
            {
                
                let n = record_arr[0][i];
                let l = arr[0].code*1;
                let r = arr[9].code*1;
                let code = [];
                if(n > 5)
                {
                    for(let i = 1; i <= 10; i++)
                    {
                        if(i !== l && i !== r && code.length < len)
                        {
                            code.push(i)
                        }
                    }
                }
                else
                {
                    for(let i = 10; i >=1; i--)
                    {
                        if(i !== l && i !== r && code.length < len)
                        {
                            code.push(i)
                        }
                    }
                }
                

                code.sort((a,b) => {return a - b});
                if(code.length === len)
                {
                    current.push({
                        issue: cur_issue,
                        code: code,
                        status: 0,
                        position: i
                    })
                }
                break;
            }

        }
    }
}

function planE ()
{
    let plan_name = 'planE';
    initPlandata(plan_name, [1,3,7,15,31]);
    compareCode(plan_name, StartnewPlanE);
};
function StartnewPlanE ()
{
    let plan = plan_record['planE'];
    let current = plan.current;
    let record = plan.record;
    let m = getPlanWinMoney(record, plan.m_arr);
    plan.win.push(m);
    if(cur_issue.substr(cur_issue.length - 3)*1 > 175) return;
    if(record_arr.length >= 30)
    {
        for(let i = 0; i < 10; i++)
        {
            let num = {
                1: 0,
                2: 0,
                3: 0,
                4: 0,
                5: 0,
                6: 0,
                7: 0,
                8: 0,
                9: 0,
                10: 0
            }
            for(let j = 0; j < 30; j++)
            {
                let c = record_arr[j][i];
                
                num[c]++;
                
            }
            let arr = [];
            for(let k in num)
            {
                arr.push({count: num[k], code: k});                
            }
            arr.sort((a, b) => {
                return a.count - b.count;
            })
            let min = arr[0].code;
            let max = arr[arr.length - 1].code;
            if(
                record_arr[0][i] !== 1 
                && record_arr[0][i] !== 10 
                && (Math.abs(record_arr[0][i] - record_arr[1][i]) > 1 && Math.abs(record_arr[0][i] - record_arr[1][i]) < 4)
            )
            {
                
                let n = record_arr[0][i];
                let s = 0;
                let code = [arr[s].code*1,arr[s+1].code*1,arr[s+2].code*1,arr[s+3].code*1,arr[s+4].code*1];
                
//                 while(code.length < 5)
//                 {
//                     let rand = Math.floor(Math.random()*10)+1;
//                     if(code.indexOf(rand) < 0)
//                     {
//                         code.push(rand);
//                     }
//                 }
                code.sort((a,b) => {return a - b});
                if(code.length === 5)
                {
                    current.push({
                        issue: cur_issue,
                        code: code,
                        status: 0,
                        position: i
                    })
                }
                break;
            }

        }
    }
}
function getCode(n, i)
{
    let code = [];
    // while(code.length < 5)
    // {
    //     let rand = Math.floor(Math.random()*10+1);
    //     if(code.indexOf(rand) < 0 && rand !== 1 && rand !== 10 && rand !== n)
    //     {
    //         code.push(rand);
    //     }
    // }
    // switch(n)
    // {
    //     case 1:
    //         code = [2,10];
    //         break;
    //     case 2:
    //         code = [1,3];
    //         break;
    //     case 3:
    //         code = [1,4];
    //         break;
    //     case 4:
    //         code = [3,5];
    //         break;
    //     case 5:
    //         code = [4,6];
    //         break;
    //     case 6:
    //         code = [5,7];
    //         break;
    //     case 7:
    //         code = [6,8];
    //         break;
    //     case 8:
    //         code = [7,9];
    //         break;
    //     case 9:
    //         code = [8,10];
    //         break;
    //     case 10:
    //         code = [1,9];
    //         break;
    // }
    for(let j = 1; j < record_arr.length; j++)
    {
        let rand = record_arr[j][i];
        if(code.indexOf(rand) < 0)
        {
            code.push(rand);
        }
        if(code.length === 3)
        {
            break;
        }
    }
    
    return code;
}
function initPlandata (plan, m_arr)
{
    //执行计划前线初始化计划数据格式
    if(!plan_record[plan])
    {
        plan_record[plan] = {
            record: [],
            current: [],
            isCanBuy: true,
            win: [],
            m_arr: m_arr
        }
    }
}
function showPlan ()
{
    console.clear();
    let total = 0;
    for(let k in plan_record)
    {
        let item = plan_record[k];
        let r = [];
        item.record.forEach((v) => {
            r.push({
                issue: v[0].issue+'-'+v[v.length-1].issue,
                code: v[0].code.join(','),
                position: v[0].position,
                status: v[v.length-1].status,
                length: v.length
            })
        })
        if(item.current.length > 0)
        {
            r.push({
                issue: item.current[0].issue+'-'+item.current[item.current.length-1].issue,
                code: item.current[0].code.join(','),
                position: item.current[0].position,
                status: item.current[item.current.length-1].status,
                length: item.current.length
            })
        }
        console.log('current table is ', k);
//         console.table(r.slice(r.length > 9 ? r.length - 9 : 0), ['issue', 'code', 'position', 'length', 'status']);
        console.table(r, ['issue', 'code', 'position', 'length', 'status']);
        let win = getPlanWinMoney(r, item.m_arr)
        total += win;
        console.log(win);
        
    }
    console.log('total: ', total);
}
function getPlanWinMoney(record, m_arr)
{
    let money = 0;
    
    record.forEach((v, i) => {
        
        let code_len = 0;
        if(v.code)
        {
            code_len = v.code.split(',').length;
        }
        else
        {
            code_len = v[0].code.length;
        }
        if(v.status === 0) return;
        let l = v.length;
        if(l <= m_arr.length)
        {
            let m = 0;
            for(let i = 0; i < l; i++)
            {
                m+=m_arr[i];
            }
            money+=m_arr[l-1]*9.95-m*code_len;
          
        }
        else
        {
            let m = 0;
            for(let i = 0; i < m_arr.length; i++)
            {
                m+=m_arr[i];
            }
            money-=m*code_len;
        }
        
    })
    return money;
}
function buyPlan ()
{
    getMoney()
    .then((money) => {
//         money = money*1;
//         if(money - initMoney >= winMoney) return;
//         let plan = plan_record.planE;
//         let item = plan.current[0];
//         if(!item) return;
//         let p_code = item.code;
//         let c = [];
//         for(let i = 1; i <= 10; i++)
//         {
//             if(p_code.indexOf(i) <= -1)
//             {
//                 c.push(i);
//             }
//         }
//         if(c.length === 7)
//         {
//             buyAction({
//                 issue: cur_issue,
//                 code: c,
//                 position: item.position
//             }, 1*beishu);
//         }
        let m = [1,3,7,15,31];
        let t = 60;
        let arr = [];
        for(let k in plan_record)
        {
            let item = plan_record[k].current;
            arr.push(item);
            
        }
        arr.sort((a, b) => {
            return b.length - a.length;
        })
        for(let k = 0; k < arr.length; k++)
        {
            let item = arr[k];
            if(item && item.length > 0 && item.length <= m.length)
            {
                t += 1000;
                setTimeout(() => {
                    
                    buyAction({
                        issue: cur_issue,
                        code: item[0].code,
                        position: item[0].position
                    }, m[item.length - 1]*beishu);
                }, t);
                
            }
        }
    });
}
function getMoney()
{
    
    return new Promise((resolve, reject) => {
       
    ajax({
        url: url + '/user/getMoney.do',
        method: 'GET',
        success: (responseText) => {
            let data = JSON.parse(responseText);
            console.log('get user money success', data);
            resolve(data);
        },
        error: (e) => {
            console.log("get user money faild");
            reject(e);
        }
    })
                              
        
                   
    })
}
function getHistory()
{
    
    return new Promise((resolve, reject) => {
        ajax({
            url: url + '/static/data/'+dateStr+gameId+'HistoryLottery.json?page=1&rows=15',
            method: 'GET',
            success: (responseText) => {
                let data = JSON.parse(responseText);
                resolve(data);
            },
            error: (e) => {
                console.log("get user History faild");
                reject(e);
            }
        })
                              
        
                   
    })
}
function buyAction(data, money)
{
    let code = data.code;
    let total_money = code.length*money;
    let turnNum = data.issue;
    let p = data.position;
    let id = 5671600+p*100;
    let params = {
        'gameId': gameId,
        'totalNums': code.length,
        'totalMoney': total_money,
        'betSrc': 0,
        'turnNum': dateStr + turnNum.substr(1),
        //'betBean[0].playId': 5510201,
        //'betBean[0].money': 100
    };
    code.forEach((v, i) => {
        params['betBean['+i+'].playId'] = id+v;
        params['betBean['+i+'].money'] = money;
    });
    return new Promise((resolve, reject) => {
        ajax({
            url: url + '/bet/bet.do',
            method: 'POST',
            success: (responseText) => {
                let data = JSON.parse(responseText);
                console.log('buy action success', `${p} ${code} ${money}`);
                resolve();
            },
            error: (e) => {
                console.log("buy action failed");
                reject(e);
            },
            data: params
        })
        
        
        
           
    })
}
function ajax(opt) {
    opt = opt || {};
    opt.method = opt.method.toUpperCase() || "GET"; //GET：用"GET"方式发送数据,只能256KB;POST：用"POST"方式发送数据,可以大到4MB
    opt.url = opt.url || "";
    opt.async = opt.async || true; //同步异步
    opt.dataType = opt.dataType || "text"; //所传的数的数据类型
    opt.contentType = opt.contentType || "application/x-www-form-urlencoded; charset=utf-8"; //默认表单格式 opt.dataType='json'
    opt.data = opt.data || null;
 
 
    var xmlHttp = getXmlHttp(); //获取XML 对象
 
    var postData = getAjaxParama(opt.data); //data
 
    if (opt.contentType === "application/json;charset=utf-8" && opt.dataType === "json") {
        postData = JSON.stringify(opt.data); //转化为字符串
    }
 
    if (opt.method === 'POST') {
        xmlHttp.open(opt.method, opt.url, opt.async);
        xmlHttp.setRequestHeader('Content-Type', opt.contentType); //而POST请求需要设置请求头，用来传递参数
 
    } else if (opt.method === 'GET') {
        postData = opt.url.indexOf("?") >= 0 ? "&" + postData : "?" + postData; //GET请求，参数是拼接到url上面；
        xmlHttp.open(opt.method, opt.url + postData, opt.async);
        postData = null; //重置参数
    }
    xmlHttp.onreadystatechange = function() {
        if (xmlHttp.readyState == 4) {
            var status = xmlHttp.status;
            if (status >= 200 && status < 300) {
                opt.success && opt.success(xmlHttp.responseText);
            } else {
                opt.error && opt.error(status);
            }
        }
    };
 
    xmlHttp.send(postData);
 
    function getXmlHttp() {
        var obj = null;
        //非IE浏览器创建XmlHttpRequest对象
        if (window.XMLHttpRequest) obj = new XMLHttpRequest();
 
        //IE浏览器创建XmlHttpRequest对象
        if (window.ActiveXObject) {
            try {
                obj = new ActiveXObject('Microsoft.XMLHTTP');
            } catch (e) {
                try {
                    obj = new ActiveXObject("msxml2.XMLHTTP");
                } catch (ex) {}
            }
        }
        return obj;
 
    }
 
    function getAjaxParama(data) {
        var params = [];
 
        for (var key in data) {
            params.push(encodeURIComponent(key) + '=' + encodeURIComponent(data[key]));
        }
        return params.join('&'); //添加&字符串
 
    }
 
}
startRecord();
function getMoneyArrlen(code_len,a_len)
{
    let a = [1];
    i = 0;
    while(a.length < a_len)
    {
        i++;
        let m = 0;
        for(let j = 0; j < a.length; j++)
        {
            m+=a[j];
        }
        m+=i;
        let diff = (i*9.95-m*code_len)/(a.length + 1);
        let d = Math.floor(9.95-code_len);
        if(diff >= d)
        {
            a.push(i);
        }
    }
    let t = 0;
    a.map((v) => {t+=v});
    console.log(t*code_len);
    return a;
}