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
        //列表试玩任务已完成
        TaskShiWanYiPrefab: {
            default: null,
            type: cc.Prefab
        },
        //列表试玩任务未完成
        TaskShiWanWeiPrefab: {
            default: null,
            type: cc.Prefab
        },
        content:{
            default:null,
            type:cc.Node,
        }
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {
        wx.aldSendEvent('游戏首页_免费体力页面访问数');
        this.startTime = Date.now();

        let self = this;
        this.ShiWanTaskData = null;
        Global.GetMission((res) => {
            // 上线前注释console.log("res == ", res);
            self.ShiWanTaskData = res.result;     //试玩任务数据
            self.onAddShiWanItemForScrollview();
        });
    },
    /**
     * 添加试玩Item的方法
     */
    onAddShiWanItemForScrollview: function () {
        // 上线前注释console.log("添加试玩item----", this.ShiWanTaskData);
        for (var i = 0; i < this.ShiWanTaskData.length; i++) {
             if (this.ShiWanTaskData[i].isfinish == false) {
                this.taskShiWan = cc.instantiate(this.TaskShiWanWeiPrefab);
                var btn_lingqu = this.taskShiWan.getChildByName("btn_lingqu");       //领取按钮
                var btn_qushiwan = this.taskShiWan.getChildByName("btn_qushiwan");       //去试玩按钮

                if (this.taskShiWan.getChildByName("btn_realBtn")) {
                    this.btn_realBtn = this.taskShiWan.getChildByName("btn_realBtn");
                    this.btn_realBtn.index = i;
                    this.btn_realBtn.idx = this.ShiWanTaskData[i].id;
                    this.btn_realBtn.GameAppID = this.ShiWanTaskData[i].AppId;
                }

                if (this.ShiWanTaskData[i].isfinish == false) {
                    btn_qushiwan.active = true;
                    btn_lingqu.active = false;
                    this.btn_realBtn.on('click', this.onClickDemo, this);
                } else {
                    // if (Global.Time_Cha >= 20 && Global.ShiWanWhetherSuccess == true) {
                        // btn_qushiwan.active = false;
                        // btn_lingqu.active = true;
                        // this.btn_realBtn.off('click', this.onClickDemo, this);
                        // this.btn_realBtn.on('click', this.onClickGetAward, this);
                        
                    //}
                }

             } else {
                this.taskShiWan = cc.instantiate(this.TaskShiWanYiPrefab);
             }

            var img_gameIcon = this.taskShiWan.getChildByName("img_gameIcon");

            var img_gameIcon_sprite = img_gameIcon.getComponent(cc.Sprite);
            // // 上线前注释console.log("Global.jumpappObject == ", Global.jumpappObject);
            var txt_shiwan = this.taskShiWan.getChildByName("txt_shiwan");       //任务需求
            var txt_shiwan_label = txt_shiwan.getComponent(cc.Label);
            
            for (let j = 0; j < Global.jumpappObject.length; j++) {
                if (this.ShiWanTaskData[i].AppId == Global.jumpappObject[j].apid) {
                    img_gameIcon_sprite.spriteFrame = Global.jumpappObject[j].sprite;
                    // img_gameIcon.setScale(76 / 144);    //游戏icon太大需要缩放 
                    txt_shiwan_label.string = Global.jumpappObject[i].name;
                }
            }

            // var txt_jiangli = this.taskShiWan.getChildByName("txt_jiangli");     //任务奖励金币
            // var txt_jiangli_label = txt_jiangli.getComponent(cc.Label);
            // txt_jiangli_label.string = this.ShiWanTaskData[i].GiveValue;

            this.content.addChild(this.taskShiWan);
            
        }
    },
    /**
     * 去试玩按钮方法
     */
    onClickDemo: function (event) {
        Global.ShiwanIndex = event.target.index;
        this.appid = event.target.GameAppID;
        Global.ShiWanAppid = this.appid;
        // // 上线前注释console.log("this.appid ==", this.appid);
        wx.aldSendEvent('游戏推广');
        wx.aldSendEvent('游戏推广_免费体力_试玩列表');

        for (let i = 0; i < Global.jumpappObject.length; i++) {
            if (this.appid == Global.jumpappObject[i].apid) {
                this.path = Global.jumpappObject[i].path;
            }
        }
        // this.path = Global.Arr_appid[event.target.index].path;
        // // 上线前注释console.log("this.path ==", this.path);
        var self = this;
        wx.navigateToMiniProgram({
            appId: self.appid,
            path: self.path,
            // extraData: {
            //   foo: 'bar'
            // },
            /**
             * envVersion的值（develop开发版，trial体验版，release正式版）
             */
            // envVersion: 'develop',
            envVersion: 'release',
            success(res) {
                // 打开成功
                // // 上线前注释console.log("跳转成功", res);
                Global.ShiWanWhetherSuccess = true;
                let that = self;
                self.scheduleOnce(() => {
                // 上线前注释.log("that.appidthat.appidthat.appid==", that.appid, self.appid);
                Global.UpdateUserMission(that.appid,(res)=>{
                    if(res.state == 1){
                        self.onClickGetAward();
                    }
                });      //只有在成功的时候才可以请求用户操作接口
                // Global.AddUserOper(2,that.appid);
                }, 20.0)
            },
            fail(res) {
                // // 上线前注释console.log("跳转失败", res);
                Global.ShiWanWhetherSuccess = false;
            },
            complete(res) {
                
            }
        })
       
    },
    /**
     * 领取奖励
     */
    onClickGetAward: function (event) {

        Global.ShowTip(this.node, "试玩成功");
        var self = this;
        //提示
        Global.AddPower(2,0,(res)=>{
            if(res.state == 1){
                cc.find("Canvas").getComponent("start").UserPower();
            }
            Global.GetMission((res) => {
                self.ShiWanTaskData = res.result;     //试玩任务数据
                //清空列表
                if (self.content.children.length > 0) {
                    self.content.removeAllChildren();
                }
                //添加item
                self.onAddShiWanItemForScrollview();
                Global.ShiwanIndex = -1;
                Global.Time_Cha = 0;
            });
        });
    },
    CloseBtn(){
        wx.aldSendEvent("游戏首页_免费体力页面停留时间",{
            "耗时" : (Date.now()-this.startTime)/1000
        });
        this.node.destroy();
    },
    // update (dt) {},
});
