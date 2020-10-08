import { message } from 'ant-design-vue'
import printJS from 'print-js'

const numberToChineseNumberMap = {
    '0': '零',
    '1': '壹',
    '2': '贰',
    '3': '叁',
    '4': '肆',
    '5': '伍',
    '6': '陆',
    '7': '柒',
    '8': '捌',
    '9': '玖',
}

const unitToChineseUnitMap = {
    0: '拾',
    1: '佰',
    2: '仟',
    3: '万',
    yi: '亿',
}

export default {
    message,
    printJS,
    getCookie: function(cname) {
        var name = cname + "=";
        var ca = document.cookie.split(';');
        for(var i=0; i<ca.length; i++) {
            var c = ca[i].trim();
            if (c.indexOf(name)==0) { return c.substring(name.length,c.length); }
        }
        return "";
      },
    setCookie: function(cname, value, expirehours){
        var exdate=new Date();
        exdate.setHours(exdate.getHours() + expirehours);
        document.cookie=cname+ "=" + escape(value) + ((expirehours==null) ? "" : ";expires="+exdate.toGMTString()) + ";path=/";
    },
    deleteCookie: function(cname){
        this.setCookie(cname, "", -1)
    },
    // convert "2020-9" to "2020/9"
    stringToDate: function(string_date){
        let date = new Date(Date.parse(string_date.replace(/-/g, "/")))
        // console.log(date)
        return date
    },
    // Input: "2020-9"
    calcAgeFromBirth: function(string_date){
        let date = this.stringToDate(string_date)
        let current_date = new Date()
        return parseInt(current_date.getFullYear()) - parseInt(date.getFullYear())
    },
    // convert date type to "2020-9" type
    dateToString: function(date){
        return date.getFullYear() + '-' + (date.getMonth()+1)
    },
    logoutAndJumpToLoginPage: function(that){
        this.message.error("您还未登陆，请登陆后再进行操作！")
        that.$store.commit("logout")
        this.deleteCookie("token")
        that.$router.push({name: "Login"})
    },
    fixed2NumberToChineseNumber(x){
        if(typeof x === 'number')
            x = x.toFixed(2)
        x = '' + x
        let yuan = x.split('.')[0]
        let jiao = numberToChineseNumberMap[x[x.length-2]]
        let fen = numberToChineseNumberMap[x[x.length-1]]
    
        let res = ''
    
        let cnt = -1
        let zero_flag = false
        for(let i=yuan.length-1; i>=0; --i, ++cnt)
        {
            let num = numberToChineseNumberMap[yuan[i]] //数字
            let unit = cnt === -1 ? '元' : unitToChineseUnitMap[cnt%4] //单位
            if(unit === '万' && cnt%8 === 7) unit = unitToChineseUnitMap.yi
    
            if(unit === '万' && (yuan[i] == 0 && yuan[i-1] == 0 && yuan[i-2] == 0 && yuan[i-3] == 0)) unit = ''
            if(unit === '亿' && (yuan[i] == 0 && yuan[i-1] == 0 && yuan[i-2] == 0 && yuan[i-3] == 0 && yuan[i-4] == 0 && yuan[i-5] == 0 && yuan[i-6] == 0 && yuan[i-7] == 0)) unit = ''
    
            if(num === '零'){
                if(!zero_flag)
                {
                    if(cnt%4 !== 3 && cnt != -1)
                        res = num + res
                }
                zero_flag = true
            }
            else zero_flag = false
            
            if(!zero_flag)
                res = (num + unit) + res
            else{
                if(cnt%4 === 3)
                {
                    res = unit + res
                }
            }
        }
    
        let tail = ''
    
        if(jiao != '零')
        {
            tail += jiao + '角'
        }else{
            tail += jiao
        }
    
        if(fen != '零')
        {
            tail += fen + '分'
        }else{
            tail += '整'
        }
    
        if(res.length == 0)
        {
            res = '零'
        }
    
        if(res[res.length-1] !== '元')
        {
            res += '元'
        }
    
        if(jiao === '零' && fen === '零')
        {
            tail = '零角零分'
        }
    
        return res+tail
    }
}


