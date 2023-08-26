/**
 * 环境配置封装
 */
// 先取出当前的环境
const env = import.meta.env.MODE || 'prod'

// 在公司中一般有三个环境 开发环境dev，测试环境test，生产环境prod
const EnvConfig = {
  dev: {
    baseApi: '/api',
    mockApi:'https://www.fastmock.site/mock/7196499c00b5911ba5d63e4f49774cfc/api'
  },
  test: {
    baseApi: '//test.future.com/api',
    mockApi: 'https://www.fastmock.site/mock/7196499c00b5911ba5d63e4f49774cfc/api'
  },
  prod: {
    baseApi: '//future.com/api',
    mockApi: 'https://www.fastmock.site/mock/7196499c00b5911ba5d63e4f49774cfc/api'
  }
}

export default {
  env,
  //模拟数据 默认开启
  // mock: true,
  ...EnvConfig[env],
  namespace: 'manage'
}