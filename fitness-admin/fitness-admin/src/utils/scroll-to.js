/**
 * 平滑滚动到指定位置
 * @param {number} y - 目标Y轴位置
 * @param {number} duration - 动画持续时间(ms)
 * @param {HTMLElement} element - 滚动元素，默认是documentElement
 * @returns {Promise} 滚动完成的Promise
 */
export function scrollTo(y, duration = 500, element = document.documentElement) {
    return new Promise((resolve) => {
        // 如果元素不存在或不是HTMLElement，直接resolve
        if (!element || !(element instanceof HTMLElement)) {
            console.warn('滚动元素不存在')
            resolve(false)
            return
        }

        const startY = element.scrollTop
        const diff = y - startY

        // 如果不需要滚动，直接返回
        if (diff === 0) {
            resolve(true)
            return
        }

        let start = null

        function step(timestamp) {
            if (!start) start = timestamp
            const progress = timestamp - start
            const percent = Math.min(progress / duration, 1)

            // 计算当前滚动位置
            element.scrollTop = startY + diff * easeInOutCubic(percent)

            if (progress < duration) {
                window.requestAnimationFrame(step)
            } else {
                // 确保最终位置准确
                element.scrollTop = y
                resolve(true)
            }
        }

        window.requestAnimationFrame(step)
    })
}

/**
 * 缓动函数 - 三次方缓动
 */
function easeInOutCubic(t) {
    return t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1
}

/**
 * 滚动到元素位置
 * @param {HTMLElement|string} target - 目标元素或选择器
 * @param {number} offset - 偏移量（px）
 * @param {number} duration - 动画持续时间
 * @param {HTMLElement} container - 容器元素
 * @returns {Promise}
 */
export function scrollToElement(target, offset = 0, duration = 500, container = document.documentElement) {
    return new Promise((resolve) => {
        let element = target

        // 如果是字符串，当作选择器使用
        if (typeof target === 'string') {
            element = document.querySelector(target)
        }

        if (!element) {
            console.warn(`目标元素不存在: ${target}`)
            resolve(false)
            return
        }

        // 计算目标位置
        const elementRect = element.getBoundingClientRect()
        const containerRect = container.getBoundingClientRect()
        const targetY = container.scrollTop + (elementRect.top - containerRect.top) - offset

        scrollTo(targetY, duration, container).then(resolve)
    })
}

/**
 * 滚动到顶部
 * @param {number} duration - 动画持续时间
 * @param {HTMLElement} container - 容器元素
 * @returns {Promise}
 */
export function scrollToTop(duration = 500, container = document.documentElement) {
    return scrollTo(0, duration, container)
}

/**
 * 滚动到底部
 * @param {number} duration - 动画持续时间
 * @param {HTMLElement} container - 容器元素
 * @returns {Promise}
 */
export function scrollToBottom(duration = 500, container = document.documentElement) {
    const maxScroll = container.scrollHeight - container.clientHeight
    return scrollTo(maxScroll, duration, container)
}

/**
 * 判断元素是否在可视区域内
 * @param {HTMLElement} element - 目标元素
 * @param {HTMLElement} container - 容器元素
 * @returns {boolean}
 */
export function isElementInViewport(element, container = document.documentElement) {
    if (!element) return false

    const elementRect = element.getBoundingClientRect()
    const containerRect = container.getBoundingClientRect()

    return (
        elementRect.top >= containerRect.top &&
        elementRect.left >= containerRect.left &&
        elementRect.bottom <= containerRect.bottom &&
        elementRect.right <= containerRect.right
    )
}

/**
 * 平滑滚动到指定位置（如果不在可视区域内）
 * @param {HTMLElement|string} target - 目标元素或选择器
 * @param {number} offset - 偏移量
 * @param {number} duration - 动画持续时间
 * @param {HTMLElement} container - 容器元素
 * @returns {Promise}
 */
export function scrollIntoViewIfNeeded(target, offset = 0, duration = 500, container = document.documentElement) {
    return new Promise((resolve) => {
        let element = target

        if (typeof target === 'string') {
            element = document.querySelector(target)
        }

        if (!element) {
            resolve(false)
            return
        }

        if (!isElementInViewport(element, container)) {
            scrollToElement(element, offset, duration, container).then(resolve)
        } else {
            resolve(true)
        }
    })
}

// 默认导出所有函数
export default {
    scrollTo,
    scrollToElement,
    scrollToTop,
    scrollToBottom,
    isElementInViewport,
    scrollIntoViewIfNeeded
}
