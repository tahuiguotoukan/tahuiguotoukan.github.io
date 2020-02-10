function openListener ()
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
function startRecord ()
{
    initData();
    openListener()
}
function initData ()
{
    //初始化参数
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
    planA();
    planB();
    //...
    showPlan();
}
function planA ()
{
    let plan_name = 'planA';
    initPlandata(plan_name);
    compareCode(plan_name, StartnewPlanA);
};
function StartnewPlanA()
{
    let current = plan_record['planA'].current;
    if(record_arr.length >= 4)
    {
        for(let i = 0; i < 10; i++)
        {
            
            if((record_arr[0][i] - record_arr[1][i] < 0 && record_arr[1][i] - record_arr[2][i] > 0 && record_arr[2][i] - record_arr[3][i] < 0) ||
            (record_arr[0][i] - record_arr[1][i] > 0 && record_arr[1][i] - record_arr[2][i] < 0 && record_arr[2][i] - record_arr[3][i] > 0) &&
            Math.abs(record_arr[0][i] - record_arr[1][i]) < 7)
            {
                let c = record_arr[0][i];
                let code = null;
                switch(c)
                {
                    case 1:
                        code = [2,3,4,5,6];
                        break;
                    case 2:
                        code = [3,4,5,6,7];
                        break;
                    case 3:
                        code = [2,4,5,6,7];
                        break;
                    case 4:
                        code = [2,3,5,6,7];
                        break;
                    case 5:
                        code = [3,4,6,7,8];
                        break;
                    case 6:
                        code = [3,4,5,7,8];
                        break;
                    case 7:
                        code = [4,5,6,8,9];
                        break;
                    case 8:
                        code = [4,5,6,7,9];
                        break;
                    case 9:
                        code = [4,5,6,7,8];
                        break;
                    case 10:
                        code = [5,6,7,8,9];
                        break;
                    default:
                        code = null;
                        break;
                }
                if(code)
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
function planB ()
{
    let plan_name = 'planB';
    initPlandata(plan_name);
    compareCode(plan_name, StartnewPlanB);
}
function StartnewPlanB ()
{
    let current = plan_record['planB'].current;
    if(record_arr.length >= 3)
    {
        for(let i = 0; i < 10; i++)
        {
            
            if((record_arr[0][i] > record_arr[1][i] && record_arr[1][i] > record_arr[2][i]) &&
            (Math.abs(record_arr[0][i] - record_arr[1][i]) !== 1))
            {
                let c = record_arr[0][i];
                let code = null;
                switch(c)
                {
                    case 7:
                        code = [3,4,5,8,9];
                        break;
                    case 6:
                        code = [2,3,4,7,8];
                        break;
                    case 5:
                        code = [2,3,6,7,8];
                        break;
                    case 4:
                        code = [2,5,6,7,8];
                        break;
                    case 3:
                        code = [4,5,6,7,8];
                        break;
                    case 2:
                        code = [3,4,5,6,7];
                        break;
                    case 1:
                        code = [2,3,4,5,6];
                        break;
                    default:
                        code = null;
                        break;
                }
                if(code)
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
            else if((record_arr[0][i] < record_arr[1][i] && record_arr[1][i] < record_arr[2][i]) &&
            (Math.abs(record_arr[0][i] - record_arr[1][i]) !== 1))
            {
                let c = record_arr[0][i];
                let code = null;
                switch(c)
                {
                    case 4:
                        code = [2,3,6,7,8];
                        break;
                    case 5:
                        code = [2,3,4,7,8];
                        break;
                    case 6:
                        code = [3,4,5,8,9];
                        break;
                    case 7:
                        code = [3,4,5,6,9];
                        break;
                    case 8:
                        code = [3,4,5,6,7];
                        break;
                    case 9:
                        code = [4,5,6,7,8];
                        break;
                    case 10:
                        code = [5,6,7,8,9];
                        break;
                    default:
                        code = null;
                        break;
                }
                if(code)
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
function initPlandata (plan)
{
    //执行计划前线初始化计划数据格式
    if(!plan_record[plan])
    {
        plan_record[plan] = {
            record: [],
            current: []
        }
    }
}
function showPlan ()
{
    console.clear();
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
        console.table(r, ['issue', 'code', 'position', 'length', 'status']);
        let money = 0;
        let m_arr = [1,3,7,15,32];
        r.forEach((v, i) => {
            if(v.status === 0) return;
            let l = v.length;
            if(l <= m_arr.length)
            {
                let m = 0;
                for(let i = 0; i < l; i++)
                {
                    m+=m_arr[i];
                }
                money+=m_arr[l-1]*9.95-m*5;
            }
            else
            {
                let m = 0;
                for(let i = 0; i < m_arr.length; i++)
                {
                    m+=m_arr[i];
                }
                money-=m*5;
            }
        })
        console.log(money);
        
    }

}
startRecord();