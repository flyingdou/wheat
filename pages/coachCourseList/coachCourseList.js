var app = getApp();
Page({
  data: {
    base_pic_url: app.constant.base_pic_url,
    currentDate: "2017年05月03日",
    dayList: '',
    currentDayList: '',
    currentObj: '',
    currentDay: '',
    currentDayStr:'',
    isChoosed:false,
    dou_items: ["item-content", "item-content", "item-content", "item-content", "item-content", "item-content", "item-content", "item-content", "item-content", "item-content", "item-content", "item-content", "item-content", "item-content", "item-content", "item-content", "item-content", "item-content", "item-content", "item-content", "item-content", "item-content", "item-content", "item-content", "item-content", "item-content", "item-content", "item-content", "item-content", "item-content", "item-content", "item-content", "item-content", "item-content", "item-content", "item-content", "item-content", "item-content", "item-content", "item-content", "item-content", "item-content"],
    hasNoData:2,
    planData:{},
    douDatas : [],
    toMonth:0,
    currentChooseDate:''
  },
  onLoad: function (options) {
    var coachName = options.coachName;
    // 设置页面title
    wx.setNavigationBarTitle({
      title: coachName + "的课程表",
    })
    var currentObj = this.getCurrentDayString()
    var YYYY = currentObj.getFullYear();
    var MM = currentObj.getMonth()+1;
    var dd = currentObj.getDate();
    if (MM < 10 ){
      MM = "0" + MM;
    }
    if (dd < 10 ) {
      dd = "0" + dd;
    }
    var planDate = YYYY + '-' + MM + '-' + dd;
   
    this.setData({
      currentDate: currentObj.getFullYear() + '年' + MM + "月",
      currentDay: currentObj.getDate(),
      currentObj: currentObj,
      toMonth: 1,
      coachName: coachName,
      currentChooseDate: currentObj.getFullYear() + "-" + MM + "-" + dd

    })
    this.setSchedule(currentObj)

    // 获取当前月份的plan数据
    this.getPlanData(planDate)
  },

 /**
  * 用户切换月份，调用的函数
  */
  doDay: function (e) {
    var that = this
    var currentObj = that.data.currentObj
    var Y = currentObj.getFullYear();
    var m = currentObj.getMonth() + 1;
    var d = currentObj.getDate();
    var str = ''
    if (e.currentTarget.dataset.key == 'left') {
      m -= 1
      if (m <= 0) {
        str = (Y - 1) + '/' + 12 + '/' + d
      } else {
        str = Y + '/' + m + '/' + d
      }
    } else {
      m += 1
      if (m <= 12) {
        str = Y + '/' + m + '/' + d
      } else {
        str = (Y + 1) + '/' + 1 + '/' + d
      }
    }
    currentObj = new Date(str);
    var dou_YY = currentObj.getFullYear();
    var dou_MM = parseInt((currentObj.getMonth() + 1));
    
    // 判断是否是当前月份
    var today = new Date();
    var toYear = today.getFullYear();
    var toMonth =parseInt((today.getMonth() + 1));
    var isToMonth = 0;
    if (dou_YY == toYear && dou_MM == toMonth ) {
        isToMonth = 1;
    } 

    // 设置当前时间是不是本月
    that.setData({
      toMonth: isToMonth
    })
    if ( dou_MM < 10 ) {
         dou_MM = "0" + dou_MM;
      } 
    this.setData({
      currentDate: currentObj.getFullYear() + '年' + dou_MM + '月',
      currentObj: currentObj
    })
    this.setSchedule(currentObj);

    var douYYYY = currentObj.getFullYear();
    var douMM = (currentObj.getMonth()+1);
    var douDD = currentObj.getDate();
    if (douMM < 10 ) {
        douMM = "0" + dou_MM;
    }
    if (douDD < 10 ) {
        douDD = "0" + douDD;
    }
    var douStr = douYYYY + "-" + douMM + "-" + douDD;

    // 获取当前月份的plan数据
    this.getPlanData(douStr);
  },
  getCurrentDayString: function () {
    var objDate = this.data.currentObj
    if (objDate != '') {
      return objDate
    } else {
      var c_obj = new Date()
      var a = c_obj.getFullYear() + '/' + (c_obj.getMonth() + 1) + '/' + c_obj.getDate()
      return new Date(a)
    }
  },
  setSchedule: function (currentObj) {
    var that = this
    var m = currentObj.getMonth() + 1
    var Y = currentObj.getFullYear()
    var d = currentObj.getDate();
    var dayString = Y + '/' + m + '/' + currentObj.getDate()
    var currentDayNum = new Date(Y, m, 0).getDate()
    var currentDayWeek = currentObj.getUTCDay() + 1
    var result = currentDayWeek - (d % 7 - 1);
    var firstKey = result <= 0 ? 7 + result : result;
    var currentDayList = []
    var f = 0
    for (var i = 0; i < 42; i++) {
      let data = []
      if (i < firstKey - 1) {
        currentDayList[i] = ''
      } else {
        if (f < currentDayNum) {
          currentDayList[i] = f + 1
          f = currentDayList[i]
        } else if (f >= currentDayNum) {
          currentDayList[i] = ''
        }
      }
    }
    that.setData({
      currentDayList: currentDayList
    })
  },

  /**
   * 用户选中日期
   */
  chooseDay: function (day) {
     // 选中下标
     var chooseIndex = day.currentTarget.dataset.index;
     // 选中的天
     var chooseDay = day.currentTarget.dataset.chooseday;

     // 拼接查询的日期
     var currentDate = this.data.currentDate;
     var yea = currentDate.substring(0, 4);
     var mon = parseInt(currentDate.substring(currentDate.indexOf("年") + 1, currentDate.indexOf("月")));
     if (mon <10) {
        mon = "0" + mon;
     }

     chooseDay = chooseDay < 10 ? ("0"+chooseDay)  : chooseDay;

     // 查询日期
     var dateStr = yea + "-" + mon + "-" + chooseDay;

     var dou_arr = this.data.dou_items;
     for(var d = 0; d < dou_arr.length ; d++) {
         dou_arr[d] = "item-content";
     }
     dou_arr[chooseIndex] = "item-content isChoosed";
    this.setData({
       dou_items: dou_arr,
       currentChooseDate:dateStr
    })
     
     // 设置当前日期，页面的数据源
     this.getCurrentData(dateStr);
  },

  /**
   * 根据日期查询当前教练的信息
   */
  getPlanData: function (planDate) {
     var memberId = wx.getStorageSync("memberId");
     var coachId = wx.getStorageSync("coachId");
     var param = {};
     // 暂时测试
    //  memberId = "9388";
    //  planDate = "2018-04-09";
    //  coachId = "12764";
     var obj = this;
     param.memberId = memberId;
     param.planDate = planDate;
     param.coachId = coachId;
     var displayRedDot = [];
     for(var d = 0; d < 42; d++) {
         displayRedDot.push("redDot");
     }
    //  微信请求中，
     wx.request({
       url:  app.request_url + 'coachCourseList.asp',
       data:{
         json: encodeURI(JSON.stringify(param))
       },
       success: function (res) {
         var xx_items = obj.data.dou_items;

         // 日历中的日期  
         var days = obj.data.currentDayList;
         for (var x=0; x < res.data.items.length; x++){
             var douPlanDate = res.data.items[x].planDate;
             var hasDay = douPlanDate.substring(douPlanDate.length - 2, douPlanDate.length);
             hasDay = parseInt(hasDay);
             for (var y = 0; y < days.length; y++) {
                 if (days[y] == hasDay) {
                    xx_items[y] = "hasPlan";
                    displayRedDot[y] = "displayRedDot";
                 }
             }
         }
         var planDatas = res.data.items;
         obj.setData({
           douDatas : planDatas,
           dou_hasPlan : xx_items,
           dou_display : displayRedDot
         });
 
         // 筛选出查询日期当天的数据
         obj.getCurrentData(planDate);
       }
       
     })

      
  },
  

  /**
   * 筛选查询日期的plan数据
   */
  getCurrentData (dateStr) {
    var objx = this;
    var douPlanData = objx.data.douDatas;
    var douPageData = [];
    for (var dx = 0; dx < douPlanData.length; dx++) {
      if (dateStr == douPlanData[dx].planDate) {
        douPageData.push(douPlanData[dx]);
      }
    }
    var hasNoData = douPageData.length == 0 ? 1 : 0;
    var currentPagePlanData = douPageData.length == 0 ? [] : douPageData;
    // 给对象设值
    objx.setData({
      planData: currentPagePlanData,
      hasNoData: hasNoData
    })

  },
  
  /**
  * 用户点击右上角分享,
  ,
  */
  onShareAppMessage: function () {

  },

  /**
   * 用户点击预约按钮
   */
  appointment: function () {
     var objx = this;
     var planDateStr = objx.data.currentChooseDate;
     var toDate  = new Date();
     var timestamp = Date.parse(planDateStr)/1000;
     var planDate = new Date((timestamp + 24 * 60 * 60) * 1000);
     if (planDate < toDate) {
       wx.showModal({
         title: '提示',
         content: '只能预约今天及以后的课程',
       })
       return;
     }
    
     wx.navigateTo({
       url: "../../pages/coachCourseDeal/coachCourseDeal?coachName=" + objx.data.coachName + "&planDate=" + planDateStr,
     })

  }


})