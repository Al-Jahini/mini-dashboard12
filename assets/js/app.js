// Mini Admin Dashboard - Main JavaScript File
class DashboardApp {
    constructor() {
        this.users = [];
        this.posts = [];
        this.comments = [];
        this.favorites = JSON.parse(localStorage.getItem('favorites')) || [];
        this.localPosts = JSON.parse(localStorage.getItem('localPosts')) || [];
        this.currentTheme = localStorage.getItem('theme') || 'light';
        
        this.initPagination();
        this.init();
    }

    async init() {
        this.setupEventListeners();
        this.applyTheme();
        this.showLoader();
        
        try {
            await this.loadData();
            this.updateStatistics();
            this.setupDataTables();
            this.renderPosts();
            this.updateFavoritesCount();
        } catch (error) {
            console.error('Error initializing app:', error);
            this.showToast('خطأ في تحميل البيانات', 'error');
        } finally {
            this.hideLoader();
        }
    }

    setupEventListeners() {
        // Navigation
        document.querySelectorAll('.menu-item').forEach(item => {
            item.addEventListener('click', (e) => {
                const page = e.currentTarget.dataset.page;
                this.showPage(page);
            });
        });

        // Theme toggle
        document.getElementById('themeToggle').addEventListener('click', () => {
            this.toggleTheme();
        });

        // User modal
        document.getElementById('addUserBtn').addEventListener('click', () => {
            this.openUserModal();
        });

        document.getElementById('saveUserBtn').addEventListener('click', () => {
            this.saveUser();
        });

        document.getElementById('cancelUserBtn').addEventListener('click', () => {
            this.closeModal('userModal');
        });

        // Post modal
        document.getElementById('addPostBtn').addEventListener('click', () => {
            this.openPostModal();
        });

        document.getElementById('savePostBtn').addEventListener('click', () => {
            this.savePost();
        });

        document.getElementById('cancelPostBtn').addEventListener('click', () => {
            this.closeModal('postModal');
        });

        // Search
        document.getElementById('postSearch').addEventListener('input', (e) => {
            this.searchPosts(e.target.value);
        });

        // Modal close buttons
        document.querySelectorAll('.close').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const modal = e.target.closest('.modal');
                this.closeModal(modal.id);
            });
        });

        // Close modal on outside click
        document.querySelectorAll('.modal').forEach(modal => {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    this.closeModal(modal.id);
                }
            });
        });

        // Favorites tabs
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const tab = e.target.dataset.tab;
                this.switchFavoritesTab(tab);
            });
        });

        // Table controls
        document.getElementById('refreshUsersBtn').addEventListener('click', () => {
            this.loadUsersTable();
            this.showToast('تم تحديث الجدول', 'success');
        });

        document.getElementById('exportUsersBtn').addEventListener('click', () => {
            this.exportUsers();
        });

        // Posts controls
        document.getElementById('refreshPostsBtn').addEventListener('click', () => {
            this.renderPosts();
            this.showToast('تم تحديث المنشورات', 'success');
        });

        document.getElementById('postFilter').addEventListener('change', (e) => {
            this.filterPosts(e.target.value);
        });

        // Pagination controls
        document.getElementById('prevPostsBtn').addEventListener('click', () => {
            this.previousPostsPage();
        });

        document.getElementById('nextPostsBtn').addEventListener('click', () => {
            this.nextPostsPage();
        });

        // Users navigation
        document.getElementById('prevUsersBtn').addEventListener('click', () => {
            this.previousUsersPage();
        });

        document.getElementById('nextUsersBtn').addEventListener('click', () => {
            this.nextUsersPage();
        });

        // Favorites navigation
        document.getElementById('prevFavoritesBtn').addEventListener('click', () => {
            this.previousFavoritesPage();
        });

        document.getElementById('nextFavoritesBtn').addEventListener('click', () => {
            this.nextFavoritesPage();
        });
    }

    async loadData() {
        // Always use Egyptian data instead of API
        this.loadFallbackData();
    }

    loadFallbackData() {
        // Fallback users data - Egyptian accounts
        this.users = [
            {
                id: 1,
                name: "أحمد محمد علي",
                username: "ahmed_mohamed",
                email: "ahmed.mohamed@gmail.com",
                phone: "01012345678",
                website: "ahmedtech.com",
                address: { city: "القاهرة", street: "شارع التحرير", suite: "مبنى رقم 15" },
                company: { name: "شركة التقنية المتقدمة" }
            },
            {
                id: 2,
                name: "فاطمة السيد أحمد",
                username: "fatima_sayed",
                email: "fatima.sayed@yahoo.com",
                phone: "01234567890",
                website: "fatima-designs.com",
                address: { city: "الإسكندرية", street: "كورنيش الإسكندرية", suite: "شقة 203" },
                company: { name: "استوديو فاطمة للتصميم" }
            },
            {
                id: 3,
                name: "محمد حسن إبراهيم",
                username: "mohamed_hassan",
                email: "mohamed.hassan@hotmail.com",
                phone: "01123456789",
                website: "hassan-solutions.com",
                address: { city: "الجيزة", street: "شارع الهرم", suite: "مكتب 301" },
                company: { name: "حلول حسن التقنية" }
            },
            {
                id: 4,
                name: "نورا محمود عبدالله",
                username: "nora_mahmoud",
                email: "nora.mahmoud@gmail.com",
                phone: "01567890123",
                website: "nora-marketing.com",
                address: { city: "المنصورة", street: "شارع الجلاء", suite: "مبنى الإبداع" },
                company: { name: "وكالة نورا للتسويق الرقمي" }
            },
            {
                id: 5,
                name: "علي أحمد فؤاد",
                username: "ali_ahmed",
                email: "ali.ahmed@outlook.com",
                phone: "01098765432",
                website: "ali-consulting.com",
                address: { city: "طنطا", street: "شارع الجلاء", suite: "مكتب 205" },
                company: { name: "استشارات علي الإدارية" }
            },
            {
                id: 6,
                name: "مريم سعد الدين",
                username: "mariam_saad",
                email: "mariam.saad@gmail.com",
                phone: "01298765432",
                website: "mariam-photography.com",
                address: { city: "أسوان", street: "كورنيش النيل", suite: "استوديو مريم" },
                company: { name: "استوديو مريم للتصوير" }
            },
            {
                id: 7,
                name: "خالد محمد رشيد",
                username: "khaled_mohamed",
                email: "khaled.mohamed@yahoo.com",
                phone: "01198765432",
                website: "khaled-engineering.com",
                address: { city: "الأقصر", street: "شارع الكرنك", suite: "مكتب المهندس" },
                company: { name: "مكتب خالد للاستشارات الهندسية" }
            },
            {
                id: 8,
                name: "رانيا أحمد حسين",
                username: "rania_ahmed",
                email: "rania.ahmed@gmail.com",
                phone: "01087654321",
                website: "rania-fashion.com",
                address: { city: "الزقازيق", street: "شارع الجمهورية", suite: "بوتيك رانيا" },
                company: { name: "بوتيك رانيا للموضة" }
            },
            {
                id: 9,
                name: "يوسف محمود السيد",
                username: "youssef_mahmoud",
                email: "youssef.mahmoud@hotmail.com",
                phone: "01287654321",
                website: "youssef-trading.com",
                address: { city: "بورسعيد", street: "شارع فلسطين", suite: "مكتب التجارة" },
                company: { name: "شركة يوسف للتجارة" }
            },
            {
                id: 10,
                name: "هند محمد عبدالرحمن",
                username: "hend_mohamed",
                email: "hend.mohamed@gmail.com",
                phone: "01187654321",
                website: "hend-education.com",
                address: { city: "المنيا", street: "شارع الجامعة", suite: "مركز التعليم" },
                company: { name: "مركز هند للتعليم" }
            }
        ];

        // Fallback posts data - Egyptian content
        this.posts = [
            {
                id: 1,
                userId: 1,
                title: "أحدث تقنيات البرمجة في 2024",
                body: "تطورت تقنيات البرمجة بشكل كبير هذا العام، خاصة في مجال الذكاء الاصطناعي وتطوير التطبيقات. في هذا المقال سأشارككم أحدث الاتجاهات والتقنيات التي يجب على كل مبرمج معرفتها."
            },
            {
                id: 2,
                userId: 2,
                title: "فن التصميم الجرافيكي في العصر الرقمي",
                body: "التصميم الجرافيكي لم يعد مجرد رسوم وإنما أصبح لغة تواصل قوية. سأوضح لكم كيف يمكن استخدام التصميم لتحقيق أهداف التسويق والعلامة التجارية بشكل فعال."
            },
            {
                id: 3,
                userId: 3,
                title: "إدارة المشاريع التقنية بنجاح",
                body: "إدارة المشاريع التقنية تتطلب مهارات خاصة تجمع بين المعرفة التقنية والقدرة على إدارة الفريق. سأشارككم تجربتي في إدارة مشاريع تقنية ناجحة."
            },
            {
                id: 4,
                userId: 4,
                title: "استراتيجيات التسويق الرقمي الفعالة",
                body: "التسويق الرقمي أصبح ضرورة لا غنى عنها لأي شركة. سأعرض لكم أحدث استراتيجيات التسويق الرقمي التي أثبتت فعاليتها في السوق المصري."
            },
            {
                id: 5,
                userId: 5,
                title: "الاستشارات الإدارية للمشاريع الصغيرة",
                body: "المشاريع الصغيرة تحتاج لاستشارات إدارية مخصصة تناسب حجمها وإمكانياتها. سأوضح لكم كيف يمكن تطوير مشروعك الصغير ليصبح شركة ناجحة."
            },
            {
                id: 6,
                userId: 6,
                title: "فن التصوير الفوتوغرافي الاحترافي",
                body: "التصوير الفوتوغرافي فن يحتاج لدراسة وممارسة. سأشارككم نصائحي في التصوير الاحترافي وكيفية تطوير مهاراتك في هذا المجال."
            },
            {
                id: 7,
                userId: 7,
                title: "الاستشارات الهندسية للمباني الذكية",
                body: "المباني الذكية هي مستقبل العمارة. سأعرض لكم أحدث التقنيات في الاستشارات الهندسية وكيفية تطبيقها في المشاريع المصرية."
            },
            {
                id: 8,
                userId: 8,
                title: "اتجاهات الموضة في 2024",
                body: "الموضة تتطور باستمرار وتتأثر بالثقافة المحلية. سأعرض لكم أحدث اتجاهات الموضة التي تناسب المرأة العربية والمصرية."
            },
            {
                id: 9,
                userId: 9,
                title: "التجارة الإلكترونية في مصر",
                body: "التجارة الإلكترونية في مصر تشهد نمواً كبيراً. سأشارككم تجربتي في إنشاء متجر إلكتروني ناجح في السوق المصري."
            },
            {
                id: 10,
                userId: 10,
                title: "التعليم الإلكتروني وتطوير المهارات",
                body: "التعليم الإلكتروني أصبح ضرورة في عصرنا. سأوضح لكم كيف يمكن استخدام التقنيات الحديثة في تطوير المهارات والتعلم المستمر."
            }
        ];

        // Fallback comments data - Egyptian comments
        this.comments = [
            {
                id: 1,
                postId: 1,
                name: "محمود أحمد",
                email: "mahmoud.ahmed@gmail.com",
                body: "مقال رائع ومفيد جداً! شكراً لك على هذه المعلومات القيمة."
            },
            {
                id: 2,
                postId: 1,
                name: "سارة محمد",
                email: "sara.mohamed@yahoo.com",
                body: "أتمنى لو تشاركنا المزيد من التفاصيل حول الذكاء الاصطناعي."
            },
            {
                id: 3,
                postId: 2,
                name: "أحمد علي",
                email: "ahmed.ali@hotmail.com",
                body: "التصميم الجرافيكي فعلاً فن رائع، شكراً على النصائح."
            },
            {
                id: 4,
                postId: 2,
                name: "فاطمة حسن",
                email: "fatima.hassan@gmail.com",
                body: "هل يمكنك مشاركة بعض الموارد للتعلم أكثر؟"
            },
            {
                id: 5,
                postId: 3,
                name: "محمد سعد",
                email: "mohamed.saad@yahoo.com",
                body: "إدارة المشاريع مهارة مهمة جداً، شكراً على المقال."
            },
            {
                id: 6,
                postId: 4,
                name: "نورا يوسف",
                email: "nora.youssef@gmail.com",
                body: "التسويق الرقمي مجال واسع ومثير، أتمنى المزيد من المقالات."
            },
            {
                id: 7,
                postId: 5,
                name: "خالد محمود",
                email: "khaled.mahmoud@hotmail.com",
                body: "الاستشارات الإدارية مهمة للمشاريع الناشئة، شكراً لك."
            },
            {
                id: 8,
                postId: 6,
                name: "رانيا أحمد",
                email: "rania.ahmed@gmail.com",
                body: "التصوير الفوتوغرافي شغف حقيقي، نصائحك مفيدة جداً."
            },
            {
                id: 9,
                postId: 7,
                name: "يوسف محمد",
                email: "youssef.mohamed@yahoo.com",
                body: "المباني الذكية مستقبل العمارة، مقال ممتاز!"
            },
            {
                id: 10,
                postId: 8,
                name: "هند علي",
                email: "hend.ali@gmail.com",
                body: "اتجاهات الموضة تتغير بسرعة، شكراً على التحديث."
            }
        ];

        // Merge local posts
        this.posts = [...this.posts, ...this.localPosts];
        
        console.log('Using fallback data due to API error');
    }

    showPage(pageId) {
        // Hide all pages
        document.querySelectorAll('.page').forEach(page => {
            page.classList.remove('active');
        });

        // Remove active class from all menu items
        document.querySelectorAll('.menu-item').forEach(item => {
            item.classList.remove('active');
        });

        // Show selected page
        document.getElementById(pageId).classList.add('active');
        
        // Add active class to selected menu item
        document.querySelector(`[data-page="${pageId}"]`).classList.add('active');

        // Load page-specific data
        if (pageId === 'users') {
            this.loadUsersTable();
        } else if (pageId === 'posts') {
            this.renderPosts();
        }
    }

    updateStatistics() {
        document.getElementById('usersCount').textContent = this.users.length;
        document.getElementById('postsCount').textContent = this.posts.length;
        document.getElementById('commentsCount').textContent = this.comments.length;
        document.getElementById('favoritesCount').textContent = this.favorites.length;

        // Update recent activity
        this.updateRecentActivity();
    }

    updateRecentActivity() {
        const activityContainer = document.getElementById('recentActivity');
        
        // Generate realistic activities based on actual data
        const activities = [];
        
        // Add recent users
        if (this.users.length > 0) {
            const recentUsers = this.users.slice(-3);
            recentUsers.forEach((user, index) => {
                activities.push({
                    icon: 'fas fa-user',
                    iconColor: '#28a745',
                    title: `مستخدم: ${user.name}`,
                    description: `تم تسجيل دخول ${user.username}`,
                    time: `${index + 1} دقيقة مضت`,
                    action: 'view',
                    data: user.id
                });
            });
        }
        
        // Add recent posts
        if (this.posts.length > 0) {
            const recentPosts = this.posts.slice(-2);
            recentPosts.forEach((post, index) => {
                activities.push({
                    icon: 'fas fa-file-alt',
                    iconColor: '#007bff',
                    title: `منشور: ${post.title.substring(0, 30)}...`,
                    description: `تم نشر منشور جديد`,
                    time: `${(index + 1) * 10} دقيقة مضت`,
                    action: 'view',
                    data: post.id
                });
            });
        }
        
        // Add favorites activity
        if (this.favorites.length > 0) {
            activities.push({
                icon: 'fas fa-star',
                iconColor: '#ffc107',
                title: 'عناصر مفضلة',
                description: `${this.favorites.length} عنصر في المفضلة`,
                time: 'الآن',
                action: 'favorites'
            });
        }
        
        // Add system status
        activities.push({
            icon: 'fas fa-server',
            iconColor: '#17a2b8',
            title: 'حالة النظام',
            description: 'جميع الخدمات تعمل بشكل طبيعي',
            time: 'مستمر',
            action: 'status'
        });

        activityContainer.innerHTML = activities.map((activity, index) => `
            <div class="activity-item animate__animated animate__fadeInRight" 
                 style="animation-delay: ${index * 0.1}s"
                 onclick="app.handleActivityClick('${activity.action}', ${activity.data || 'null'})">
                <div class="activity-icon" style="background-color: ${activity.iconColor}">
                    <i class="${activity.icon}"></i>
                </div>
                <div class="activity-content">
                    <h4>${activity.title}</h4>
                    <p>${activity.description}</p>
                </div>
                <div class="activity-actions">
                    <small style="color: var(--text-muted);">${activity.time}</small>
                    <button class="btn btn-sm btn-outline" onclick="event.stopPropagation(); app.handleActivityClick('${activity.action}', ${activity.data || 'null'})">
                        <i class="fas fa-eye"></i>
                    </button>
                </div>
            </div>
        `).join('');
    }

    setupDataTables() {
        if ($.fn.DataTable) {
            $('#usersTable').DataTable({
                language: {
                    url: 'https://cdn.datatables.net/plug-ins/1.13.7/i18n/ar.json'
                },
                responsive: true,
                pageLength: 10,
                order: [[0, 'desc']],
                columnDefs: [
                    { orderable: false, targets: [6, 7] }
                ],
                destroy: true
            });
        }
    }

    loadUsersTable() {
        // Destroy existing DataTable if it exists
        if ($.fn.DataTable && $.fn.DataTable.isDataTable('#usersTable')) {
            $('#usersTable').DataTable().destroy();
        }

        const tbody = document.querySelector('#usersTable tbody');
        tbody.innerHTML = '';

        this.users.forEach(user => {
            const isFavorite = this.favorites.includes(user.id.toString());
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>
                    <div class="user-cell">
                        <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=${user.username}&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf" 
                             alt="${user.name}" class="table-avatar">
                        <span class="user-id">#${user.id}</span>
                    </div>
                </td>
                <td>
                    <div class="user-name-cell">
                        <strong>${user.name}</strong>
                        <small>@${user.username}</small>
                    </div>
                </td>
                <td>
                    <div class="email-cell">
                        <i class="fas fa-envelope"></i>
                        ${user.email}
                    </div>
                </td>
                <td>
                    <div class="phone-cell">
                        <i class="fas fa-phone"></i>
                        ${user.phone || 'غير محدد'}
                    </div>
                </td>
                <td>
                    <div class="location-cell">
                        <i class="fas fa-map-marker-alt"></i>
                        ${user.address?.city || 'غير محدد'}
                    </div>
                </td>
                <td>
                    <button class="favorite-btn ${isFavorite ? 'active' : ''}" 
                            onclick="app.toggleFavorite(${user.id}, 'user')"
                            title="${isFavorite ? 'إزالة من المفضلة' : 'إضافة للمفضلة'}">
                        <i class="fas fa-heart"></i>
                    </button>
                </td>
                <td>
                    <div class="action-buttons">
                        <button class="btn btn-sm btn-info" onclick="app.viewUser(${user.id})" title="عرض">
                            <i class="fas fa-eye"></i>
                        </button>
                        <button class="btn btn-sm btn-warning" onclick="app.editUser(${user.id})" title="تعديل">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn btn-sm btn-danger" onclick="app.deleteUser(${user.id})" title="حذف">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </td>
            `;
            tbody.appendChild(row);
        });

        // Initialize DataTable
        this.setupDataTables();
    }

    openUserModal(userId = null) {
        const modal = document.getElementById('userModal');
        const title = document.getElementById('userModalTitle');
        const form = document.getElementById('userForm');
        
        if (userId) {
            const user = this.users.find(u => u.id === userId);
            if (user) {
                title.textContent = 'تعديل المستخدم';
                document.getElementById('userId').value = user.id;
                document.getElementById('userName').value = user.name;
                document.getElementById('userUsername').value = user.username;
                document.getElementById('userEmail').value = user.email;
                document.getElementById('userPhone').value = user.phone || '';
                document.getElementById('userWebsite').value = user.website || '';
            }
        } else {
            title.textContent = 'إضافة مستخدم';
            form.reset();
        }
        
        this.showModal('userModal');
    }

    saveUser() {
        const form = document.getElementById('userForm');
        const formData = new FormData(form);
        const userId = document.getElementById('userId').value;
        
        const userData = {
            name: document.getElementById('userName').value,
            username: document.getElementById('userUsername').value,
            email: document.getElementById('userEmail').value,
            phone: document.getElementById('userPhone').value,
            website: document.getElementById('userWebsite').value
        };

        if (!userData.name || !userData.username || !userData.email) {
            this.showToast('يرجى ملء جميع الحقول المطلوبة', 'warning');
            return;
        }

        if (userId) {
            // Update existing user
            const userIndex = this.users.findIndex(u => u.id === parseInt(userId));
            if (userIndex !== -1) {
                this.users[userIndex] = { ...this.users[userIndex], ...userData };
                this.showToast('تم تحديث المستخدم بنجاح', 'success');
            }
        } else {
            // Add new user
            const newUser = {
                id: Date.now(), // Simple ID generation
                ...userData
            };
            this.users.push(newUser);
            console.log('New user added:', newUser);
            console.log('Total users:', this.users.length);
            this.showToast('تم إضافة المستخدم بنجاح', 'success');
        }

        this.closeModal('userModal');
        this.loadUsersTable();
        this.updateStatistics();
    }

    deleteUser(userId) {
        if (confirm('هل أنت متأكد من حذف هذا المستخدم؟')) {
            this.users = this.users.filter(u => u.id !== userId);
            this.loadUsersTable();
            this.updateStatistics();
            this.showToast('تم حذف المستخدم بنجاح', 'success');
        }
    }

    editUser(userId) {
        this.openUserModal(userId);
    }

    viewUser(userId) {
        const user = this.users.find(u => u.id === userId);
        if (user) {
            const modal = document.createElement('div');
            modal.className = 'modal show';
            modal.innerHTML = `
                <div class="modal-content user-view-modal">
                    <div class="modal-header">
                        <h2>تفاصيل المستخدم</h2>
                        <span class="close" onclick="this.closest('.modal').remove()">&times;</span>
                    </div>
                    <div class="modal-body">
                        <div class="user-profile-view">
                            <div class="profile-avatar">
                                <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=${user.username}&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf" 
                                     alt="${user.name}" class="profile-img">
                            </div>
                            <div class="profile-info">
                                <h3>${user.name}</h3>
                                <p class="username">@${user.username}</p>
                                <div class="profile-badges">
                                    <span class="badge badge-success">نشط</span>
                                    <span class="badge badge-info">مستخدم</span>
                                </div>
                            </div>
                        </div>
                        <div class="profile-details">
                            <div class="detail-section">
                                <h4><i class="fas fa-info-circle"></i> المعلومات الشخصية</h4>
                                <div class="detail-grid">
                                    <div class="detail-item">
                                        <i class="fas fa-envelope"></i>
                                        <span>البريد الإلكتروني</span>
                                        <strong>${user.email}</strong>
                                    </div>
                                    <div class="detail-item">
                                        <i class="fas fa-phone"></i>
                                        <span>الهاتف</span>
                                        <strong>${user.phone || 'غير محدد'}</strong>
                                    </div>
                                    <div class="detail-item">
                                        <i class="fas fa-globe"></i>
                                        <span>الموقع</span>
                                        <strong>${user.website || 'غير محدد'}</strong>
                                    </div>
                                </div>
                            </div>
                            <div class="detail-section">
                                <h4><i class="fas fa-map-marker-alt"></i> العنوان</h4>
                                <div class="detail-grid">
                                    <div class="detail-item">
                                        <i class="fas fa-city"></i>
                                        <span>المدينة</span>
                                        <strong>${user.address?.city || 'غير محدد'}</strong>
                                    </div>
                                    <div class="detail-item">
                                        <i class="fas fa-road"></i>
                                        <span>الشارع</span>
                                        <strong>${user.address?.street || 'غير محدد'}</strong>
                                    </div>
                                    <div class="detail-item">
                                        <i class="fas fa-home"></i>
                                        <span>المنزل</span>
                                        <strong>${user.address?.suite || 'غير محدد'}</strong>
                                    </div>
                                </div>
                            </div>
                            <div class="detail-section">
                                <h4><i class="fas fa-building"></i> الشركة</h4>
                                <div class="detail-grid">
                                    <div class="detail-item">
                                        <i class="fas fa-briefcase"></i>
                                        <span>اسم الشركة</span>
                                        <strong>${user.company?.name || 'غير محدد'}</strong>
                                    </div>
                                    <div class="detail-item">
                                        <i class="fas fa-quote-left"></i>
                                        <span>الشعار</span>
                                        <strong>${user.company?.catchPhrase || 'غير محدد'}</strong>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            document.body.appendChild(modal);
        }
    }

    renderPosts() {
        const container = document.getElementById('postsGrid');
        container.innerHTML = '';

        // Initialize filtered posts if not set
        if (!this.filteredPosts || this.filteredPosts.length === 0) {
            this.filteredPosts = this.posts;
        }

        // Calculate pagination
        const startIndex = (this.currentPostsPage - 1) * this.postsPerPage;
        const endIndex = startIndex + this.postsPerPage;
        const postsToShow = this.filteredPosts.slice(startIndex, endIndex);

        postsToShow.forEach(post => {
            const isFavorite = this.favorites.includes(`post-${post.id}`);
            const postCard = document.createElement('div');
            postCard.className = 'post-card animate__animated animate__fadeInUp';
            postCard.innerHTML = `
                <div class="post-header">
                    <h3 class="post-title">${post.title}</h3>
                    <button class="favorite-btn ${isFavorite ? 'active' : ''}" 
                            onclick="app.toggleFavorite('post-${post.id}', 'post')">
                        <i class="fas fa-heart"></i>
                    </button>
                </div>
                <p class="post-body">${post.body}</p>
                <div class="post-actions">
                    <button class="btn btn-sm btn-info" onclick="app.showComments(${post.id})">
                        <i class="fas fa-comments"></i> التعليقات
                    </button>
                    <button class="btn btn-sm btn-warning" onclick="app.editPost(${post.id})">
                        <i class="fas fa-edit"></i> تعديل
                    </button>
                    <button class="btn btn-sm btn-danger" onclick="app.deletePost(${post.id})">
                        <i class="fas fa-trash"></i> حذف
                    </button>
                </div>
            `;
            container.appendChild(postCard);
        });

        // Update pagination
        this.updatePostsPagination();
    }

    searchPosts(query) {
        const filteredPosts = this.posts.filter(post => 
            post.title.toLowerCase().includes(query.toLowerCase()) ||
            post.body.toLowerCase().includes(query.toLowerCase())
        );

        const container = document.getElementById('postsGrid');
        container.innerHTML = '';

        filteredPosts.forEach(post => {
            const isFavorite = this.favorites.includes(`post-${post.id}`);
            const postCard = document.createElement('div');
            postCard.className = 'post-card animate__animated animate__fadeInUp';
            postCard.innerHTML = `
                <div class="post-header">
                    <h3 class="post-title">${post.title}</h3>
                    <button class="favorite-btn ${isFavorite ? 'active' : ''}" 
                            onclick="app.toggleFavorite('post-${post.id}', 'post')">
                        <i class="fas fa-heart"></i>
                    </button>
                </div>
                <p class="post-body">${post.body}</p>
                <div class="post-actions">
                    <button class="btn btn-sm btn-info" onclick="app.showComments(${post.id})">
                        <i class="fas fa-comments"></i> التعليقات
                    </button>
                    <button class="btn btn-sm btn-warning" onclick="app.editPost(${post.id})">
                        <i class="fas fa-edit"></i> تعديل
                    </button>
                    <button class="btn btn-sm btn-danger" onclick="app.deletePost(${post.id})">
                        <i class="fas fa-trash"></i> حذف
                    </button>
                </div>
            `;
            container.appendChild(postCard);
        });
    }

    openPostModal(postId = null) {
        const modal = document.getElementById('postModal');
        const title = document.getElementById('postModalTitle');
        const form = document.getElementById('postForm');
        
        if (postId) {
            const post = this.posts.find(p => p.id === postId);
            if (post) {
                title.textContent = 'تعديل المنشور';
                document.getElementById('postId').value = post.id;
                document.getElementById('postTitle').value = post.title;
                document.getElementById('postBody').value = post.body;
            }
        } else {
            title.textContent = 'إضافة منشور';
            form.reset();
        }
        
        this.showModal('postModal');
    }

    savePost() {
        const form = document.getElementById('postForm');
        const postId = document.getElementById('postId').value;
        
        const postData = {
            title: document.getElementById('postTitle').value,
            body: document.getElementById('postBody').value
        };

        if (!postData.title || !postData.body) {
            this.showToast('يرجى ملء جميع الحقول المطلوبة', 'warning');
            return;
        }

        if (postId) {
            // Update existing post
            const postIndex = this.posts.findIndex(p => p.id === parseInt(postId));
            if (postIndex !== -1) {
                this.posts[postIndex] = { ...this.posts[postIndex], ...postData };
                this.showToast('تم تحديث المنشور بنجاح', 'success');
            }
        } else {
            // Add new post
            const newPost = {
                id: Date.now(),
                userId: 1,
                ...postData
            };
            this.posts.push(newPost);
            this.localPosts.push(newPost);
            localStorage.setItem('localPosts', JSON.stringify(this.localPosts));
            this.showToast('تم إضافة المنشور بنجاح', 'success');
        }

        this.closeModal('postModal');
        this.renderPosts();
        this.updateStatistics();
    }

    deletePost(postId) {
        if (confirm('هل أنت متأكد من حذف هذا المنشور؟')) {
            this.posts = this.posts.filter(p => p.id !== postId);
            this.localPosts = this.localPosts.filter(p => p.id !== postId);
            localStorage.setItem('localPosts', JSON.stringify(this.localPosts));
            this.renderPosts();
            this.updateStatistics();
            this.showToast('تم حذف المنشور بنجاح', 'success');
        }
    }

    editPost(postId) {
        this.openPostModal(postId);
    }

    async showComments(postId) {
        const modal = document.getElementById('commentsModal');
        const commentsList = document.getElementById('commentsList');
        
        // Show loading
        commentsList.innerHTML = '<div class="text-center"><i class="fas fa-spinner fa-spin"></i> جاري تحميل التعليقات...</div>';
        this.showModal('commentsModal');

        try {
            // Filter comments for this post
            const postComments = this.comments.filter(comment => comment.postId === postId);
            
            if (postComments.length === 0) {
                commentsList.innerHTML = '<div class="text-center text-muted">لا توجد تعليقات لهذا المنشور</div>';
            } else {
                commentsList.innerHTML = postComments.map(comment => `
                    <div class="comment-item animate__animated animate__fadeInUp">
                        <div class="comment-header">
                            <span class="comment-author">${comment.name}</span>
                            <span class="comment-email">${comment.email}</span>
                        </div>
                        <div class="comment-body">${comment.body}</div>
                    </div>
                `).join('');
            }
        } catch (error) {
            commentsList.innerHTML = '<div class="text-center text-danger">خطأ في تحميل التعليقات</div>';
        }
    }

    toggleFavorite(itemId, type) {
        // Convert to string for consistent comparison
        const itemIdStr = itemId.toString();
        const index = this.favorites.indexOf(itemIdStr);
        
        console.log('Toggle favorite:', itemIdStr, 'Type:', type, 'Current favorites:', this.favorites);
        
        if (index > -1) {
            this.favorites.splice(index, 1);
            this.showToast('تم إزالة العنصر من المفضلة', 'info');
        } else {
            this.favorites.push(itemIdStr);
            this.showToast('تم إضافة العنصر للمفضلة', 'success');
        }
        
        localStorage.setItem('favorites', JSON.stringify(this.favorites));
        this.updateFavoritesCount();
        
        // Update UI
        if (type === 'user') {
            this.loadUsersTable();
        } else if (type === 'post') {
            this.renderPosts();
        }
        
        // Force reload favorites page if it's currently visible
        if (document.getElementById('favorites').style.display !== 'none') {
            this.loadFavoritesPage();
        }
    }

    updateFavoritesCount() {
        document.getElementById('favoritesCount').textContent = this.favorites.length;
    }

    handleActivityClick(action, data) {
        switch (action) {
            case 'view':
                if (data) {
                    // Find if it's a user or post
                    const user = this.users.find(u => u.id === data);
                    const post = this.posts.find(p => p.id === data);
                    
                    if (user) {
                        this.showPage('users');
                        this.showToast(`عرض تفاصيل المستخدم: ${user.name}`, 'info');
                    } else if (post) {
                        this.showPage('posts');
                        this.showToast(`عرض المنشور: ${post.title}`, 'info');
                    }
                }
                break;
            case 'favorites':
                this.showToast(`لديك ${this.favorites.length} عنصر في المفضلة`, 'info');
                break;
            case 'status':
                this.showToast('حالة النظام: ممتازة', 'success');
                break;
        }
    }

    showCommentsStats() {
        this.showToast(`إجمالي التعليقات: ${this.comments.length}`, 'info');
        // يمكن إضافة صفحة مخصصة للتعليقات هنا
    }

    showFavorites() {
        this.showPage('favorites');
        // Force load favorites immediately
        this.loadFavoritesPage();
    }

    loadFavoritesPage() {
        console.log('Loading favorites page...', this.favorites);
        this.updateFavoritesBadge();
        this.loadFavoriteUsers();
        this.loadFavoritePosts();
    }

    updateFavoritesBadge() {
        document.getElementById('favoritesBadge').textContent = `${this.favorites.length} عنصر`;
    }

    loadFavoriteUsers() {
        const container = document.getElementById('favoritesUsersGrid');
        if (!container) {
            console.log('Favorites users container not found');
            return;
        }

        console.log('Loading favorite users...', this.favorites, this.users);
        
        const favoriteUsers = this.users.filter(user => 
            this.favorites.includes(user.id.toString())
        );

        console.log('Favorite users found:', favoriteUsers);

        if (favoriteUsers.length === 0) {
            container.innerHTML = `
                <div class="empty-favorites">
                    <i class="fas fa-heart-broken"></i>
                    <h3>لا توجد مستخدمين مفضلين</h3>
                    <p>اضغط على أيقونة القلب في صفحة المستخدمين لإضافة مستخدم للمفضلة</p>
                </div>
            `;
        } else {
            container.innerHTML = favoriteUsers.map(user => `
                <div class="favorite-item animate__animated animate__fadeInUp">
                    <div class="favorite-item-header">
                        <div class="user-avatar">
                            <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=${user.username}&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf" 
                                 alt="${user.name}" class="avatar-img">
                        </div>
                        <div class="user-info">
                            <h3 class="favorite-item-title">${user.name}</h3>
                            <p class="favorite-item-subtitle">@${user.username}</p>
                            <div class="user-badges">
                                <span class="badge badge-success">نشط</span>
                                <span class="badge badge-info">مستخدم</span>
                            </div>
                        </div>
                        <button class="favorite-remove-btn" onclick="app.removeFromFavorites('${user.id}', 'user')">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                    <div class="favorite-item-content">
                        <div class="info-row">
                            <i class="fas fa-envelope"></i>
                            <span>${user.email}</span>
                        </div>
                        <div class="info-row">
                            <i class="fas fa-phone"></i>
                            <span>${user.phone || 'غير محدد'}</span>
                        </div>
                        <div class="info-row">
                            <i class="fas fa-globe"></i>
                            <span>${user.website || 'غير محدد'}</span>
                        </div>
                        <div class="info-row">
                            <i class="fas fa-map-marker-alt"></i>
                            <span>${user.address?.city || 'غير محدد'}</span>
                        </div>
                        <div class="info-row">
                            <i class="fas fa-building"></i>
                            <span>${user.company?.name || 'غير محدد'}</span>
                        </div>
                    </div>
                    <div class="favorite-item-meta">
                        <span><i class="fas fa-id-badge"></i> المعرف: ${user.id}</span>
                        <span><i class="fas fa-clock"></i> مضاف للمفضلة</span>
                    </div>
                </div>
            `).join('');
        }
    }

    loadFavoritePosts() {
        const container = document.getElementById('favoritesPostsGrid');
        if (!container) {
            console.log('Favorites posts container not found');
            return;
        }

        console.log('Loading favorite posts...', this.favorites, this.posts);
        
        const favoritePosts = this.posts.filter(post => 
            this.favorites.includes(`post-${post.id}`)
        );

        console.log('Favorite posts found:', favoritePosts);

        if (favoritePosts.length === 0) {
            container.innerHTML = `
                <div class="empty-favorites">
                    <i class="fas fa-heart-broken"></i>
                    <h3>لا توجد منشورات مفضلة</h3>
                    <p>اضغط على أيقونة القلب في صفحة المنشورات لإضافة منشور للمفضلة</p>
                </div>
            `;
        } else {
            container.innerHTML = favoritePosts.map(post => `
                <div class="favorite-item animate__animated animate__fadeInUp">
                    <div class="favorite-item-header">
                        <div>
                            <h3 class="favorite-item-title">${post.title}</h3>
                            <p class="favorite-item-subtitle">منشور #${post.id}</p>
                        </div>
                        <button class="favorite-remove-btn" onclick="app.removeFromFavorites('post-${post.id}', 'post')">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                    <div class="favorite-item-content">
                        <p>${post.body}</p>
                    </div>
                    <div class="favorite-item-meta">
                        <span>المعرف: ${post.id}</span>
                        <span>مضاف للمفضلة</span>
                    </div>
                </div>
            `).join('');
        }
    }

    removeFromFavorites(itemId, type) {
        const index = this.favorites.indexOf(itemId);
        if (index > -1) {
            this.favorites.splice(index, 1);
            localStorage.setItem('favorites', JSON.stringify(this.favorites));
            this.updateFavoritesCount();
            this.updateFavoritesBadge();
            
            if (type === 'user') {
                this.loadFavoriteUsers();
            } else if (type === 'post') {
                this.loadFavoritePosts();
            }
            
            this.showToast('تم إزالة العنصر من المفضلة', 'info');
        }
    }

    switchFavoritesTab(tab) {
        // Remove active class from all tabs
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        
        // Add active class to clicked tab
        document.querySelector(`[data-tab="${tab}"]`).classList.add('active');
        
        // Hide all tab contents
        document.querySelectorAll('.favorites-tab-content').forEach(content => {
            content.classList.remove('active');
        });
        
        // Show selected tab content
        document.getElementById(`favorites${tab.charAt(0).toUpperCase() + tab.slice(1)}`).classList.add('active');
    }

    // Initialize pagination variables
    initPagination() {
        this.currentPostsPage = 1;
        this.postsPerPage = 12;
        this.filteredPosts = [];
    }

    exportUsers() {
        const csvContent = this.users.map(user => 
            `${user.id},${user.name},${user.username},${user.email},${user.phone || ''},${user.address?.city || ''}`
        ).join('\n');
        
        const blob = new Blob([`المعرف,الاسم,اسم المستخدم,البريد,الهاتف,المدينة\n${csvContent}`], 
                             { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'users.csv';
        link.click();
        
        this.showToast('تم تصدير البيانات بنجاح', 'success');
    }

    filterPosts(filter) {
        switch(filter) {
            case 'recent':
                this.filteredPosts = this.posts.slice(0, 20);
                break;
            case 'favorites':
                this.filteredPosts = this.posts.filter(post => 
                    this.favorites.includes(`post-${post.id}`)
                );
                break;
            case 'all':
            default:
                this.filteredPosts = this.posts;
                break;
        }
        this.currentPostsPage = 1;
        this.renderPosts();
    }

    previousPostsPage() {
        if (this.currentPostsPage > 1) {
            this.currentPostsPage--;
            this.renderPosts();
        }
    }

    nextPostsPage() {
        const totalPages = Math.ceil(this.filteredPosts.length / this.postsPerPage);
        if (this.currentPostsPage < totalPages) {
            this.currentPostsPage++;
            this.renderPosts();
        }
    }

    updatePostsPagination() {
        const totalPosts = this.filteredPosts.length;
        const totalPages = Math.ceil(totalPosts / this.postsPerPage);
        const startItem = (this.currentPostsPage - 1) * this.postsPerPage + 1;
        const endItem = Math.min(this.currentPostsPage * this.postsPerPage, totalPosts);

        // Update info
        document.getElementById('postsInfo').textContent = 
            `عرض ${startItem} إلى ${endItem} من ${totalPosts} منشور`;

        // Update buttons
        document.getElementById('prevPostsBtn').disabled = this.currentPostsPage === 1;
        document.getElementById('nextPostsBtn').disabled = this.currentPostsPage === totalPages;

        // Generate page numbers
        const pagesContainer = document.getElementById('postsPages');
        pagesContainer.innerHTML = '';

        for (let i = 1; i <= Math.min(totalPages, 5); i++) {
            const pageBtn = document.createElement('button');
            pageBtn.className = `page-btn ${i === this.currentPostsPage ? 'active' : ''}`;
            pageBtn.textContent = i;
            pageBtn.onclick = () => {
                this.currentPostsPage = i;
                this.renderPosts();
            };
            pagesContainer.appendChild(pageBtn);
        }
    }

    toggleTheme() {
        this.currentTheme = this.currentTheme === 'light' ? 'dark' : 'light';
        this.applyTheme();
        localStorage.setItem('theme', this.currentTheme);
    }

    applyTheme() {
        document.documentElement.setAttribute('data-theme', this.currentTheme);
        const themeIcon = document.querySelector('#themeToggle i');
        themeIcon.className = this.currentTheme === 'light' ? 'fas fa-moon' : 'fas fa-sun';
    }

    showModal(modalId) {
        const modal = document.getElementById(modalId);
        modal.classList.add('show');
        document.body.style.overflow = 'hidden';
    }

    closeModal(modalId) {
        const modal = document.getElementById(modalId);
        modal.classList.remove('show');
        document.body.style.overflow = 'auto';
    }

    showLoader() {
        document.getElementById('loader').classList.remove('hidden');
    }

    hideLoader() {
        setTimeout(() => {
            document.getElementById('loader').classList.add('hidden');
        }, 1000);
    }

    showToast(message, type = 'info') {
        if (typeof toastr !== 'undefined') {
            const options = {
                closeButton: true,
                progressBar: true,
                positionClass: 'toast-top-right',
                timeOut: 3000,
                extendedTimeOut: 1000
            };

            switch (type) {
                case 'success':
                    toastr.success(message, 'نجح', options);
                    break;
                case 'error':
                    toastr.error(message, 'خطأ', options);
                    break;
                case 'warning':
                    toastr.warning(message, 'تحذير', options);
                    break;
                case 'info':
                default:
                    toastr.info(message, 'معلومات', options);
                    break;
            }
        } else {
            // Fallback to alert if toastr is not available
            alert(message);
        }
    }

    // Navigation functions for different pages
    previousUsersPage() {
        // Implementation for users pagination
        this.showToast('صفحة المستخدمين السابقة', 'info');
    }

    nextUsersPage() {
        // Implementation for users pagination
        this.showToast('صفحة المستخدمين التالية', 'info');
    }

    previousFavoritesPage() {
        // Implementation for favorites pagination
        this.showToast('صفحة المفضلة السابقة', 'info');
    }

    nextFavoritesPage() {
        // Implementation for favorites pagination
        this.showToast('صفحة المفضلة التالية', 'info');
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.app = new DashboardApp();
});

// Add some utility functions for global access
window.DashboardUtils = {
    formatDate: (date) => {
        return new Date(date).toLocaleDateString('ar-SA');
    },
    
    formatNumber: (num) => {
        return new Intl.NumberFormat('ar-SA').format(num);
    },
    
    truncateText: (text, maxLength = 100) => {
        return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
    }
};
