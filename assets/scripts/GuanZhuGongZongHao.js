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
        }
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {
        //TODO 判断是否获奖来显示页面
    },
    //关注公众号
    GuangZhuBtn(){
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
        this.bg_gzh.active = true;
        this.bg_hj.active = false;
    },
    CloseBtn(){
        this.node.destroy();
    },
    // update (dt) {},
});
