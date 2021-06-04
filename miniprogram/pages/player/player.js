// pages/player/player.js
let musiclist = []
let nowMusicIndex = 0
const getBackgroundAudioManager = wx.getBackgroundAudioManager()
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  // 需要显示到页面上的东西全部要定义在data里，得到值后用setdata传进去
  data: {
    musicImgUrl: '',
    isPlay:false,
    isLyricShow:false,
    lyric:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    nowMusicIndex = options.musicindex
    musiclist = wx.getStorageSync('musiclist')
    // console.log(options)
    this._loadmusic(options.musicid)
  },
  _loadmusic(musicId){

    let loadmusic = musiclist[nowMusicIndex]
    console.log(loadmusic)
    wx.setNavigationBarTitle({
      title: loadmusic.name,
    })
    this.setData({
      musicImgUrl : loadmusic.al.picUrl,
      isPlay:false,
    })
    app.setPlayMusicId(musicId)

    wx.showLoading({
      title: '加载中',
    })
    wx.cloud.callFunction({
      name:'music',
      data:{
        musicId,
        $url:'musicUrl'
      }
    }).then((res) => {
      let result = JSON.parse(res.result)
      // console.log(result.data[0])
      if(result.data[0].url == null){
        wx.showToast({
          title: '该歌曲版权受限，无法播放',
        })
        return
      }
      getBackgroundAudioManager.src = result.data[0].url
      getBackgroundAudioManager.title = loadmusic.name
    })
    this.setData({
      isPlay:true
    })
    wx.cloud.callFunction({
      name:'music',
      data:{
        musicId,
        $url:'lyric',
      }
    }).then((res) => {
      // console.log (JSON.parse(res.result).lrc)
      let lyric = "暂无歌词"
      const lrc = JSON.parse(res.result).lrc
      if(lrc){
        lyric = lrc.lyric
      }
      this.setData({
        lyric
      })
    })
    wx.hideLoading()
  },

  changeTap(){
    if(this.data.isPlay){
      getBackgroundAudioManager.pause()
    }else{
      getBackgroundAudioManager.play()
    }
    this.setData({
      isPlay:!(this.data.isPlay)
    })
  },
  toPre(){
    if(nowMusicIndex === 0){
      nowMusicIndex = musiclist.length-1
    }else{
      nowMusicIndex--
    }
    this._loadmusic(musiclist[nowMusicIndex].id)
  },
  toNext(){
    nowMusicIndex++
    if(nowMusicIndex === musiclist.length){
      nowMusicIndex = 0
    }
    this._loadmusic(musiclist[nowMusicIndex].id)
  },
  onChangeLyricShow(){
    this.setData({
      isLyricShow:! this.data.isLyricShow
    })
  },
  timeUpdate(event){
    // console.log('1')
    this.selectComponent('.lrc').update(event.detail.curtime)
    
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

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})