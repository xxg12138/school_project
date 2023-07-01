<template>
  <div>
    <el-upload
    list-type="picture-card"
    :on-preview="handlePictureCardPreview"
    :on-remove="handleRemove"
    :on-change="handlchange"
    :before-upload="beforeUpload"
    :http-request="upload"
    :file-list="fileList"
    :class="{disabled: fileComputed }"
    action="#"
    :limit="1"
  >
  <i class="el-icon-plus" ></i>
</el-upload>
<el-progress v-if="showPercent" :percentage="percent" style="width: 180px;"></el-progress>
<el-dialog :visible.sync="showDialog" title="图片预览">
    <img :src="imgUrl" alt="" style="width: 100%;">
</el-dialog>
  </div>
</template>

<script>
import COS from 'cos-js-sdk-v5'
const Cos=new COS({
    SecretId: 'AKIDYyEJBJCqLfkaCAwU5d3IZgIiuuhIuW8l',
    SecretKey: 'fM5qCaorkjcM0YwCKJAtUr1ynXdmmYCl'
})
export default {
    data(){
        return {
            imgUrl:'',
            showDialog:false,
            fileList:[],
            currentFileUid: null,
            percent: 0,
            showPercent: false // 默认不显示进度条
        }
    },
    computed: {
        fileComputed() {
            return this.fileList.length===1
        }
    },
    methods: {
        handlePictureCardPreview(file){
            this.showDialog=true
            this.imgUrl=file.url
        },
        handleRemove(file, fileList){
        //    this.fileList=this.fileList.filter(item=>item.uid!==file.uid)
        this.fileList=fileList

        
        },
        handlchange(file, fileList){
            this.fileList = fileList.map(item => item)
        //    this.fileList.push({url:file.url})
        },
        beforeUpload(file){
            const types = ['image/jpeg', 'image/gif', 'image/bmp', 'image/png']
            if(!types.some(item=>item==file.type)){
                this.$message.error('上传图片只能是 JPG、GIF、BMP、PNG 格式!')
                return false
            }
            const maxSize=5*1024*1024
            if(file.size>maxSize){
                this.$message.error('上传图片不能大于5M!')
                return false
            }
            this.showPercent=true
            this.currentFileUid=file.uid
            return true
        },
        upload(params){
            console.log(params);
            if(params.file){
                Cos.putObject({
                    Bucket: 'hrsaas-1313373043', /* 填入您自己的存储桶，必须字段 */
                    Region: 'ap-guangzhou',  /* 存储桶所在地域，例如ap-beijing，必须字段 */
                    Key: params.file.name,  /* 存储在桶里的对象键（例如1.jpg，a/b/test.txt），必须字段 */
                    Body: params.file, /* 必须，上传文件对象，可以是input[type="file"]标签选择本地文件后得到的file对象 */
                    StorageClass:'STANDARD',
                    onProgress: (progressData)=>{
                        this.percent=progressData.percent*100
    }
                }, (err, data)=>{
                    console.log(err || data)
                    if(!err&&data.statusCode===200){
                      this.fileList = this.fileList.map(item=>{
                            if(item.uid===this.currentFileUid){
                                return {url:'http://'+data.Location,upload:true}
                            }
                            return item
                        })
                        setTimeout(()=>{
                            this.showPercent=false
                            this.percent=0
                        },1000)
                    }
                });
               
            }
        }
    }
}
</script>


<style>
.disabled .el-upload--picture-card {
  display: none
}
</style>