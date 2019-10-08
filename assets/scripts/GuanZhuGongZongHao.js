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
        bg_gzh:{
            default:null,
            type:cc.Node,
        },
        bg_hj:{
            default:null,
            type:cc.Node,
        },
        rank:cc.Label,
        avatarImg_1Sprite:cc.Sprite,
        avatarImg_2Sprite:cc.Sprite,
        duiyou:cc.Node,
        me_node:cc.Node,
        nickLabel:cc.Label,
        nickLabel_2:cc.Label,
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {
        //TODO 判断是否获奖来显示页面
        if(Global.userrank.rank<=100){
            wx.aldSendEvent('获奖提示1页面pv');
            this.bg_hj.active = true;
            this.bg_gzh.active = false;
            //TODO 给获奖页面赋值
            this.rank.string = Global.userrank.rank;
            if(Global.userrank.users.length == 2){
                let avatarUrl = Global.userrank.users[0].headurl;
                this.createImage(avatarUrl);
                
                let headurl = Global.userrank.users[1].headurl;
                if(headurl){
                    this.createImage2(headurl);
                }
                Global.userrank.users[0].nick = Global.userrank.users[0].nick.substr(0,1);
                if(Global.userrank.users[1].nick){
                    Global.userrank.users[1].nick = Global.userrank.users[1].nick.substr(0,1);
                }else{
                    Global.userrank.users[1].nick = "游";
                }
                this.nickLabel_2.string = this.nickLabel.string = Global.userrank.users[0].nick+Global.userrank.users[1].nick+"战队";
            }else{
                this.duiyou.active = false;
                this.me_node.x=0;
                let avatarUrl = Global.userrank.users[0].headurl;
                this.createImage(avatarUrl);
                if(Global.userrank.users[0].nick.length>6){
                    Global.userrank.users[0].nick = Global.userrank.users[0].nick.substr(0,6);
                }
                this.nickLabel_2.string =  this.nickLabel.string = Global.userrank.users[0].nick;
            }
        }else{
            this.bg_hj.active = false;
            this.bg_gzh.active = true;
            wx.aldSendEvent('获奖提示2页面pv');
        }
    },
    //关注公众号
    GuangZhuBtn(){
        if(Global.isplaymusic){
            cc.audioEngine.play(Global.clip_btnclick, false);
        }
        wx.aldSendEvent('点击关注公众号');
        //点击关注公众号
        var realurl = 'https://img.zaohegame.com/staticfile/wx039e71b55cba9869/hlcy_share.png';
        var urls = [];
        urls.push(realurl);
        wx.previewImage({
            current: realurl,
            urls: urls,
            success: function (res) {
                console.log('预览的图片 成功', res);
            },
            fail: function (res) {
              console.log('预览的图片 失败');
            },
        });
    },
    //拷贝客服信息
    CopyBtn(){
        if(Global.isplaymusic){
            cc.audioEngine.play(Global.clip_btnclick, false);
        }
        wx.aldSendEvent('复制微信客服号');
        wx.setClipboardData({
                data: "zuishuaiyouxikefu", //公众号id
                success: function(res) {
                    wx.getClipboardData({
                        success: function(res) {
                            console.log("复制成功：", res.data);
                        }
                    });
                }
            });
    },
    //保存图片
    onSavePhotoBtnClick: function () {
        if(Global.isplaymusic){
            cc.audioEngine.play(Global.clip_btnclick, false);
        }
        wx.aldSendEvent('保存图片分享朋友圈');
        //CC_WECHATGAME
        if (cc.sys.browserType == cc.sys.BROWSER_TYPE_WECHAT_GAME) {
            this.photo = null;
            let self = this;
            let windowSize = cc.view.getVisibleSize();
            let rate = windowSize.height/canvas.height;

            let width = this.bg_hj.width/rate;
            let height = this.bg_hj.height/rate;
            let x = (canvas.width/2 -self.bg_hj.width/rate/2);
            let y = (canvas.height/2-(self.bg_hj.height/rate/2+self.bg_hj.y));

            console.log("分辨率== ",windowSize,canvas.width,canvas.height);
            let tempFilePath = canvas.toTempFilePathSync({
                x: x,
                y: y,
                width: width,
                height: height,
                destWidth: width,
                destHeight: height,
            })

            // cc.loader.loadRes("1", function (err, data) {
            //     if (err) {
            //         return;
            //     }
            //     self.photo = data.url;
            //     console.log("self.photo == ", self.photo);
            //     wx.hideLoading({});
            //     self.saveImage(self.photo);
            // });
            self.photo = tempFilePath;
            console.log("self.photo == ", self.photo);
            wx.hideLoading({});
            self.saveImage(self.photo);
        }
    },
    saveImage: function (t) {
        // 上线前注释console.log("t == ", t);
        this.mSaveImage = t;
        // 上线前注释console.log("this.mSaveImage == ", this.mSaveImage);
        var _self = this;
        wx.getSetting({
            success: function (t) {
                if (null == t.authSetting["scope.writePhotosAlbum"])
                    _self.dealAlbum();
                else if (1 == t.authSetting["scope.writePhotosAlbum"])
                    _self.saveToAlbum();
                else
                    _self.openAlbumSeting();
            },

            fail: function (t) {
                _self.dealAlbum();
            }

        });
    },
    dealAlbum: function () {
        var _self = this;
        wx.authorize({
            scope: "scope.writePhotosAlbum",
            success: function (e) {
                _self.saveToAlbum();
            },
            fail: function (e) {
                _self.openAlbumSeting();
            }
        });
    },
    saveToAlbum: function () {
        wx.saveImageToPhotosAlbum({
            filePath: this.mSaveImage,
            success: function (t) {
                wx.showToast({
                    title: "保存成功",
                    icon: "success",
                    image: "",
                    duration: 2e3
                });
            }
        });
    },
    openAlbumSeting: function () {
        var _self = this;
        wx.showModal({
            title: "提示",
            content: "游戏需要您授权保存图片到相册",
            showCancel: false,
            cancelText: "取消",
            confirmText: "确认",
            success: function (e) {
                wx.openSetting({
                    success: function (e) {
                        0 == e.authSetting["scope.writePhotosAlbum"] || _self.saveToAlbum();
                    }
                });
            }
        });
    },
    //关闭获奖页面
    CloseHuoJieView(){
        if(Global.isplaymusic){
            cc.audioEngine.play(Global.clip_btnclose, false);
        }
        this.bg_gzh.active = true;
        this.bg_hj.active = false;
        wx.aldSendEvent('获奖提示1页面pv');
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
    createImage(avatarUrl) {
        let self = this;
        cc.loader.load({url:avatarUrl +"?aaa=aa.jpg", type: 'jpg'},function(err, texture){
            if(texture){ 
                self.avatarImg_1Sprite.spriteFrame = new cc.SpriteFrame(texture);
            }
        });
    },
    createImage2(avatarUrl) {
        let self = this;
        cc.loader.load({url:avatarUrl +"?aaa=aa.jpg", type: 'jpg'},function(err, texture){
            if(texture){ 
                self.avatarImg_2Sprite.spriteFrame = new cc.SpriteFrame(texture);
            }
        });
    },
    // update (dt) {},
});
