// components/musicitemlist/musicitemlist.js
const app = getApp()
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    musiclist:Array
  },

  /**
   * 组件的初始数据
   */
  data: {
    tapid:"-1"
  },
  pageLifetimes:{
    show(){
      this.setData({
        tapid:parseInt(app.getPlayMusicId())
      })
    }
  },
  /**
   * 组件的方法列表
   */
  methods: {
    tapsong(event) {
      // console.log(event)
      // console.log(event.currentTarget.dataset.musicid)
      const musicid = event.currentTarget.dataset.musicid
      const musicindex = event.currentTarget.dataset.musicindex
      this.setData({
        tapid : musicid
      })
      wx.navigateTo({
        url: `../../pages/player/player?musicid=${musicid}&musicindex=${musicindex}`,
      })
    }
  }
})
