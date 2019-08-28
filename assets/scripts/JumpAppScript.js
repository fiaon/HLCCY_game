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
        sprite: {
            default: null,
            type: cc.Sprite,
        },

        labelGame: {
            default: null,
            type: cc.Label,
        }
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.index = 0;
    },

    start() {
        this.node.on("touchend", this.TouchEnd, this);
    },

    TouchEnd(event) {
        event.stopPropagation();
        wx.aldSendEvent('游戏推广');
        // 上线前注释console.log("this.index == ", this.index);
        var curScene = cc.director.getScene().name;
        if(curScene == "start"){
            if(this.node.parent.name == "content"){
                wx.aldSendEvent('游戏推广_游戏首页_收藏夹');
            }else if(this.node.parent.parent.parent.name == "BoxView"){
                wx.aldSendEvent('游戏推广_惊喜宝箱_滚动列表');
            }else if(this.node.parent.parent.parent.name == "FreePowerView"){
                wx.aldSendEvent('游戏推广_免费体力_滚动列表');
            }else if(this.node.parent.parent.parent.name == "RankView"){
                wx.aldSendEvent('游戏推广_荣耀榜_滚动列表');
            }else if(this.node.parent.parent.parent.name == "PeopleUpView"){
                wx.aldSendEvent('游戏推广_时光足迹_滚动列表');
            }
        }else{
            if(this.node.parent.name == "content"){
                wx.aldSendEvent('游戏推广_答题页_收藏夹');
            }
            else if(this.node.parent.parent.parent.name == "LoserView"){
                wx.aldSendEvent('游戏推广_答题失败_滚动列表');
            }
            else if(this.node.parent.parent.parent.name == "WinView"){
                wx.aldSendEvent('游戏推广_恭喜过关_滚动列表');
            }
            else if(this.node.parent.parent.parent.name == "GuideView"){
                wx.aldSendEvent('游戏推广_如何玩_滚动列表');
            }
            else if(this.node.name == "img_tuijian"){
                wx.aldSendEvent('游戏推广_答题页_推荐游戏');
            }
            else if(this.node.name == "game_guanggao"){
                wx.aldSendEvent('游戏推广_答题页_关卡广告');
            }
            
        }
        
        if (CC_WECHATGAME) {
            this.appId = Global.jumpappObject[this.index].apid;
            let slef = this;
            wx.navigateToMiniProgram({
                appId: slef.appId,
                path: Global.jumpappObject[this.index].path,
                success: function (res) {
                    // 上线前注释
                    //console.log("跳转成功：",slef.appId);
                    //Global.AddUserOper(2,slef.appId);
                },
                fail: function (res) {
                    // 上线前注释console.log(res);
                },
            });
        }
    }

    // update (dt) {},
});
