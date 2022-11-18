const router = [
    {
        name: "Tab", //跳转路径
        title: "Tab", //头部展示标题
        component: require("./TabNavigator").default
    },
    //只需要引入非Tabbar页面 
    {
        name: "Welcome",
        title: "欢迎",
        component: require("../pages/WelcomeScreen").default
    }, , {
        name: "ChooseWalletNet",
        title: "选择网络",
        component: require("../pages/ChooseWalletNetScreen").default
    },
    {
        name: "CreatWallet",
        title: "创建钱包",
        component: require("../pages/CreatWalletScreen").default
    },
    {
        name: "ImportWallet",
        title: "导入钱包",
        component: require("../pages/ImportWalletScreen").default
    },
    {
        name: "RemarkWordAid",
        title: "备份助词器",
        component: require("../pages/RemarkWordAidScreen").default
    },
    {
        name: "VerifyWordAid",
        title: "验证助词器",
        component: require("../pages/VerifyWordAidScreen").default
    }, {
        name: "Splash",
        title: "启动页",
        component: require("../pages/SplashScreen").default
    }, {
        name: "AssetsMannager",
        title: "资产管理",
        component: require("../pages/AssetsMannagerScreen").default
    }, {
        name: "AddChain",
        title: "新增代币",
        component: require("../pages/AddChainScreen").default
    }, {
        name: "TransferList",
        title: "交易列表",
        component: require("../pages/TransferListScreen").default
    }, {
        name: "TransferDetail",
        title: "交易详情",
        component: require("../pages/TransferDetailScreen").default
    }, {
        name: "Transfer",
        title: "转账",
        component: require("../pages/TransferScreen").default
    }, {
        name: "TransferSuccess",
        title: "转账成功详情",
        component: require("../pages/TransferSuccessScreen").default
    }, {
        name: "QRcodePay",
        title: "收款",
        component: require("../pages/QRcodePayScreen").default
    }, {
        name: "ChoosePayChain",
        title: "选择币种",
        component: require("../pages/ChoosePayChainScreen").default
    }, {
        name: "AddressList",
        title: "地址列表",
        component: require("../pages/AddressListScreen").default
    }, {
        name: "AddAddress",
        title: "添加地址",
        component: require("../pages/AddAddressScreen").default
    }, {
        name: "EditAddress",
        title: "编辑地址",
        component: require("../pages/EditAddressScreen").default
    }, {
        name: "SaoYiSao",
        title: "扫一扫",
        component: require("../pages/SaoYiSaoScreen").default
    }, {
        name: "WalletDetail",
        title: "钱包详情",
        component: require("../pages/WalletDetailScreen").default
    }, {
        name: "ReplacePassword",
        title: "重置密码",
        component: require("../pages/ReplacePasswordScreen").default
    }, {
        name: "AboutUs",
        title: "关于我们",
        component: require("../pages/AboutUsScreen").default
    }, {
        name: "WalletList",
        title: "资产总览",
        component: require("../pages/WalletListScreen").default
    }, {
        name: "inviteScreen",
        title: "邀请好友",
        component: require("../pages/inviteScreen").default
    }, {
        name: "selectNode",
        title: "选择节点",
        component: require("../pages/SelectNodeScreen").default
    }
]
export default router