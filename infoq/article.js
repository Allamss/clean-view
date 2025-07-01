// ==UserScript==
// @name               InfoQ文章页
// @namespace          infoq
// @version            0.0.1
// @description        清洁页面
// @description:en     Clean Page
// @author             Allamss
// @match              *://www.infoq.cn/article/*
// @homepageURL        https://github.com/Allamss/clean-view
// @supportURL         https://github.com/Allamss/clean-view
// @run-at             document-start
// @license            MIT License
// ==/UserScript==

const removeIds = new Set([
]);
const removeClasses = new Set([
    'article-aside', // 右侧推荐栏
    'operation-bar', // 左侧操作栏
    'audioPlayer', // 音频播放器
    'layout-header', // 顶部烂
    'sub-nav-wrap', // 顶部导航栏
    'layout-footer', // 底部栏
    'article-widget-foot', // 文章底部点赞标签
    'comment-container', // 评论区
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
    document.body.style.backgroundImage = 'none';
    if (document.getElementsByClassName("article-main").length > 0) {
        document.getElementsByClassName("article-main")[0].style.width = "990px"; // 宽屏模式
    }
    if (document.getElementsByClassName("inner-content").length > 0) {
        document.getElementsByClassName("inner-content")[0].style.paddingTop = "0"; // 移除顶部空白
    }
    removeClasses.forEach(c => removeClass(c));
    removeIds.forEach(id => removeId(id));
};

observer.observe(document, {childList: true, subtree: true});
document.addEventListener('DOMContentLoaded', () => {
    clean();
    observer.disconnect(); // 清理完成后断开观察，避免不必要的性能消耗
    // 页面异步加载内容，一段时间clean新加载内容
    setTimeout(() => clean(), 300);
    setTimeout(() => clean(), 1000);
    setTimeout(() => clean(), 3000);
    setTimeout(() => clean(), 5000);
    setTimeout(() => clean(), 8000);
    setTimeout(() => clean(), 10000);
}, true);
window.onload = clean;