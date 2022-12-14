// pages/blog-comment/blog-comment.js
import formatTime from '../../untils/formatTime.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    blog:{},
    commentList :[],
    blogId:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    this.setData({
      blogId:options.blogid
    })
    this._getBlogComment()
  },

  _getBlogComment(){
    wx.showLoading({
      title: '加载中',
      mask:true
    })

    wx.cloud.callFunction({
      name:'blog',
      data:{
        blogId:this.data.blogId,
        $url:'detail'
      }
    }).then((res) => {
      wx.hideLoading()
      console.log(res)

      let commentList = res.result.commentList.data
      for(let k = 0 ;k < commentList.length;k++){
        commentList[k].createTime = formatTime(new Date(commentList[k].createTime))
      }

      this.setData({
        commentList,
        blog:res.result.detail[0],
      })
      console.log(commentList.length,'com')
    })
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
    const blog = this.data.blog
    return{
      title:blog.content,
      path:`/miniprogram/pages/blog-comment/blog-comment?blogId=${blog._id}`
    }
  }
})