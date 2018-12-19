var DATE_REGEXP = new RegExp("(\\d{4})-(\\d{2})-(\\d{2})([T\\s](\\d{2}):(\\d{2}):(\\d{2})(\\.(\\d{3}))?)?.*");
export default {
  GetUrlRelativePath(url) {　　　　 //var url = document.location.toString();
    　　　　
    var arrUrl = url.split("//");　
    var start = arrUrl[1].indexOf("/");　　　　
    var relUrl = arrUrl[1].substring(start); //stop省略，截取从start开始到结尾的所有字符　　　
    if (relUrl.indexOf("?") != -1) {　　　　　　
      relUrl = relUrl.split("?")[0];　　　　
    }　　　　
    return relUrl;　　
  },
  extend(des, src, override) {   
    if (src instanceof Array) {       
      for (var i = 0, len = src.length; i < len; i++)  {
        extend(des, src[i], override);  
      } 
    }   
    for (var i in src) {       
      if (override || !(i in des)) {           
        des[i] = src[i];       
      }   
    }   
    return des;
  },
  formatData(code, items) {
    var codeObject = {};
    for (var i = 0; i < code.length; i++) {
      codeObject[code[i]] = {
        max: -1,
        min: -1
      }
    }
    for (var index in items) {
      for (var i = 0; i < code.length; i++) {
        var temp = items[index][code[i]];
        if (!isNaN(temp)) {
          temp = temp * 1;
          if (temp > codeObject[code[i]].max) {
            codeObject[code[i]].max = temp;
            if (codeObject[code[i]].min == -1) {
              codeObject[code[i]].min = temp;
            }
          }
          if (temp < codeObject[code[i]].min) {
            codeObject[code[i]].min = temp;
          }
        }
      }
    }
    for (var index in items) {
      for (var i = 0; i < code.length; i++) {
        var codeValue = items[index][code[i]];
        if (!isNaN(codeValue)) {
          codeValue = codeValue * 1;
          items[index][code[i] + "_base"] = codeValue;
          if (codeObject[code[i]].min == codeObject[code[i]].max) {
            items[index][code[i]] = 1;
          } else {
            items[index][code[i]] = (codeValue - codeObject[code[i]].min) * 1.0 / (codeObject[code[i]].max - codeObject[code[i]].min);
          }
          items[index]["item" + code[i]] = codeObject[code[i]];
        }
      }
    }
    return items;
  },
  /**************************************时间格式化处理************************************/
  dateFtt(fmt, date) { //author: meizz
    var o = {
      "M+": date.getMonth() + 1, //月份
      "d+": date.getDate(), //日
      "h+": date.getHours(), //小时
      "m+": date.getMinutes(), //分
      "s+": date.getSeconds(), //秒
      "q+": Math.floor((date.getMonth() + 3) / 3), //季度
      "S": date.getMilliseconds() //毫秒
    };
    if (/(y+)/.test(fmt))
      fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
      if (new RegExp("(" + k + ")").test(fmt))
        fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
  },
  toDate(dateString) {
    if (DATE_REGEXP.test(dateString)) {
      var timestamp = dateString.replace(DATE_REGEXP, function($all, $year, $month, $day, $part1, $hour, $minute, $second, $part2, $milliscond) {
        var date = new Date($year, $month - 1, $day, $hour || "00", $minute || "00", $second || "00", $milliscond || "00");
        return date.getTime();
      });
      var date = new Date();

      date.setTime(timestamp);
      return date;
    }
    return null;
  },
  /**
    items 集合集
    item 单项
    判断集合集items是否包含单项item
  */
  contains(items, item) {
    for (var i in items) {
      if (items[i] == item) return true;
    }
    return false;
  },
  /* json数据行列转换
   * @jsonData json数据源
   * @idField  条件字段
   * @colField 生成列名的字段
   * @valueField 生成值的字段
   * @emptyValue 默认值 避免有些数据不全
   */
  row2col(jsonData, idField, colField, valueField, emptyValue) {
    var result = [], //存储返回的数据
      idIndexData = {}, //存储id在数组中的信息(位置)
      resultColumns = {}, //存储列名数据
      curRecord = null; //存储当前数据

    var colFields = colField.split(','); //

    // 循环整个JSON数组：[{...},{...},{...},...]
    for (var idx = 0; idx < jsonData.length; idx++) {

      //当前json数据对象
      var cdata = jsonData[idx];

      //根据主键值，查找到结果数组中的索引号
      var idValue = cdata[idField];
      var num = idIndexData[idValue]; //获取存储该id的数组索引号
      if (num != null) {
        curRecord = result[num];
      } else {
        //初始化数据时保持完整的结构信息 避免因为缺乏数据，缺乏指定的列数据
        curRecord = {};
      }

      // 指定的colFields列下的数据作为y轴，则取出该列的数据作为y轴即可
      for (var i in colFields) {
        var key = colFields[i];

        //获取到colField的值，作为列名
        var value = cdata[valueField];
        curRecord[value] = cdata[key];

        //存储列名
        resultColumns[value] = null;
        break;
      }

      //除数据内容外，还需要添加主键数据
      curRecord[idField] = idValue;

      //对象若为新建 则新增进数组
      if (num == null) {
        idIndexData[idValue] = result.push(curRecord) - 1;
      }
    }

    //数据检查 由于是将行数据作为列名，则可能会存在部分行缺少其他列数据，若缺少，则指定默认值
    for (var i in result) {
      for (var name in resultColumns) {
        if (!result[i].hasOwnProperty(name)) result[i][name] = emptyValue;
      }
    }
    return result;
  },
  formatHistoryData(datas) {
    var filds = datas[0].column;
    var tempDatas = [];
    for (var i = 1; i < datas.length; i++) {
      var item = {};
      var itemdata = datas[i].column;
      for (var j = 0; j < itemdata.length; j++) {
        item[filds[j]] = itemdata[j];
      }
      tempDatas.push(item);
    }
    return tempDatas;
  }
}
