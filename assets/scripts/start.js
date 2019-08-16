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
        anim_target:cc.Node,
        anim_pos:cc.Node,
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {
        Global.prefab_tip = this.prefab_tips;
        if (CC_WECHATGAME) {
            Global.GetJumpInfo();
            Global.GetMission();
            var self = this;
            wx.login({
                success(res) {
                    // 上线前注释console.log("登录成功 == ", res);
                    self.code = res.code;
                    let parme = {};
                    if(Global.app_data){
                        console.log("app_data存在")
                        parme = {
                            appid: Global.appid,
                            code: self.code,
                            introuid: Global.Introuid,
                            appdata:Global.app_data,
                        };
                    }else{
                        console.log("app_data不存在")
                        parme = {
                            appid: Global.appid,
                            code: self.code,
                            introuid: Global.Introuid,
                            appdata:"",
                        };
                    }
                    // Global.Post(url, parme);
                    console.log("登陆参数",parme);
                    Global.UserLogin(parme);
                }
            });

            Global.GetUserLvlData();
        }

        //Global.addListener();
        this.ShowBoxView();

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
        //如果体力够
        if(Global.power>0){
            //动画
            cc.tween(this.anim_target)
            .to(1, { position: cc.v2(this.anim_pos.x, this.anim_pos.y)})
            .call(() => { 
                Global.power -=1;
                cc.director.loadScene("game.fire"); })
            .start()
        }else{
            Global.ShowTip(this.node,"游戏体力不足，请参与免费体力活动获取");
        }
    }
    // update (dt) {},
});
