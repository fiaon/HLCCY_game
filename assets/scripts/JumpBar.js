// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        content: {
            default: null,
            type: cc.Node,
        },

        jumpappPrefab: {
            default: null,
            type: cc.Prefab
        },

        btn: {
            default: null,
            type: cc.Sprite
        },
        
        btnSprite:{
            default:[],
            type:cc.SpriteFrame,
        },

    },

    // LIFE-CYCLE CALLBACKS:
    onLoad() {
        this.zhezhao = this.node.parent.getChildByName("zhezhao");
        // 上线前注释console.log("zhezhao == ", this.zhezhao);
    },

    start() {
        // this.outpos = cc.v2(185, 0);
        // this.hidepos = cc.v2(-353, 0);
        this.hidepos = this.node.position;
        this.outpos = cc.v2(this.node.x+this.node.width, this.node.y);
        this.hide = true;
        this.ischage = false;

        this.jumpArr_1 = [0,1,2,3,4];
        this.jumpArr_2 = [5,6,7,8,9];
        // 上线前注释console.log("start1");
        // if (Global.jumpinfo_callback == null) {
        //     // 上线前注释console.log("set callback");
        //     // 上线前注释console.log("11111111111-----");
        //     Global.jumpinfo_callback = this.JumpCallBack.bind(this);
        // }
        // else {
            this.JumpCallBack();
        // }
        this.btn_sprite = this.btn.getComponent(cc.Sprite);
        // this.btn.getComponent(cc.Animation).play('btnclip');
        // this.zhezhao.zIndex = cc.macro.MAX_ZINDEX-1;
        // this.node.zIndex = cc.macro.MAX_ZINDEX;
        
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
        let jumarr = [];
        let temp_arr =[];
        for(let i=0;i<Global.jumpappObject.length;i++){
            temp_arr[i] = i;
        }
        jumarr = this.shuffle(temp_arr);
        // console.log("随机数组",jumarr);

        for (let i = 0; i < 5; i++) {
            let app = cc.instantiate(this.jumpappPrefab);
            if (app) {
                let src = app.getComponent(require("JumpAppScript"));
                if (src) {
                    src.index = jumarr[i];
                }
                src.sprite.spriteFrame = Global.jumpappObject[jumarr[i]].sprite;
                if (src.labelGame) {
                    src.labelGame.string = Global.jumpappObject[jumarr[i]].name;
                }
                this.content.addChild(app);
            }
        }
    },

    onButtonClick(event) {
        // // 上线前注释console.log("event== ", event.target);

        if (this.hide == false) {
            this.node.runAction(cc.moveTo(0.5, this.hidepos).easing(cc.easeBackIn()));
            this.btn_sprite.spriteFrame = this.btnSprite[0];
            // 上线前注释console.log("this.node.parent == ", this.node.parent);
            this.zhezhao.active = false;
            if(Global.level>=10){
                Global.showGameLoop = true;
            }
            if(Global.isplaymusic){
                cc.audioEngine.play(Global.clip_btnclose, false);
            }
            this.unschedule(this.QieHuanJumpApp);
        }
        else {
            if(Global.isplaymusic){
                cc.audioEngine.play(Global.clip_btnclick, false);
            }
            this.node.runAction(cc.moveTo(0.5, this.outpos).easing(cc.easeBackOut()));
            this.btn_sprite.spriteFrame = this.btnSprite[1];
            this.zhezhao.active = true;
            Global.showGameLoop =false;
            this.schedule(this.QieHuanJumpApp,5);
        }
        this.hide = !this.hide;
        // if (Global.jumpinfo_callback == null) {
        //     // 上线前注释console.log("set callback");
        //     // 上线前注释console.log("11111111111-----");
        //     Global.jumpinfo_callback = this.JumpCallBack.bind(this);
        // }
        // else {
        //    this.JumpCallBack();
        // }
        // //页面停留开始时间
        // this.startTime = Date.now();

        // this.zhezhao.active = true;
        // this.bg.active =true;
        // this.btn.node.parent.active = false;
    },
    btnclose(){
        this.zhezhao.active = false;
        this.bg.active =false;
        this.btn.node.parent.active = true;
        wx.aldSendEvent("游戏首页_收藏夹页面停留时间",{
            "耗时" : (Date.now()-this.startTime)/1000
        });
    },
    QieHuanJumpApp(){
        if (Global.jumpappObject == null)
        return;
        this.content.removeAllChildren();
        // let jumarr = [];
        // if(this.ischage){
        //     this.jumpArr_1.sort(function(){ return 0.5 - Math.random() });
        //     jumarr = this.jumpArr_1;
        // }else{
        //     this.jumpArr_2.sort(function(){ return 0.5 - Math.random() });
        //     jumarr = this.jumpArr_2;
        // }
        
        // jumarr.sort(function(){ return 0.5 - Math.random() });
        let jumarr = [];
        let temp_arr =[];
        for(let i=0;i<Global.jumpappObject.length;i++){
            temp_arr[i] = i;
        }
        jumarr = this.shuffle(temp_arr);

        for (let i = 0; i < 5; i++) {
            let app = cc.instantiate(this.jumpappPrefab);
            if (app) {
                let src = app.getComponent(require("JumpAppScript"));
                if (src) {
                    src.index = jumarr[i];
                }
                src.sprite.spriteFrame = Global.jumpappObject[jumarr[i]].sprite;
                if (src.labelGame) {
                    src.labelGame.string = Global.jumpappObject[jumarr[i]].name;
                }
                this.content.addChild(app);
            }
        }
        // this.ischage = !this.ischage;
    },
    // update (dt) {},
});
