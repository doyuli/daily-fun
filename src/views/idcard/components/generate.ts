import { random, getRandomItem } from '../helper'
import { isOdd } from '~/shared'
import addressArray from './address.json'

const bankPrefixArray = [
  '622202',
  '622848',
  '622700',
  '622262',
  '621661',
  '622666',
  '622622',
  '622556',
  '622588',
  '622155',
  '622689',
  '622630',
  '622908',
  '621717',
  '622323',
  '622309',
]

export function getBankno() {
  let prefix = getRandomItem(bankPrefixArray)

  for (var j = 0; j < 13; j++) {
    prefix = prefix + Math.floor(random() * 10)
  }

  return prefix
}

const mobilePrefixArray = [
  '135',
  '136',
  '137',
  '138',
  '139',
  '150',
  '151',
  '152',
  '157',
  '158',
  '159',
  '182',
  '183',
  '187',
  '188',
  '198',
  '130',
  '131',
  '132',
  '155',
  '156',
  '186',
  '181',
  '189',
]

export function getMobile() {
  let prefix = getRandomItem(mobilePrefixArray)

  for (var j = 0; j < 8; j++) {
    prefix = prefix + Math.floor(random() * 10)
  }

  return prefix
}

const coefficientArray = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2] // 加权因子
const lastNumberArray = ['1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2'] // 校验码

export function getIdno() {
  const { code: regionCode, address } = getRandomItem(addressArray)

  // 生成出生日期（YYYYMMDD格式）
  const birthYear = Math.floor(random() * 40) + 1960 // 1960-1999年
  const birthMonth = String(Math.floor(random() * 12) + 1).padStart(2, '0')
  const birthDay = String(Math.floor(random() * 28) + 1).padStart(2, '0') // 简单处理，不考虑闰月

  // 生成顺序码（3位）
  const randomSequence = Math.floor(random() * 1000)
  const sequenceCode = String(randomSequence).padStart(3, '0')

  // 计算校验码
  const idNoPrefix = regionCode + `${birthYear}${birthMonth}${birthDay}` + sequenceCode
  let total = 0

  for (let i = 0; i < 17; i++) {
    total += parseInt(idNoPrefix[i]) * coefficientArray[i]
  }

  const now = new Date().getFullYear()
  const checkCode = lastNumberArray[total % 11]
  const idno = idNoPrefix + checkCode
  const birthday = `${birthYear}-${birthMonth}-${birthDay}`
  const age = now - birthYear
  const sex = isOdd(randomSequence) ? 1 : 0

  return {
    idno,
    birthday,
    age,
    sex, // 男1 女2
    address,
  }
}

const familyNames =
  '赵钱孙李周吴郑王冯陈褚卫蒋沈韩杨朱秦尤金许何吕施张孔曹严华金魏陶姜戚谢邹喻柏水窦章云苏潘葛奚范彭郎鲁韦昌马苗凤花方俞任袁柳酆鲍史唐费廉岑薛雷贺倪汤滕殷罗毕郝邬安常乐于时傅皮卞齐康伍余元卜晕晕亚雅牙韵芸筠哑哑亚香菜夕瑶汐姚汐瑶浩顾孟平黄和穆萧尹姚邵湛汪祁毛禹狄米贝明臧计伏成戴谈宋茅庞熊纪舒屈项祝董梁杜阮蓝闵席季麻强贾路娄危江童颜郭梅盛林刁钟徐邱骆高夏蔡田樊胡凌霍虞万支柯昝管卢莫经房裘缪干解应宗丁宣贲邓郁单杭洪包诸左石崔吉钮龚程嵇邢滑裴陆荣翁荀羊於惠甄曲家封芮羿储靳汲邴糜松井段富巫乌焦巴弓牧隗山谷车侯宓蓬全郗班仰秋仲伊宫宁仇栾暴甘钭厉戎祖武符刘景詹束龙叶幸司韶郜黎蓟薄印宿白怀蒲邰从鄂索咸籍赖卓蔺屠蒙池乔阴鬱胥能苍双闻莘党翟谭贡劳逄姬申扶堵冉宰郦雍卻璩桑桂濮牛寿通边扈燕冀郏浦尚农温别庄晏柴瞿阎充慕连茹习宦艾鱼容向古易慎戈廖庾终暨居衡步都耿满弘匡国文寇广禄阙东欧殳沃利蔚越夔隆师巩厍聂晁勾敖融冷訾辛阚那简饶空曾毋沙乜养鞠须丰巢关蒯相查后荆红游竺权逯盖益桓公万俟司马上官欧阳夏侯诸葛闻人东方赫连皇甫尉迟公羊澹台公冶宗政濮阳淳于单于太叔申屠公孙仲孙轩辕令狐钟离宇文长孙慕容鲜于闾丘司徒司空丌官司寇仉督子车颛孙端木巫马公西漆雕乐正壤驷公良拓跋夹谷宰父谷梁晋楚闫法汝鄢涂钦段干百里东郭南门呼延归海羊舌微生岳帅缑亢况郈有琴梁丘左丘东门西门商牟佘佴伯赏南宫墨哈谯笪年爱阳佟'
const givenNames =
  '子璇淼国栋夫子瑞堂甜敏尚浩曼皓曼国贤贺祥晨涛昊轩易轩辰益帆冉瑾春瑾昆春齐杨文昊东雄霖浩晨熙涵溶溶冰枫欣宜豪欣慧建政美欣淑慧文轩杰欣源忠林榕润欣汝慧嘉新建建林亦菲林冰洁佳欣涵涵禹辰淳美泽惠伟洋涵越润丽翔淑华晶莹凌晶苒溪雨涵嘉怡佳毅子辰佳琪紫轩瑞辰昕蕊萌明远欣宜泽远欣怡佳怡佳惠晨茜晨璐运昊汝鑫淑君晶滢润莎榕汕佳钰佳玉晓庆一鸣语晨添池添昊雨泽雅晗雅涵清妍诗悦嘉乐晨涵天赫玥傲佳昊天昊萌萌若萌'

export function getName() {
  // 随机选择姓氏
  const familyNameIndex: number = Math.floor(Math.random() * familyNames.length)
  const familyName: string = familyNames[familyNameIndex]

  // 随机选择名字 (1-2个字)
  const givenNameLength: number = Math.random() > 0.3 ? 2 : 1
  const givenNameStartIndex: number = Math.floor(
    Math.random() * (givenNames.length - givenNameLength),
  )
  const givenName: string = givenNames.substr(givenNameStartIndex, givenNameLength)

  return familyName + givenName
}
