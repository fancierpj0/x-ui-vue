module.exports = {
  moduleFileExtensions: [
    'js',
    'jsx',
    'json',
    'vue'
  ],
  transform: {
    '^.+\\.vue$': 'vue-jest', // 当引入vue文件时，会调用vue-jest转换器来识别和翻译vue文件
    '.+\\.(css|styl|less|sass|scss|svg|png|jpg|gif|eot|otf|webp|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$|svg.js': 'jest-transform-stub', // 会把静态文件转化为字符串，在做单元测试时我们只对逻辑进行测试而不对样式进行测试
    '^.+\\.jsx?$': 'babel-jest' // es6,jsx->es5
  },
  transformIgnorePatterns: [
    '/node_modules/'
  ],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1'
  },
  snapshotSerializers: [ // 决定snapshot怎么去存储
    'jest-serializer-vue'
  ],
  testMatch: [
    '**/tests/unit/**/*.(spec|test).(js|jsx|ts|tsx)|**/__tests__/*.(spec|test).(js|jsx|ts|tsx)'
  ],
  testURL: 'http://localhost/',
  watchPlugins: [
    'jest-watch-typeahead/filename', // 在测试选择p模式时，输入字符后会 自动显示 被匹配的文件以供选择
    'jest-watch-typeahead/testname'
  ]
}
