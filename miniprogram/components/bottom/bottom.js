// components/bottom/bottom.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    modalshow:{
      type:Boolean
    }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },
  options:{
    styleIsolation:'apply-shared',
    multipleSlots:true,
  },
  /**
   * 组件的方法列表
   */
  methods: {
    onClose(){
      this.setData({
        modalshow:false
      })
    }
  }
})
