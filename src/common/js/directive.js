import $ from 'jquery'

// 自定义指令，点击放大图片
export default {
  install: (Vue) => {
    Vue.directive('img', {
      bind(el, binding, vnode) {
        $(el).css('cursor', 'pointer')
        el.addEventListener('click', e => {
          if (e && e.stopPropagation) {
            e.stopPropagation()
          } else {
            window.event.cancelBubble = true
          }
          const shade = $('<div class="preview-shade"></div>')
          const imgBox = $('<div class="preview-img"></div>')
          const rotate = $('<span class="xffont xf-shuaxin preview-rotate"></span>')
          const image = $(`<img src="${binding.value}">`)
          imgBox.append(image).append(rotate)
          $('body').append(shade).append(imgBox)
          imgBox.on('click', () => {
            shade.remove()
            imgBox.remove()
          })
          image.on('click', e => {
            if (e && e.stopPropagation) {
              e.stopPropagation()
            } else {
              window.event.cancelBubble = true
            }
          })
          let currentRotate = 0
          rotate.on('click', e => {
            if (e && e.stopPropagation) {
              e.stopPropagation()
            } else {
              window.event.cancelBubble = true
            }
            currentRotate += 90
            image.css('transform', `rotate(${currentRotate}deg)`)
          })
        }, false)
      }
    })
  }
}
