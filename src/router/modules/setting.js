import Layout from '@/layout'

export default {
    path: '/setting',
    component: Layout,
    name: 'settings',
    children: [{
            path: '',
            name: 'settings',
            component: () =>
                import ('@/views/setting'),
            meta: {
                title: '公司设置',
                icon: "setting"
            }
        }

    ]

}