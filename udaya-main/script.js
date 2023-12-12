// Nav
const overlay = document.createElement('div') // 创建背景层元素
overlay.classList.add('overlay') // 添加样式类到背景层
const menuwrapper = document.getElementById('menuwrapper')

function addMenuButtonListener() {
  const menuButton = document.getElementById('menuButton')
  const menu = document.getElementById('menu')

  if (menuButton) {
    menuButton.addEventListener('click', toggleMenu)
    console.log('Menu button listener added') // 添加调试日志
  }else{
    console.log('Menu button listener not added') // 添加调试日志
  }

    overlay.addEventListener('click', toggleMenu)

  if (menu) {
    if (menu.classList.contains('menu-mobile')) {
      toggleMenu()
    }
  }

  // 在窗口尺寸调整时关闭导航栏
  window.addEventListener('resize', () => {
    if (window.innerWidth >= 640 && menu.classList.contains('menu-mobile')) {
      toggleMenu()
    }
  })
}

function loadFile(filePath, elementId) {
  console.log('loadFile called with', filePath, elementId) // 添加调试日志
  return fetch(filePath) // 注意这里的 return 语句
    .then(function (response) {
      return response.text()
    })
    .then(function (html) {
      document.getElementById(elementId).innerHTML = html
    })
    .catch(function (err) {
      console.warn('Something went wrong.', err)
    })
}


// Load the header and footer
loadFile('/header.html', 'header').then(() => {
  addMenuButtonListener()
})
loadFile('/footer.html', 'footer')

function toggleMenu() {
  const menuButton = document.getElementById('menuButton')
  const menu = document.getElementById('menu')
  const menuwrapper = document.getElementById('menuwrapper')
  console.log('toggleMenu called') // 添加调试日志
  menu.classList.toggle('hidden')
  menu.classList.toggle('menu-mobile')

  if (menu.classList.contains('menu-mobile')) {
    console.log('Menu is now mobile, adding overlay') // 添加调试日志
    document.body.appendChild(overlay)
    document.body.style.overflow = 'hidden'
    document.documentElement.style.overflow = 'hidden'
    overlay.style.display = 'block'
  } else {
    console.log('Menu is now hidden, removing overlay') // 添加调试日志
    document.body.style.overflow = ''
    document.documentElement.style.overflow = ''
    overlay.style.display = 'none'
  }
}

// scroll
function addScrollListener() {
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault()

      const targetId = this.getAttribute('href').substring(1)
      const targetElement = document.getElementById(targetId)
      alert(targetElement)

      if (targetElement) {
        const offset = window.innerHeight * 0.1 // 10% 的视口高度作为偏移量
        const targetPosition = targetElement.offsetTop - offset

        window.scrollTo({ top: targetPosition, behavior: 'smooth' })
      }
    })
  })

}


// Preload images
document.addEventListener('DOMContentLoaded', function () {
  const preloadImages = document.querySelectorAll('[data-high-res-image]')

  preloadImages.forEach((imgElement) => {
    const highResImage = imgElement.getAttribute('data-high-res-image')
    const img = new Image()
    img.onload = () => {
      if (imgElement.tagName === 'IMG') {
        imgElement.src = highResImage
      } else {
        imgElement.style.backgroundImage = `url('${highResImage}')`
      }
    }
    img.src = highResImage
  })

  const bgElements = document.querySelectorAll('[data-high-res-bg]')

  bgElements.forEach((element) => {
    const highResBg = element.getAttribute('data-high-res-bg')
    const img = new Image()
    img.onload = () => {
      element.style.backgroundImage = `url('${highResBg}')`
    }
    img.src = highResBg
  })
})
