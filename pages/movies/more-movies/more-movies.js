// pages/movies/more-movies/more-movies.js
var util = require("../../../util/util");
var app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    movies: {},
    category: "",
    dataUrl: "", //请求地址
    totalConst: 0, //电影条数
    isEmpty: true //看movies里面是不是空数据
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    // console.log(options);
    this.category = options.category;
    /*   wx.setNavigationBarTitle({
      title: options.category
    }); */
    // var dataUrl = "";
    var doubanUrl = app.globalData.doubanBase; // 获取豆瓣api
    switch (this.category) {
      case "正在上映":
        this.dataUrl = doubanUrl + "/v2/movie/in_theaters"; //正在上映
        break;
      case "即将上映":
        this.dataUrl = doubanUrl + "/v2/movie/coming_soon"; //即将上映
        break;
      case "豆瓣Top250":
        this.dataUrl = doubanUrl + "/v2/movie/top250"; //top250
        break;
    }
    util.http(this.dataUrl, this.processDouban);
  },
  // 处理电影的信息
  processDouban(movieDouban) {
    // console.log(movieDouban.subjects, "444");
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
    var totalMovies = {}; //页面显示总数据
    // console.log(this.data.totalConst, "222");
    // 初始化页面空数据 isEmpty true 后面就为false
    if (!this.data.isEmpty) {
      // console.log(this.data.isEmpty);
      // this.data.movies 页面上的已有数据
      totalMovies = this.data.movies.concat(movies);
    } else {
      // console.log(this.data.isEmpty, "222");
      // 没有数据就直接等于第一次加载的数据
      totalMovies = movies;
      this.data.isEmpty = false;
    }
    // console.log(totalMovies);

    this.setData({
      // wxml要用的时候，一定要先初始化  否则报错
      movies: totalMovies
    });
    this.data.totalConst += 20; //每次请求都加20就记录好
    wx.hideNavigationBarLoading();
    wx.stopPullDownRefresh();
  },
  // 上滑加载更多数据
  /*  onScroll() {
    // console.log(111);
    // 从当前的总数据再加20条
    var moreUrl = this.dataUrl + "?start=" + this.data.totalConst + "&count=20";
    // console.log(moreUrl);
    util.http(moreUrl, this.processDouban);
    wx.showNavigationBarLoading();
  } */ onReachBottom() {
    // 从当前的总数据再加20条
    var moreUrl = this.dataUrl + "?start=" + this.data.totalConst + "&count=20";
    // console.log(moreUrl);
    util.http(moreUrl, this.processDouban);
    wx.showNavigationBarLoading();
  },
  // 下拉刷新
  onPullDownRefresh() {
    // console.log(111);
    var referUrl = this.dataUrl + "?start=0&count=20";
    this.data.movies = {};
    this.data.isEmpty = true;
    this.data.totalConst = 0;
    // console.log(moreUrl);
    util.http(referUrl, this.processDouban);
    wx.startPullDownRefresh();
  },
  // 跳转到详情页面
  onMovietap(event) {
    // console.log(event);
    var movieId = event.currentTarget.dataset.movieid;
    wx.navigateTo({
      url: "../movies-detail/movies-detail?movieId=" + movieId
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    wx.setNavigationBarTitle({
      title: this.category
    });
  },

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
