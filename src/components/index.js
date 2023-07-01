import PageTools from '@/components/PageTools'
import UploadExcel from '@/components/UploadExcel'
import ImageUpload from './ImageUpload'
import ScreenFull from '@/layout/components/ScreenFull'
import ThemePicker from '@/components/ThemePicker'
import TagsView from './TagsView'

export default {
    install(Vue) {
        Vue.component('PageTools', PageTools)
        Vue.component('UploadExcel', UploadExcel)
        Vue.component('ImageUpload', ImageUpload)
        Vue.component('ScreenFull', ScreenFull)
        Vue.component('ThemePicker', ThemePicker)
        Vue.component('TagsView', TagsView)
    }
}