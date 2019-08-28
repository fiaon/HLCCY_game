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
        arr_word:new Array(),
        lvl_label:cc.Label,
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {
        wx.aldSendEvent('挑战失败_页面访问数');
        this.startTime = Date.now();

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
        cc.director.preloadScene("game", function () {
            cc.log("预加载开始scene");
        });
    },
    AddErrorWord(num){
        this.arr_word.push(num);
        console.log("arrword",this.arr_word);
    },
    AgainChallengeBtn(){
        wx.aldSendEvent('挑战失败_再次挑战');
        wx.aldSendEvent("挑战失败_页面停留时间",{
            "耗时" : (Date.now()-this.startTime)/1000
        });
        cc.director.loadScene("game.fire");
    },
    //继续按钮 看视频成功之后取消当前的错误成语
    ShowAdVideo(){
        if (CC_WECHATGAME) {
            if(wx.createRewardedVideoAd){
                wx.aldSendEvent('视频广告');
                wx.aldSendEvent('视频广告_挑战失败_继续');
                Global.showAdVedio(this.Success.bind(this), this.Failed.bind(this));
            }
        }
    },
    Success(){
        wx.aldSendEvent('视频广告',{'是否有效' : '是'});
        wx.aldSendEvent('视频广告',{'是否有效' : '挑战失败_继续_是'});
        for(let i=0;i<this.arr_word.length;i++){
            cc.game.emit("idiomError",this.arr_word[i]);
        }
        wx.aldSendEvent("挑战失败_页面停留时间",{
            "耗时" : (Date.now()-this.startTime)/1000
        });
        this.node.destroy();
    },
    Failed(){
        wx.aldSendEvent('视频广告',{'是否有效' : '否'});
        wx.aldSendEvent('视频广告',{'是否有效' : '挑战失败_继续_否'});
        Global.ShowTip(this.node, "观看完视频才会清除错误答案");
    },
    // update (dt) {},
});
