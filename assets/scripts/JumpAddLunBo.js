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
        jumplunbo_prefab:cc.Prefab,
        content:cc.Node,
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {
        this.firstclose = 0;
        this.ischage = true;
        this.jumpArr_1 = [0,1,2,3];
        this.jumpArr_2 = [4,5,6,7];
        this.JumpCallBack();

        this.schedule(this.QieHuanJumpApp,5);
        //如果邀请过好友
        if(Global.isshowad){
            this.node.getChildByName("btn_closegg").active = true;
        }else{
            this.node.getChildByName("btn_closegg").active = false;
        }
    },
    //洗牌算法
    shuffle(array) {
        var m = array.length,
          t, i;
        // 如果还剩有元素…
        while (m) {
          // 随机选取一个元素…
          i = Math.floor(Math.random() * m--);
          // 与当前元素进行交换
          t = array[m];
          array[m] = array[i];
          array[i] = t;
        }
        return array;
    },
    JumpCallBack() {
        if (Global.jumpappObject == null){
            return;
        }
        // let jumarr = [];
        // this.jumpArr_1.sort(function(){ return 0.5 - Math.random() });
        // jumarr = this.jumpArr_1;

        let jumarr = [];
        let temp_arr =[];
        for(let i=0;i<Global.jumpappObject.length;i++){
            temp_arr[i] = i;
        }
        jumarr = this.shuffle(temp_arr);

        let randomAnim = Math.floor(Math.random() * 4);
        for (let i = 0; i < 4; i++) {
            let app = cc.instantiate(this.jumplunbo_prefab);
            if (app) {
                let src = app.getComponent(require("JumpAppScript"));
                if (src) {
                    src.index = jumarr[i];
                }
                src.sprite.spriteFrame = Global.jumpappObject[jumarr[i]].sprite;
                if (src.labelGame) {
                    src.labelGame.string = Global.jumpappObject[jumarr[i]].name;
                }
                if(i == randomAnim){
                    app.getChildByName("dot").active = true;
                    this.schedule(function () {
                        app.runAction(cc.sequence(
                            cc.scaleTo(0.5, 0.9, 0.9),
                            cc.scaleTo(0.5, 1.1, 1.1),
                        ));
                    }, 1.0, cc.macro.REPEAT_FOREVER, 0.1);
                }
                this.content.addChild(app);
            }
        }
    },
    CloseBtn(){
        if(this.firstclose == 0){
            let probability = Math.floor(Math.random() * 10);
            let random = Math.floor(Math.random() * Global.jumpappObject.length);
            if(probability<=5){
                wx.aldSendEvent('关闭广告_是否成功_否');
                this.firstclose++;
                if (CC_WECHATGAME) {
                    wx.navigateToMiniProgram({
                        appId: Global.jumpappObject[random].apid,
                        path: Global.jumpappObject[random].path,
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
                this.unschedule(this.QieHuanJumpApp);
                this.node.destroy();
            }
        }else{
            wx.aldSendEvent('关闭广告_是否成功_是');
            this.unschedule(this.QieHuanJumpApp);
            this.node.destroy();
        }
    },
    QieHuanJumpApp(){
        if (Global.jumpappObject == null){
            return;
        }
        this.content.removeAllChildren();
        // let jumarr = [];
        // if(this.ischage){
        //     this.jumpArr_1.sort(function(){ return 0.5 - Math.random() });
        //     jumarr = this.jumpArr_1;
        // }else{
        //     this.jumpArr_2.sort(function(){ return 0.5 - Math.random() });
        //     jumarr = this.jumpArr_2;
        // }
        let jumarr = [];
        let temp_arr =[];
        for(let i=0;i<Global.jumpappObject.length;i++){
            temp_arr[i] = i;
        }
        jumarr = this.shuffle(temp_arr);

        let randomAnim = Math.floor(Math.random() * 4);
        for (let i = 0; i < 4; i++) {
            let app = cc.instantiate(this.jumplunbo_prefab);
            if (app) {
                let src = app.getComponent(require("JumpAppScript"));
                if (src) {
                    src.index = jumarr[i];
                }
                src.sprite.spriteFrame = Global.jumpappObject[jumarr[i]].sprite;
                if (src.labelGame) {
                    src.labelGame.string = Global.jumpappObject[jumarr[i]].name;
                }
                //动画
                if(i == randomAnim){
                    app.getChildByName("dot").active = true;
                    this.schedule(function () {
                        app.runAction(cc.sequence(
                            cc.scaleTo(0.5, 0.9, 0.9),
                            cc.scaleTo(0.5, 1.1, 1.1),
                        ));
                    }, 1.0, cc.macro.REPEAT_FOREVER, 0.1);
                }
                this.content.addChild(app);
            }
        }
        this.ischage = !this.ischage;
    },
    // update (dt) {},
});
