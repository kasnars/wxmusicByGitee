// pages/playlist/playlist.js

const MAX_LIMIT = 15
Page({

  /**
   * 页面的初始数据
   */
  data: {
    swiperImgUrl:[{
      url: 'https://p1.music.126.net/bMzLFRgEha913U2_DeP3Yg==/109951163433862798.jpg',
      id: 902633862
    },
    {
      url: 'https://p1.music.126.net/AB-3WsIeCfDPkRyF_csLVQ==/109951165260265255.jpg',
      id: 5152332685
    },
    {
      url: 'https://p1.music.126.net/ns0C_DgZp8SAxwWLjtJ_7Q==/109951165137169029.jpg',
      id: 5051447966
    }
  ],
  playlist:[]
  },
  toweb(e){
    // console.log(e)
    console.log(e.currentTarget.dataset.picid)
    wx.navigateTo({
      url:'../detail/detail'
    })
  },
  gotoMusicList(e){
    const targetUrl = this.data.swiperImgUrl[e.currentTarget.dataset.picid].id
    wx.navigateTo({
      url: `../../pages/muscilist/musiclist?playlistId=${targetUrl}`,
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this._getplaylist()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    this.setData({
      playlist:[]
    })
    this._getplaylist()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this._getplaylist()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  _getplaylist() {
    wx.showLoading({
      title: '加载中',
    })
    wx.cloud.callFunction({
      name:'music',
      data:{
        start:this.data.playlist.length,
        count:MAX_LIMIT,
        $url:'playlist'
      }
    }).then((res) => {
      this.setData({
        playlist:this.data.playlist.concat(res.result.data)
      })
      wx.stopPullDownRefresh()
      wx.hideLoading()
    })
  }
})