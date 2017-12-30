# QY
一站式前端自动检测平台
## 名字的由来
`西游记`中记载：唐丞相魏征斩了泾河老龙王之后，老龙王的鬼魂自觉委屈，便每夜进入内宫找唐太宗李世民索命。
无奈宫门外有`秦琼`，`尉迟恭`二将把守，老龙王冤魂自不敢从双锏双鞭下走过，便转至皇宫的后宰门，砸砖碎瓦。
由于秦琼和尉迟恭已在前门，故丞相魏征只好亲自持诛龙宝剑夜守后宰门，时间一长，老龙王的冤魂渐渐地衰落下去，
魏征手中那把诛龙宝剑便不再呈高扬之状而垂立一侧了。魏征在隋唐演义中本是一文臣，最早在潞城县二贤庄三清观内当道长，
后被民间奉为门神后，其像也仗剑怒目，一派英武气概。

因此取`秦琼`和`尉迟恭`二人的名字作为我们的名字。中国民间常常将二人供奉为门神，将其神像贴于门上，用以驱邪避鬼、卫家宅、保平安、助功利、降吉祥等。
我们的这个平台做的事情也是一样，将牛鬼蛇神拒之门外，保证代码的高质量，这是一个伟大的愿景。

## 我们的目标
我们的目标是有两个关键字。 一个是检测，另一个是弱相关。 检测的意思是我们只会检测并给出检测结果。
并不会对文件进行任何修改，也就是说没有副作用。第二个是弱相关，怎么理解呢？ 其实就是我们检测的
东西是那些即使你错了，也可以正常运行，从而被很多人，尤其是习惯不好的人所忽略的内容。

## 第一期功能
第一期功能比较有限，我会在接下来的时间慢慢完善，将检测的范围和精确度上更进一层。
第一期的功能主要有：

### 检测
图片：包括图片类型检测，图片大小检测，图片相似度检测。

依赖：对项目的package进行检测，发现没用的，过期的，是否有已知的安全隐患。
### 通知
将检测结果通知相关人员。支持webhook自定义

## 让我们开始吧

### 配置
将.qyconfig放到任何地方，推荐项目根目录。

文件内容如下：

```json
{
  root: '', // 项目根目录,
  imgThreshold: 30, // 限制图片大小为30k内 （单位kb）
}

```