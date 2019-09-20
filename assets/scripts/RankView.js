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
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {
        wx.aldSendEvent('游戏首页_荣耀榜页面访问数');
        this.startTime = Date.now();

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
    },
    CloseBtn(){
        wx.aldSendEvent("游戏首页_荣耀榜页面停留时间",{
            "耗时" : (Date.now()-this.startTime)/1000
        });
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
    },
    //分享按钮
    shareBtn(){
        wx.aldSendEvent('分享',{'页面' : '荣耀榜_分享战绩'});
        Global.ShareApp();
    },
    /**
     * 
     * @param toggle 点击的toggle对象 
     */
    onClickToggle(toggle) {
        if (toggle.isChecked && toggle.node.name == 'toggle1') {
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
            Global.GetRank((res)=>{
                if(res.state==1){
                    if(res.result.ranks.length >0){
                        for(let i=0;i<res.result.ranks.length;i++){
                            let other = cc.instantiate(this.other_rankprefab);
                            other.getComponent("rankinit").init(res.result.ranks[i]);
                            this.content.addChild(other);
                        }
                    }
                    if(res.result.myrank.rank){
                        let play = cc.instantiate(this.play_rankprefab);
                        play.getComponent("rankinit").init(res.result.myrank);
                        this.view_zuijia.addChild(play);
                    }
                }
            })
            
        }else if(toggle.isChecked && toggle.node.name == 'toggle2'){
            this.view_zuijia.active = false;
            this.view_haoyou.active = true;

            
        }
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
});
