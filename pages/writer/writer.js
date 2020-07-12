// pages/writer/writer.js
var postData = require("../../data/writer-data");
Page({
  /**
   * 页面的初始数据
   */
  data: {
    post_key: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    // console.log(postData);
    // post_content 是一个数组了 但是要保证放在是一个js对象，
    // 所以要用一个键值对的形式响应 ！！！！
    this.setData({ post_key: postData.postList });
    // this.setData({ post_content }) // es6语法  键值对相等
  },
  onWriterdetail(event) {
    console.log(event);

    var writerId = event.currentTarget.dataset.writerid;
    wx.navigateTo({
      url: "./writer-detail/writer-detail?id=" + writerId
    });
  },
  onSwiperitem(event) {
    //   target 指的是当前点击的组件   currentTarget 指的是事件捕获的组件
    // target这里指的是image ,currentTarget指的是swiper
    var writerId = event.target.dataset.writerid;
    wx.navigateTo({
      url: "./writer-detail/writer-detail?id=" + writerId
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
