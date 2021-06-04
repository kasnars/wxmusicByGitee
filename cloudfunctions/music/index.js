// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

const TcbRouter = require('tcb-router')
const rp = require('request-promise')
const BASE_URL = 'http://www.huangjingxian.cn:3000'

// 云函数入口函数
exports.main = async (event, context) => {

  const app = new TcbRouter({ //new一个tcb对象 传入event
    event
  })

  app.router('playlist',async(ctx, next) => {  //用app.router创建一个函数 第一个参数是名字，第二个参数是异步回调给i一个箭头函数 然后用ctx.body接受功能函数
    ctx.body = await cloud.database().collection('playlist')
    .skip(event.start)
    .limit(event.count)
    .orderBy('createTime','desc')
    .get()
    .then((res) => {
      return res
    })
  })

  app.router('musiclist',async(ctx,next) => {
    ctx.body = await rp(BASE_URL + '/playlist/detail?id='+ parseInt(event.playlistId))
    .then((res) => {
      return JSON.parse(res)
    })
  })

  app.router('musicUrl',async(ctx,next) => {
    ctx.body = rp(BASE_URL+`/song/url?id=${event.musicId}`)
    .then((res) => {
      return res
    })
  })

  app.router('lyric',async(ctx,next) => {
    ctx.body = rp(BASE_URL+`/lyric?id=${event.musicId}`)
    .then((res) => {
      return res
    })
  })

    return app.serve() // 最后返回app.serve
}