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
        word:cc.Label,
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {
        this.node.on("touchstart", this.onTouchStart, this);
        this.node.on("touchend", this.onTouched, this);
        this.node.on('touchcancel', this.onEventCancel, this);
        this.isclick = true;
    },

    init(id,word, posx, posy){
        this.selectID = id;
        this.selectword = word;
        this.node.name = id.toString();
        this.word.string = word;
        // 无效
        this.word_index = posx * 10 + posy;
    },
    onTouchStart(){
        if(this.isclick){
            var action = cc.scaleTo(0.2, 1.5, 1.5);
            this.node.runAction(action);
        }
    },
    onTouched(){
        if(this.isclick){
            let self = this;
            var action = cc.sequence(cc.scaleTo(0.3, 0, 0),cc.callFunc(function(){
                self.node.opacity  = 0;
                cc.audioEngine.play(Global.clip_click, false);
                self.isclick = false;
            }));
            this.node.runAction(action);
            cc.game.emit("clickWord",this.selectID,this.selectword);
        }
    },
    ChangeState(){
        let self = this;
        this.node.opacity =255;
        var action = cc.sequence(cc.scaleTo(0.2, 1, 1),cc.callFunc(function(){
            self.isclick = true;
        }));
        this.node.runAction(action);
    },
    onEventCancel(){
        if(this.isclick){
            let self = this;
            var action = cc.sequence(cc.scaleTo(0.3, 0, 0),cc.callFunc(function(){
                self.node.opacity  = 0;
                cc.audioEngine.play(Global.clip_click, false);
                self.isclick = false;
            }));
            this.node.runAction(action);
            cc.game.emit("clickWord",this.selectID,this.selectword);
        }
    },
    // update (dt) {},
});
