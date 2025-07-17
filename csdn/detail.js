// ==UserScript==
// @name               CSDN文章页
// @namespace          csdn
// @version            0.0.1
// @description        清洁页面
// @description:en     Clean Page
// @author             Allamss
// @match              *://blog.csdn.net/*/article/details/*
// @homepageURL        https://github.com/Allamss/clean-view
// @supportURL         https://github.com/Allamss/clean-view
// @run-at             document-start
// @license            MIT License
// ==/UserScript==

const removeIds = new Set([
    'rightAside',// 移除底部
    'toolbarBox',// 移除顶部
    'treeSkill',// 移除技能底部
    'blogColumnPayAdvert',// 顶部专栏
    'recommendNps', // 推荐栏
    'blogHuaweiyunAdvert', // 收录栏
    'pcCommentBox', // 热评底部
]);
const removeClasses = new Set([
    'aside-box',//干掉左边
    'csdn-side-toolbar',// 移除工具框
    'article-info-box',// 移除作者栏
    'more-toolbox-new',// 移除底部作者
    'blog-footer-bottom',//移除最底部
    'recommend-box', // 删除关联推荐
    'swiper-slide-box-remuneration', // 左侧幻灯片广告
    'swiper-wrapper', // 左侧幻灯片广告
    'mb8', // 插件提醒
    'article-previous', // 下一篇
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
    document.body.style.backgroundImage = 'none'
    removeClasses.forEach(c => removeClass(c));
    removeIds.forEach(id => removeId(id));
};

observer.observe(document, {childList: true, subtree: true});
document.addEventListener('DOMContentLoaded', () => {
    observer.disconnect(); // 清理完成后断开观察，避免不必要的性能消耗
    setTimeout(() => clean(), 3000);
}, true);
window.onload = clean;