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
    //分享按钮
    shareBtn(){
        Global.ShareApp();
    },
});
