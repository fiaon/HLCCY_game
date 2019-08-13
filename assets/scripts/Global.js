window.Global = {

    power:1,                //体力点数
    maxpower:5,             //最大体力值
    prefab_tip: null,       //提示
    map:null,               //存储所有成语和他每个字的状态

    Time_Last: 0,                    //切后台时间
    Time_After: 0,                   //切回前台时间
    Time_Cha: 0,                     //前后端切换时间差
    ShiwanIndex: -1,                     //试玩任务index
    ShiWanWhetherSuccess: false,         //是否跳转试玩成功
    shareimg: null,
    banner: null,

    jumpappObject: null,

    jumpinfo_callback: null,

    appid: "wx4fb5b2de70ef1649",
    appSecret: "fe18f16ab7a39971e69767dce7897e7e",
    linkUrl: "https://wx.zaohegame.com/",        //域名
    //linkUrl: "http://wx.zaohegame.com:8099/",        //测试域名
    sessionId: null,                                 //sessionid
    app_data:null,                      //第三方进游戏存储数据
    Introuid: 0,                    //用来辨别邀请任务的id

    url_UserLogin: "game/UserLogin",                         //接口地址
    url_UserAuth: "game/UserAuth",                         //接口地址
    url_UserLoginV2: "game/UserLoginV2",
    url_UserAuthV2: "game/UserAuthV2", 
    url_GetLvlData:"HLCY/GetLvldata",                       //获取每关的数据
    url_GetMission: "HLCY/GetUserMission",                  //任务数据
    url_GetUserData: "game/GetUserData",                    //获取数据
    url_SetUserData: "game/SetUserData",                    //存储数据
    url_GetUserLvlData:"HLCY/GetUserLvlData",               //等级信息
    url_GetCarData:"HLCY/GetCarData",                       //车辆信息

    //num:下标 没有字的时候状态是0
    ChangeIdiomStateGui0(num){
        //修改每个字的状态。
        for(let n=0;n<Global.map.length;n++){
            for(let m=0;m<Global.map[n].length;m++){
             if(Global.map[n][m].index == num){
                 Global.map[n][m].isOn = 0;
                 Global.map[n][m].curword = "";
                 Global.map[n][m].answer = 0;
             }
            }
        }
    },
    //添加字的时候状态变成1
    ChangeIdiomStateChange1(num,word){
        //修改每个字的状态。
        for(let n=0;n<Global.map.length;n++){
            for(let m=0;m<Global.map[n].length;m++){
             if(Global.map[n][m].index == num){
                 Global.map[n][m].isOn = 1;
                 Global.map[n][m].curword = word;
             }
            }
        }
    },
    /**
     * 读取用户数据
     */
    GetUserData(){
        let parme = {
            appid: this.appid,
            sessionId: this.sessionId,
        };
        this.Post(this.url_GetUserData, parme, (res) => {

        });
    },
    /**
     * 存储用户数据
     */
    SetUserData() {
        let parme = {
            appid: this.appid,
            sessionId: this.sessionId,
            udata: 0,               
            score:0,
            lvl: 0,
            ucount: 0,
            zcount: 0,
        };
        this.Post(this.url_SetUserData, parme, () => {
            this.GetUserData();
        });
    },
    /**
     * 获取任务列表
     */
    GetMission(callback) {
        let parme = {
            sessionId: this.sessionId,
            appid: this.appid,
        };
        this.Post(this.url_GetMission + "?t=" + (new Date()).getTime(), parme, (res) => {
            if (callback) {
                callback(res);
            }
        });
    },
    addListener: function () {
        var that = this;
        if (CC_WECHATGAME) {
            // 上线前注释console.log("前后台切换--");
            wx.onHide(res => {
                // 上线前注释console.log("小程序切换到了后台", res);
                that.Time_Cha = 0;
                that.Time_Last = new Date().getTime();
                
                if (that.Time_Last != null && that.Time_After != null) {
                    that.Time_Cha = (that.Time_After - that.Time_Last) / 1000;
                    // console.log("that.Time_Cha == ", that.Time_Cha);
                    if (that.Time_Cha >= 20) {
                        that.Time_Last = 0;
                        that.Time_After = 0;
                    } else {

                    }
                }
            });
            // wx.onShow(this.onGameHide.bind(this));
            wx.onShow(res => {
                // 上线前注释console.log("小程序重新回到了前台", res);
                that.Time_After = new Date().getTime();
                // 上线前注释console.log("当前时间 =回到前台= ", (new Date()).getTime(), new Date().getMinutes(), new Date().getSeconds());
                if (res.query.test) {
                    that.test = res.query.test;
                    that.ShareID = res.query.id;
                    
                }
                if (that.Time_Last != null && that.Time_After != null) {
                    that.Time_Cha = (that.Time_After - that.Time_Last) / 1000;
                    // console.log("that.Time_Cha == ", that.Time_Cha);
                    if (that.Time_Cha >= 20) {
                        that.Time_Last = 0;
                        that.Time_After = 0;
                    } else {
                        that.ShiWanWhetherSuccess = false;
                        that.Time_Cha = 0;
                    }
                }
            });
        } else {
            // 上线前注释console.log("前后台切换--==");
        }
    },
    /**
     * 登陆接口
     * @param {*} parme 参数
     */
    UserLogin(parme) {
        let self = this;
        // 上线前注释console.log("parme =登录= ", parme);
        this.Post(this.url_UserLoginV2, parme, (res) => {
            self.sessionId = res.result.sessionid;
        });
    },
     /**
     * 授权接口
     * @param {*} res 参数
     * @param {*} sessionId sessionId
     */
    UserAuthPost(res, sessionId, callback) {
        this.sessionId = sessionId;
        this.rawData = res.rawData;
        this.compareSignature = res.signature;
        this.encryptedData = res.encryptedData;
        this.iv = res.iv;
        let parme ={};
        if(Global.app_data){
            parme = {
                appid: this.appid,
                sessionId: this.sessionId,
                rawData: this.rawData,
                compareSignature: this.compareSignature,
                encryptedData: this.encryptedData,
                iv: this.iv,
                appdata:Global.app_data,
            };
        }else{
            parme = {
                appid: this.appid,
                sessionId: this.sessionId,
                rawData: this.rawData,
                compareSignature: this.compareSignature,
                encryptedData: this.encryptedData,
                iv: this.iv,
                appdata:"",
            };
        }
        this.Post(this.url_UserAuthV2, parme, (res) => {
            if (res.resultcode == 500) {
                this.UserAuthPost(this.res, this.sessionId, callback);
                console.log("需要重新授权");
            } else {
                this.Introuid = res.result.uid;
                console.log("用户人ID == ", this.Introuid);
            }
        });
    },
    Getinfo() {
        var self = this;
        this.Get("https://wx.zaohegame.com/game/shareimg?appid=wxfa819a83fa221978", (obj) => {
            if (obj.state == 1) {
                this.shareimg = obj.result;
                // 上线前注释console.log(self.shareimg)
            }
        });
    },

    GetJumpInfo(callback) {
        this.Get("https://wx.zaohegame.com/game/jumpapp?appid=wxfa819a83fa221978", (obj) => {
            if (obj.state == 1) {
                this.jumpappObject = obj.result;
                var self = this;
                var count = 0;
                for (let i = 0; i < this.jumpappObject.length; i++) {
                    cc.loader.load({ url: this.jumpappObject[i].img, type: "png" }, function (err, res) {
                        self.jumpappObject[i].sprite = null;
                        if (err == null) {
                            let spriteFrame = new cc.SpriteFrame(res);
                            self.jumpappObject[i].sprite = spriteFrame;
                            count++;
                            if (count == self.jumpappObject.length) {
                                if (self.jumpinfo_callback) {
                                    self.jumpinfo_callback();
                                }
                                if (callback) {
                                    callback();
                                }
                            }
                        }
                        else {
                            // 上线前注释console.log(i, err);
                        }
                    });
                }
                
            }
        });
    },
    Get(url, callback) {
        var self = this;
        if (CC_WECHATGAME) {
            wx.request({
                url: url,
                success: function (res) {
                    callback(res.data);
                    // 上线前注释
                    console.log(res.data);
                }
            });
        }
        else {
            var xhr = new XMLHttpRequest();
            xhr.onreadystatechange = function () {
                if (xhr.readyState == 4) {
                    if (xhr.status >= 200 && xhr.status < 400) {
                        var response = xhr.responseText;
                        if (response) {
                            var responseJson = JSON.parse(response);
                            callback(responseJson);
                        } else {
                            // 上线前注释console.log("返回数据不存在")
                            callback(null);
                        }
                    } else {
                        // 上线前注释console.log("请求失败")
                        callback(null);
                    }
                }
            };
            xhr.open("GET", url, true);
            xhr.send();
        }
    },
    ShareApp(callback) {
        if (CC_WECHATGAME) {
            // 上线前注释console.log(this.shareimg);
            wx.shareAppMessage({
                title: '被这游戏分分钟虐的怀疑人生，我就问问：还有谁？',
                imageUrl: this.shareimg,
                success(res) {
                    // 上线前注释console.log("yes");
                },
                fail(res) {
                    // 上线前注释console.log("failed");
                },
                complete(res) {
                    // 上线前注释console.log("complete");
                }
            });
            if (callback) {
                callback();
            }
        }
    },
    /**
     * Post请求接口
     * @param {*} url 链接 
     * @param {*} parme 参数（json形势）
     * @param {*} callback 回调方法
     */
    Post(url, parme, callback) {
        var self = this;
        if (CC_WECHATGAME) {
            wx.request({
                url: self.linkUrl + url,
                method: 'post',
                data: parme,
                header: {
                    'content-type': 'application/json' // 默认值
                },
                success(res) {
                    if (callback) {
                        callback(res.data);
                    }
                    // 上线前注释
                    console.log("请求成功" + url, res.data);
                },
                failed(res) {
                    // 上线前注释
                    console.log("请求失败" + url, res.data);
                },
                complete(res) {
                    // 上线前注释console.log("请求完成" + url, res.data);
                },
            });
        } else {
            var xhr = new XMLHttpRequest();
            xhr.onreadystatechange = function () {
                if (xhr.readyState == 4) {
                    if (xhr.status >= 200 && xhr.status < 400) {
                        var response = xhr.responseText;
                        if (response) {
                            var responseJson = JSON.parse(response);
                            callback(responseJson);
                        } else {
                            // 上线前注释console.log("返回数据不存在")
                            callback(null);
                        }
                    } else {
                        // 上线前注释console.log("请求失败")
                        callback(null);
                    }
                }
            };
            xhr.open("POST", url, true);
            xhr.send();
        }
    },
    showAdVedio(success, failed) {
        if (CC_WECHATGAME) {
            if(wx.createRewardedVideoAd){
                let videoAd = wx.createRewardedVideoAd({
                    adUnitId: 'adunit-3dd2f672a153d93a'
                })
    
                videoAd.load()
                    .then(() => videoAd.show())
                    .catch(err => console.log(err.errMsg));
                videoAd.offClose();
                videoAd.onClose(res => {
    
                    if (res && res.isEnded || res === undefined) {
                        // self.UserInfo.AddGold(addvalue);
                        if (success)
                            success();
                    }
                    else {
                        if (failed)
                            failed();
                    }
                });
                videoAd.onError((err) => {
                    // 上线前注释
                    console.log("失败处理",err);
    
                });
            }
        }
    },

    showBannerTime: 0,
    showBanner: function () {
        if (this.banner == null) {
            if (CC_WECHATGAME) {
                let system = wx.getSystemInfoSync();
                if (system != null) {
                    this.ScreenWidth = system.windowWidth;
                    this.realWidth = this.ScreenWidth;
                    if (this.ScreenWidth - 20 < 300) {

                    } else {
                        this.realWidth = this.ScreenWidth - 20;
                    }
                    this.ScreenHeight = system.windowHeight;
                }

                if (system.system.search("iOS") != -1) {
                    this.ios = 1;
                    // 上线前注释console.log("Ios");
                }
                else {
                    this.ios = -1;
                }
                let bannerAd = wx.createBannerAd({
                    adUnitId: 'adunit-e4a48fdb20684eec',
                    style: {
                        // left: 0,
                        left: (this.ScreenWidth - this.realWidth) / 2,
                        top: this.ScreenHeight - 90,
                        width: this.realWidth,
                    }
                })

                bannerAd.onResize(res => {

                    if (bannerAd.style.realHeight > 120) {
                        // bannerAd.style.top = this.ScreenHeight - 120;
                        bannerAd.style.top = this.ScreenHeight - 120 - this.ScreenHeight * 0.02;
                        // 上线前注释console.log("123", bannerAd.style.top);
                    }
                    else {
                        bannerAd.style.top = this.ScreenHeight - bannerAd.style.realHeight - 5;
                        // 上线前注释console.log("12344", bannerAd.style.top);
                    }
                })
                this.banner = bannerAd;
                bannerAd.show()
                var self = this;
                bannerAd.onError(() => {
                    self.banner.hide();
                });
            }
            return;
        }

        this.showBannerTime++;
        if (this.showBannerTime >= 3) {
            if (CC_WECHATGAME) {
                let system = wx.getSystemInfoSync();
                if (system != null) {
                    this.ScreenWidth = system.windowWidth;
                    this.realWidth = this.ScreenWidth;
                    if (this.ScreenWidth - 20 < 300) {

                    } else {
                        this.realWidth = this.ScreenWidth - 20;
                    }
                    this.ScreenHeight = system.windowHeight;
                }

                this.showBannerTime = 0;
                this.banner.destroy();
                let bannerAd = wx.createBannerAd({
                    adUnitId: 'adunit-e4a48fdb20684eec',
                    style: {
                        // left: 0,
                        left: (this.ScreenWidth - this.realWidth) / 2,
                        top: this.ScreenHeight - 90,
                        width: this.realWidth,
                    }
                })

                bannerAd.onResize(res => {
                    // 上线前注释console.log(res.width, res.height);

                    if (bannerAd.style.realHeight > 120) {
                        // bannerAd.style.top = this.ScreenHeight - 120;
                        bannerAd.style.top = this.ScreenHeight - 120 - this.ScreenHeight * 0.02;
                        // 上线前注释console.log("123123", bannerAd.style.top);
                    } else {
                        bannerAd.style.top = this.ScreenHeight - bannerAd.style.realHeight - 5;
                        // 上线前注释console.log("12341234", bannerAd.style.top);
                    }
                })

                bannerAd.show();
                this.banner = bannerAd;
                var self = this;
                bannerAd.onError(() => {
                    self.banner.hide();
                });

            }
        }
        else {
            this.banner.show();
        }
    },
    /**
     * 添加提示语
     * @param {*} node 
     * @param {*} msg 
     */
    ShowTip(node, msg) {
        let tip = cc.instantiate(this.prefab_tip);
        // 上线前注释console.log("tip == ", tip);
        if (tip) {
            if (node.getChildByName("tips")) {

            } else {
                node.addChild(tip);
                let src = tip.getComponent(require("TipShow"));
                if (src) {
                    src.label.string = msg;
                }
            }
        }
    },
}