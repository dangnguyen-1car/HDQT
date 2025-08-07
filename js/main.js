document.addEventListener('DOMContentLoaded', () => {
    lucide.createIcons();

    // --- KHAI BÁO BIẾN ---
    const navLinks = document.querySelectorAll('.nav-link');
    const contentArea = document.getElementById('content-area');
    const pageTitleElement = document.getElementById('page-title');
    const defaultPageLink = document.querySelector('.nav-link[data-page="home"]');
    
    // Biến cho responsive menu
    const hamburgerBtn = document.getElementById('hamburger-btn');
    const sidebar = document.getElementById('sidebar');

    const pageTitles = {
        home: 'Trang chủ',
        strategy: 'Phân tích Nền tảng & Định hướng Chiến lược',
        legal: 'Nền tảng Pháp lý',
        operations: 'Quy chế & Chính sách Vận hành',
        finance: 'Quản trị Tài chính & Kiểm soát Nội bộ',
        hr: 'Quản trị Nhân sự & Văn hóa',
        sops: 'Vận hành Tiêu chuẩn (SOPs) & Đào tạo'
    };

    // --- LOGIC CHỨC NĂNG ---

    // 1. LOGIC TẢI NỘI DUNG
    const loadContent = async (filePath, pageKey) => {
        contentArea.innerHTML = `<div id="loader" class="loader-container"><div class="loader-spinner" style="border-color: var(--border-color); border-top-color: var(--primary-color);"></div></div>`;
        try {
            const response = await fetch(filePath);
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            
            const markdown = await response.text();
            // Kiểm tra theme: ưu tiên class 'dark' trên body, nếu không có thì kiểm tra hệ thống
            const hasExplicitDark = document.body.classList.contains('dark');
            const prefersSystemDark = !hasExplicitDark && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
            const isDark = hasExplicitDark || prefersSystemDark;
            
            const proseClasses = isDark ? 'prose prose-lg max-w-none dark:prose-invert' : 'prose prose-lg max-w-none';
            
            const htmlContent = marked.parse(markdown);
            contentArea.innerHTML = `<div class="${proseClasses}">${htmlContent}</div>`;
            
            const newTitle = pageTitles[pageKey] || 'Cổng Thông Tin 1CAR';
            pageTitleElement.textContent = newTitle;
            document.title = `${newTitle} - Cổng Quản Trị 1CAR`;
        } catch (error) {
            const hasExplicitDark = document.body.classList.contains('dark');
            const prefersSystemDark = !hasExplicitDark && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
            const isDark = hasExplicitDark || prefersSystemDark;
            
            const proseClasses = isDark ? 'prose dark:prose-invert' : 'prose';
            contentArea.innerHTML = `<div class="${proseClasses}"><h2>Lỗi tải nội dung</h2><p>${error.message}</p></div>`;
        }
    };

    const setActiveLink = (activeLink) => {
        navLinks.forEach(link => link.classList.remove('active'));
        activeLink.classList.add('active');
    };

    navLinks.forEach(link => {
        link.addEventListener('click', (event) => {
            event.preventDefault();
            setActiveLink(link);
            loadContent(link.dataset.file, link.dataset.page);
            // Tự động ẩn sidebar trên mobile sau khi chọn
            if (window.innerWidth <= 768) {
                sidebar.classList.remove('visible');
            }
        });
    });

    // 2. LOGIC RESPONSIVE SIDEBAR
    hamburgerBtn.addEventListener('click', () => {
        sidebar.classList.toggle('visible');
    });

    // --- LOGIC THEO DÕI THAY ĐỔI THEME HỆ THỐNG ---
    
    // Hàm cập nhật prose classes cho nội dung hiện tại
    const updateCurrentContentTheme = () => {
        const contentDiv = contentArea.querySelector('.prose');
        if (contentDiv) {
            const hasExplicitDark = document.body.classList.contains('dark');
            const prefersSystemDark = !hasExplicitDark && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
            const isDark = hasExplicitDark || prefersSystemDark;
            
            contentDiv.className = isDark ? 'prose prose-lg max-w-none dark:prose-invert' : 'prose prose-lg max-w-none';
        }
    };

    // Theo dõi thay đổi theme hệ thống
    if (window.matchMedia) {
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        mediaQuery.addEventListener('change', () => {
            // Chỉ cập nhật nếu không có class .dark được set thủ công
            if (!document.body.classList.contains('dark')) {
                updateCurrentContentTheme();
            }
        });
    }

    // --- KHỞI TẠO KHI TẢI TRANG ---

    // Tải trang mặc định
    if (defaultPageLink) {
        setActiveLink(defaultPageLink);
        loadContent(defaultPageLink.dataset.file, defaultPageLink.dataset.page);
    }
});
