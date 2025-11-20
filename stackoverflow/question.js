// ==UserScript==
// @name               stackoverflow优化
// @version            0.0.1
// @description        清洁页面
// @description:en     Clean Page
// @author             Allamss
// @match              *://stackoverflow.com/questions/**
// @homepageURL        https://github.com/Allamss/clean-view
// @supportURL         https://github.com/Allamss/clean-view
// @run-at             document-start
// @license            MIT License
// ==/UserScript==

const removeIds = new Set([
    'left-sidebar', // 左侧
    'announcement-banner', // banner
    'hireme', // 广告
    'hot-network-questions', // 右侧
    'footer', // 底部
]);
const removeClasses = new Set([
    's-topbar', // 顶部栏
    's-sidebarwidget', // 右侧
    's-anchors', // 右侧
    'js-zone-container', // 广告
    'js-bottom-notice', // 底部
    's-notice', // 底部
]);
const removeTags = new Set([
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

const removeTag = tagName => {
    for (let tag of document.getElementsByTagName(tagName)) {
        tag?.remove();
    }
}

let clean = () => {
    console.log('优化器开始清洁')
    removeClasses.forEach(c => removeClass(c));
    removeIds.forEach(id => removeId(id));
    removeTags.forEach(t => removeTag(t));

    // 置顶
    for (let questionPage of document.getElementsByClassName('question-page')) {
        questionPage.style.paddingTop = '0';
    }

    // 宽屏
    for (let container of document.getElementsByClassName('container')) {
        container.style.maxWidth = '1400px';
    }
    const contend = document.getElementById('content');
    contend.style.border = '0';
    contend.style.maxWidth = '1400px';

    // 正文文字变大
    for (let content of document.getElementsByTagName('p')) {
        content.style.fontSize = '16px';
    }

    // 代码JetBrainsMono展示
    for (let code of document.getElementsByTagName('code')) {
        code.style.fontFamily = 'JetBrainsMono, ui-monospace, "Cascadia Mono", "Segoe UI Mono", "Liberation Mono", Menlo, Monaco, Consolas, monospace;'
    }
};

observer.observe(document, { childList: true, subtree: true });
document.addEventListener('DOMContentLoaded', () => {
    observer.disconnect(); // 清理完成后断开观察，避免不必要的性能消耗
}, true);
window.onload = clean;