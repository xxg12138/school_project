import Layout from '@/layout'

export default {
    path: '/permission',
    component: Layout,
    name: 'permissions',
    children: [{
            path: '',
            name: 'permissions',
            component: () =>
                import ('@/views/permission'),
            meta: {
                title: '权限管理',
                icon: 'lock'
            }
        }

    ]

}