// ==UserScript==
// @name               财新文章页优化
// @namespace          caixin
// @version            0.0.1
// @description        清洁页面
// @description:en     Clean Page
// @author             Allamss
// @match              *://*.caixin.com/*/*.html*
// @homepageURL        https://github.com/Allamss/clean-view
// @supportURL         https://github.com/Allamss/clean-view
// @run-at             document-start
// @license            MIT License
// ==/UserScript==

const removeIds = new Set();
const removeClasses = new Set([
    "pc-aivoice",
    "pc-aivoice listner",
    "sitenav",
    "vioce-box-cons",
    "icon_key",
    "subhead",
    "pip",
    "function01",
    "morelink",
    "greenBg",
    "redBg",
    "cx-wx-hb-tips",
    "conri",
    "f_ri",
    "fenghui_code",
    "comment",
    "hot_word_v2",
    "bottom_tong_ad",
    "copyright",
    "navBottom",
    "multimedia",
    "share_tool",
    "head",
    "head",
    "logo",
    "leftAd",
    "leftAd",
    "multimedia",
    "article_topic",
    "end_ico",
    "idetor",
    "lanmu_textend"
]);

function hasIntersection(setA, setB) {
    for (const item of setB) {
        if (setA.has(item)) {
            return true;
        }
    }
    return false;
}

// 定义清理逻辑函数
function preventLoading(element) {
    if (removeIds.has(element.id) || hasIntersection(removeClasses, element.classList)) {
        element.remove(); // 或者使用其他方式禁用/隐藏元素，而不是直接移除
    }
}

// 初始化观察者，在DOM构建过程中监控变化并清理
const observer = new MutationObserver((mutationsList) => {
    mutationsList.forEach((mutation) => {
        if (mutation.type === 'childList') { // 只关注子节点的添加或移除
            mutation.addedNodes.forEach((node) => {
                if (node.nodeType === Node.ELEMENT_NODE) { // 确保处理的是元素节点
                    preventLoading(node); // 应用清理逻辑
                }
            });
        }
    });
});

const removeClass = className => {
    for (let a of document.getElementsByClassName(className)) {
        a.remove();
    }
}

const removeId = id => {
    if (document.getElementById(id)) document.getElementById(id).remove();
}

const clean = () => {
    console.log('优化器开始清洁')

    if (document.getElementsByClassName("comMain").length > 0) {
        document.getElementsByClassName("comMain")[0].style['padding-top'] = "1px"; // 减少页面顶部间距
    }
    //格式调整
    if (document.getElementsByClassName("conlf").length > 0) {
        document.getElementsByClassName("conlf")[0].style.width = "990px";//宽屏模式
    }
    if (document.getElementsByClassName("conTop").length > 0) document.getElementsByClassName("conTop")[0].style.border = "none"; // 移除顶部线
    if (document.getElementById('Main_Content_Val')) document.getElementById('Main_Content_Val').style = ""; //去背景水印

    if (document.getElementsByClassName("media pip_none").length > 0) document.getElementsByClassName("media pip_none")[0].style.padding = "20px"; //图片padding

    if (document.getElementsByTagName('wb:follow-button').length > 0) {
        document.getElementsByTagName('wb:follow-button')[0].remove(); //移除微博加关注
    }
    removeClasses.forEach(c => removeClass(c));
    removeIds.forEach(id => removeId(id));
};

observer.observe(document, { childList: true, subtree: true });
document.addEventListener('DOMContentLoaded', () => {
    //clean();
    observer.disconnect(); // 清理完成后断开观察，避免不必要的性能消耗
}, true);
window.onload = clean;
