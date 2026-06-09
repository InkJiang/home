document.addEventListener("DOMContentLoaded", () => {
  // 1. 加载 Header 和 Footer
  const headerEl = document.getElementById("navbar");
  const footerEl = document.getElementById("global-footer");

  // 使用 Promise.all 确保组件加载完成后再绑定事件和处理高亮
  Promise.all([
    fetch("./components/header.html").then(res => res.text()).then(html => { if(headerEl) headerEl.innerHTML = html; }),
    fetch("./components/footer.html").then(res => res.text()).then(html => { if(footerEl) footerEl.innerHTML = html; })
  ]).then(() => {
    // 组件加载完成后执行初始化
    initNavigation();
  }).catch(err => console.error("加载公共组件失败:", err));
});

// 核心：导航高亮与交互逻辑
function initNavigation() {
  // 获取当前页面的完整路径名并转为小写（例如：/works.html 或 /work01.html）
  const currentPath = window.location.pathname.toLowerCase();
  
  // 获取所有导航链接（包含桌面端和移动端）
  const navLinks = document.querySelectorAll("#desktop-links a, #mobile-links a");
  
  navLinks.forEach(link => {
    // 获取 a 标签的 href 相对路径，并转为小写（例如：./works.html -> works.html）
    const hrefAttr = link.getAttribute("href").replace("./", "").toLowerCase();
    
    let isMatch = false;

    // 1. 特殊处理“短文”选项的匹配逻辑
    if (hrefAttr === "works.html") {
      // 如果当前页面是 works.html 本身，或者路径中包含 "work" (如 work01.html, work_detail.html 等)
      if (currentPath.includes("works.html") || currentPath.includes("/work")) {
        isMatch = true;
      }
    } 
    // 2. 特殊处理首页（根路径）
    else if (hrefAttr === "index.html") {
      if (currentPath.includes("index.html") || currentPath.endsWith("/")) {
        isMatch = true;
      }
    } 
    // 3. 其他页面的常规精确匹配（关于、联系、工具等）
    else {
      if (currentPath.includes(hrefAttr)) {
        isMatch = true;
      }
    }

    // 如果匹配成功，应用高亮样式
    if (isMatch) {
      // 区分桌面端和移动端的高亮样式
      if (link.closest("#desktop-links")) {
        // 桌面端高亮样式：白色、加粗、字间距加宽、不透明度高
        link.className = "text-white font-bold text-sm tracking-widest opacity-90 hover:opacity-100 transition-opacity";
      } else {
        // 移动端高亮样式
        link.className = "text-white text-sm tracking-wider py-1 transition-colors font-bold";
      }
    }
  });

  // ---- 你原有的 Header 滚动及移动端菜单 JS 交互代码 ----
  const navbar = document.getElementById('navbar');
  if (navbar) {
    window.addEventListener('scroll', () => {
      navbar.classList.toggle('scrolled', window.scrollY > 60);
    });
  }

  const menuBtn = document.getElementById('menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  const iconOpen = document.getElementById('icon-open');
  const iconClose = document.getElementById('icon-close');

  if (!menuBtn || !mobileMenu) return;

  function closeMenu() {
    mobileMenu.classList.remove('open');
    if (iconOpen) iconOpen.classList.remove('hidden');
    if (iconClose) iconClose.classList.add('hidden');
  }

  function openMenu() {
    mobileMenu.classList.add('open');
    if (iconOpen) iconOpen.classList.add('hidden');
    if (iconClose) iconClose.classList.remove('hidden');
  }

  menuBtn.addEventListener('click', (e) => {
    e.stopPropagation(); 
    mobileMenu.classList.contains('open') ? closeMenu() : openMenu();
  });

  mobileMenu.addEventListener('click', (e) => { e.stopPropagation(); });

  document.addEventListener('click', (e) => {
    if (mobileMenu.classList.contains('open') && !mobileMenu.contains(e.target)) {
      closeMenu();
    }
  });

  const mobileLinks = mobileMenu.querySelectorAll('a');
  mobileLinks.forEach(link => {
    link.addEventListener('click', () => { closeMenu(); });
  });
}