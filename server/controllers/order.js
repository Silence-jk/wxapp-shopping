const DB =  require('../utils/db.js')

module.exports = {
  add: async ctx => {
    let user = ctx.state.$wxInfo.userinfo.openId
    let productList = ctx.request.body.list || []

    //插入订单至 order_user 表
    let order = await DB.query('insert into order_user(user) values (?)', [user])

    let orderId = order.insertId
    let sql = 'INSERT INTO order_product (order_id, product_id, count) values'

    //插入时需要的数据和参数
    let params = []
    let query = []
    productList.forEach(product => {
      query.push('(?, ?, ?)')

      params.push(orderId)
      params.push(product.id)
      params.push(product.count || 1)
    })

    await DB.query(sql + query.join(', '), params)
    ctx.state.data = {}
  },

  /**
   * 获取已购买订单列表
   */
  list: async ctx => {
    let user = ctx.state.$wxInfo.userinfo.openId
    let list = await DB.query('SELECT order_user.id AS `id`, order_user.user AS `user`, order_user.create_time AS `create_time`, order_product.product_id AS `product_id`, order_product.count AS `count`, product.name AS `name`, product.image AS `image`, product.price AS `price` FROM order_user LEFT JOIN order_product ON order_user.id = order_product.order_id LEFT JOIN product ON order_product.product_id = product.id WHERE order_user.user = ? ORDER BY order_product.order_id', [user])

    //将数据库返回的数据组装成页面需要的格式
    let ret = []
    let cacheMap = {}
    let block = []
    let id = 0

    list.forEach(order => {
      if(!cacheMap[order.id]) {
        block = []
        ret.push({
          id: ++id,
          list: block
        })
        cacheMap[order.id] = true
      }
      block.push(order)
    })
    ctx.state.data = ret
  }
}