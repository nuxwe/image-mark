// 为了方便工作，减少重复代码量，故封装一些常用方法

/*
回到顶部
btnId    按钮id
*/ 
function backTop(btnId) {
    var btn = document.getElementById(btnId);
    var d = document.documentElement;
    var b = document.body;
    window.onscroll = set;
    btn.style.display = "none";
    btn.onclick = function() {
      btn.style.display = "none";
      window.onscroll = null;
      this.timer = setInterval(function() {
        d.scrollTop -= Math.ceil((d.scrollTop + b.scrollTop) * 0.1);
        b.scrollTop -= Math.ceil((d.scrollTop + b.scrollTop) * 0.1);
        if (d.scrollTop + b.scrollTop == 0)
          clearInterval(btn.timer, (window.onscroll = set));
      }, 10);
    };
    function set() {
        btn.style.display = d.scrollTop + b.scrollTop > 100 ? "block" : "none";
    }
}
/*
base64 编码
*/
function base64_decode(data) {
    var b64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
    var o1,
      o2,
      o3,
      h1,
      h2,
      h3,
      h4,
      bits,
      i = 0,
      ac = 0,
      dec = "",
      tmp_arr = [];
    if (!data) {
      return data;
    }
    data += "";
    do {
      h1 = b64.indexOf(data.charAt(i++));
      h2 = b64.indexOf(data.charAt(i++));
      h3 = b64.indexOf(data.charAt(i++));
      h4 = b64.indexOf(data.charAt(i++));
      bits = (h1 << 18) | (h2 << 12) | (h3 << 6) | h4;
      o1 = (bits >> 16) & 0xff;
      o2 = (bits >> 8) & 0xff;
      o3 = bits & 0xff;
      if (h3 == 64) {
        tmp_arr[ac++] = String.fromCharCode(o1);
      } else if (h4 == 64) {
        tmp_arr[ac++] = String.fromCharCode(o1, o2);
      } else {
        tmp_arr[ac++] = String.fromCharCode(o1, o2, o3);
      }
    } while (i < data.length);
    dec = tmp_arr.join("");
    dec = utf8_decode(dec);
    return dec;
}
/** 
 * 版本对比
 * 
*/
function compareVersion(v1, v2) {
    v1 = v1.split(".");
    v2 = v2.split(".");
    var len = Math.max(v1.length, v2.length);
    while (v1.length < len) {
      v1.push("0");
    }
    while (v2.length < len) {
      v2.push("0");
    }
    for (var i = 0; i < len; i++) {
      var num1 = parseInt(v1[i]);
      var num2 = parseInt(v2[i]);
      if (num1 > num2) {
        return 1;
      } else if (num1 < num2) {
        return -1;
      }
    }
    return 0;
}
/**
 * CSS样式压缩
 */
 function compressCss(s) {
    //压缩代码
    s = s.replace(/\/\*(.|\n)*?\*\//g, ""); //删除注释
    s = s.replace(/\s*([\{\}\:\;\,])\s*/g, "$1");
    s = s.replace(/\,[\s\.\#\d]*\{/g, "{"); //容错处理
    s = s.replace(/;\s*;/g, ";"); //清除连续分号
    s = s.match(/^\s*(\S+(\s+\S+)*)\s*$/); //去掉首尾空白
    return s == null ? "" : s[1];
}
/**
 * 字符串长度截取
 */

 function cutstr(str, len) {
    var temp,
        icount = 0,
        patrn = /[^\x00-\xff]/,
        strre = "";
    for (var i = 0; i < str.length; i++) {
        if (icount < len - 1) {
            temp = str.substr(i, 1);
                if (patrn.exec(temp) == null) {
                   icount = icount + 1
            } else {
                icount = icount + 2
            }
            strre += temp
            } else {
            break;
        }
    }
    return strre + "..."
}

/**
 * 时间格式转换
 * new Date().format("yyyy-MM-dd hh:mm:ss")
 */
 Date.prototype.format = function(formatStr) {
    var str = formatStr;
    var Week = ["日", "一", "二", "三", "四", "五", "六"];
    str = str.replace(/yyyy|YYYY/, this.getFullYear());
    str = str.replace(
      /yy|YY/,
      this.getYear() % 100 > 9
        ? (this.getYear() % 100).toString()
        : "0" + (this.getYear() % 100)
    );
    str = str.replace(
      /MM/,
      this.getMonth() + 1 > 9
        ? (this.getMonth() + 1).toString()
        : "0" + (this.getMonth() + 1)
    );
    str = str.replace(/M/g, this.getMonth() + 1);
    str = str.replace(/w|W/g, Week[this.getDay()]);
    str = str.replace(
      /dd|DD/,
      this.getDate() > 9 ? this.getDate().toString() : "0" + this.getDate()
    );
    str = str.replace(/d|D/g, this.getDate());
    str = str.replace(
      /hh|HH/,
      this.getHours() > 9 ? this.getHours().toString() : "0" + this.getHours()
    );
    str = str.replace(/h|H/g, this.getHours());
    str = str.replace(
      /mm/,
      this.getMinutes() > 9
        ? this.getMinutes().toString()
        : "0" + this.getMinutes()
    );
    str = str.replace(/m/g, this.getMinutes());
    str = str.replace(
      /ss|SS/,
      this.getSeconds() > 9
        ? this.getSeconds().toString()
        : "0" + this.getSeconds()
    );
    str = str.replace(/s|S/g, this.getSeconds());
    return str;
};
// 或
Date.prototype.format = function(format) {
    var o = {
        "M+": this.getMonth() + 1, //month
        "d+": this.getDate(), //day
        "h+": this.getHours(), //hour
        "m+": this.getMinutes(), //minute
        "s+": this.getSeconds(), //second
        "q+": Math.floor((this.getMonth() + 3) / 3), //quarter
        S: this.getMilliseconds() //millisecond
    };
    if (/(y+)/.test(format))
        format = format.replace(
        RegExp.$1,
        (this.getFullYear() + "").substr(4 - RegExp.$1.length)
        );
    for (var k in o) {
        if (new RegExp("(" + k + ")").test(format))
        format = format.replace(
            RegExp.$1,
            RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length)
        );
    }
    return format;
};

/**
 * 获取cookie
 */
function getCookie(name) {
    var arr = document.cookie.match(new RegExp("(^| )" + name + "=([^;]*)(;|$)"));
    if (arr != null) return unescape(arr[2]);
    return null;
}

/**
 * 获取URL中的参数
 * 用法：如果地址是 test.htm?t1=1&t2=2&t3=3, 那么能取得：GET["t1"], GET["t2"], GET["t3"]
 */
function getGet() {
    querystr = window.location.href.split("?");
    if (querystr[1]) {
      GETs = querystr[1].split("&");
      GET = [];
      for (i = 0; i < GETs.length; i++) {
        tmp_arr = GETs.split("=");
        key = tmp_arr[0];
        GET[key] = tmp_arr[1];
      }
    }
    return querystr[1];
}

/**
 * 检查URL是否有效
 */
function getUrlState(URL) {
    var xmlhttp = new ActiveXObject("microsoft.xmlhttp");
    xmlhttp.Open("GET", URL, false);
    try {
        xmlhttp.Send();
    } catch (e) {
    } finally {
        var result = xmlhttp.responseText;
        if (result) {
        if (xmlhttp.Status == 200) {
            return true;
        } else {
            return false;
        }
        } else {
        return false;
        }
    }
}
/**
 * 获取URL的参数
 * 获取URL中的某参数值,不区分大小写
 * 默认是取'hash'里的参数，
 * 如果传其他参数支持取‘search’中的参数
 * @param {String} name 参数名称
 */
export function getUrlParam(name, type = "hash") {
    let newName = name,
      reg = new RegExp("(^|&)" + newName + "=([^&]*)(&|$)", "i"),
      paramHash = window.location.hash.split("?")[1] || "",
      paramSearch = window.location.search.split("?")[1] || "",
      param;
    type === "hash" ? (param = paramHash) : (param = paramSearch);
    let result = param.match(reg);
    if (result != null) {
      return result[2].split("/")[0];
    }
    return null;
}
/**
 * 检查是否是安卓设备
 */
function isAndroidMobileDevice() {
    return /android/i.test(navigator.userAgent.toLowerCase());
}
/**
 * 检查是否是苹果设备
 */
function isAppleMobileDevice() {
    return /iphone|ipod|ipad|Macintosh/i.test(navigator.userAgent.toLowerCase());
}
/**
 * 判断是否移动设备访问
 */
function isMobileUserAgent() {
    return /iphone|ipod|android.*mobile|windows.*phone|blackberry.*mobile/i.test(
        window.navigator.userAgent.toLowerCase()
    );
}
/**
 * 判断是否是网址
 */
function isURL(strUrl) {
    var regular = /^\b(((https?|ftp):\/\/)?[-a-z0-9]+(\.[-a-z0-9]+)*\.(?:com|edu|gov|int|mil|net|org|biz|info|name|museum|asia|coop|aero|[a-z][a-z]|((25[0-5])|(2[0-4]\d)|(1\d\d)|([1-9]\d)|\d))\b(\/[-a-z0-9_:\@&?=+,.!\/~%\$]*)?)$/i;
    if (regular.test(strUrl)) {
      return true;
    } else {
      return false;
    }
}

/**
 * 设置cookie值
 */
function setCookie(name, value, Hours) {
    var d = new Date();
    var offset = 8;
    var utc = d.getTime() + d.getTimezoneOffset() * 60000;
    var nd = utc + 3600000 * offset;
    var exp = new Date(nd);
    exp.setTime(exp.getTime() + Hours * 60 * 60 * 1000);
    document.cookie =
      name +
      "=" +
      escape(value) +
      ";path=/;expires=" +
      exp.toGMTString() +
      ";domain=360doc.com;";
}
/**
 * 时间计算操作
1、< 60s, 显示为“刚刚”
2、>= 1min && < 60 min, 显示与当前时间差“XX分钟前”
3、>= 60min && < 1day, 显示与当前时间差“今天 XX:XX”
4、>= 1day && < 1year, 显示日期“XX月XX日 XX:XX”
5、>= 1year, 显示具体日期“XXXX年XX月XX日 XX:XX”
*/
function timeFormat(time) {
    var date = new Date(time),
      curDate = new Date(),
      year = date.getFullYear(),
      month = date.getMonth() + 10,
      day = date.getDate(),
      hour = date.getHours(),
      minute = date.getMinutes(),
      curYear = curDate.getFullYear(),
      curHour = curDate.getHours(),
      timeStr;
    if (year < curYear) {
      timeStr = year + "年" + month + "月" + day + "日 " + hour + ":" + minute;
    } else {
      var pastTime = curDate - date,
        pastH = pastTime / 3600000;
      if (pastH > curHour) {
        timeStr = month + "月" + day + "日 " + hour + ":" + minute;
      } else if (pastH >= 1) {
        timeStr = "今天 " + hour + ":" + minute + "分";
      } else {
        var pastM = curDate.getMinutes() - minute;
        if (pastM > 1) {
          timeStr = pastM + "分钟前";
        } else {
          timeStr = "刚刚";
        }
      }
    }
    return timeStr;
}

/**
 * 金额大小写转换
 */
function transform(tranvalue) {
    try {
      var i = 1;
      var dw2 = new Array("", "万", "亿"); //大单位
      var dw1 = new Array("拾", "佰", "仟"); //小单位
      var dw = new Array(
        "零",
        "壹",
        "贰",
        "叁",
        "肆",
        "伍",
        "陆",
        "柒",
        "捌",
        "玖"
      );
      //整数部分用
      //以下是小写转换成大写显示在合计大写的文本框中
      //分离整数与小数
      var source = splits(tranvalue);
      var num = source[0];
      var dig = source[1];
      //转换整数部分
      var k1 = 0; //计小单位
      var k2 = 0; //计大单位
      var sum = 0;
      var str = "";
      var len = source[0].length; //整数的长度
      for (i = 1; i <= len; i++) {
        var n = source[0].charAt(len - i); //取得某个位数上的数字
        var bn = 0;
        if (len - i - 1 >= 0) {
          bn = source[0].charAt(len - i - 1); //取得某个位数前一位上的数字
        }
        sum = sum + Number(n);
        if (sum != 0) {
          str = dw[Number(n)].concat(str); //取得该数字对应的大写数字，并插入到str字符串的前面
          if (n == "0") sum = 0;
        }
        if (len - i - 1 >= 0) {
          //在数字范围内
          if (k1 != 3) {
            //加小单位
            if (bn != 0) {
              str = dw1[k1].concat(str);
            }
            k1++;
          } else {
            //不加小单位，加大单位
            k1 = 0;
            var temp = str.charAt(0);
            if (temp == "万" || temp == "亿")
              //若大单位前没有数字则舍去大单位
              str = str.substr(1, str.length - 1);
            str = dw2[k2].concat(str);
            sum = 0;
          }
        }
        if (k1 == 3) {
          //小单位到千则大单位进一
          k2++;
        }
      }
      //转换小数部分
      var strdig = "";
      if (dig != "") {
        var n = dig.charAt(0);
        if (n != 0) {
          strdig += dw[Number(n)] + "角"; //加数字
        }
        var n = dig.charAt(1);
        if (n != 0) {
          strdig += dw[Number(n)] + "分"; //加数字
        }
      }
      str += "元" + strdig;
    } catch (e) {
      return "0元";
    }
    return str;
}

/**
 * 邮箱校验
 */

function isEmail(str) {
    return /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/.test(str);
}

/**
 * 网址校验
 */
function isURL(str) {
    return /^(https:\/\/|http:\/\/|ftp:\/\/|rtsp:\/\/|mms:\/\/)?[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+[\/=\?%\-&_~`@[\]\':+!]*([^<>\"\"])*$/.test(str);
}

/**
 * 身份证校验
 */
function isIDCard(str){
    return /^[1-9][0-9]{5}(18|19|(2[0-9]))[0-9]{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)[0-9]{3}[0-9Xx]$/.test(str);
}


/**
 * 下载文件流
 */
//download.js v3.0, by dandavis; 2008-2014. [CCBY2] see http://danml.com/download.html for tests/usage
// v1 landed a FF+Chrome compat way of downloading strings to local un-named files, upgraded to use a hidden frame and optional mime
// v2 added named files via a[download], msSaveBlob, IE (10+) support, and window.URL support for larger+faster saves than dataURLs
// v3 added dataURL and Blob Input, bind-toggle arity, and legacy dataURL fallback was improved with force-download mime and base64 support

// data can be a string, Blob, File, or dataURL

       
                   
                   
function download(data, strFileName, strMimeType) {
   
    var self = window, // this script is only for browsers anyway...
       u = "application/octet-stream", // this default mime also triggers iframe downloads
       m = strMimeType || u, 
       x = data,
       D = document,
       a = D.createElement("a"),
       z = function(a){return String(a);},
       
       
       B = self.Blob || self.MozBlob || self.WebKitBlob || z,
       BB = self.MSBlobBuilder || self.WebKitBlobBuilder || self.BlobBuilder,
       fn = strFileName || "download",
       blob, 
       b,
       ua,
       fr;
 
    //if(typeof B.bind === 'function' ){ B=B.bind(self); }
    
    if(String(this)==="true"){ //reverse arguments, allowing download.bind(true, "text/xml", "export.xml") to act as a callback
       x=[x, m];
       m=x[0];
       x=x[1]; 
    }
    
    
    
    //go ahead and download dataURLs right away
    if(String(x).match(/^data\:[\w+\-]+\/[\w+\-]+[,;]/)){
       return navigator.msSaveBlob ?  // IE10 can't do a[download], only Blobs:
          navigator.msSaveBlob(d2b(x), fn) : 
          saver(x) ; // everyone else can save dataURLs un-processed
    }//end if dataURL passed?
    
    try{
    
       blob = x instanceof B ? 
          x : 
          new B([x], {type: m}) ;
    }catch(y){
       if(BB){
          b = new BB();
          b.append([x]);
          blob = b.getBlob(m); // the blob
       }
       
    }
 
    function d2b(u) {
       var p= u.split(/[:;,]/),
       t= p[1],
       dec= p[2] == "base64" ? atob : decodeURIComponent,
       bin= dec(p.pop()),
       mx= bin.length,
       i= 0,
       uia= new Uint8Array(mx);
 
       for(i;i<mx;++i) uia[i]= bin.charCodeAt(i);
 
       return new B([uia], {type: t});
     }
      
    function saver(url, winMode){
       
       
       if ('download' in a) { //html5 A[download]           
          a.href = url;
          a.setAttribute("download", fn);
          a.innerHTML = "downloading...";
          D.body.appendChild(a);
          setTimeout(function() {
             a.click();
             D.body.removeChild(a);
             if(winMode===true){setTimeout(function(){ self.URL.revokeObjectURL(a.href);}, 250 );}
          }, 66);
          return true;
       }
       
       //do iframe dataURL download (old ch+FF):
       var f = D.createElement("iframe");
       D.body.appendChild(f);
       if(!winMode){ // force a mime that will download:
          url="data:"+url.replace(/^data:([\w\/\-\+]+)/, u);
       }
        
    
       f.src = url;
       setTimeout(function(){ D.body.removeChild(f); }, 333);
       
    }//end saver 
       
 
    if (navigator.msSaveBlob) { // IE10+ : (has Blob, but not a[download] or URL)
       return navigator.msSaveBlob(blob, fn);
    }  
    
    if(self.URL){ // simple fast and modern way using Blob and URL:
       saver(self.URL.createObjectURL(blob), true);
    }else{
       // handle non-Blob()+non-URL browsers:
       if(typeof blob === "string" || blob.constructor===z ){
          try{
             return saver( "data:" +  m   + ";base64,"  +  self.btoa(blob)  ); 
          }catch(y){
             return saver( "data:" +  m   + "," + encodeURIComponent(blob)  ); 
          }
       }
       
       // Blob but not URL:
       fr=new FileReader();
       fr.onload=function(e){
          saver(this.result); 
       };
       fr.readAsDataURL(blob);
    }  
    return true;
 } /* end download() */ 