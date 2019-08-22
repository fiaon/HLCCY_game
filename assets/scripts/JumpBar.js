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

        btnSprite: {
            default: [],
            type: cc.SpriteFrame
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
        // // 上线前注释console.log("start1");
        // if (Global.jumpinfo_callback == null) {
        //     // 上线前注释console.log("set callback");
        //     // 上线前注释console.log("11111111111-----");
        //     Global.jumpinfo_callback = this.JumpCallBack.bind(this);
        // }
        // else {
            this.JumpCallBack();
        // }
        //this.btn_sprite = this.btn.getComponent(cc.Sprite);
        this.btn.getComponent(cc.Animation).play('btnclip');
        //this.giftAnim();
        this.zhezhao.zIndex = cc.macro.MAX_ZINDEX-1;
        this.node.zIndex = cc.macro.MAX_ZINDEX;
    },

    JumpCallBack() {
        if (Global.jumpappObject == null)
            return;
        for (let i = 0; i < Global.jumpappObject.length; i++) {
            let app = cc.instantiate(this.jumpappPrefab);
            if (app) {
                this.content.addChild(app);
                let src = app.getComponent(require("JumpAppScript"));
                if (src) {
                    src.index = i;
                }
                src.sprite.spriteFrame = Global.jumpappObject[i].sprite;
                if (src.labelGame) {
                    src.labelGame.string = Global.jumpappObject[i].name;
                }
            }
        }
    },

    onButtonClick(event) {
        // 上线前注释console.log("event== ", event.target);

        if (this.hide == false) {
            this.node.runAction(cc.moveTo(0.5, this.hidepos).easing(cc.easeBackIn()));
            //this.btn_sprite.spriteFrame = this.btnSprite[0];
            this.btn.node.scaleX = 1;
            this.btn.node.x = 0;
            // 上线前注释console.log("this.node.parent == ", this.node.parent);
            this.zhezhao.active = false;
        }
        else {
            this.node.runAction(cc.moveTo(0.5, this.outpos).easing(cc.easeBackOut()));
            //this.btn_sprite.spriteFrame = this.btnSprite[1];
            this.btn.node.scaleX = -1;
            this.btn.node.x = 19.5;
            this.zhezhao.active = true;
        }
        this.hide = !this.hide;
    },
    //动画
    giftAnim() {
        var self = this;
        this.gift = this.btn.node;
        
        self.giftAnim = cc.repeatForever(
            cc.sequence(
                cc.skewTo(0.5,-20,20),
                cc.skewTo(0.5,20,-20)
            )
        )
        this.gift.runAction(self.giftAnim);
    },
    stopGiftAnim() {
        this.gift.stopAction(self.giftAnim);
        this.gift.rotation =0;
    },
    // update (dt) {},
});
