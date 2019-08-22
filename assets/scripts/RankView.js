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
        }
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {
        this.canvasAdopt();
        this.display.node.setContentSize(cc.view.getVisibleSize());
        if(CC_WECHATGAME){
            //给子域发送消息
            var openDataContext = wx.getOpenDataContext();
            openDataContext.postMessage({
                text:'showRank',
            });

            this.tex = new cc.Texture2D();
            // this.isBag = true;
            // var sharedCanvas = openDataContext.canvas;

            // this.tex.initWithElement(sharedCanvas);
            // this.tex.handleLoadedTexture();
            // this.display.spriteFrame = new cc.SpriteFrame(this.tex);
            // this.display.getComponent(cc.WXSubContextView).enabled = false;
            // this.display.getComponent(cc.WXSubContextView).update();
        }
    },
    CloseBtn(){
        this.node.destroy();
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
        this.display.spriteFrame = new cc.SpriteFrame(this.tex);
    },
    update (dt) {
        this._updaetSubDomainCanvas();
    },
    canvasAdopt() {
        // 适配解决方案
        let canvas = cc.find('Canvas').getComponent(cc.Canvas);
        // 设计分辨率比
        let rateR = canvas.designResolution.height/canvas.designResolution.width;
        // 显示分辨率比
        let rateV = cc.view.getVisibleSize().height / cc.view.getVisibleSize().width;
        console.log("winSize: rateR: " + rateR + " rateV: " + rateV);
        if (rateV > rateR) {
        canvas.fitHeight = false;
        canvas.fitWidth = true;
        console.log("winSize: fitWidth");
        } else {
        canvas.fitHeight = true;
        canvas.fitWidth = false;
        console.log("winSize: fitHeight");
        }
    }
});
