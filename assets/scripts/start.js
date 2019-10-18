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
        prefab_boxview:{
            default: null,
            type: cc.Prefab,
        },
        prefab_carview:{
            default: null,
            type: cc.Prefab,
        },
        prefab_taskview:{
            default: null,
            type: cc.Prefab,
        },
        prefab_peopleupview:{
            default: null,
            type: cc.Prefab,
        },
        prefab_rankview:{
            default: null,
            type: cc.Prefab,
        },
        prefab_userview:{
            default: null,
            type: cc.Prefab,
        },
        prefab_addpower:{
            default:null,
            type:cc.Prefab,
        },
        prefab_nationaldat:{
            default: null,
            type: cc.Prefab,
        },
        prefab_IdiomFortunes:{
            default: null,
            type: cc.Prefab,
        },
        // clip_backmusic: {
        //     default: null,
        //     type: cc.AudioClip,
        // },
        clip_close:{
            default:null,
            type:cc.AudioClip,
        },
        anim_target:cc.Node,
        anim_pos:cc.Node,
        powerbg:cc.Node,
        player_name:cc.Label,
        player_img:cc.Sprite,
        car_img:cc.Sprite,
        lvlup_player:cc.Node,
        lvlup_car:cc.Node,
        lvl_label:cc.Label,
        lvl_label_2:cc.Label,
        musicbtn:{
            default: null,
            type: cc.Sprite,
        },
        btnSprite: {
            default: [],
            type: cc.SpriteFrame
        },
        jumpAppPrefab: {
            default: [],
            type: cc.Node,
        },
        userlvlsprite:{
            default:[],
            type: cc.SpriteFrame,
        },
        carlvlsprite:{
            default:[],
            type: cc.SpriteFrame,
        },
        power_prefab:{
            default:null,
            type:cc.Prefab,
        },
        btn_guoqing:{
            default:null,
            type:cc.Node,
        },
        prefab_gongzhonghao:{
            default:null,
            type:cc.Prefab,
        },
        display:{
            default:null,
            type:cc.Node,
        },
        rank_start:{
            default:null,
            type:cc.Prefab,
        },
        content:{
            default:null,
            type:cc.Node,
        },
        shareSprite:{
            default:null,
            type:cc.Sprite,
        },
        sharespriteFrame:cc.SpriteFrame,
        gameQuan:cc.Node,
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},
    _updaetSubDomainCanvas () {
        if (!this.tex) {
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
        this.display.getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(this.tex);
    },
    shouquan(){
        let self = this;
        wx.getSetting({
            success: function (res) {
                var authSetting = res.authSetting;
                if (authSetting['scope.userInfo'] === true) {
                    if (Global.UserAuthPostCount == 0) {
                        wx.getUserInfo({
                            success(res){
                                Global.UserAuthPost(res, Global.sessionId,(res)=>{
                                    self.content.removeAllChildren();
                                    //授权显示搭档榜
                                    Global.GetRank((res)=>{
                                        if(res.state==1){
                                            if(res.result.ranks.length >=2){
                                                for(let i=0;i<3;i++){
                                                    let other = cc.instantiate(self.rank_start);
                                                    other.getComponent("rankstart").init(res.result.ranks[i]);
                                                    self.content.addChild(other);
                                                }
                                            }else{
                                                for(let i=0;i<res.result.ranks.length;i++){
                                                    let other = cc.instantiate(self.rank_start);
                                                    other.getComponent("rankstart").init(res.result.ranks[i]);
                                                    self.content.addChild(other);
                                                }
                                            }
                                        }
                                    })
                                });
                            }
                        });
                    }else{
                        self.content.removeAllChildren();
                        //授权显示搭档榜
                        Global.GetRank((res)=>{
                            if(res.state==1){
                                if(res.result.ranks.length >=2){
                                    for(let i=0;i<3;i++){
                                        let other = cc.instantiate(self.rank_start);
                                        other.getComponent("rankstart").init(res.result.ranks[i]);
                                        self.content.addChild(other);
                                    }
                                }else{
                                    for(let i=0;i<res.result.ranks.length;i++){
                                        let other = cc.instantiate(self.rank_start);
                                        other.getComponent("rankstart").init(res.result.ranks[i]);
                                        self.content.addChild(other);
                                    }
                                }
                            }
                        })
                    }
                }else{
                    self.display.active = true;
                    //没有授权显示好友榜 
                    self.display.setContentSize(cc.view.getVisibleSize());
                    //给子域发送消息
                    var openDataContext = wx.getOpenDataContext();
                    openDataContext.postMessage({
                        text:'shouye',
                    });
                    self.tex = new cc.Texture2D();
                }
            }
        });
    },

    start () {
        wx.aldSendEvent('游戏首页_页面访问数');
        this.startTime = Date.now();
        let self = this;
        //判断如果玩家授权过。就调用一下我们自己的授权(因为授权成功之后是不会再出现的)
        
        this.shouquan();
        

        Global.GetServerTime((res)=>{
            if(res.state == 1){
                let gqtime = res.result.substr(0,10);
                var arr_gqtime = gqtime.split("-");
                console.log("当前日期",arr_gqtime);
                //判断是否是10月9号
                if(Global.isgqlogin){
                    if(arr_gqtime[0]==2019&&arr_gqtime[1]==10&&arr_gqtime[2]>=9){
                        //隐藏说明按钮 显示国庆活动按钮
                        if(arr_gqtime[2]<16){
                            this.node.getChildByName("nationaldayBtn").active = true;
                        }
                        //显示获奖页面
                        if(!Global.isdaylogin){
                            this.nationaldayBtn();
                        }
                    }
                }
                if(arr_gqtime[0]==2019&&arr_gqtime[1]==10&&arr_gqtime[2]>8){
                    this.node.getChildByName("nationalday_img").active = false;
                }
                // else{
                //     this.node.getChildByName("nationalday_img").active = true;
                // }
            }
        })

        this.firstclose = 0;
        this.isOK = false;
        // if(this.clip_backmusic){
        //     cc.audioEngine.playMusic(this.clip_backmusic, true);
        //     cc.audioEngine.setMusicVolume(0.6);
        // }
        this.power_string = this.powerbg.getChildByName("number").getComponent(cc.Label);
        this.power_max = this.powerbg.getChildByName("max");
        this.power_time = this.powerbg.getChildByName("time");

        if (CC_WECHATGAME) {
            self.UserPower();
        }

        Global.addListener();
        this.scheduleOnce(function() {
            this.ShowBoxView();
        }, 2);
        
        
        cc.director.preloadScene("game", function () {
            cc.log("预加载开始scene");
        });
    },
    BackMusicBtn(){
        if(Global.isplaymusic == false){
            // cc.audioEngine.resumeMusic();
            this.musicbtn.spriteFrame = this.btnSprite[0];
        }else{
            // cc.audioEngine.pauseMusic();
            this.musicbtn.spriteFrame = this.btnSprite[1];
        }
        Global.isplaymusic = !Global.isplaymusic;
    },
    //玩家数据 赋值等
    UserPower(){
        let self = this;
        Global.GetUserInfo((res)=>{
            if(res.state == 1){
                this.isOK =true;
                Global.power = res.result.power;
                Global.level = res.result.lvl;
                if(Global.level >=2){
                    if(!self.node.getChildByName("rankBtn").active){
                        self.node.getChildByName("rankBtn").active = true;
                    }
                    if(!self.node.getChildByName("Btn_sound_on").active){
                        self.node.getChildByName("Btn_sound_on").active = true;
                    }
                    if(!self.node.getChildByName("JumpBar").active){
                        self.node.getChildByName("JumpBar").active = true;
                    }
                }
                if(Global.level >=10){
                    if(!self.node.getChildByName("taskBtn").active){
                        self.node.getChildByName("taskBtn").active = true;
                        self.onCreateGameLoop();
                    }
                }
                if(Global.level >=16){
                    if(!self.node.getChildByName("btn_showApp").active){
                        self.node.getChildByName("btn_showApp").active = true;
                        self.ChangeJumpAppSelectSprite();
                    }
                }
                if(Global.level >=30){
                    if(!self.node.getChildByName("btn_idiomfortunes").active){
                        self.node.getChildByName("btn_idiomfortunes").active = true;
                    }
                }

                Global.isgqlogin = res.result.isgqlogin;
                Global.ismpday = res.result.ismpday;
                Global.isteam = res.result.isteam;
                Global.isdaylogin = res.result.isdaylogin;
                Global.isshowad = res.result.isshowad;
                Global.isshowshare = res.result.isshowshare;
                Global.tips = res.result.tips;
                Global.ysid = res.result.ysid;
                Global.dayplaycount = res.result.dayplaycount;
                Global.userrank = res.result.userrank;
                
                //首次邀请成功 没点击关闭广告按钮
                if(Global.isshowad && !Global.isshowshare){
                    // //显示广告上面的差
                    // for(let i = 0; i < this.jumpAppPrefab.length; i++){
                    //     this.jumpAppPrefab[i].getChildByName("btn_closegg").active = true;
                    // }
                }else if(Global.isshowad){
                    //首次邀请成功 点击关闭广告按钮
                    self.shareSprite.spriteFrame = self.sharespriteFrame;
                    for(let i = 0; i < this.jumpAppPrefab.length; i++){
                        this.jumpAppPrefab[i].getChildByName("btn_closegg").active = true;
                    }
                }

                
                if(Global.ismpday ==false &&Global.isGongZhonghao){
                    wx.aldSendEvent('再次进入游戏弹窗pv');
                    let powerview = cc.instantiate(self.power_prefab);
                    Global.showGameLoop =false;
                    self.node.addChild(powerview);
                }

                Global.playerlvl = res.result.playerlvl;
                Global.carlvl = res.result.carlvl;
                this.player_name.string = Global.UserLvlData[Global.playerlvl-1].name.trim();

                self.player_img.spriteFrame = this.userlvlsprite[Global.playerlvl-1];
                self.car_img.spriteFrame =  this.carlvlsprite[Global.carlvl-1];
                
                //显示升级按钮
                if(Global.playerlvl&&Global.level>=Global.UserLvlData[Global.playerlvl].gamelvl){
                    self.lvlup_player.active =true;
                }else{
                    self.lvlup_player.active =false;
                }
                if(Global.carlvl&&Global.level>=Global.CarLvlData[Global.carlvl-1].gamelvl){
                    self.lvlup_car.active = true;
                }else{
                    self.lvlup_car.active =false;
                }
                if(Global.playerlvl<Global.carlvl){
                    let num_lvl = Global.UserLvlData[Global.playerlvl].gamelvl - Global.level;
                    if(num_lvl<=0){
                        self.lvl_label_2.string = self.lvl_label.string = "当前可以升级人物";
                    }else{
                        self.lvl_label_2.string = self.lvl_label.string = "还有"+num_lvl+"关后可升级人物";
                    }
                }else{
                    let num_lvl = Global.CarLvlData[Global.carlvl-1].gamelvl - Global.level;
                    if(num_lvl<=0){
                        self.lvl_label_2.string = self.lvl_label.string = "当前可以升级车辆";
                    }else{
                        self.lvl_label_2.string = self.lvl_label.string = "还有"+num_lvl+"关后可升级车辆";
                    }
                }
                self.power_string.string = res.result.power;
                if(res.result.nexttime>0){
                    Global.nexttime = res.result.nexttime;
                    self.power_max.active = false;
                    self.power_time.active = true;
                    this._time = Math.round(res.result.nexttime/1000) -Math.round(Date.now() / 1000)+10;
                    if(this._time>0){
                        var minute  = Math.floor((this._time%3600)/60);
                        var second = this._time %3600%60;
                        minute = minute < 10 ? ('0' + minute) : minute;
                        second = second < 10 ? ('0' + second) : second;
                        self.power_time.getComponent(cc.Label).string = minute+":"+second;
                        this.schedule(this.doCountdownTime,1);
                    }
                }else{
                    self.power_max.active = true;
                    self.power_time.active = false;
                }
            }
        });
    },
    //倒计时
    doCountdownTime(){
        //每秒更新显示信息
        if (this._time > 0 ) {
            this._time -= 1;
            var minute  = Math.floor((this._time%3600)/60);
            var second = this._time %3600%60;
            minute = minute < 10 ? ('0' + minute) : minute;
            second = second < 10 ? ('0' + second) : second;
            this.power_time.getComponent(cc.Label).string = minute+":"+second;
            this.countDownShow(this._time);
        }
    },
    countDownShow(temp){
        if(temp<=0){
            this.unschedule(this.doCountdownTime);
            this.UserPower();
        }
    },
    //分享按钮
    shareBtn(){
        if(Global.isplaymusic){
            cc.audioEngine.play(Global.clip_btnclick, false);
        }
        wx.aldSendEvent('邀请',{'邀请类型' : '邀请得提示'});
        if (CC_WECHATGAME) {
            wx.aldShareAppMessage({
                title: '你忘记了我们当初的海誓山盟了吗？点击一起赢取千元红包大奖',
                imageUrl: Global.shareimg,
                query: "introuid=" + Global.Introuid,
            });
        }

    },
    nationaldayBtn(){
        wx.aldSendEvent('游戏首页_国庆奖励');
        if(Global.isplaymusic){
            cc.audioEngine.play(Global.clip_btnclick, false);
        }
        let gzh = cc.instantiate(this.prefab_gongzhonghao);
        if(gzh){
            Global.showGameLoop =false;
            this.node.addChild(gzh);
        }

    },
    //排行榜
    rankBtn(){
        if(Global.isplaymusic){
            cc.audioEngine.play(Global.clip_btnclick, false);
        }
        wx.aldSendEvent('游戏首页_荣耀榜');
        let ranview = cc.instantiate(this.prefab_rankview);
        if(ranview){
            Global.showGameLoop =false;
            this.node.addChild(ranview);
        }
    },
    //免费体力(试玩任务)
    FreePowerBtn(event, customEventData){
        if(Global.isplaymusic){
            cc.audioEngine.play(Global.clip_btnclick, false);
        }
        if(customEventData == "taskBtn"){
            wx.aldSendEvent('游戏首页_免费体力');
        }else{
            wx.aldSendEvent('游戏首页_体力加');
        }
        let freepowerview = cc.instantiate(this.prefab_taskview);
        if(freepowerview){
            Global.showGameLoop =false;
            this.node.addChild(freepowerview);
        }
    },
    //升级车辆
    CarLevelUpBtn(){
        if (CC_WECHATGAME) {
            if(Global.isplaymusic){
                cc.audioEngine.play(Global.clip_btnclick, false);
            }
            if(Global.carlvl == 1){
                this.lvlup_car.getChildByName("levelupimg").active = false;
                this.CarLevelUp();
            }else{
                if(wx.createRewardedVideoAd){
                    //看视频成功显示页面TODO
                    wx.aldSendEvent('视频广告');
                    wx.aldSendEvent('视频广告_游戏首页_升级车辆');
                    this.lvlup_car.getChildByName("levelupimg").active = true;
                    Global.showAdVedio(this.CarLevelUp.bind(this), this.CarFailed.bind(this));
                }
            }
        }
    },
    CarLevelUp(){
        if(Global.carlvl > 1){
            wx.aldSendEvent('视频广告',{'是否有效' : '是'});
            wx.aldSendEvent('视频广告',{'是否有效' : '游戏首页_升级车辆_是'});
        }
        let carview = cc.instantiate(this.prefab_carview);
        if(carview){
            Global.showGameLoop =false;
            this.node.addChild(carview);
        }
    },
    CarFailed(){
        wx.aldSendEvent('视频广告',{'是否有效' : '否'});
        wx.aldSendEvent('视频广告',{'是否有效' : '游戏首页_升级车辆_否'});
        Global.ShowTip(this.node, "观看完视频才能升级哦");
    },
    //升级人物
    UserLevelUpBtn(){
        if (CC_WECHATGAME) {
            if(Global.isplaymusic){
                cc.audioEngine.play(Global.clip_btnclick, false);
            }
            if(Global.playerlvl ==1){
                this.lvlup_player.getChildByName("levelupimg").active = false;
                this.UserLevelUp();
            }else{
                if(wx.createRewardedVideoAd){
                    //看视频成功显示页面TODO
                    wx.aldSendEvent('视频广告');
                    wx.aldSendEvent('视频广告_游戏首页_升级人物');
                    this.lvlup_player.getChildByName("levelupimg").active = true;
                    Global.showAdVedio(this.UserLevelUp.bind(this), this.UserFailed.bind(this));
                }
            }
        }
    },
    UserLevelUp(){
        if(Global.playerlvl >1){
            wx.aldSendEvent('视频广告',{'是否有效' : '是'});
            wx.aldSendEvent('视频广告',{'是否有效' : '游戏首页_升级人物_是'});
        }
        let user= cc.instantiate(this.prefab_userview);
        if(user){
            Global.showGameLoop =false;
            this.node.addChild(user);
        }
    },
    UserFailed(){
        wx.aldSendEvent('视频广告',{'是否有效' : '否'});
        wx.aldSendEvent('视频广告',{'是否有效' : '游戏首页_升级人物_否'});
        Global.ShowTip(this.node, "观看完视频才能升级哦");
    },
    ShowPeopleUpView(){
        if(Global.isplaymusic){
            cc.audioEngine.play(Global.clip_btnclick, false);
        }
        wx.aldSendEvent('游戏首页_人物');
        let peopleview = cc.instantiate(this.prefab_peopleupview)
        if(peopleview){
            Global.showGameLoop =false;
            this.node.addChild(peopleview);
        }
    },
    //宝箱
    ShowBoxView(){
        Global.GetUserData((res)=>{
            if(res.state == 1){
                Global.boxnum = res.result.ucount;
                if(Global.boxnum >5){
                    let probability = Math.floor(Math.random() * 10);
                    if(probability<=3){
                        let boxview = cc.instantiate(this.prefab_boxview);
                        if(boxview){
                            Global.showGameLoop =false;
                            this.node.addChild(boxview);
                        }
                    }
                }
            }
        })
    },
    ShowIdiomView(){
        if(Global.isplaymusic){
            cc.audioEngine.play(Global.clip_btnclick, false);
        }
        let IdiomFortunes = cc.instantiate(this.prefab_IdiomFortunes)
        if(IdiomFortunes){
            Global.showGameLoop =false;
            this.node.addChild(IdiomFortunes);
        }
    },
    //开始游戏
    PlayerBtn(){
        if(this.isOK){
            if(Global.isplaymusic){
                cc.audioEngine.play(Global.clip_btnclick, false);
            }
            this.isOK = false;
            let self =this;
            wx.aldSendEvent('游戏首页_答题升级');
            Global.showGameLoop = false;
            //如果体力够
            if(Global.power>0){
                //如果体力是满的
                if(Global.power == Global.maxpower){
                    self.power_max.active = false;
                    self.power_time.active = true;
                    self._time = 600;
                    self.schedule(self.doCountdownTime,1);
                }
                Global.power -=1;
                self.power_string.string = Global.power;
                //动画
                cc.tween(this.anim_target)
                .to(1, { position: cc.v2(this.anim_pos.x, this.anim_pos.y)})
                .call(() => {
                    //获取关卡数据
                    Global.GetLvldata(Global.level+1,(res)=>{
                        if(res.state==1){
                            Global.gamedata = res.result;
                            cc.director.loadScene("game.fire");
                            wx.aldSendEvent("游戏首页_页面停留时间",{
                                "耗时" : (Date.now()-this.startTime)/1000
                            });
                        }else{
                            this.isOK = true;
                        }
                    });
                })
                .start()
            }else{
                this.ShowAddPower();
                this.isOK = true;
            }
        }
    },
    ShowAddPower(){
        let addpower = cc.instantiate(this.prefab_addpower)
        if(addpower){
            Global.showGameLoop =false;
            this.node.addChild(addpower);
        }
    },
    ShowNationaldat(){
        if(Global.isplaymusic){
            cc.audioEngine.play(Global.clip_btnclick, false);
        }
        wx.aldSendEvent('游戏首页_点击查看获奖规则');
        let nationaldat = cc.instantiate(this.prefab_nationaldat)
        if(nationaldat){
            this.node.getChildByName("nationalday_img").active = false;
            Global.showGameLoop =false;
            this.node.addChild(nationaldat);
        }
    },
    /**
     * 循环切换广告图片的方法
     */
    ChangeJumpAppSelectSprite() {
        let Arr_jumpApp_Sprite = [];
        for (let i = 0; i < this.jumpAppPrefab.length; i++) {
            this.jumpAppPrefab[i].active = true;
            let sprite = this.jumpAppPrefab[i].getChildByName("sprite");
            let temp = sprite.getComponent(cc.Sprite);
            Arr_jumpApp_Sprite.push(temp);
            this.jumpAppPrefab[i].index = i;
            this.jumpAppPrefab[i].on("touchend",this.TouchEnd,this);
            this.JumpAppFangSuo(this.jumpAppPrefab[i]);
        }
        this.schedule(() => {
            for (let j = 0; j < this.jumpAppPrefab.length; j++) {
                // // 上线前注释console.log(" Arr_jumpApp_Sprite[j].index == ", Arr_jumpApp_Sprite[j].index);
                if (this.jumpAppPrefab[j].index < Global.jumpappObject.length - 1) {
                    this.jumpAppPrefab[j].index++;
                } else {
                    this.jumpAppPrefab[j].index = 0;
                }
                Arr_jumpApp_Sprite[j].spriteFrame = Global.jumpappObject[this.jumpAppPrefab[j].index].sprite;
            }
        }, 3.0, cc.macro.REPEAT_FOREVER, 0.1);
    },

    /**
    * 游戏广告按钮的放缩
    */
    JumpAppFangSuo: function (node) {
        var self = this;
        this.schedule(function () {
            var action = self.GGFangSuoFun();
            node.runAction(action);
        }, 1.0, cc.macro.REPEAT_FOREVER, 0.1);
    },

    /**
     * 按钮放缩方法
     */
    GGFangSuoFun: function () {
        var action = cc.sequence(
            cc.scaleTo(0.5, 1.0, 1.0),
            cc.scaleTo(0.5, 1.2, 1.2),
        );
        return action;
    },

    TouchEnd(event) {
        // 上线前注释console.log("event == ", event.target);
        if(event.target.children[1].active){
            if(this.firstclose == 0){
                let probability = Math.floor(Math.random() * 10);
                if(probability<=5){
                    wx.aldSendEvent('关闭广告_是否成功_否');
                    event.stopPropagation();
                    this.firstclose++;

                    if (CC_WECHATGAME) {
                        wx.navigateToMiniProgram({
                            appId: Global.jumpappObject[event.target.index].apid,
                            path: Global.jumpappObject[event.target.index].path,
                            success: function (res) {
                                // 上线前注释console.log(res);
                            },
                            fail: function (res) {
                                // 上线前注释console.log(res);
                            },
                        });
                    }
                }else{
                    wx.aldSendEvent('关闭广告_是否成功_是');
                    //Global.isshowshare = true;
                    //Global.SetUserInfo();
                    event.target.active = false;
                }
            }else{
                wx.aldSendEvent('关闭广告_是否成功_是');
                //Global.isshowshare = true;
                //Global.SetUserInfo();
                event.target.active = false;
            }
        }else{
            event.stopPropagation();
            // 阿拉丁埋点
            wx.aldSendEvent('导流广告_图片广告');
    
            if (CC_WECHATGAME) {
                wx.navigateToMiniProgram({
                    appId: Global.jumpappObject[event.target.index].apid,
                    path: Global.jumpappObject[event.target.index].path,
                    success: function (res) {
                        // 上线前注释console.log(res);
                    },
                    fail: function (res) {
                        // 上线前注释console.log(res);
                    },
                });
            }
        }
       
    },
    /**
     * 创建游戏圈按钮
     */
    onCreateGameLoop() {

        console.log("游戏圈位置",this.gameQuan.x,this.gameQuan.y);
        this.x = 375+this.gameQuan.x;
        this.y = 279;

        //获取逻辑屏幕宽高
        let windowSize = cc.view.getVisibleSize();
        // 上线前注释console.log("windowSize =获取逻辑屏幕宽高= ", windowSize.width, windowSize.height);

        //得出该位置对应于左上的比例
        var leftRatio = this.x / windowSize.width;
        // var topRatio = 1 - y / windowSize.height;
        var topRatio = this.y / windowSize.height;

        //获得实际手机的屏幕宽高
        let sysInfo = wx.getSystemInfoSync();
        // 上线前注释console.log("sysInfo =获得实际手机的屏幕宽高= ", sysInfo.windowWidth, sysInfo.windowHeight);

        //得出应该放置的对应于left和top的距离
        this.leftPos = sysInfo.windowWidth * leftRatio;
        this.topPos = sysInfo.windowHeight * topRatio;
        // 上线前注释console.log("leftPos == ", this.leftPos, "topPos==", this.topPos);

        this.shijigaodu = this.topPos -(this.gameQuan.height / 4);
        var self = this;
        //创建游戏圈按钮
        if (Global.TheGameLoop == null) {
            Global.TheGameLoop = this.clubButton = wx.createGameClubButton({
                // icon: 'white',
                type:"image",
                image:"https://img.zaohegame.com/staticfile/wxfa819a83fa221978/gameQuan.png",
                style: {
                    left: self.leftPos - (self.gameQuan.width / 4), 
                    top: self.shijigaodu, 
                    width: self.gameQuan.width/2,
                    height: self.gameQuan.height/2,
                }
            });
            //console.log("left == ", this.clubButton.style.left,"top ==",this.clubButton.style.top);
            Global.showGameLoop = true;
            //this.clubButton.show();
        } else {
            Global.showGameLoop = true;
            this.clubButton = Global.TheGameLoop;
            // this.clubButton.style.left = this.leftPos - (this.gameQuan.width / 4);
            // //this.clubButton.style.top = this.topPos + (this.realHeight / 2);
            // this.clubButton.style.top = this.shijigaodu;
            //this.gameQuan.active = false;
            //this.clubButton.show();
        }
    },
    /**
     * 游戏圈隐藏
     */
    onHideGameLoop() {
        this.gameQuan.active = true;
        if(this.clubButton){
            this.clubButton.hide();
        }
    },
    update (dt) {
        if(Global.level>=10){
            if(Global.showGameLoop == true&&this.gameQuan.active ==true){
                this.clubButton.left = this.leftPos - (this.gameQuan.width / 4);
                this.clubButton.top = this.shijigaodu;
                this.clubButton.show();
                this.gameQuan.active = false;
            }else if(Global.showGameLoop ==false&&this.gameQuan.active == false){
                this.onHideGameLoop();
            }
        }
        this._updaetSubDomainCanvas();
    },
});
