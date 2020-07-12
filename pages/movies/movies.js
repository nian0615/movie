// pages/movies/movies.js
var util = require("../../util/util");
var app = getApp();

Page({
  /**
   * 页面的初始数据
   */
  data: {
    theaters: {},
    coming_soon: {},
    top: {},
    searchResult: {},
    conntainerShow: true,
    searchBannerShow: false,
    inputValue: ""
  },
  // 搜索框聚焦的时候
  onChangefocus: function() {
    this.setData({
      conntainerShow: false,
      searchBannerShow: true
    });
  },
  // 搜索框搜索的时候
  onSend: function(e) {
    value = e.detail.value;
    var searchUrl = app.globalData.doubanBase + "/v2/movie/search?q=" + value;
    this.getmovieList(searchUrl, "searchResult", "");
    // console.log(searchUrl);
  },
  // 退出搜索
  oncancle(e) {
    // console.log(e);
    this.setData({
      conntainerShow: true,
      searchBannerShow: false,
      inputValue: "",
      // 清空上一次搜索数据
      searchResult: {}
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    // console.log(compile_stars);
    var doubanUrl = app.globalData.doubanBase; // 获取豆瓣api
    var in_theatersUrl =
      doubanUrl + "/v2/movie/in_theaters" + "?start=0&count=3"; //正在上映
    var coming_soon = doubanUrl + "/v2/movie/coming_soon" + "?start=0&count=3"; //即将上映
    var top = doubanUrl + "/v2/movie/top250" + "?start=0&count=3"; //top250
    // 如果分类太多的话，就可以再temp哪里绑定值获取
    this.getmovieList(in_theatersUrl, "theaters", "正在上映");
    this.getmovieList(coming_soon, "coming_soon", "即将上映");
    this.getmovieList(top, "top", "豆瓣Top250");
  },
  getmovieList(url, settKey, cateKey) {
    var that = this;
    wx.request({
      url: url,
      method: "Get",
      header: {
        "content-type": "application/xml" // 默认值
      },
      success(res) {
        // console.log(res.data);
        that.processDouban(res.data, settKey, cateKey);
      },
      fail(err) {
        console.log(err);
      }
    });
  },
  //处理电影的信息
  processDouban(movieDouban, settKey, cateKey) {
    // console.log(movieDouban.subjects);
    var movies = [];
    for (let index = 0; index < movieDouban.subjects.length; index++) {
      let subject = movieDouban.subjects[index];
      let title = subject.title;
      // 标题长度大于6 就省略
      if (title.length >= 6) {
        title = title.substring(0, 6) + "...";
      }
      // console.log(movieDouban);
      // console.log(util.compile_stars(subject.rating.stars));
      // 拿到单个电影想要的数据
      var temp = {
        starts: util.compile_stars(subject.rating.stars), //星星组件
        title: title, // 标题
        average: subject.rating.average, // 评分
        imgUrl: subject.images.large, // 图片
        movieId: subject.id // 电影id
      };
      // console.log(temp);
      movies.push(temp);
    }
    var readyData = {};
    // console.log(movies);
    // 给了一个key值 好分辨是是哪一个区域，js基础 自定义属性  放在readyData这个对象里
    // theaters: {movies: Array(3)}
    readyData[settKey] = { cateTitle: cateKey, movies: movies };
    // console.log(readyData, 2222);
    this.setData(readyData);
  },
  // -----更多
  onMoreMovie(event) {
    // console.log(event);
    var category = event.currentTarget.dataset.category;
    // console.log(category);
    wx.navigateTo({
      url: "./more-movies/more-movies?category=" + category,
      success: result => {},
      fail: () => {},
      complete: () => {}
    });
  },
  // 跳转到详情页面
  onMovietap(event) {
    // console.log(event);
    var movieId = event.currentTarget.dataset.movieid;
    wx.navigateTo({
      url: "./movies-detail/movies-detail?movieId=" + movieId
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {},

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {},

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {},

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {},

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {},

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {}
});
