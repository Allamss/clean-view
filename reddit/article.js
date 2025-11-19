// ==UserScript==
// @name               Reddit优化
// @version            0.0.1
// @description        清洁页面
// @description:en     Clean Page
// @author             Allamss
// @match              *://www.reddit.com/r/**
// @homepageURL        https://github.com/Allamss/clean-view
// @supportURL         https://github.com/Allamss/clean-view
// @run-at             document-start
// @license            MIT License
// ==/UserScript==

const removeIds = new Set([
    'right-sidebar-container' // 右侧
]);
const removeClasses = new Set([
]);
const removeTags = new Set([
    'shreddit-comment-tree-ad', // 评论区广告
    'shreddit-comments-page-ad'
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
    document.getElementById('main-content').style.width = '990px'; // 宽屏模式
    document.getElementsByTagName('reddit-header-action-items')?.item(0)?.remove(); // 去除顶部栏
    document.getElementsByTagName('shreddit-app').item(0).style.paddingTop = '0'; // 去除顶部栏后文章置顶
    document.getElementById('flex-left-nav-container').remove(); // 去除左边栏
    // 正文文字变大
    for (let content of document.getElementsByTagName('p')) {
        content.style.fontSize = '16px';
    }

    // 移除左边栏占位
    for (let container of document.getElementsByClassName('grid-container')) {
        container.classList.remove('grid')
    }

    removeClasses.forEach(c => removeClass(c));
    removeIds.forEach(id => removeId(id));
    removeTags.forEach(t => removeTag(t));
};

observer.observe(document, { childList: true, subtree: true });
document.addEventListener('DOMContentLoaded', () => {
    observer.disconnect(); // 清理完成后断开观察，避免不必要的性能消耗
}, true);
window.onload = clean;