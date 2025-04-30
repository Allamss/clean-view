// ==UserScript==
// @name               Maven官方库列表页
// @version            0.0.1
// @description        清洁页面
// @description:en     Clean Page
// @author             Allamss
// @match              *://mvnrepository.com
// @match              *://mvnrepository.com/search*
// @match              *://mvnrepository.com/artifact/**
// @homepageURL        https://github.com/Allamss/clean-view
// @supportURL         https://github.com/Allamss/clean-view
// @run-at             document-start
// @license            MIT License
// ==/UserScript==

const removeIds = new Set([
]);
const removeClasses = new Set([
    'box box-stats', // 侧边图
    'box-categories', // 侧边目录
    'right', // 右侧栏
    'box', // 左侧栏
    'box-header',
    'facet',
    'h-ad' // 广告
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

    removeClasses.forEach(c => removeClass(c));
    removeIds.forEach(id => removeId(id));
};

clean();

observer.observe(document, { childList: true, subtree: true });
document.addEventListener('DOMContentLoaded', () => {
}, true);
window.onload = clean;