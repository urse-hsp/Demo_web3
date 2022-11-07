const list = [true, false, true]

const requestJS = () =>
  new Promise((res, rej) => {
    setTimeout(() => {
      // 请求成功(resolve)则代表车票未售空
      if (list[0]) return res({ ticket: true, price: 530, destination: '吉林-山东' })
      // 请求成功(rejected)则代表车票已售空
      rej({ ticket: false, destination: '吉林-山东' })
    }, 1000)
  })
// 查询 山东-云南 的车票是否已售空的接口
const requestSY = () =>
  new Promise((res, rej) => {
    setTimeout(() => {
      if (list[1]) return res({ ticket: true, price: 820, destination: '山东-云南' })
      rej({ ticket: false, destination: '山东-云南' })
    }, 1500)
  })
// 查询 云南-海南 的车票是否已售空的接口
const requestYH = () =>
  new Promise((res, rej) => {
    setTimeout(() => {
      if (list[2]) return res({ ticket: true, price: 1500, destination: '云南-海南' })
      rej({ ticket: false, destination: '云南-海南' })
    }, 2000)
  })

// 屎山 地狱嵌套循环 方式嵌套的层级太多
export const fn1 = () => {
  // 标识每次请求的成功与否(吉林-山东、山东-云南、云南-海南)

  // 查询 吉林-山东 的车票是否已售空的接口

  // requestJS().then((res) => {
  //   console.log(res)
  // })
  // requestSY().then((res) => {
  //   console.log(res)
  // })
  // requestYH().then((res) => {
  //   console.log(res)
  // })

  requestJS()
    .then(({ price: p1 }) => {
      console.log(`吉林-山东的车票未售空，价格是 ${p1} RMB`)
      // 如果吉林-山东的车票未售空，则继续查询山东-云南的车票
      requestSY()
        .then(({ price: p2 }) => {
          console.log(`山东-云南的车票未售空，价格是 ${p2} RMB`)
          // 如果山东-云南的车票未售空，则继续查询云南-海南的车票
          requestYH()
            .then(({ price: p3 }) => {
              console.log(`云南-海南的车票未售空，价格是 ${p3} RMB`)
              console.log(`本次旅途共计车费 ${p1 + p2 + p3} RMB`)
            })
            .catch(({ destination }) => {
              console.log(`来晚了，${destination}的车票已售空`)
            })
        })
        .catch(({ destination }) => {
          console.log(`来晚了，${destination}的车票已售空`)
        })
    })
    .catch(({ destination }) => {
      console.log(`来晚了，${destination}的车票已售空`)
    })
}

// 屎山优化 then会在请求成功时触发，catch会在请求失败时触发，而无论是then或catch都会返回一个Promise实例(return this)，我们也正是借助这个特性来实现then的链式调用
export const fn2 = () => {
  let acc = 0
  // 先查询吉林到山东
  requestJS()
    .then(({ price: p1 }) => {
      acc += p1
      console.log(`吉林-山东的车票未售空，价格是 ${p1} RMB`)
      // 如果吉林-山东的车票未售空，则继续查询山东-云南的车票
      return requestSY()
    })
    .then(({ price: p2 }) => {
      acc += p2
      console.log(`山东-云南的车票未售空，价格是 ${p2} RMB`)
      // 如果山东-云南的车票未售空，则继续查询云南-海南的车票
      return requestYH()
    })
    .then(({ price: p3 }) => {
      // 能执行到这里，就说明前面所有请求都成功了
      acc += p3
      console.log(`云南-海南的车票未售空，价格是 ${p3} RMB`)
      console.log(`本次旅途共计车费 ${acc} RMB`)
    })
    .catch(({ destination }) => console.log(`来晚了，${destination}的车票已售空`))
}

// 解决外部额外声明一个变量统计数据，
// 使用async处理Promise 磨平了一点屎山
export const fn3 = () => {
  const f = async () => {
    try {
      const js = await requestJS()
      console.log(`吉林-山东的车票未售空，价格是 ${js.price} RMB`)
      const sy = await requestSY()
      console.log(`山东-云南的车票未售空，价格是 ${sy.price} RMB`)
      const yh = await requestYH()
      console.log(`云南-海南的车票未售空，价格是 ${yh.price} RMB`)
      console.log(`本次旅途共计车费 ${js.price + sy.price + yh.price} RMB`)
    } catch ({ destination }) {
      console.log(`来晚了，${destination}的车票已售空`)
    }
  }

  f()
}

// 仅仅使用了一个catch便可以捕获所有错误
// 重复性catch, 封装智能化捕获函数
export const fn4 = () => {
  // 可以捕获
  try {
    throw ReferenceError('1对象 is not defined')
  } catch (e) {
    console.log(e)
  }

  // 不可以捕获
  try {
    setTimeout(() => {
      throw ReferenceError('2对象 is defined')
    }, 1)
  } catch (e) {
    console.log(e)
  }
}

// Generator
// Generator函数称作生成器，调用生成器函数会返回一个迭代器来控制这个生成器执行其代码，在生成器中可以使用yield关键字，理论上yield可以出现在任何能求值的地方，我们通过迭代器的next方法来确保生成器始终是可控的
// yield暂停代码，next执行代码
export const fn5 = () => {
  const f = function* () {
    console.log(1)
    // 注意yield只能出现在Gerenator函数中
    // 如果你将yield写在了回调里，请一定要确认这个回调是一个生成器函数
    yield
    console.log(2)
  }
  f().next()
}

// 异步
export const fn6 = () => {
  const f = async () => {
    console.log(1)
    // async函数在执行时，遇到await会交出“线程”，转而去执行其它任务，且await总是会异步求
    await '鲨鱼辣椒'
    console.log(3)
  }
  f()
  console.log(2)
}

// 让await永远不要抛出错误
export const fn7 = () => {
  // getInfo为获取车票信息的功能函数
  const getInfo = async () => {
    try {
      const result = await requestJS()
      console.log('try')
      return result
    } catch (e) {
      // 返回抛出错误
      console.log('catch')

      return e
    }
  }
  getInfo()
    .then((res) => {
      console.log(res, 'then')
    })
    .catch((err) => {
      console.log(err, 'err')
    })
}

// 让await抛出错误
// 保证不抛出错误
// noErrorAwait已经实现了它的第一个特点——保证不抛出错误, 但是并不能确保所有请求函数是按顺序执行的
export const fn8 = () => {
  // noErrorAwait负责拿到成功或失败的值，并保证永远不会抛出错误！
  const noErrorAwait = async (f) => {
    try {
      const r = await f() // (A)
      return { flag: true, data: r }
    } catch (e) {
      return { flag: false, data: e }
    }
  }

  const getInfo = () => {
    // const result = noErrorAwait(requestJS)
    // console.log(result, 'result')
    // return result

    const js = noErrorAwait(requestJS) // (B)
    console.log(`js 吉林-山东的车票未售空，价格是 ${js.data.price} RMB`)
    const sy = noErrorAwait(requestSY) // (C)

    console.log(`sy 山东-云南的车票未售空，价格是 ${sy.data.price} RMB`)
    const yh = noErrorAwait(requestYH) // (D)

    console.log(`yh 云南-海南的车票未售空，价格是 ${yh.data.price} RMB`)
    console.log(`本次旅途共计车费 ${js.price + sy.price + yh.price}`)
  }
  getInfo()
}

// 保证顺序执行 Generator
export const fn9 = () => {
  // noErrorAwait负责拿到成功或失败的值，并保证永远不会抛出错误！
  const noErrorAwait = async (f) => {
    try {
      console.log('try')
      const r = await f() // (A)
      // return { flag: true, data: r }
      generator.next({ flag: true, data: r })
    } catch (e) {
      console.log('catch')
      return { flag: false, data: e }
    }
  }

  const getInfo = function* () {
    const js = yield noErrorAwait(requestJS)
    console.log(`吉林-山东的车票未售空，价格是 ${js.data.price} RMB`)
    const sy = yield noErrorAwait(requestSY)
    console.log(`山东-云南的车票未售空，价格是 ${sy.data.price} RMB`)
    const yh = yield noErrorAwait(requestYH)
    console.log(`云南-海南的车票未售空，价格是 ${yh.data.price} RMB`)
    console.log(`本次旅途共计车费 ${js.data.price + sy.data.price + yh.data.price}`)
  }

  const generator = getInfo()
  getInfo().next()
}

// 抛出错误（实现了处理嵌套请求）yield什么的需要自定义。开始进行封装
export const fn10 = () => {
  // 存储每次的请求结果
  const result = []

  // 失败的回调(不要关心callback定义在哪里，以及如何传递)
  const callback = (...args) => console.log('某个请求出错了，前面收到的结果是', ...args) // (A)

  const noErrorAwait = async (f) => {
    try {
      const r = await f()
      const args = { flag: true, data: r }
      result.push(args)
      generator.next(args)
    } catch (e) {
      const args = { flag: false, data: e }
      result.push(args)
      callback(result)
      return args
    }
  }

  const getInfo = function* () {
    // (B)
    const js = yield noErrorAwait(requestJS)
    console.log(`吉林-山东的车票未售空，价格是 ${js.data.price} RMB`)
    const sy = yield noErrorAwait(requestSY)
    console.log(`山东-云南的车票未售空，价格是 ${sy.data.price} RMB`)
    const yh = yield noErrorAwait(requestYH)
    console.log(`云南-海南的车票未售空，价格是 ${yh.data.price} RMB`)
    console.log(`本次旅途共计车费 ${js.data.price + sy.data.price + yh.data.price}`)
  }

  const generator = getInfo() // (C)
  generator.next() // (D)
}

// 开始封装
const combineAsyncError = (tasks, config) => {
  // doGlide相当于一个公共区域(你也可以理解为原型对象)，把一些值和数据存放在这个公共区域中，其它人可以通过这个公共区域来访问这里面的值和数据
  const doGlide = {
    node: null, // 生成器节点
    out: null, // 结束请求函数的执行
    times: 0, // 表示执行的次数
    data: {
      // data为返回的最终数据
      result: [],
      error: null,
    },
  }

  // 扩展noErrorAwait
  const noErrorAwait = async (f) => {
    try {
      // 执行请求函数
      const r = await f()
      // 追加数据
      doGlide.data.result.push({ flag: true, data: r })
      // 请求成功时继续执行生成器
      doGlide.node.next()
    } catch (e) {
      // doGlide.data.error = e
      // // 当某个请求函数失败时，立即终止函数执行并返回数据
      // doGlide.out(doGlide.data)

      doGlide.data.result.push({ flag: false, data: e })
      // 当forever为true时，不必理会错误，而是继续执行生成器
      if (config?.forever) return doGlide.node.next()
      doGlide.out(doGlide.data)
    }
  }

  // 在handler中完成处理请求函数的逻辑。也就是操作Generator函数，既然这里要使用生成器，那就很有必要做一下初始化工作
  const handler = (res) => {
    doGlide.out = res
    // 预先定义好生成器
    doGlide.node = (function* () {
      const { out, data } = doGlide
      const len = tasks.length
      // yield把循环带回了JavaScript编程的世界
      while (doGlide.times < len) yield noErrorAwait(tasks[doGlide.times++])
      // 全部请求成功(生成器执行完毕)时，返回数据
      out(data)
    })()
    doGlide.node.next()
  }
  return new Promise((res) => handler(res))
}

export const fn11 = () => {
  const getInfo = [requestJS, requestSY, requestYH]
  combineAsyncError(getInfo, { forever: true }).then((data) => {
    console.log('请求结果为：', data)
  })
}


// https://juejin.cn/post/7121853787794325512#heading-27