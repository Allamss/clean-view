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

// 直接执行方法，避免站点阻止复制
(function unlockCopy() {
    // 1) 强制允许选中
    const style = document.createElement('style');
    style.type = 'text/css';
    style.textContent = `
    * { -webkit-user-select: text !important; user-select: text !important; }
    html, body { -webkit-touch-callout: default !important; }
    [unselectable="on"] { -webkit-user-select: text !important; user-select: text !important; }
  `;
    (document.head || document.documentElement).appendChild(style);

    // 2) 在捕获阶段“抢先”阻断站点阻止复制/选中/右键
    const KILL = ['copy','cut','paste','selectstart','select','contextmenu','dragstart'];
    const kill = e => {
        // 放开默认并阻止后续监听器
        try { e.returnValue = true; } catch(_) {}
        e.stopImmediatePropagation();
        e.stopPropagation();
        // 不主动 preventDefault，避免影响你自身逻辑
    };
    KILL.forEach(t => {
        document.addEventListener(t, kill, { capture: true, passive: false });
        window.addEventListener(t, kill, { capture: true, passive: false });
    });

    // 3) 清理常见内联拦截属性
    const clearInlineHandlers = root => {
        const props = [
            'oncopy','oncut','onpaste',
            'onselectstart','onselect','oncontextmenu',
            'ondragstart'
        ];
        try {
            // window/document/body 级别
            [window, document, document.documentElement, document.body].forEach(t => {
                if (!t) return;
                props.forEach(p => { try { t[p] = null; } catch(_) {} });
            });
            // 元素级别
            const selector = props.map(p => `[${p}]`).join(',');
            (root || document).querySelectorAll(selector).forEach(el => {
                props.forEach(p => { try { el[p] = null; el.removeAttribute(p); } catch(_) {} });
            });
        } catch(_) {}
    };

    // 初次尝试
    clearInlineHandlers();

    // 4) 监听后续注入的元素，把 “unselectable=on / user-select:none” 修正掉
    const fixAttrs = node => {
        if (!(node && node.nodeType === 1)) return; // 元素
        try {
            if (node.getAttribute && node.getAttribute('unselectable') === 'on') {
                node.setAttribute('unselectable', 'off');
                node.style.setProperty('-webkit-user-select','text','important');
                node.style.setProperty('user-select','text','important');
            }
            const cs = getComputedStyle(node);
            if (cs && (cs.userSelect === 'none' || cs.webkitUserSelect === 'none')) {
                node.style.setProperty('-webkit-user-select','text','important');
                node.style.setProperty('user-select','text','important');
            }
        } catch(_) {}
    };

    const mo = new MutationObserver(muts => {
        for (const m of muts) {
            if (m.type === 'childList' && m.addedNodes) {
                m.addedNodes.forEach(n => {
                    fixAttrs(n);
                    // 顺便清一下内联处理器（针对新注入节点）
                    if (n.querySelectorAll) clearInlineHandlers(n);
                });
            } else if (m.type === 'attributes') {
                fixAttrs(m.target);
            }
        }
    });
    mo.observe(document, { subtree: true, childList: true, attributes: true, attributeFilter: ['unselectable','style','class'] });

    // 5) 兜底：Ctrl/Cmd + C 时，直接把选中文本写入剪贴板（如果站点仍拦截）
    document.addEventListener('keydown', async (e) => {
        const isMac = navigator.platform.toUpperCase().includes('MAC');
        const isCopy = (isMac && e.metaKey && e.key.toLowerCase() === 'c') ||
            (!isMac && e.ctrlKey && e.key.toLowerCase() === 'c');
        if (!isCopy) return;

        const sel = window.getSelection && window.getSelection();
        if (!sel || sel.isCollapsed) return;
        const text = sel.toString();
        if (!text) return;

        try {
            if (navigator.clipboard && navigator.clipboard.writeText) {
                await navigator.clipboard.writeText(text);
            } else {
                const ta = document.createElement('textarea');
                ta.style.position = 'fixed';
                ta.style.opacity = '0';
                ta.value = text;
                document.body.appendChild(ta);
                ta.select();
                document.execCommand('copy');
                ta.remove();
            }
            // 防止页面后续监听器吃掉复制动作
            e.stopImmediatePropagation();
            e.stopPropagation();
        } catch(_) {}
    }, { capture: true });
})();

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