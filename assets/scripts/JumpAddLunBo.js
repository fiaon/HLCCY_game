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
        jumplunbo_content:cc.Node,
        jumplunbo_content_2:cc.Node,
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {
        this.gundong = false;
        this.speed = 100;
        //cc.director.getScene().name == "start"&&
        if(Global.jumpappObject == null){
            this.scheduleOnce(function(){
                this.JumpCallBack();
            },2);
        }else{
            this.JumpCallBack();
        }
        
        // this.schedule(function(){
        //     if(this.jumplunbo_content.children.length > 0){
        //         this.jumplunbo_content.children[0].setSiblingIndex(this.jumplunbo_content.children.length-1);
        //     }
        // },2);
    },
    //生成广告
    JumpCallBack() {
        if (Global.jumpappObject == null)
            return;
        let num_1 = Math.ceil(Global.jumpappObject.length/2);
        let num_2 = Global.jumpappObject.length-num_1;
        this.jumplunbo_content.width = num_1*110 + num_1*20;
        this.jumplunbo_content_2.width = num_2 *110 + num_2*20;
        if(this.jumplunbo_content.width>750){

            this.outpos = this.jumplunbo_content.x = (this.jumplunbo_content.width-750)/2;
            this.hidpos = this.jumplunbo_content_2.x = this.jumplunbo_content.x+this.jumplunbo_content.width;
        }else{
            this.outpos = this.jumplunbo_content.x = (750-this.jumplunbo_content.width)/2;
            this.hidpos = this.jumplunbo_content_2.x = this.jumplunbo_content.x+this.jumplunbo_content.width;
        }
        for (let i = 0; i < num_1; i++) {
            let app = cc.instantiate(this.jumplunbo_prefab);
            if (app) {
                this.jumplunbo_content.addChild(app);
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
        for (let i = num_1; i < Global.jumpappObject.length; i++) {
            let app = cc.instantiate(this.jumplunbo_prefab);
            if (app) {
                this.jumplunbo_content_2.addChild(app);
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
        this.gundong = true;
    },
    //跑马灯动画
    update (dt) {
        if(this.gundong){
            this.jumplunbo_content.x -= this.speed*dt;
            this.jumplunbo_content_2.x -= this.speed*dt;
            if(this.jumplunbo_content.x <=(-(this.jumplunbo_content.width-this.outpos))){
                this.jumplunbo_content.x = this.hidpos;
            }else if(this.jumplunbo_content_2.x <=(-(this.jumplunbo_content.width-this.outpos))){
                this.jumplunbo_content_2.x  = this.hidpos;
            }
        }
    },
});
