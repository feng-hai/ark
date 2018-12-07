// 定义类型常量，默认全部大写
const INCREMENT = 'INCREMENT'
const DECREMENT = 'DECREMENT'
const FIELDS = [{
    "field": "state",
    "checkbox": true
  },
  {
    "width": 200,
    'type': 'normal',
    "field": "field",
    "title": "字段代码",
    "align": "center",
    "visible": true,
    "valign": "bottom",
    "sortable": true,
    "editable": true


  }, {
    "width": 200,
    'type': 'normal',
    "field": "title",
    "title": "字段名称",
    "align": "center",
    "visible": true,
    "valign": "bottom",
    "sortable": true,
    "editable": true

  }, {
    "width": 200,
    'type': 'normal',
    "field": "code",
    "title": "自定义code",
    "align": "center",
    "visible": true,
    "valign": "bottom",
    "sortable": true,
    "editable": true

  },
  {
    "width": 200,
    'type': 'normal',
    "field": "align",
    "title": "左右对其方式",
    "align": "center",
    "visible": true,
    "valign": "bottom",
    "sortable": true,
    "editable": true

  }, {
    "width": 200,
    'type': 'normal',
    "field": "visible",
    "title": "是否可见",
    "align": "center",
    "visible": true,
    "valign": "bottom",
    "sortable": true,
    "editable": true
  },
  {
    "width": 200,
    'type': 'normal',
    "field": "valign",
    "title": "上下对其方式",
    "align": "center",
    "visible": true,
    "valign": "bottom",
    "sortable": true,
    "editable": true
  },
  {
    "width": 200,
    'type': 'normal',
    "field": "sortable",
    "title": "是否允许排序",
    "align": "center",
    "visible": true,
    "valign": "bottom",
    "sortable": true,
    "editable": true
  },
  {
    "width": 200,
    'type': 'normal',
    "field": "editable",
    "title": "是否允许修改",
    "align": "center",
    "visible": true,
    "valign": "bottom",
    "sortable": true,
    "editable": true
  },
  {
    "width": 200,
    'type': 'normal',
    "field": "formatter",
    "title": "字段函数",
    "align": "center",
    "visible": true,
    "valign": "bottom",
    "sortable": true,
    "editable": true
  },
  {
    "width": 200,
    'type': 'normal',
    "field": "events",
    "title": "事件操作函数集合",
    "align": "center",
    "visible": true,
    "valign": "bottom",
    "sortable": true,
    "editable": true
  },
  {
    "width": 200,
    'type': 'normal',
    "field": "api",
    "title": "管理视图id",
    "align": "center",
    "visible": true,
    "valign": "bottom",
    "sortable": false,
    "editable": true
  },
  {
    "width": 200,
    'type': 'normal',
    "field": "apikey",
    "title": "关联视图key",
    "align": "center",
    "visible": true,
    "valign": "bottom",
    "sortable": false,
    "editable": true
  },
  {
    "width": 200,
    'type': 'normal',
    "field": "apiName",
    "title": "关联视图name",
    "align": "center",
    "visible": true,
    "valign": "bottom",
    "sortable": false,
    "editable": true
  },
  {
    "width": 200,
    'type': 'normal',
    "field": "checkbox",
    "title": "选择器",
    "align": "center",
    "visible": true,
    "valign": "bottom",
    "sortable": false,
    "editable": true
  }, {
    "width": 200,
    'type': 'normal',
    "field": "groupKey",
    "title": "组编码",
    "align": "center",
    "visible": true,
    "valign": "bottom",
    "sortable": false,
    "editable": true
  }, {
    "width": 200,
    'type': 'normal',
    "field": "groupName",
    "title": "组名称",
    "align": "center",
    "visible": true,
    "valign": "bottom",
    "sortable": false,
    "editable": true
  },

  {
    "width": 200,
    'type': 'normal',
    "field": "number",
    "title": "显示顺序",
    "align": "center",
    "visible": true,
    "valign": "bottom",
    "sortable": false,
    "editable": true
  },
  {
    "width": 200,
    'type': 'normal',
    "field": "api_uri",
    "title": "原始Uri",
    "align": "center",
    "visible": true,
    "valign": "bottom",
    "sortable": false,
    "editable": true
  },
  {
    "width": 200,
    'type': 'normal',
    "field": "delete",
    "title": "操作",
    "align": "center",
    "visible": true,
    "valign": "bottom",
    "sortable": false,
    "formatter": "vehicleListDemo.deleteFormatter",
    "events": "vehicleListDemo.deleteEvents"
  }



]

export default {
  INCREMENT,
  DECREMENT,
  FIELDS
}
