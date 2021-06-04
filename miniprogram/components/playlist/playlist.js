// components/playlist/playlist.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    playlist: {
      type:Object
    }
  },


  observers:{
    ['playlist.playCount'](count){
      this.setData({
        _count:this._tranNum(count,2)
      })
    }
  },
  /**
   * 组件的初始数据
   */
  data: {
    _count : 0
  },

  /**
   * 组件的方法列表
   */
  methods: {
    gotoMusicList(){
      wx.navigateTo({
        url: `../../pages/muscilist/musiclist?playlistId=${this.properties.playlist.id}`,
      })
    },
    _tranNum(num,point) {
      let numstr = num.toString().split('.')[0]
      if (numstr.length < 6) {
        return numstr
      }else if(numstr.length >= 6 && numstr.length <= 8 ) {
        let dec = numstr.substring(numstr.length-4, numstr.length-4+point)
        return parseFloat(parseInt(num/10000) + '.'+dec)+'万'
      }else if(numstr.length>8){
        let dec = numstr.substring(numstr.length-8,numstr.length-8+point)
        return parseFloat(parseInt(num/100000000) + '.'+dec)+'亿'
      }
    }
  }
})
