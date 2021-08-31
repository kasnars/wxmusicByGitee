// components/blog-ctrl/blog-ctrl.js
let app = getApp()
const db = wx.cloud.database()
Component({
  /**
   * 组件的属性列表
   */
  options: {
    styleIsolation: 'shared'
  },
  properties: {
    // userInfo:{
    //   type:'Object'
    // }
    blogid:String,
    blog:Object
  },
  /**
   * 组件的初始数据
   */
  data: {
    modalshow:false,
    content:''
  },

  /**
   * 组件的方法列表
   */
  methods: {
    onComment(){
      // console.log(this.properties.blogid)
      wx.getSetting({
        success(res) {
          console.log(app.globalData.userInfo)
        }
      })
      if(JSON.stringify(app.globalData.userInfo) != '{}'){
        this.setData({
          modalshow:true
        })
      }
    },
    onInput(event){
      this.setData({
        content:event.detail.value
      })
    },
    onSend(event){
      let content = this.data.content
      let formId = event.detail.formId
      if(content.trim() == ''){
        wx.showModal({
          cancelColor: 'cancelColor',
          title:'评论内容不能为空',
          mask:true
        })
        return
      }
      wx.showLoading({
        title: '评价中',
        mask:true,
      })
      db.collection('blog-comment').add({
        data:{
          content,
          createTime:db.serverDate(),
          blogId:this.properties.blogid,
          nickName:app.globalData.userInfo.name,
          avatalUrl:app.globalData.userInfo.img
        }
      }).then((res) => {
        wx.hideLoading()
        wx.showToast({
          title: '评论成功',
        })
        this.setData({
          content:'',
          showModal:false
        })
        
        this.triggerEvent('refresh')
      })
    }
  }
})
