// ==UserScript==
// @name               腾讯云详情优化
// @version            0.0.1
// @description        清洁页面
// @description:en     Clean Page
// @author             Allamss
// @match              *://cloud.tencent.com/developer/article/*
// @homepageURL        https://github.com/Allamss/clean-view
// @supportURL         https://github.com/Allamss/clean-view
// @run-at             document-start
// @license            MIT License
// ==/UserScript==

const removeIds = new Set([
    'tea-overlay-root', // 右部通知
]);
const removeClasses = new Set([
    'mod-author', // 作者栏
    'cdc-header', // 顶部栏
    'cdc-suspend-pill', // 左边点赞收藏
    'cdc-crumb', // 顶部文章分类
    'cdc-widget-global', // 右部公告
    'cdc-commercial-card', // 右部广告
    'cdc-mod-product2',
    'cdc-sticky-header', // 顶部悬浮
    'mod-header__column', // 顶部收录
    'cdc-icon__list', // 浏览、评论数
    'mod-header__operates', // 举报
    'cdc-footer', // 底部
    'cdc-discussion-card', // 右部讨论
    'is-pill-hidden', // 相关推荐
    'recommend', // 推荐
    'mod-statement', // 声明
    'title-tag', // 标题标签
    'cdc-tag_list', // 标签列表
    'cdc-tag', // 标签列表
    'mod-content__tags', //标签
    'cdc-tag__inner', // 标签
    'date-tip', //
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

observer.observe(document, { childList: true, subtree: true });
document.addEventListener('DOMContentLoaded', () => {
    observer.disconnect(); // 清理完成后断开观察，避免不必要的性能消耗
}, true);
window.onload = clean;