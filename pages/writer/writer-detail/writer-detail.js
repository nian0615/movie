// pages/movies/movies.js
var writerDetail = require("../../../data/writer-data");
var app = getApp();

Page({
  /**
   * 页面的初始数据
   */
  data: {
    isPlayaudio: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var writerId = options.id;
    this.data.currentId = writerId;
    var writerData = writerDetail.postList[writerId];
    this.setData({ writerKey: writerData });
    // 收藏
    // 获取本地的状态 writerCollection首先是一个对象 记录所有的状态
    var writerCollection = wx.getStorageSync("writer_collectionId");
    // console.log(writerCollection);
    if (writerCollection) {
      // 如果有 就重新赋值获取当前的文章的收藏的状态
      var writerCollection = writerCollection[writerId];
      if (writerCollection) {
        this.setData({
          conllection: writerCollection
        });
        // console.log(writerCollection, 'true---');
      }
    } else {
      var writerCollection = {};
      writerCollection[writerId] = false;
      // console.log(writerCollection, 'false---');
      wx.setStorageSync("writer_collectionId", writerCollection);
    }
    // --
    var gloable = app.globalData;

    // 如果app.里面的是true就把本地的改为true,如果为false就不改变
    // 并且app.js里面的id 要等于这篇文章的id 才能显示播放
    if (gloable.g_isPlaymusic && gloable.g_currentID === writerId) {
      this.setData({
        isPlayaudio: true
      });
      // this.data.isPlayaudio = true;
    }
    this.setAudio();
  },
  // 监听音乐播放事件
  setAudio() {
    var that = this;
    // 监听音乐播放事件
    const backgroundAudioManager = wx.getBackgroundAudioManager();
    backgroundAudioManager.onPlay(function() {
      that.setData({
        isPlayaudio: true
      });
      //   把app里面得状态也改变
      app.globalData.g_isPlaymusic = true;
      //   获取哪篇文章在播放
      app.globalData.g_currentID = that.data.currentId;
      //   console.log(app.globalData.g_isPlaymusic,"true");
    });
    // 监听音乐暂停事件
    backgroundAudioManager.onPause(function() {
      that.setData({
        isPlayaudio: false
      });
      app.globalData.g_isPlaymusic = false;
      //   暂停就清空这个id
      app.globalData.g_currentID = null;
      //   console.log(app.globalData.g_isPlaymusic,"false");
    });
    // 监听音频停止事件------音频听完后，图片不自动变化
    backgroundAudioManager.onEnded(() => {
      that.setData({
        isPlayaudio: false
      });
      app.globalData.g_isPlaymusic = false;
      app.globalData.g_currentID = null;
    });
  },
  //音乐播放器
  onMusic() {
    var currentid = this.data.currentId;
    var writerMusic = writerDetail.postList[currentid];
    if (this.data.isPlayaudio) {
      wx.pauseBackgroundAudio();
      this.setData({
        isPlayaudio: false
      });
    } else {
      wx.playBackgroundAudio({
        dataUrl: writerMusic.music.musicUrl,
        title: writerMusic.music.title,
        coverImgUrl: writerMusic.music.imgSrc
      });

      this.setData({
        isPlayaudio: true
      });
    }
  },
  // 收藏
  onColletionTap: function(event) {
    // console.log('hhahaha ');
    var writerCollection = wx.getStorageSync("writer_collectionId");
    // console.log(writerCollection, '00000');
    // 获取到当前的文章的收藏状态
    var writerColl = writerCollection[this.data.currentId];
    // 然后取反
    writerColl = !writerColl;
    writerCollection[this.data.currentId] = writerColl;
    // this.showModel(writerColl, writerCollection)
    this.showToast(writerColl, writerCollection);
  },
  // 模态框
  showModel(writerColl, writerCollection) {
    var that = this;
    wx.showModal({
      title: "收藏",
      content: writerColl ? "收藏该文章?" : "取消收藏该文章?",
      showCancel: "true",
      cancelText: "取消",
      cancelColor: "#ccc",
      confirmText: "确认",
      confirmColor: "#405f80",
      success(res) {
        if (res.confirm) {
          //更新文章的缓存期  writerCollection这是一个对象   千万不能写成writerColl 报错找半天这个地方
          wx.setStorageSync("writer_collectionId", writerCollection);
          // 更新数据绑定  从而实现图片切换
          that.setData({
            conllection: writerColl
          });
        }
      }
    });
  },
  showToast(writerColl, writerCollection) {
    //更新文章的缓存期  writerCollection这是一个对象   千万不能写成writerColl 报错找半天这个地方
    wx.setStorageSync("writer_collectionId", writerCollection);
    // 更新数据绑定  从而实现图片切换
    this.setData({
      conllection: writerColl
    });
    wx.showToast({
      title: writerColl ? "收藏成功" : "取消收藏",
      icon: "success",
      duration: 1000
    });
  },
  onshare: function(event) {
    let itemList = ["分享到微信好友", "分享到QQ", "分享到微博", "分享到朋友圈"];
    wx.showActionSheet({
      itemList: itemList,
      itemColor: "#405f80",
      success(res) {
        wx.showModal({
          title: "用户分享到" + itemList[res.tapIndex],
          content: "是否取消" + res.cancel + "此功能暂时无法实现"
        });
        // console.log(res.tapIndex)
      },
      fail(res) {
        wx.showToast({
          title: "取消分享",
          icon: "none",
          duration: 1000
        });
      }
    });
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    // this.onColletionTap()
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
