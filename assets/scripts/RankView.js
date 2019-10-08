// Learn cc.Class:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] https://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        display:{
            type:cc.Sprite,
            default:null 
        },
        view_zuijia:{
            default:null,
            type:cc.Node,
        },
        view_haoyou:{
            default:null,
            type:cc.Node,
        },
        shuoming_view:{
            default:null,
            type:cc.Node,
        },
        toggle1:{
            default:null,
            type:cc.Node,
        },
        btn:{
            default:null,
            type:cc.Node,
        },
        content:{
            default:null,
            type:cc.Node,
        },
        other_rankprefab:{
            default:null,
            type:cc.Prefab,
        },
        play_rankprefab:{
            default:null,
            type:cc.Prefab,
        },
        btn_yaoqing:{
            default:null,
            type:cc.Node,
        },
        sprite:{
            default:null,
            type:cc.Sprite,
        },
        jumapp:{
            default:null,
            type:cc.Node,
        },
        view:cc.Node,
        //item的间隔
        spacingY:0,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        //预加载的item的数据
        this.data = null;
        //当前可视区域内部填充满需要的item数量
        this.rowItemCounts = 0 
        //创建的item节点的数组
        this.items = []
        //顶部最大Y
        this.topMax = 0
        //底部最小Y
        this.bottomMax = 0
        //上一次listnode的Y坐标
        this.lastListY = 0
        //itemprefab的高度
        this.itemHeight = 0
    },

    start () {
        wx.aldSendEvent('排行榜pv');
        this.startTime = Date.now();
        
        Global.GetRank((res)=>{
            if(res.state==1){
                this.data = res.result;
            }
        })

        this.guangGaoIndex = Global.GetGuangGaoIndex();
        this.sprite.spriteFrame = Global.jumpappObject[this.guangGaoIndex].sprite;

        this.canvasAdopt();

        this.display.node.setContentSize(cc.view.getVisibleSize());
        if(CC_WECHATGAME){
            //给子域发送消息
            var openDataContext = wx.getOpenDataContext();
            openDataContext.postMessage({
                text:'showRank',
            });

            this.tex = new cc.Texture2D();
            let system = wx.getSystemInfoSync();
            if (system != null) {
                // 上线前注释console.log(system);
                this.ScreenWidth = system.windowWidth;
                this.ScreenHeight = system.windowHeight;
            }

            var self = this;
            var rt_1 = this.toggle1.getBoundingBoxToWorld();
            var ratio = this.ScreenWidth / 750;
            var detal = this.ScreenHeight / ratio - 1334;

            wx.getSetting({
                success: function (res) {
                    var authSetting = res.authSetting;
                    if (authSetting['scope.userInfo'] === false || authSetting['scope.userInfo'] == null){
                        var button = wx.createUserInfoButton({
                            type: 'text',
                            text: '',
                            style: {
                                left: rt_1.x * ratio,
                                top: (1334 - rt_1.y + detal) * ratio - rt_1.height * ratio,
                                width: rt_1.width * ratio,
                                height: rt_1.height * ratio,
                                lineHeight: 40,
                                backgroundColor: '#00ff0000',
                                color: '#00ffffff',
                                textAlign: 'center',
                                fontSize: 16,
                                borderRadius: 4
                            }
                        });
                        button.onTap(res => {
                            button.hide();
                            wx.getUserInfo({
                                opendIdList: ['selfOpenId'],
                                success: res => {
                                    // 上线前注释console.log("success+", res);
                                    var data = res.userInfo;
                                    let avatarUrl = data.avatarUrl;
                                    Global.avatarUrl = avatarUrl;
                                    Global.res = res;

                                    Global.UserAuthPost(res, Global.sessionId);

                                    self.view_zuijia.active = true;
                                    self.view_haoyou.active = false;
                                    self.btn.active = false;
                                    self.toggle1.getComponent(cc.Toggle).isChecked = true;
                                },
                                fail: res => {
                                    button.hide();
                                },
                            });
                        })
                    }
                }
            });
        }
        if(Global.isteam){
            this.btn_yaoqing.active = false;
        }
    },
    CloseBtn(){
        wx.aldSendEvent("游戏首页_排行榜页面停留时间",{
            "耗时" : (Date.now()-this.startTime)/1000
        });
        if(Global.level>=10){
            Global.showGameLoop = true;
        }
        //没授权 首页显示好友排行榜
        if(Global.UserAuthPostCount == 0){
            //给子域发送消息
            var openDataContext = wx.getOpenDataContext();
            openDataContext.postMessage({
                text:'shouye',
            });
        }else{
            cc.find("Canvas").getComponent("start").shouquan();
        }
        if(Global.isplaymusic){
            cc.audioEngine.play(Global.clip_btnclose, false);
        }
        this.node.destroy();
    },
    _updaetSubDomainCanvas () {
        if (!this.tex) {
            return;
        }
        if(!this.view_haoyou.active){
            return;
        }
        var openDataContext = wx.getOpenDataContext();
        var sharedCanvas = openDataContext.canvas;
        // if (sharedCanvas&&this.isBag) {
        //     this.isBag = false;
        //     sharedCanvas.width = cc.game.canvas.width;
        //     sharedCanvas.height = cc.game.canvas.height;
        // }
        this.tex.initWithElement(sharedCanvas);
        this.display.spriteFrame = new cc.SpriteFrame(this.tex);
    },
    update (dt) {
        this._updaetSubDomainCanvas();
        if(!this.view_zuijia.active){
            return;
        }
        //判断是否往下滑动
        let isDown = this.content.y > this.lastListY
        //当前的item数量
        let countOfItems = this.items.length
        //预显示数据的总数量
        let dataLen = this.data.ranks.length
        //遍历所有item节点
        for (let i in this.items){
            let item = this.items[i]
            //item坐标转换到对应view节点的坐标 y坐标需要减去一半item的高度...具体看你item的锚点设置
            let itemPos = this.content.convertToWorldSpaceAR(item.position)
            itemPos.y -= this.view.height / 2
            itemPos = this.view.convertToNodeSpaceAR(itemPos)
            //如果是往下滑动
            if(isDown){
                //判断当前item的坐标是否大于顶部最大Y
                if(itemPos.y > this.topMax){
                    //计算新的itmeid 
                    //比如一共13个item item的索引就是0-12 那么第0个item超过y坐标之后 就需要显示第13个item
                    //那么就是将当前id + 当前item的数量即可
                    let newId = item.__itemID + countOfItems 
                    //如果item已经显示完毕了就不需要刷新了
                    if(newId >= dataLen) return 
                    //保存itemid
                    item.__itemID = newId
                    //计算item的新的Y坐标 也就是当前y减去所有item加起来的高度
                    item.y = item.y - countOfItems * this.itemHeight - (countOfItems ) * this.spacingY
                    //刷新item内容 
                    item.getComponent('rankinit').init(this.data.ranks[item.__itemID])
                }
                //如果是往上滑动
            }else { 
                //如果超过底部最小Y 和上面的一样处理一下就完事了
                if(itemPos.y < this.bottomMax){
                    let newId = item.__itemID - countOfItems
                    if (newId < 0) return
                    item.__itemID = newId
                    item.y = item.y + countOfItems * this.itemHeight + (countOfItems) * this.spacingY
                    item.getComponent('rankinit').init(this.data.ranks[item.__itemID])
                }
            }
        }
        //存储下当前listnode的Y坐标 
        this.lastListY = this.content.y
    },
    //分享按钮
    shareBtn(){
        if(Global.isplaymusic){
            cc.audioEngine.play(Global.clip_btnclick, false);
        }
        wx.aldSendEvent('分享',{'分享功能' : '排行榜_分享战绩'});
        Global.ShareApp();
    },
    onClickInviteFriend: function (event) {
        if(Global.isplaymusic){
            cc.audioEngine.play(Global.clip_btnclick, false);
        }
        wx.aldSendEvent('邀请',{'邀请类型' : '邀请好友组队'});
        if (CC_WECHATGAME) {
            // 上线前注释console.log(Global.shareimg);
            wx.aldShareAppMessage({
                title: '你忘记了我们当初的海誓山盟了吗？点击一起赢取千元红包大奖',
                imageUrl: Global.shareimg,
                query: "team=" + Global.Introuid,
                success(res) {
                    // 上线前注释console.log("yes");
                },
                fail(res) {
                    // 上线前注释console.log("failed");
                },
                complete(res) {
                    // 上线前注释console.log("complete");
                }
            });
        }
    },
    /**
     * 
     * @param toggle 点击的toggle对象 
     */
    onClickToggle(toggle) {
        if(Global.isplaymusic){
            cc.audioEngine.play(Global.clip_btnclick, false);
        }
        if (toggle.isChecked && toggle.node.name == 'toggle1') {
            wx.aldSendEvent('搭档榜pv');
            if (Global.UserAuthPostCount > 0) {

            } else {
                wx.getUserInfo({
                    success(res){
                        Global.UserAuthPost(res, Global.sessionId);
                    }
                });
            }
            this.view_zuijia.active = true;
            this.view_haoyou.active = false;
            this.content.removeAllChildren();
            
            this.init(this.data.ranks);
            
            if(this.data.myrank.rank){
                let play = cc.instantiate(this.play_rankprefab);
                play.getComponent("rankinit").init(this.data.myrank);
                this.view_zuijia.addChild(play);
            }
                
            
        }else if(toggle.isChecked && toggle.node.name == 'toggle2'){
            this.view_zuijia.active = false;
            this.view_haoyou.active = true;
            wx.aldSendEvent('排行榜pv');
            
        }
    },
    init(data){
        //保存高度
        let height = 0
        //创建item 
        let item = cc.instantiate(this.other_rankprefab)
        height = item.height
        this.itemHeight = height
        //计算可视区域内部填充满需要的item数量
        this.rowItemCounts = Math.ceil(this.view.height / (height + this.spacingY))
        //加载rowitemCounts + 10个item 
        for(let i =0 ; i < this.rowItemCounts + 10 ; ++ i){
            //数据已经加载完毕了 说明需要加载的数据量很小
            if(typeof data[i] == 'undefined')
                break 
            //data[i]为了测试方便实际上只是一个1 2 3这样的数字 具体data和updateItem方法的实现
            //你需要根据你自己的情况来实现 
            item.getComponent('rankinit').init(data[i]);
            //记录一下itemid
            item.__itemID = i 
            //保存item到数组
            this.items.push(item)
            //加入item节点到scrollview的list里面
            this.content.addChild(item)
            //设置x坐标
            item.x = 2
            //设置y坐标 (根据自己设置的不同的锚点这些东西来调整能跑就完事了)
            item.y = - (height / 2 +  i * (height + this.spacingY ))
            //继续创建
            if(i < this.rowItemCounts + 9){
                item = cc.instantiate(this.other_rankprefab)
            }
            
        }
        //设置list的高度 不设置无法滑动
        this.content.height = 20 + (data.length) * height + (data.length) * this.spacingY
        //计算顶部最大Y
        this.topMax = (5 * height + 4 * this.spacingY)-60
        //计算底部最小Y
        this.bottomMax = -(this.view.height + this.topMax)
        //保存content的当前Y坐标
        this.lastListY = this.content.y
    },
    OpenShuomingBtn(){
        this.shuoming_view.active = true;
    },
    CloseShuoMingBtn(){
        this.shuoming_view.active = false;
    },
    WeiShouQuan(){
        let self = this;
        wx.getSetting({
            success: function (res) {
                var authSetting = res.authSetting;
                if (authSetting['scope.userInfo'] === true) {
                    if (Global.UserAuthPostCount > 0) {
                        self.btn.active = false;
                        self.toggle1.getComponent(cc.Toggle).isChecked = true;
                    } else {
                        wx.getUserInfo({
                            success(res){
                                Global.UserAuthPost(res, Global.sessionId,(res)=>{
                                    self.view_zuijia.active = true;
                                    self.view_haoyou.active = false;
                                    self.btn.active = false;
                                    self.toggle1.getComponent(cc.Toggle).isChecked = true;
                                });
                            }
                        });
                    }
                } else {
                    wx.showModal({
                        title: "提示",
                        content: "需要您授权才能打开最佳排行榜",
                        showCancel: false,
                        cancelText: "取消",
                        confirmText: "确认",
                        success: function (e) {
                            wx.openSetting({
                                success: function (res) {
                                    if (res.authSetting["scope.userInfo"] === true) {
                                        wx.getUserInfo({
                                            opendIdList: ['selfOpenId'],
                                            success: res => {
                                                // 上线前注释
                                                console.log("reshahaha=", res);
                                                var data = res.userInfo;
                                                Global.avatarUrl = data.avatarUrl;

                                                Global.res = res;

                                                Global.UserAuthPost(res, Global.sessionId);
                                                self.view_zuijia.active = true;
                                                self.view_haoyou.active = false;
                                                self.btn.active = false;

                                                self.toggle1.getComponent(cc.Toggle).isChecked = true;

                                            },
                                            fail: res => {
                                                // 上线前注释console.log("shibaishibai==", res);
                                                // button.hide();
                                                
                                            },
                                        });
                                    }
                                },
                                fail: function (res) {
                                    
                                }
                            })
                        }
                    });
                }
            }
        });
    },
    /**
     * 图片的试玩游戏跳转
     */
    OnClickTryNewGame(event, customEventData) {
        wx.aldSendEvent('导流广告_一角广告');
        this.appid = Global.jumpappObject[this.guangGaoIndex].apid;
        this.path = Global.jumpappObject[this.guangGaoIndex].path;
        // 上线前注释console.log("this.appid==", this.appid);
        // 上线前注释console.log("this.path==", this.path);

        var self = this;
        wx.navigateToMiniProgram({
            appId: self.appid,
            path: self.path,
            success(res) {
                // 打开成功
                // // 上线前注释console.log("跳转成功", res);
            },
            fail(res) {
                // // 上线前注释console.log("跳转失败", res);
            },
            complete(res) {
                // // 上线前注释console.log("跳转结果", res);
            }
        })
    },
    canvasAdopt() {
        // 适配解决方案
        let windowSize = cc.view.getVisibleSize();
        let ratio = windowSize.width / windowSize.height;
        ratio = ratio.toFixed(2);
        if(ratio != 0.56){
          this.jumapp.y-=173;
        }
      },
});
