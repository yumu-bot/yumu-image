# 运行环境

## 必需


- NodeJS v22+（老版本会遇到 puppeteer 和 puppeteer-extra 的语法兼容问题）

绘图程序默认会连接端口 `8388`（websocket 客户端）。

请确保端口不被其他程序占用。

## .env 文件配置

绘图模块提供多个环境变量导入，方便您自行调节。

缓存路径：node 获取您操作系统的缓存文件夹下的 n-bot 文件夹。如果您配置好了下面的环境变量，则不用考虑这个。

| 变量名称 | 默认值 | 解释 |
| :-: | :-: | :-: |
| EXPORT_FILE | /home/spring/work/img/ExportFileV3 | 资源文件的本地路径。**必需** |
| PORT | 8388 | 与主程序通信的端口。**一般不用改** |
| SUPER_KEY | - | 绘图模块与文件模块的通信秘钥。**可不填** |
| OSU_BUFFER_PATH | 缓存路径/osufile | 存储 .osu 文件的地方，可以与主程序相同。 |
| BUFFER_PATH | 缓存路径/buffer | 存储图像缓存的地方，采用了 sharp 压缩，预期每文件平均占用 70~200KB。<br />会默认存储 webp，保证存储空间和质量。不受 IMAGE_FORMAT 变量影响。 |
| USE_PROXY | false | 是否使用本地代理 (127.0.0.1)。 |
| OSUFILE_NO_PROXY | false | 是否禁用 osu 文件下载时的代理。<br />因为现在 ppy 基本上拦掉了所有主站异常请求。 |
| PROXY_PORT | 7890 | 挂 http 代理的端口。 |
| IMAGE_FORMAT | jpg | 绘图模块返回的图片格式。可以使用 webp、jpg、png。<br />强烈推荐使用 webp，但是某些神秘 qq 客户端会出现缩略图预览问题。<br />部分需要玩家点开的超大面板（无需考虑缩略图预览问题时），会自动使用 webp 格式。 |

### Windows 运行

```bash
chcp 65001

set EXPORT_FILE="D:\ExportFileV3" <-- 自己改

yarn start
```

npm start 也行。

### Linux 运行

```bash
export EXPORT_FILE=/home/spring/work/img/ExportFileV3
export PORT=8388
export USE_PROXY=true
export OSUFILE_NO_PROXY=true

if pm2 describe main > /dev/null 2>&1
then
  echo "重启现有集群"
  pm2 reload main --update-env
  #pm2 restart main.js
else
  echo "启动新集群"
  pm2 start main.js --name "main" -i 2
  #pm2 start main.js
fi
```

可以使用 PM2 运行。你应该能自己解决。

不一定要集群运行，你自己运行的时候可直接 pm2 start main.js。

## 可选

简称你必然会踩到的坑

- maimai 和 chunithm 组件的歌曲背景，貌似会在特定情况和环境下，无法通过源站的 js 挑战。
  - 开发者在 windows 环境下可以正常补充下载，但是 linux 完全不行。
  - 这样下载到的图片会是挑战本身，而不是真正的歌曲背景。
  - 如果您要使用类似功能，可以在 ExportFileV3/Maimai/Cover 和 ExportFileV3/Chunithm/Cover 中，存放你获取到的歌曲背景。
  - 你需要自己找歌曲背景。

# 致谢和版权声明

- [EndfieldByButan.ttf](https://github.com/lhclbt/Endfield_Font)：
  - [鹰角网络 (HYPERGRYPH)](https://www.hypergryph.com/) 拥有该文字的最终解释权和所有权。
- 部分美术素材（歌曲封面）：
  - 来源：[落雪咖啡屋](https://maimai.lxns.net/docs)
  - 版权归世嘉 (SEGA) 和华立科技 (WAHLAP) 所有。

# 功能对应表

## 普通面板

- A: 没有额外功能区，只有卡片的面板，这种面板一般来说尺寸是 1920x1080。下面的可用空间是 790x1080。
  - A1: 好友面板 F
  - A2: 过审面板 Q
  - A3: 榜单 L
  - A4: 最好成绩（包括今日）T/B
  - A5: 多成绩 PS/RS
  - A6: 帮助和维基 MD/H/W
  - A7: 理论最好成绩 BF
  - A8: 猜歌 G
  - A9: 战队 TM
  - A10: 奖牌 BD
  - A11: 客串谱师 GD
  - A12: 最多游玩 E
  - A13: 探索谱面 E
  - A14: 玩家谱面 E
  - A15: 顶流成绩 TP
  - A16: 群内榜单 LG
- B: PPM 评分系统 PM
  - B1: PP- PM/PV
  - B2: 骂娘谱面解析 MM
  - B3: PP+ PP/PA/PX
  - K: 即现在的 K/KV
- C: MRA 斗力系统 RA (严格意义上说这也符合 A 类面板的标准，但是没纳入进去)
  - C2: SRA 斗力系统 SA
- D: 个人信息 IL
  - D2 老婆信息 IW
  - D3 新版个人信息 I
- E: 
  - E5: 新成绩 B/P/R/S
  - ~~E6: 谱面信息 M~~
  - E7: 对局当前谱面 ST
  - E10: 封面成绩 BW/PW/RW/SW
- F: 比赛监控 MN
  - F3: 单次对局 MR/RR
- G: 
- H: 图池系统 GP
- I: 
- J: 最好成绩分析 BA V2
  - J2: 最好成绩分析 BA V3
- K: 技巧分析
- L: 
- M: 谱师信息 IM
- N: 提名流程 N
- R: 谱面信息 M V2
- T: 流行谱面 PU
- U: 最佳朋友 F
-
- MA: 舞萌最好成绩 X/MB
- MA2: 中二最好成绩 Y/CB
- MF: 舞萌歌曲筛选 MF
- ME: 舞萌最好单曲成绩 X/MB
- MS: 舞萌歌曲信息 MS
- MV: 舞萌牌子信息 MV

## 额外面板

- Alpha 文字面板
- Beta 一个超帅的新面板 // 但是为什么弃用了呢
- Gamma 成绩和信息简版 IC/PC
- Delta XinRan 比赛面板 KT
- Epsilon 截图用头像 OA
- Zeta 截图用头像 OC
- Eta 千变万化 B/P/R/S
- Theta 图表面板 CT

## 卡片

- A: 可以在默认大小 (A) 里铺 4x3 的卡片
  - A1: 个人信息 430x210
  - A2: 谱面信息 430x210
  - A3: 用于 Q（A2）面板的谱面卡片
  - A4: 用于 L（A3）面板的成绩卡片，915x62
    - A04: 旧版，已经弃用
  - A5: 用于搜索 O (A8) 面板的谱面卡片
- B: PPM 评分系统 (B) 的卡片
  - B1: 左边默认卡片
  - B2: 中间卡片
- C: 用于 RA、BP、TBP (C、A4) 面板的玩家或谱面卡片 900x110
  - C2: 用于 BD (A10) 面板的徽章卡片
- D: I (D) 面板的（最近成绩）谱面卡片 310x80
  - D0: 用于 I（D0）面板的（最好成绩）谱面卡片 70x50，已经弃用
  - D2: 用于 I（D2）面板的（最好成绩）谱面卡片 70x50
  - D3: 
- E: 
- F: 比赛监控 MN (F) 的对局卡片
  - F2: 用于单次对局 MR/RR (F3) 面板的卡片
  - F3: 同上
- G: 
- H: 图池系统 MP (H) 的谱面卡片
- I: 
  - I3: 用于舞萌最好成绩 X/Y (MA) 面板的卡片
  - I4: 用于 osu! 大量成绩的小卡片 (A4/A5)
    - I01, I02: 旧版，已经弃用
- J: 
- K: 用于 K (K) 面板的卡片
- 
- MF: 用于舞萌歌曲 (MF) 的谱面卡片
- MS: 用于舞萌 (MS) 的成绩卡片

## 组件

- D: 重置版 I (D) 面板的拆分部分
- E: 重置版 PRS（E）面板的拆分部分
  - E1: 谱面信息部分
  - E2: 成绩部分
  - E3: 四维和密度部分
  - E4: 谱面 PP 分布
  - E5: 谱面信息
- J: 用于 BA（J）面板的统计部分，内含 I4
- IM: 谱师信息 IM 面板的拆分部分
- MD: 可以显示 Markdown 的成绩
