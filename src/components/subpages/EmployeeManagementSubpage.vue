<template>
    <div class="white-box">
        <div v-if="is_manager">
        <div id="title"> 管理员工 </div>
        <a-table :columns="columns" :data-source="data_source" :loading="!has_data_loaded" :scroll="{x:true}">
            <span slot="action" slot-scope="record">
                <a href="javascript:;" @click="onActionClicked('edit', record)"> 编辑 </a>
                <a-divider type="vertical" />
                <a href="javascript:;" @click="onActionClicked('delete', record)"> 删除 </a>
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
export default {
    name: "EmployeeManagementSubpageSubpage",
    data: function(){
        return {
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
            error_msg: "无权"
        }
    },
    created: function() {
        // 首先判断是否已经登陆，若未登陆则等待3秒
        // 若已登陆则无需等待
        // 随后再次检测是否登陆
        // 若已登陆，则向服务器获取所有员工信息

        // let temp = this.data_source[0]
        // for(let i=0;i<50;++i)
        // {
        //     let d = {
        //         ...temp
        //     }
        //     d.key = '' + (parseInt(d.key) + i + 1)
        //     d.name = d.name + '(' + d.key + ')'
        //     this.data_source.push(d)
        // }

        // var that = this
        // setTimeout(function(){that.has_data_loaded = true}, 2000)

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
                                    dept_name
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
    methods: {
        onActionClicked(action, record){
            console.log(action + ": ")
            console.log(record)
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