import Layout from '@/layout'

export default {
    path: '/employees',
    component: Layout,
    name: 'employees',
    children: [{
            path: '',
            name: 'employees',
            component: () =>
                import ('@/views/employees'),
            meta: {
                title: '员工管理',
                icon: 'people'
            }
        },
        {
            path: 'detail/:id',
            component: () =>
                import ('@/views/employees/detail'),
            hidden: true,
            meta: {
                title: '员工详情' // 标记当前路由规则的中文名称 后续在做左侧菜单时 使用
            }
        },
        {
            path: 'print/:id?',
            component: () =>
                import ('@/views/employees/print'),
            hidden: true,
            meta: {
                title: '员工打印',
                icon: 'people'
            }
        }
    ]

}