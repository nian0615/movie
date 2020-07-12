// pages/movies/movies-detail/movies-detail.js
var app = getApp();
var util = require("../../../util/util");
Page({
  /**
   * 页面的初始数据
   */
  data: {
    movie: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var movieId = options.movieId;
    var url = app.globalData.doubanBase + "/v2/movie/subject/" + movieId;
    util.http(url, this.processData);
  },
  processData(data) {
    // console.log(data);
    var director = {
      avatar: "",
      name: "",
      id: ""
    };
    // console.log(data);
    // 判空
    if (data.directors[0] != null) {
      if (data.directors[0].avatars != null) {
        director.avatar = data.directors[0].avatars.large;
      }
      director.name = data.directors[0].name;
      director.id = data.directors[0].id;
    }
    var movie = {
      movieImg: data.images ? data.images.large : "",
      country: data.countries[0],
      title: data.title,
      originalTitle: data.original_title,
      wishCount: data.wish_count,
      commentCount: data.comments_count,
      year: data.year,
      geners: data.genres.join("、"),
      stars: util.compile_stars(data.rating.stars),
      score: data.rating.average,
      director: director,
      casts: util.moviePeople(data.casts),
      castsInfo: util.moviePeopleInfo(data.casts),
      summary: data.summary
    };
    this.setData({
      movie: movie
    });
    // console.log(movie);
  },
  /*查看图片*/
  viewMoviePostImg: function(e) {
    // console.log(111);
    var src = e.currentTarget.dataset.src;
    wx.previewImage({
      current: src, // 当前显示图片的http链接
      urls: [src] // 需要预览的图片http链接列表
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
