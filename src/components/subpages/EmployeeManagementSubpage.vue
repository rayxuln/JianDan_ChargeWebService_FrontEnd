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

        <a-modal v-model="add_window_visibility" title="添加员工">
            <template slot="footer">
                <div style="text-align: left;">
                <a-radio-group v-model="add_window_mode" @change="onAddWindowModeChanged">
                    <a-radio value="new">
                        添加新员工
                    </a-radio>
                    <a-radio value="old">
                        添加现有员工
                    </a-radio>
                </a-radio-group>
                </div>

                <a-button key="back" @click="onAddWindowCancelButtonClicked"> 取消 </a-button>
                <a-button key="submit" :loading="add_window_saving" type="primary" @click="onAddWindowAddButtonClicked"> 添加 </a-button>
            </template>

            <a-form-model ref="add_form" :model="add_window_form" :rules="add_window_rules" :label-col="{span:4}" :wrapper-col="{span:14}">
                <a-form-model-item v-if="add_window_mode==='old'" label="员工" prop="old_staff_id">
                    <a-select v-model="add_window_form.old_staff_id" placeholder="请选择一名员工" @change="onAddWindowStaffSelectChanged">
                        <a-select-option v-for="staff in add_window_old_staffs" :key="staff.staff_id" :value="staff.staff_id">
                            {{ staff.staff_id }} | {{ staff.name }}
                        </a-select-option>
                    </a-select>
                </a-form-model-item>

                <a-form-model-item v-if="add_window_mode==='new'" label="员工号" prop="new_staff_id">
                    <a-input v-model="add_window_form.new_staff_id" />
                </a-form-model-item>
                <a-form-model-item v-if="add_window_mode==='new'" label="密码" prop="pwd">
                    <a-input-password v-model="add_window_form.pwd" />
                </a-form-model-item>
                <a-form-model-item label="姓名" prop="name">
                    <a-input :disabled="add_window_mode==='old'" v-model="add_window_form.name" />
                </a-form-model-item>
                <a-form-model-item label="性别" prop="gender">
                    <a-radio-group v-model="add_window_form.gender">
                        <a-radio :disabled="add_window_mode==='old'" value="男">
                            男
                        </a-radio>
                        <a-radio :disabled="add_window_mode==='old'" value="女">
                            女
                        </a-radio>
                    </a-radio-group>
                </a-form-model-item>
                <a-form-model-item label="联系电话" prop="phone">
                    <a-input :disabled="add_window_mode==='old'" v-model="add_window_form.phone" />
                </a-form-model-item>
                <a-form-model-item label="出生年月" prop="birthday">
                    <a-month-picker :disabled="add_window_mode==='old'" :locale="locale" v-model="add_window_form.birthday" placeholder="请选择出生年月" /> 
                </a-form-model-item>
                <a-form-model-item label="住址" prop="address">
                    <a-input :disabled="add_window_mode==='old'" v-model="add_window_form.address" />
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

        <a-button style="margin-top: 15px;" @click="onAddStaffButtonClicked"> 添加新员工 </a-button>
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
            add_window_mode: 'new',
            add_window_form: {
                name: "",
                gender: "",
                phone: "",
                birthday: "",
                address: "",
                old_staff_id: "",
                new_staff_id: "",
                pwd: ""
            },
            add_window_saving: false,
            add_window_rules: {
                new_staff_id: [
                    {type: 'string', required: true, message: '请填写员工号', trigger: 'blur'},
                    {pattern: /^[a-z0-9]+$/, message: '员工号只能是小写字母和数字的组合!', trigger: 'blur'},
                    {asyncValidator(rule, staff_id, callback){
                        // 检测员工号是否合法
                        var token = util.getCookie("token")
                        fetch("/api/validate_new_staff_id?token="+token+"&staff_id="+staff_id).then(function(res){res.json().then(function(res){
                            if(res.code === 0)
                            {
                                callback()
                            }else{
                                callback(new Error(res.msg))
                            }
                        })})
                    }, trigger: 'blur'}
                ],
                pwd: [
                    {type: 'string', required: true, message: '请填写密码', trigger: 'blur'},
                ],
                old_staff_id: [
                    {required: true, message: '请选择一位员工', trigger: 'change'},
                ],
            },
            add_window_old_staffs: [
                {staff_id:"chaoji113", name:"男武神"},
                {staff_id:"chaoji114", name:"女武神"},
            ]
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
            }else if(action === 'delete')
            {
                // 删除员工逻辑
                // 请求api (POST)
                // 是否成功
                // 成功则刷新列表
                // 失败则抛出提示
                var that = this
                var token = util.getCookie("token")
                let body_data = {staff_id:record.staff_id}
                fetch(
                    "/api/remove_staff?token="+token,
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
                        util.message.success("已将员工["+record.staff_id+"]移出本部门!")
                        that.refreshStaffList()
                    }else if(res.code === -1)
                    {
                        util.logoutAndJumpToLoginPage(that)
                    }else{
                        util.message.error(res.msg)
                    }
                })})
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
                        util.logoutAndJumpToLoginPage(that)
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
        },
        onAddStaffButtonClicked(){
            // 添加员工逻辑
            // 第一步选择现有员工或者创建新员工
            // 现有员工页面，直接从未指定部门的员工的列表中选则一个，添加到本部门
            // 创建新员工页面，填写所有员工信息，包括设定员工号，部门则直接为本部门
            var that = this
            var token = util.getCookie("token")
            //获取所有未指派部门的员工的id和名称
            fetch("/api/get_all_none_dept_staffs?token="+token).then(function(res){res.json().then(function(res){
                if(res.code === 0)
                {
                    that.add_window_old_staffs = [...res.data.staffs]

                    that.add_window_visibility = true
                }else if(res.code === -1)
                {
                    util.logoutAndJumpToLoginPage(that)
                }else{
                    util.message.error(res.msg)
                }
            })})

            // that.add_window_visibility = true
        },
        onAddWindowCancelButtonClicked(){
            this.add_window_visibility = false
        },
        onAddWindowStaffSelectChanged(staff_id){
            // 获取选定的员工的信息
            var that = this
            var token = util.getCookie("token")
            fetch("/api/get_staff_info?token="+token+"&staff_id="+staff_id).then(function(res){res.json().then(function(res){
                if(res.code === 0)
                {
                    that.add_window_form.name = res.data.info.name
                    that.add_window_form.gender = res.data.info.gender
                    that.add_window_form.birthday = res.data.info.birthday
                    that.add_window_form.phone = res.data.info.phone
                    that.add_window_form.address = res.data.info.address
                }else if(res.code === -1)
                {
                    util.logoutAndJumpToLoginPage(that)
                }else{
                    util.message.error(res.msg)
                }
            })})
        },
        onAddWindowAddButtonClicked(){
            var that = this
            this.$refs.add_form.validate(valid => {
                if(valid)
                {
                    // 验证通过
                    that.add_window_saving = true
                    var token = util.getCookie("token")
                    if(that.add_window_mode === 'new')
                    {//添加新员工到本部门
                        let body_data = {...that.add_window_form}
                        body_data.birthday = util.dateToString(new Date(body_data.birthday))
                        fetch(
                            "/api/add_new_staff?token="+token,
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
                                util.message.success("添加成功!")
                                that.add_window_saving = false
                                that.add_window_visibility = false

                                that.$refs.add_form.resetFields()
                                that.refreshStaffList()
                            }else if(res.code === -1)
                            {
                                util.logoutAndJumpToLoginPage(that)
                            }else{
                                util.message.error(res.msg)
                                that.edit_window_saving = false
                            }
                        })}).catch(function(error){
                            that.edit_window_saving = false
                            util.message.error(error.message)
                        })
                    }else if(that.add_window_mode === 'old')
                    {//将指定员工添加到本部门
                        fetch("/api/change_staff_dept?token="+token+"&staff_id="+that.add_window_form.old_staff_id).then(function(res){res.json().then(function(res){
                            if(res.code === 0)
                            {
                                util.message.success("添加成功!")
                                that.add_window_saving = false
                                that.add_window_visibility = false

                                that.$refs.add_form.resetFields()
                                that.refreshStaffList()
                            }else if(res.code === -1)
                            {
                                util.logoutAndJumpToLoginPage(that)
                            }else{
                                util.message.error(res.msg)
                                that.edit_window_saving = false
                            }
                        })}).catch(function(error){
                            that.edit_window_saving = false
                            util.message.error(error.message)
                        })
                    }
                }else{
                    return false
                }
            })
        },
        onAddWindowModeChanged(){
            this.$refs.add_form.resetFields()
        },
    }
}
</script>

<style scoped>
#title {
  font-size: 20px;
  text-align: left;
  margin-bottom: 10px;
}
.ant-table{
    white-space: nowrap;
}
</style>