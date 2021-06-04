// pages/blog/blog.js
let keywords = ''
Page({

  /**
   * 页面的初始数据
   */
  data: {
    modalshow:false,
    userInfo:{
      img:'',
      name:''
    },
    blogList:[],
  },
  onPublish(){
    // this.setData({
    //   modalshow:true
    // })
    // wx.getSetting({
    //   success: (res) => {
    //     if(res.authSetting['scope.userInfo']){
    //       // console.log(res)
    //       wx.getUserProfile({
    //         desc:'123',
    //         success: (res) => {
    //           console.log(res)
    //       }
    //       })
    //     }
    //   },
    // })
    if(this.data.userInfo.img === '' && this.data.userInfo.name === ''){
      wx.getUserProfile({
        desc: '123',
        success:(res) => {
          console.log(res.userInfo)
          this.setData({
            userInfo:{
              img:res.userInfo.avatarUrl,
              name:res.userInfo.nickName
            }
          })
        }
      })
      // console.log(this.data.userInfo)
    }else{
      wx.navigateTo({
        url: `../../pages/blog-edit/blog-edit?nickName=${this.data.userInfo.name}&avatarUrl=${this.data.userInfo.img}`,
      })
    }
    console.log(this.data.userInfo)
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this._loadBlogList()
  },

  _loadBlogList(start = 0){
    wx.showLoading({
      title: '拼命加载中',
    })
    wx.cloud.callFunction({
      name:'blog',
      data:{
        keywords,
        $url:'list',
        start,
        count:10,
      }
    }).then((res) =>{
      this.setData({
        blogList:this.data.blogList.concat(res.result)
      })
      wx.hideLoading()
      wx.stopPullDownRefresh()
    })
  },
  goComment(event){
    wx.navigateTo({
      url: `../blog-comment/blog-comment?blogid=${event.target.dataset.blogid}`,
    })
  },
  onSearch(event){
    console.log(event.detail.keywords)
    keywords = event.detail.keywords
    this._loadBlogList()
    this.onPullDownRefresh()
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
      blogList:[]
    })
    this._loadBlogList(0)
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this._loadBlogList(this.data.blogList.length)
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})