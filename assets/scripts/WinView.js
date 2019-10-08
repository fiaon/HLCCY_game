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
        tips:{
            default:null,
            type:cc.Prefab,
        },
        label_level:{
            default:null,
            type:cc.Label,
        },
        prefab_addpower:{
            default:null,
            type:cc.Prefab,
        },
        backstart:cc.Node,
        powerbg:cc.Node,
        lvl_label:cc.Label,
        freeview:cc.Prefab,
        idiom_prefab:{
            default:null,
            type:cc.Prefab,
        },
        idiom_content:cc.Node,
        curlvl:cc.Label,
        anim_target:cc.Node,
        anim_pos:cc.Node,
        display:{
            default:null,
            type:cc.Node,
        },
        lvlonce:cc.Node,
        lvlonce_hand:cc.Node,
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},
    start () {
        let self = this;
        wx.aldSendEvent('恭喜过关_页面访问数');
        this.startTime = Date.now();
        if(Global.isplaymusic){
            cc.audioEngine.play(Global.clip_win, false);
        }

        if(Global.gamedata.data.data.lvl ==1){
            wx.aldSendEvent('首次过关pv');
            this.lvlonce.active = true;
            this.lvlonce_hand.active = true;
            this.schedule(function(){
                self.lvlonce_hand.runAction(cc.sequence(
                    cc.moveTo(0.5,self.lvlonce_hand.x-20, self.lvlonce_hand.y),
                    cc.moveTo(0.5,self.lvlonce_hand.x, self.lvlonce_hand.y),
                ));
            }, 1.0, cc.macro.REPEAT_FOREVER, 0.1);
        }
        if(Global.level >=2){
            this.node.getChildByName("JumpBar").active = true;
        }else{
            this.node.getChildByName("JumpBar").active = false;
        }
        if(Global.level >=10){
            this.node.getChildByName("jumpappwidget").active = true;
        }else{
            this.node.getChildByName("jumpappwidget").active = false;
        }
        if(CC_WECHATGAME){
            //数据存在托管数据上
            var arr = new Array();
            let level = Global.level.toString();
            arr.push({ key: "score", value:level});
    
            wx.setUserCloudStorage({
            KVDataList: arr,
            success: function (res) {
                console.log("-------存储成功-----：");
                console.log(res);
            },
            fail: function (res) {
                console.error(res);
            },
            complete(res) {
            }
            });
        }

        this.isclicknext = true;

        this.power_string = this.powerbg.getChildByName("number").getComponent(cc.Label);
        this.power_max = this.powerbg.getChildByName("max");
        this.power_time = this.powerbg.getChildByName("time");

        //显示成语
        this._idiom = Global.gamedata.data.data.conf.idiom;
        if(this._idiom.length>7){
            for(let i=0;i<8;i++){
                let idiom = cc.instantiate(this.idiom_prefab);
                idiom.getChildByName("label").getComponent(cc.Label).string = this._idiom[i];
                this.idiom_content.addChild(idiom);
            }
        }else{
            for(let i=0;i<this._idiom.length;i++){
                let idiom = cc.instantiate(this.idiom_prefab);
                idiom.getChildByName("label").getComponent(cc.Label).string = this._idiom[i];
                this.idiom_content.addChild(idiom);
            }
        }
        //显示关卡
        this.curlvl.string = "第"+(Global.level).toString()+"关";
        
        if(Global.playerlvl&&Global.level>=Global.UserLvlData[Global.playerlvl].gamelvl){
            this.backstart.active =true;
        }
        if(Global.carlvl&&Global.level>=Global.CarLvlData[Global.carlvl-1].gamelvl){
            this.backstart.active = true;
        }
        if(Global.playerlvl<Global.carlvl){
            let num_lvl = Global.UserLvlData[Global.playerlvl].gamelvl - Global.level;
            if(num_lvl<=0){
                this.lvl_label.string = "当前可以升级人物";
            }else{
                this.lvl_label.string = "还有"+num_lvl+"关后可升级人物";
            }
        }else{
            let num_lvl = Global.CarLvlData[Global.carlvl-1].gamelvl - Global.level;
            if(num_lvl<=0){
                this.lvl_label.string = "当前可以升级车辆";
            }else {
                this.lvl_label.string = "还有"+num_lvl+"关后可升级车辆";
            }
        }
        this.UserPower();
        
        this.display.active = true;
        //没有授权显示好友榜 
        this.display.setContentSize(cc.view.getVisibleSize());
        //给子域发送消息
        var openDataContext = wx.getOpenDataContext();
        openDataContext.postMessage({
            text:'win',
        });
        this.tex = new cc.Texture2D();
                
           

        cc.director.preloadScene("start", function () {
            cc.log("预加载开始scene");
        });
        cc.director.preloadScene("game", function () {
            cc.log("预加载开始scene");
        });
        
    },
    UserPower(){
        let self = this;
        //获取玩家信息 给体力赋值
        Global.GetUserInfo((res)=>{
            if(res.state == 1){
                Global.power = res.result.power;

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
        })
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
    backBtn(){
        if(Global.isplaymusic){
            cc.audioEngine.play(Global.clip_btnclick, false);
        }
        wx.aldSendEvent('恭喜过关_返回主页');
        cc.director.loadScene("start.fire");
    },
    
    nextBtn(){
        if(this.isclicknext){
            if(Global.isplaymusic){
                cc.audioEngine.play(Global.clip_btnclick, false);
            }
            this.isclicknext = false;
            let self =this;
            wx.aldSendEvent('恭喜过关_下一关');
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
                            wx.aldSendEvent("答题页_页面停留时间",{
                                "耗时" : (Date.now()-Global.startTime)/1000
                            });
                            wx.aldSendEvent("恭喜过关_页面停留时间",{
                                "耗时" : (Date.now()-this.startTime)/1000
                            });
                        }else{
                            this.isclicknext = true;
                        }
                    });
                })
                .start()
            }else{
                this.ShowAddPower();
                this.isclicknext = true;
            }
        }
    },
    ShowAddPower(){
        let addpower = cc.instantiate(this.prefab_addpower)
        if(addpower){
            this.node.addChild(addpower);
        }
    },
    FreeBtn(){
        if(Global.isplaymusic){
            cc.audioEngine.play(Global.clip_btnclick, false);
        }
        let freepowerview = cc.instantiate(this.freeview);
        if(freepowerview){
            this.node.addChild(freepowerview);
        }
    },
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
    update (dt) {
        this._updaetSubDomainCanvas();
    },
    JumpAppBtn(){
        let rantuijian = Math.floor(Math.random()*Global.jumpappObject.length);
        if (CC_WECHATGAME) {
            wx.navigateToMiniProgram({
                appId: Global.jumpappObject[rantuijian].apid,
                path: Global.jumpappObject[rantuijian].path,
                success: function (res) {
                    // 上线前注释console.log(res);
                },
                fail: function (res) {
                    // 上线前注释console.log(res);
                },
            });
        }
    },
});
