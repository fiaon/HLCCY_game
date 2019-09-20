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
        btn_video:{
            default: null,
            type: cc.Node,
        },
        time_label:{
            default:null,
            type:cc.Label,
        },
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
        lvl_label:cc.Label,
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {
        wx.aldSendEvent('恭喜过关_页面访问数');
        this.startTime = Date.now();

        this.isclicknext = true;

        cc.audioEngine.play(Global.clip_win, false);
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
        // if(((Global.level+1)%3)==0){
        //     this.btn_video.active = true;
        //     this._time = 5;
        //     this.time_label.string = "("+this._time +"s)";
        //     this.schedule(this.doCountdownTime,1);
        // }
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
                this.lvl_label.string = "还有"+num_lvl+"关后可升级最新人物";
            }
        }else{
            let num_lvl = Global.CarLvlData[Global.carlvl-1].gamelvl - Global.level;
            if(num_lvl<=0){
                this.lvl_label.string = "当前可以升级车辆";
            }else {
                this.lvl_label.string = "还有"+num_lvl+"关后可升级最新车辆";
            }
        }

        cc.director.preloadScene("start", function () {
            cc.log("预加载开始scene");
        });
        cc.director.preloadScene("game", function () {
            cc.log("预加载开始scene");
        });
    },
    //倒计时
    // doCountdownTime(){
    //     //每秒更新显示信息
    //     if (this._time > 0 ) {
    //         this._time -= 1;
    //         this.time_label.string = "("+this._time +"s)";
    //         this.countDownShow(this._time);
    //     }
    // },
    // countDownShow(temp){
    //     if(temp<=0){
    //         this.unschedule(this.doCountdownTime);
    //         this.btn_video.active = false;
    //     }
    // },
    showVideoBtn(){
        if (CC_WECHATGAME) {
            if(wx.createRewardedVideoAd){
                wx.aldSendEvent('视频广告');
                wx.aldSendEvent('视频广告_恭喜过关_视频领取');
                Global.showAdVedio(this.Success.bind(this), this.Failed.bind(this));
            }
        }
    },
    Success(){
        wx.aldSendEvent('视频广告',{'是否有效' : '是'});
        wx.aldSendEvent('视频广告',{'是否有效' : '恭喜过关_视频领取_是'});
        let self = this;
        Global.AddPower(1,0,(res)=>{
            if(res.state == 1){
                Global.power +=1;
                let tip = cc.instantiate(this.tips)
                if(tip){
                    this.node.addChild(tip);
                }
                this.btn_video.active = false;
            }
        });
    },
    Failed(){
        wx.aldSendEvent('视频广告',{'是否有效' : '否'});
        wx.aldSendEvent('视频广告',{'是否有效' : '恭喜过关_视频领取_否'});
        Global.ShowTip(this.node, "观看完视频才会有奖励哦");
    },
    backBtn(){
        wx.aldSendEvent('恭喜过关_返回主页');
        cc.director.loadScene("start.fire");
    },
    //分享按钮
    shareBtn(){
        wx.aldSendEvent('分享',{'页面' : '恭喜过关_炫耀一下'});
        Global.ShareApp();
    },
    nextBtn(){
        if(this.isclicknext){
            this.isclicknext = false;
            let self =this;
            wx.aldSendEvent('恭喜过关_下一关');
            Global.GetUserInfo((res)=>{
                if(res.state == 1){
                    Global.power = res.result.power;
                    //如果体力够
                    if(Global.power>0){
                        //获取关卡数据
                        Global.GetLvldata(Global.level,(res)=>{
                            if(res.state==1){
                                Global.power -=1;
                                Global.gamedata = res.result;
                                wx.aldSendEvent("答题页_页面停留时间",{
                                    "耗时" : (Date.now()-Global.startTime)/1000
                                });
                                wx.aldSendEvent("恭喜过关_页面停留时间",{
                                    "耗时" : (Date.now()-this.startTime)/1000
                                });
                                cc.director.loadScene("game.fire");
                            }else{
                                this.isclicknext = true;
                            }
                        });
                    }else{
                        this.ShowAddPower();
                        this.isclicknext = true;
                    }
                }
            })
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
