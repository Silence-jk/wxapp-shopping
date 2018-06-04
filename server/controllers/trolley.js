const DB = require('../utils/db.js')

module.exports = {
  //添加进购物车
  add: async ctx => {
    let user = ctx.state.$wxInfo.userinfo.openId
    let product = ctx.request.body

    let list = await DB.query('select * from trolley_user where trolley_user.id = ? and trolley_user.user = ?', [product.id, user] )

    if(!list.length) {
      //购物车没有该商品
      await DB.query('insert into trolley_user(id, count, user) values (?, ?, ?)', [product.id, 1, user])
    } else {
      //购物车已有该商品，数量 + 1
      let count = list[0].count + 1
      await DB.query('update trolley_user set count = ? where trolley_user.id = ? and trolley_user.user = ?', [count, product.id, user])
    }
  },
  //展示购物车信息
  list: async ctx => {
    let user = ctx.state.$wxInfo.userinfo.openId
    ctx.state.data = await DB.query('SELECT * FROM trolley_user LEFT JOIN product ON trolley_user.id = product.id WHERE trolley_user.user = ?', [user])
  },

  //更新购物车商品信息
  update: async ctx => {
    let user = ctx.state.$wxInfo.userinfo.openId
    let productList = ctx.request.body.list || []

    //删除购物车里的旧数据
    await DB.query('delete from trolley_user where trolley_user.user = ?', [user])

    let sql = 'insert into trolley_user(id, count, user) values '
    let query = []
    let param = []

    productList.forEach(product => {
      query.push('(?, ?, ?)')

      param.push(product.id)
      param.push(product.count || 1),
      param.push(user)
    })

    await DB.query(sql + query.join(', '), param)

    ctx.state.data = {}
  }
} 