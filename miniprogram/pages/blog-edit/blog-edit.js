// pages/blog-edit/blog-edit.js
const MAX_WORDS = 140;
const MAX_IMG = 9;
const db = wx.cloud.database()
let content = ''
let userInfo = {}
Page({

  /**
   * 页面的初始数据
   */
  data: {
    wordsNum:0,
    keywordHeight:0,
    img:[],
    selectShow:true,
  },
  countInput(event){
    let nowWords = event.detail.value.length
    if(nowWords >= MAX_WORDS){
      nowWords = 140
    }
    this.setData({
      wordsNum:nowWords,
    })
    content = event.detail.value
  },
  onFocus(event){
    // console.log(event.detail.height)
    this.setData({
      keywordHeight:event.detail.height,
    })

  },
  onBlur(event){
    this.setData({
      keywordHeight:0,
    })
  },
  chooseImg(){
    let canchoose = MAX_IMG-this.data.img.length
    wx.chooseImage({
      count: canchoose,
      sizeType:['origin','compressed'],
      sourceType:['album','camera'],
      success:(res) => {
        console.log(res)
        this.setData({
          img:this.data.img.concat(res.tempFilePaths)
        })
        canchoose = MAX_IMG-this.data.img.length
        console.log(canchoose)
        this.setData({
          selectShow:canchoose <=0 ? false:true
        })
      }
    })
  },
  delImg(event){
    this.data.img.splice(event.target.dataset.index,1)
    this.setData({
      img:this.data.img
    })
    if(this.data.img.length === MAX_IMG-1){
      this.setData({
        selectShow:true
      })
    }
  },
  onPre(event){
    wx.previewImage({
      urls: this.data.img,
      current:event.target.dataset.imgsrc
    })
  },
  send(){
    if(content.trim() === ''){
      wx.showModal({
        cancelColor: 'red',
        title:'发布内容不能为空'
      })
      return
    }
    wx.showLoading({
      title: '发布中',
      mask:true,
    })
    let promisearr = []
    let fileIds = []
    
      for (let i =0,len=this.data.img.length;i<len;i++) {
        let p = new Promise((resolve,reject) => {
        let item = this.data.img[i]
        let suffix = /\.\w+$/.exec(item)[0]
        wx.cloud.uploadFile({
          cloudPath:'blog/'+Date.now()+'-'+Math.random()*10000000+suffix,
          filePath:item,
          success:(res)=>{
            // console.log(res.fileID)
            fileIds = fileIds.concat(res.fileID)
            // console.log(fileIds)
            resolve()
          },
          fail:(err) => {
            console.error(err)
            reject()
          }
        })
      })
      promisearr.push(p)
      // console.log(promisearr)
      }

      Promise.all(promisearr).then((res)=>{
        db.collection('blog').add({
          data:{
            ...userInfo,
            content,
            img:fileIds,
            createTime:db.serverDate(),
          }
        }).then((res)=>{
          wx.hideLoading()
          // console.log(content)
          wx.showToast({
            title: '发布成功',
          })
          content = ''
          // console.log(content)
          wx.navigateBack()
          const pages = getCurrentPages()
          const perPages = pages[pages.length-2]
          perPages.onPullDownRefresh()
        })
      }).catch((err)=>{
        wx.showToast({
          title: '发布失败',
        })
        content=''
      })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // console.log(options)
    userInfo = options
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