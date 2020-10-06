<template>
    <div class="white-box">
        <div v-if="is_manager">
        <a-modal v-model="edit_window_visibility" :title="edit_window_title">
            <template slot="footer">
                <a-button key="back" @click="onEditWindowCancelButtonClicked"> 取消 </a-button>
                <a-button key="submit" :loading="edit_window_saving" type="primary" @click="onEditWindowSaveButtonClicked"> 保存 </a-button>
            </template>

            <a-form-model ref="edit_form" :model="edit_window_form" :label-col="{span:4}" :wrapper-col="{span:14}">
                <a-form-model-item label="姓名" prop="name">
                    <a-input v-model="edit_window_form.name" />
                </a-form-model-item>
                <a-form-model-item label="性别" prop="gender">
                    <a-radio-group v-model="edit_window_form.gender">
                        <a-radio value="男">
                            男
                        </a-radio>
                        <a-radio value="女">
                            女
                        </a-radio>
                    </a-radio-group>
                </a-form-model-item>
                <a-form-model-item label="联系电话" prop="phone">
                    <a-input v-model="edit_window_form.phone" />
                </a-form-model-item>
                <a-form-model-item label="出生年月" prop="birthday">
                    <a-month-picker :locale="locale" v-model="edit_window_form.birthday" placeholder="请选择出生年月" /> 
                </a-form-model-item>
                <a-form-model-item label="住址" prop="address">
                    <a-input v-model="edit_window_form.address" />
                </a-form-model-item>
            </a-form-model>
        </a-modal>

        <div id="title"> 管理员工 </div>
        <a-table :columns="columns" :data-source="data_source" :loading="!has_data_loaded" :scroll="{x:true}">
            <span slot="action" slot-scope="record">
                <a href="javascript:;" @click="onActionClicked('edit', record)"> 编辑 </a>
                <a-divider type="vertical" />

                <a-popconfirm
                    title="你确定要将本员工移除出本部门？"
                    ok-text="确认"
                    cancel-text="取消"
                    @confirm="onActionClicked('delete', record)"
                >
                <a href="javascript:;"> 删除 </a>
                </a-popconfirm>
            </span>
        </a-table>

        <a-button style="margin-top: 15px;"> 添加新员工 </a-button>
        </div>

        <div v-if="!is_manager">
            <a-empty :description="error_msg" />
        </div>
    </div>
</template>

<script>
import util from '../../util'
import locale from 'ant-design-vue/es/date-picker/locale/zh_CN';

export default {
    name: "EmployeeManagementSubpageSubpage",
    data: function(){
        return {
            locale,
            columns: [
                {
                    dataIndex: 'name',
                    key: 'name',
                    title: '姓名',
                },
                {
                    dataIndex: 'staff_id',
                    key: 'staff_id',
                    title: '员工号',
                },
                {
                    dataIndex: 'birthday',
                    key: 'birthday',
                    title: '出生年月',
                },
                {
                    dataIndex: 'age',
                    key: 'age',
                    title: '年龄',
                },
                {
                    dataIndex: 'gender',
                    key: 'gender',
                    title: '性别',
                },
                {
                    dataIndex: 'phone',
                    key: 'phone',
                    title: '联系电话',
                },
                {
                    dataIndex: 'address',
                    key: 'address',
                    title: '住址',
                },
                {
                    dataIndex: 'dept_name',
                    key: 'dept_name',
                    title: '所在部门',
                },
                {
                    dataIndex: 'position',
                    key: 'position',
                    title: '职务',
                },
                {
                    key: 'action',
                    title: '操作',
                    scopedSlots: { customRender: 'action' }
                }
            ],
            data_source: [
                {
                    key: '1',
                    staff_id: "2333",
                    name: "杰克",
                    birthday: "2009-06",
                    age:"18",
                    gender: "男",
                    phone: "13812345678",
                    address: "北纬一路32号",
                    dept_name: "收费部",
                    position: "部门经理"
                }
            ],
            has_data_loaded: false,
            is_manager: false,
            error_msg: "加载中...",
            edit_window_visibility: false,
            edit_window_title: "编辑员工[]信息",
            edit_window_form: {
                name: "",
                gender: "",
                phone: "",
                birthday: "",
                address: "",
            },
            edit_window_saving: false,
            add_window_visibility: false,
        }
    },
    created: function() {
        this.loadStaffList()
    },
    methods: {
        onActionClicked(action, record){
            // console.log(action + ": ")
            // console.log(record)
            if(action === 'edit')
            {
                this.edit_window_title = "编辑员工[" + record.staff_id + "]的信息"
                this.edit_window_form.staff_id = record.staff_id
                this.edit_window_form.name = record.name
                this.edit_window_form.gender = record.gender
                this.edit_window_form.phone = record.phone
                this.edit_window_form.birthday = record.birthday
                this.edit_window_form.address = record.address
                this.edit_window_visibility = true
            }
        },
        onEditWindowCancelButtonClicked(){
            this.edit_window_visibility = false
        },
        onEditWindowSaveButtonClicked(){
            // 保存逻辑
            // 设置正在保存的状态
            // 等待500毫秒
            // 调用保存api (POST)
            // 等待结果
            // 若成功则关闭窗口，并弹出保存成功提示，并重新加载列表
            // 若失败则提示失败，然后不再进行操作
            var that = this
            that.edit_window_saving = true
            var token = util.getCookie("token")
            setTimeout(function(){
                let body_data = {...that.edit_window_form}
                body_data.birthday = util.dateToString(new Date(body_data.birthday))
                // console.log(body_data)
                fetch(
                    "/api/change_staff_info?token="+token,
                    {
                        method: "POST",
                        body: JSON.stringify(body_data),
                        headers: new Headers({
                            'content-type': 'application/json;charset=utf-8'
                        })
                    }
                ).then(function(res){res.json().then(function(res){
                    if(res.code === 0)
                    {
                        util.message.success("保存成功!")
                        that.edit_window_saving = false
                        that.edit_window_visibility = false

                        that.refreshStaffList()
                    }else if(res.code === -1)
                    {
                        util.logoutAndJumpToLoginPage()
                    }else if(res.code === -2)
                    {
                        util.message.error(res.msg)
                        that.edit_window_saving = false
                    }else{
                        util.message.error(res.msg)
                        that.edit_window_saving = false
                    }
                })}).catch(function(error){
                    that.edit_window_saving = false
                    util.message.error(error.message)
                })
            }, 500)
            
        },
        refreshStaffList(){
            var that = this
            that.has_data_loaded = false
            that.data_source = []
            setTimeout(function(){
                that.loadStaffList()
            }, 500)
        },
        loadStaffList(){
            // 首先判断是否已经登陆，若未登陆则等待3秒
            // 若已登陆则无需等待
            // 随后再次检测是否登陆
            // 若已登陆，则向服务器获取所有员工信息
            var that = this
            that.has_data_loaded = false
            setTimeout(function(){
                if(!that.$store.state.login)
                {
                    that.is_manager = false
                    that.error_msg = "您还没有登陆！"
                    return
                }
                
                var token = util.getCookie("token")
                // 现获取当前部门的名字
                fetch("/api/get_dept_name?token="+token).then(function(res){res.json().then(function(res){
                    if(res.code === 0)
                    {  
                        var dept_name = res.data.dept_name

                        fetch("/api/get_dept_staffs?token="+token).then(function(res){res.json().then(function(res){
                            if(res.code === 0)
                            {
                                that.is_manager = true
                                that.data_source = []
                                for(let i=0; i<res.data.staffs.length; ++i)
                                {
                                    that.data_source.push({
                                        key: "" + i,
                                        ...res.data.staffs[i],
                                        dept_name,
                                        age: util.calcAgeFromBirth(res.data.staffs[i].birthday)
                                    })
                                }

                                that.has_data_loaded = true
                            }else if(res.code === -1)
                            {
                                util.logoutAndJumpToLoginPage(that)
                            }else if(res.code === -2)
                            {
                                that.is_manager = false
                                that.error_msg = res.msg
                            }
                        })})
                    }else if(res.code === -1){
                        util.logoutAndJumpToLoginPage(that)
                    }
                })})
            }, that.$store.state.login ? 0 : 3000)
        }
    }
}
</script>

<style scoped>
#title {
  font-size: 24px;
  text-align: center;
  margin-bottom: 10px;
}
.ant-table{
    white-space: nowrap;
}
</style>