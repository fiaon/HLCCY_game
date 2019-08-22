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
        prefab_tips:{
            default: null,
            type: cc.Prefab,
        },
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
        clip_backmusic: {
            default: null,
            type: cc.AudioClip,
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
        musicbtn:{
            default: null,
            type: cc.Sprite,
        },
        btnSprite: {
            default: [],
            type: cc.SpriteFrame
        },
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {
        let self = this;
        this.isplaymusic = true;
        cc.audioEngine.playMusic(this.clip_backmusic, true);
        this.power_string = this.powerbg.getChildByName("number").getComponent(cc.Label);
        this.power_max = this.powerbg.getChildByName("max");
        this.power_time = this.powerbg.getChildByName("time");
        Global.prefab_tip = this.prefab_tips;
        if (CC_WECHATGAME) {
            self.UserPower();
        }

        //Global.addListener();
        this.ShowBoxView();
    },
    BackMusicBtn(){
        if(this.isplaymusic == false){
            cc.audioEngine.resumeMusic();
            this.musicbtn.spriteFrame = this.btnSprite[0];
        }else{
            cc.audioEngine.pauseMusic();
            this.musicbtn.spriteFrame = this.btnSprite[1];
        }
        this.isplaymusic = !this.isplaymusic;
    },
    //玩家数据 赋值等
    UserPower(){
        let self = this;
        Global.GetUserInfo((res)=>{
            if(res.state == 1){
                Global.power = res.result.power;
                Global.level = res.result.lvl;
                if(Global.level ==1){
                    Global.level =2;
                }
                Global.playerlvl = res.result.playerlvl;
                Global.carlvl = res.result.carlvl;
                this.player_name.string = Global.UserLvlData[Global.playerlvl-1].name.trim();
                let url_player ="user_"+Global.playerlvl+'.png';
                cc.loader.loadRes(url_player, cc.SpriteFrame, function (err, spriteFrame) {
                    self.player_img.spriteFrame = spriteFrame;
                });
                let url_car ="car_"+Global.carlvl+'.png';
                cc.loader.loadRes(url_car, cc.SpriteFrame, function (err, spriteFrame) {
                    self.car_img.spriteFrame = spriteFrame;
                });
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
                    self.lvl_label.string = "还有"+num_lvl+"关后可升级最新人物";
                }else{
                    let num_lvl = Global.CarLvlData[Global.carlvl-1].gamelvl - Global.level;
                    self.lvl_label.string = "还有"+num_lvl+"关后可升级最新车辆";
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
        Global.ShareApp();
    },
    //排行榜
    rankBtn(){
        let ranview = cc.instantiate(this.prefab_rankview);
        if(ranview){
            this.node.addChild(ranview);
        }
    },
    //免费体力(试玩任务)
    FreePowerBtn(){
        let freepowerview = cc.instantiate(this.prefab_taskview);
        if(freepowerview){
            this.node.addChild(freepowerview);
        }
    },
    //升级车辆
    CarLevelUpBtn(){
        //看视频成功显示页面TODO
        let carview = cc.instantiate(this.prefab_carview);
        if(carview){
            this.node.addChild(carview);
        }
    },
    //升级人物
    UserLevelUpBtn(){
        //看视频成功显示页面TODO
        let user= cc.instantiate(this.prefab_userview);
        if(user){
            this.node.addChild(user);
        }
    },
    ShowPeopleUpView(){
        let peopleview = cc.instantiate(this.prefab_peopleupview)
        if(peopleview){
            this.node.addChild(peopleview);
        }
    },
    //宝箱
    ShowBoxView(){
        let probability = Math.floor(Math.random() * 10);
        if(probability<=8){
            let boxview = cc.instantiate(this.prefab_boxview);
            if(boxview){
                this.node.addChild(boxview);
            }
        }
    },
    //开始游戏
    PlayerBtn(){
        let self =this;
        //如果体力够
        if(Global.power>0){
            //如果体力是满的
            if(Global.power == Global.maxpower){
                self.power_max.active = false;
                self.power_time.active = true;
                self._time = 310;
                self.schedule(self.doCountdownTime,1);
            }
            Global.power -=1;
            self.power_string.string = Global.power;
            //动画
            cc.tween(this.anim_target)
            .to(1, { position: cc.v2(this.anim_pos.x, this.anim_pos.y)})
            .call(() => {
                //获取关卡数据
                Global.GetLvldata(Global.level,(res)=>{
                    if(res.state==1){
                        Global.gamedata = res.result.data;
                        cc.director.loadScene("game.fire");
                    }
                });
            })
            .start()
        }else{
            //Global.ShowTip(this.node,"游戏体力不足，请参与免费体力活动获取");
            this.ShowAddPower();
        }
    },
    ShowAddPower(){
        let addpower = cc.instantiate(this.prefab_addpower)
        if(addpower){
            this.node.addChild(addpower);
        }
    },
    // update (dt) {},
});
