// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init()

const db = cloud.database()
const rp = require('request-promise')




// const URL = 'http://musicapi.xiecheng.live/personalized'
const URL = 'http://www.huangjingxian.cn:3000/personalized'
const selctplaylist = db.collection('playlist') //collection选择集合 要加引号
const MAX_LIMIT = 100


// 云函数入口函数
exports.main = async (event, context) => {

    
    const countResult = await selctplaylist.count()
    const total = countResult.total
    const batchTimes = Math.ceil(total / MAX_LIMIT)
    const tasks = []
    for (let i = 0 ;i < batchTimes; i++) {
      let promise = selctplaylist.skip(i * MAX_LIMIT).limit(MAX_LIMIT).get()
      tasks.push(promise)
    }
    let list = {
      data: []
    }
    if (tasks.length > 0){
      list = (await Promise.all(tasks)).reduce((acc, cur) => {
        return{
          data :acc.data.concat(cur.data)
        }
      })

    }


    //请求新数据
    const playListByCloud = await rp(URL).then((res) => {
      return JSON.parse(res).result
    })

    //从原数据库中取出原数据
    const playlistBydb = await selctplaylist.get()

    //数据去重
    const newData = []
    for (let i = 0; i < playListByCloud.length;i++) {
      let flag = true //判断是否为唯一值
      for (let j =0; j < playlistBydb.data.length; j++){
        if (playListByCloud[i].id === playlistBydb.data[j].id) {
          flag = false
          break
        }
      }
      if(flag) {
        newData.push(playListByCloud[i])
      }
    }

    //往数据里添加去重后的数据
    for (let i = 0 ; i < newData.length;i++) {
      await selctplaylist.add({ //  然后add方法添加
        data:{
          ...newData[i],
          createTime:db.serverDate(),
        }
      }).then((res) => {
        console.log('push db is ok')
      }).catch((err) => {
        console.error('push hava a error')
      })
    }
}