// components/progress/progress.js
let movareawidth = 0
let movviewwidth = 0
const backgroundAudioManager = wx.getBackgroundAudioManager()
let cursectime = -1
let duration = 0
let isMoving = false
Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    time:{
      nowTime:'00:00',
      allTime:'00:00'
    },
    movdis:0,
    progress:0,
  },
  lifetimes:{
    ready(){
      this._getMoveDis()
      this._bindBGMevent()
      this._setallTime()
    }
  },
  /**
   * 组件的方法列表
   */
  methods: {
    _getMoveDis(){
      const query = this.createSelectorQuery()
      query.select('.area').boundingClientRect()
      query.select('.movview').boundingClientRect()
      query.exec((rect) => {
        // console.log(rect)
        movareawidth = rect[0].width
        movviewwidth = rect[1].width
      })
    },
    _bindBGMevent(){
      backgroundAudioManager.onPlay(() => {
        console.log('onplay')
        isMoving = false
      })
      backgroundAudioManager.onStop(() => {
        console.log('nostop')
      })
      backgroundAudioManager.onPause(() => {
        console.log('onpause')
      })
      backgroundAudioManager.onWaiting(() => {
        console.log('onwiting')
      })
      backgroundAudioManager.onCanplay(() => {
        console.log('oncanplay')
        if(typeof backgroundAudioManager.duration != 'undefined'){
          this._setallTime()
        }else{
          setTimeout(() => {
            this._setallTime()
          },1000)
        }
      })
      backgroundAudioManager.onTimeUpdate(() => {
        // console.log('ontimeupdate')
        if(!isMoving){
          const curtime = backgroundAudioManager.currentTime
          const durtime = backgroundAudioManager.duration
          const sectime = curtime.toString().split('.')[0]
          if(sectime != cursectime){
            const curtimeFmt = this._timeFormat(curtime)
            this.setData({
              movdis:(movareawidth-movviewwidth)*(curtime/durtime),
              progress:curtime/durtime*100,
              ['time.nowTime']:`${curtimeFmt.min}:${curtimeFmt.s}`
            })
            cursectime = sectime
            this.triggerEvent('timeupdate',{
              curtime
            })
          }
        }

      })
      backgroundAudioManager.onEnded(() => {
        console.log('onend')
        this.triggerEvent('musicEnd')
      })
      backgroundAudioManager.onError((res) => {
        console.error(res.errMsg)
        console.error(res.errCode)
        wx.showToast({
          title: '出现错误'+res.errCode,
        })
      })
    },
    _setallTime(){
      const dur = backgroundAudioManager.duration
      duration = dur
      const durformat = this._timeFormat(dur)
      // console.log(durformat)
      this.setData({
        ['time.allTime']:`${durformat.min}:${durformat.s}`
      })
    },
    _timeFormat(sec){
      const min = Math.floor(sec / 60)
      const s = Math.floor(sec % 60)
      return{
        'min':this._parse0(min),
        's':this._parse0(s)
      }
    },
    _parse0(sec){
      return sec<10?'0'+sec:sec
    },
    onChange(event){
      if(event.detail.source == 'touch'){
        this.data.progress = event.detail.x / (movareawidth-movviewwidth) * 100
        this.data.movdis = event.detail.x
        isMoving = true
      }
    },
    onTouchEnd(){
      const curtimeFmt = this._timeFormat(Math.floor(backgroundAudioManager.currentTime))
      this.setData({
        progress:this.data.progress,
        movdis:this.data.movdis,
        ['time.nowTime']:curtimeFmt.min + ':' +curtimeFmt.s
      })
      backgroundAudioManager.seek(duration*this.data.progress / 100)
      isMoving = false
    }

  }
})
