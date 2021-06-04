// components/lyric/lyric.js
let lrcHight = 0
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    isLyricShow:{
      type:Boolean,
      value:false,
    },
    lyric:String,
  },
  observers:{
    lyric(lrc){
      if(lrc ==='暂无歌词' ){
        this.setData({
          lrclist:[
            {
              lrc,
              time:0,
            }
          ],
          nowLrcIndex:-1
        })
      }else{
        this._parseLyric(lrc)
      }
      // console.log(lrc)

     
    }
  },
  /**
   * 组件的初始数据
   */
  data: {
    lrclist:[],
    nowLrcIndex:0,
    scrollTop:0,
  },
  lifetimes:{
    ready(){
      wx.getSystemInfo({
        success(res){
          lrcHight = res.screenWidth/750*64
        }
      })
    }
  },

  /**
   * 组件的方法列表
   */
  methods: {
    update(curtime){
      console.log(curtime)
      let lrclist = this.data.lrclist
      if(lrclist.length == 0){
        return
      }
      if(curtime > lrclist[lrclist.length-1].time){
        if(this.data.nowLrcIndex != -1){
          this.setData({
            nowLrcIndex:-1,
            scrollTop:lrclist.length* lrcHight
          })
        }
      }
      for(let i =0 ,len = lrclist.length;i < len;i++){
        if(curtime <= lrclist[i].time){
          this.setData({
            nowLrcIndex : i-1,
            scrollTop :(i-1)*lrcHight
          })
          break
        }
      }
    },
    _parseLyric(sLyric){
      let line = sLyric.split('\n')
      // console.log(line)
      let _lrcList = []
      line.forEach((elem)=>{
        let time = elem.match(/\[(\d{2,}):(\d{2})(?:\.(\d{2,3}))?]/g)
        if(time!= null){
          let lrc = elem.split(time)[1]
          let timeReg = time[0].match(/(\d{2,}):(\d{2})(?:\.(\d{2,3}))?/)
          let time2s = parseInt(timeReg[1])*60+parseInt(timeReg[2])+parseInt(timeReg[3])/1000
          _lrcList.push({
            lrc,
            time:time2s,
          })
        }
      })
      this.setData({
        lrclist:_lrcList
      })
    }
  }
})
