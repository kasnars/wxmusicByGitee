// components/blogcard/blogcard.js
import formatTime from '../../untils/formatTime'
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    blog:Object
  },

  /**
   * 组件的初始数据
   */
  data: {
    _createTime:'',
  },
  observers:{
    ['blog.createTime'](val){
      if(val){
        this.setData({
          _createTime:formatTime(new Date(val))
        })
      }
    }
  },
  /**
   * 组件的方法列表
   */
  methods: {
    onPre(event){
      wx.previewImage({
        urls: this.data.blog.img,
        current:event.currentTarget.dataset.imgindex
      })
    }
  }
})
