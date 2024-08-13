// ==UserScript==
// @name               财新周刊页优化
// @namespace          caixin
// @version            0.0.1
// @description        清洁页面
// @description:en     Clean Page
// @author             Allamss
// @match              *://weekly.caixin.com/*
// @homepageURL        https://github.com/Allamss/clean-view
// @supportURL         https://github.com/Allamss/clean-view
// @run-at             document-start
// @license            MIT License
// ==/UserScript==

const removeIds = new Set();
const removeClasses = new Set([
    'topup',//移除顶部广告
    'bottom',// 移除底部
    'code_box',// 移除最底部
    'head', // 干掉顶部，需要登录时打开
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

let clean = () => {
    console.log('优化器开始清洁')
    //格式调整
    /*if (document.getElementsByClassName("mainMagContent").length > 0) {
        document.getElementsByClassName("mainMagContent")[0].style.width = "990px";//宽屏模式
    }*/
    document.body.style.backgroundImage = 'none'
    removeClasses.forEach(c => removeClass(c));
    removeIds.forEach(id => removeId(id));
    console.log('清洁完成')
};

//observer.observe(document, { childList: true, subtree: true });
document.addEventListener('DOMContentLoaded', () => {
    //observer.disconnect(); // 清理完成后断开观察，避免不必要的性能消耗
}, true);
window.onload = clean;