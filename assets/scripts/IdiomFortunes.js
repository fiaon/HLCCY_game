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
        bg_1:cc.Node,
        bg_2:cc.Node,
        progressBar: {
            default: null,
            type: cc.ProgressBar,
        },
        loadtext:cc.Label,
        btn_weijiesuo:cc.Node,
        word_idiom:{
            default:[],
            type:cc.Label,
        },
        explain:cc.Label,
        source:cc.Label,
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {
        wx.aldSendEvent('成语运势pv');
        if(Global.dayplaycount){
            this.progressBar.progress = Global.dayplaycount/10;
            if(Global.dayplaycount>10){
                Global.dayplaycount = 10;
            }
            this.loadtext.string = Global.dayplaycount+ "/10";
        }else{
            this.progressBar.progress = 0;
            this.loadtext.string = "0/10";
        }
        if(Global.ysid != 0){
            this.btn_weijiesuo.active = false;
        }
    },
    CloseBtn(){
        if(Global.level>=10){
            Global.showGameLoop = true;
        }
        if(Global.isplaymusic){
            cc.audioEngine.play(Global.clip_btnclose, false);
        }
        this.node.destroy();
    },
    ClosebgView(){
        if(Global.isplaymusic){
            cc.audioEngine.play(Global.clip_btnclose, false);
        }
        this.bg_2.active = false;
        this.bg_1.active = true;
    },
    Btn_JieSuo(){
        wx.aldSendEvent('成语运势成功解锁次数');
        if(Global.isplaymusic){
            cc.audioEngine.play(Global.clip_btnclick, false);
        }
        let self = this;
        this.bg_1.active = false;
        this.bg_2.active = true;
        cc.loader.loadRes( "fortunes", function( err, res){
            //随机一个数显示console.log(res.json);
            let data = res.json[Global.ysid-1];
            for(let i=0;i< data.idiom.length;i++){
                self.word_idiom[i].string = data.idiom[i];
            }
            self.explain.string = data.explain;
            self.source.string = data.source;
        });  
    },
    // update (dt) {},
});
