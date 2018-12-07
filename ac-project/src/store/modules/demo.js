            export default {
              state: {
                products: [{
                    name: '鼠标',
                    price: 20
                  },
                  {
                    name: '键盘',
                    price: 40
                  },
                  {
                    name: '耳机',
                    price: 60
                  },
                  {
                    name: '显示屏',
                    price: 80
                  }
                ]
              },
              getters: { //添加getters vuex 計算字段
                saleProducts: (state) => {
                  for (var i = 0; i < state.products.length; i++) {
                    state.products[i].price = state.products[i].price / 2
                  }
                  //重新copy一份后不再更新state中數據
                  // let saleProducts = state.products.map(product => {
                  //   return {
                  //     name: product.name,
                  //     price: product.price / 2
                  //   }
                  // })
                  // return saleProducts;
                  return state.products;
                },
                sproducts: (state) => {
                  return state.products;
                }
              },
              mutations: { //添加mutations
                minusPrice(state, payload) {
                  let newPrice = state.products.forEach(product => {
                    product.price -= payload
                  })
                }
              },
              actions: { //添加actions
                minusPriceAsync(context, payload) {
                  setTimeout(() => {
                    context.commit('minusPrice', payload); //context提交
                  }, 2000)
                }
              }
            }
