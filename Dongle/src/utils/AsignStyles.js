import { FontSize } from './FontSize'
import { Px2Dp } from './Px2dp.js'


export function StyleAsign(...args) {
  let obj = {}
  for (let i in args) {
    Object.assign(obj, args[i])
  }
  return obj
}

// backgroundColor
export function bgc(str) {
  return {
    backgroundColor: str
  }
}

// 行高
export function lgh(num) {
  return {
    lineHeight: Px2Dp(num)
  }
}


// margin-top
export function mt(num) {
  return {
    marginTop: Px2Dp(num)
  }
}

// margin-right
export function mr(num) {
  return {
    marginRight: Px2Dp(num)
  }
}

// margin-bottom
export function mb(num) {
  return {
    marginBottom: Px2Dp(num)
  }
}

// margin-left
export function ml(num) {
  return {
    marginLeft: Px2Dp(num)
  }
}

// padding-top
export function pt(num) {
  return {
    paddingTop: Px2Dp(num)
  }
}

// padding-right
export function pr(num) {
  return {
    paddingRight: Px2Dp(num)
  }
}

// padding-bottom
export function pb(num) {
  return {
    paddingBottom: Px2Dp(num)
  }
}

// padding-left
export function pl(num) {
  return {
    paddingLeft: Px2Dp(num)
  }
}

// flex1 flex2
export function flex(num) {
  return {
    flex: num
  }
}

// flex、 更换主轴方向 默认是column 更换为row
export function flexDir() {
  return {
    flexDirection: 'row'
  }
}

// 是否换行
export function flexWrap() {
  return {
    flexWrap: 'warp'
  }
}

// alignItems: 'flex-start'
export function al() {
  return {
    alignItems: 'flex-start'
  }
}

// alignItems: 'flex-start'
export function ar() {
  return {
    alignItems: 'flex-end'
  }
}

// alignItems: 'center'
export function ac() {
  return {
    alignItems: 'center'
  }
}

// alignItems: 'stretch'
export function as() {
  return {
    alignItems: 'stretch'
  }
}

// justifyContent: 'flex-start'
export function jl() {
  return {
    justifyContent: 'flex-start'
  }
}

// justifyContent: 'flex-end'
export function jr() {
  return {
    justifyContent: 'flex-end'
  }
}

// justifyContent: 'center'
export function bc() {
  return {
    justifyContent: 'center'
  }
}

// justifyContent: 'space-between'
export function jb() {
  return {
    alignItems: 'space-between'
  }
}

// justifyContent: 'stretch'
export function ja() {
  return {
    alignItems: 'space-around'
  }
}


// opacity: 0 ~ 1
export function op(num) {
  return {
    opacity: num
  }
}

// 颜色
export function color(string) {
  return {
    color: string
  }
}

// 字体大小
export function fz(num) {
  return {
    fontSize: FontSize(num)
  }  
}

// border-top
export function bt(num) {
  return{
    borderTopWidth: Px2Dp(num)
  }
}

// border-top-color
export function btc(string) {
  return{
    borderTopColor: string
  }
}

// border-right
export function br(num) {
  return{
    borderRightWidth: Px2Dp(num)
  }
}

// border-right-color
export function brc(string) {
  return{
    borderRightColor: string
  }
}

// border-bottom
export function bb(num) {
  return{
    borderBottomWidth: Px2Dp(num)
  }
}

// border-bottom-color
export function bbc(string) {
  return{
    borderBottomColor: string
  }
}

// border-left
export function bl(num) {
  return{
    borderLeftWidth: Px2Dp(num)
  }
}

// border-left-color
export function blc(string) {
  return{
    borderLeftColor: string
  }
}

// 左对齐
export function tleft() {
  return {
    textAlign: 'left'
  }
}

// 右对齐
export function tright() {
  return {
    textAlign: 'right'
  }
}

// 居中
export function tcenter() {
  return {
    textAlign: 'center'
  }
}

// 居中
export function posr() {
  return {
    position: 'relative'
  }
}

// 居中
export function posa() {
  return {
    position: 'absolute'
  }
}

// overflow: 'hidden
export function over() {
  return {
    overflow: 'hidden'
  }
}

// overflow: 'auto
export function overa() {
  return {
    overflow: 'auto'
  }
}