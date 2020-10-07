<template>
    <div class="white-box">
        <div v-if="is_manager">
            <div id="title"> 收费信息查询 </div>

            <a-table
                :columns="charge_info_table_columns"
                :data-source="charge_info_table_data"
                :scroll="{x:true}"
                :loading="!has_charge_info_loaded"
            >
                <a-tooltip slot="owner_id" slot-scope="text, record" @visibleChange='(visible)=>onPromptVisibleChanged(visible, record, "owner_id")'>
                    <template slot="title">
                    <a-icon v-if="!has_prompt_loaded" type="loading" />
                    <span v-if="has_prompt_loaded">{{ prompt_text }}</span>
                    </template>
                    <a>{{ text }}</a>
                </a-tooltip>


                <a-tooltip slot="staff_id" slot-scope="text, record" @visibleChange='(visible)=>onPromptVisibleChanged(visible, record, "staff_id")'>
                    <template slot="title">
                    <a-icon v-if="!has_prompt_loaded" type="loading" />
                    <span v-if="has_prompt_loaded">{{ prompt_text }}</span>
                    </template>
                    <a>{{ text }}</a>
                </a-tooltip>
            </a-table>

            <br>

            <a-collapse v-model="collapse_active_key" :bordered="false">
            <a-collapse-panel key="1" header="过滤搜索面板">
                <a-form-model ref="search_form" :model="search_form">
                    <a-form-model-item label="收费号" prop="charge_id">
                        <a-input v-model="search_form.charge_id" />
                    </a-form-model-item>
                    <a-form-model-item label="房号" prop="house_id">
                        <a-input v-model="search_form.house_id" />
                    </a-form-model-item>
                    <a-form-model-item label="业主号" prop="owner_id">
                        <a-input v-model="search_form.owner_id" />
                    </a-form-model-item>
                    <a-form-model-item label="收费类型" prop="type">
                        <a-input v-model="search_form.type" />
                    </a-form-model-item>
                    <a-form-model-item label="数量" prop="number">
                        <a-input v-model="search_form.number" />
                    </a-form-model-item>
                    <a-form-model-item label="收费日期" prop="date">
                        <a-input v-model="search_form.date" />
                    </a-form-model-item>
                    <a-form-model-item label="金额" prop="charge">
                        <a-input v-model="search_form.charge" />
                    </a-form-model-item>
                    <a-form-model-item label="收费开始日期" prop="charge_ym_start">
                        <a-input v-model="search_form.charge_ym_start" />
                    </a-form-model-item>
                    <a-form-model-item label="收费结束日期" prop="charge_ym_end">
                        <a-input v-model="search_form.charge_ym_end" />
                    </a-form-model-item>
                    <a-form-model-item label="收费员工号" prop="staff_id">
                        <a-input v-model="search_form.staff_id" />
                    </a-form-model-item>
                </a-form-model>
                <a-button @click="onRefreshButtonClicked" :loading="!has_charge_info_loaded" style="margin-top: 15px;" type="primary"><a-icon v-if="has_charge_info_loaded" type="search" /> 过滤 </a-button>
                <a-button @click="onResetButtonClicked" style="margin-top: 15px; margin-left: 15px;"><a-icon type="reload" /> 重置 </a-button>
            </a-collapse-panel>
            </a-collapse>
        </div>

        <div v-if="!is_manager">
            <a-empty :description="error_msg" />
        </div>
    </div>
</template>

<script>
import util from '../../util'
export default {
    name: "ChargeSearchSubpage",
    data: function(){
        return {
            charge_info_table_columns: [
                {
                    title: '收费号',
                    dataIndex: 'charge_id',
                },
                {
                    title: '房号',
                    dataIndex: 'house_id',
                },
                {
                    title: '业主号',
                    dataIndex: 'owner_id',
                    key: 'owner_id',
                    scopedSlots: { customRender: 'owner_id' },
                },
                {
                    title: '收费类型',
                    dataIndex: 'type',
                },
                {
                    title: '数量',
                    dataIndex: 'number',
                },
                {
                    title: '金额',
                    dataIndex: 'charge',
                },
                {
                    title: '收费开始日期',
                    dataIndex: 'charge_ym_start',
                },
                {
                    title: '收费结束日期',
                    dataIndex: 'charge_ym_end',
                },
                {
                    title: '收费日期',
                    dataIndex: 'date',
                },
                {
                    title: '收费员工号',
                    dataIndex: 'staff_id',
                    key: 'staff_id',
                    scopedSlots: { customRender: 'staff_id' },
                },
            ],
            charge_info_table_data: [
                {
                    charge_id: 0,
                    house_id: 'A110',
                    charge: '99.00',
                    owner_id: 0,
                    date: '2020-9-3',
                    staff_id: 'admin',
                    type: '神秘费用',
                    number: 9.03,
                    charge_ym_start: '2020-8',
                    charge_ym_end: '2020-9',
                },
                {
                    charge_id: 0,
                    house_id: 'A110',
                    charge: '99.00',
                    owner_id: 0,
                    date: '2020-9-3',
                    staff_id: 'admin',
                    type: '神秘费用',
                    number: 9.03,
                    charge_ym_start: '2020-8',
                    charge_ym_end: '2020-9',
                },
            ],
            is_manager: false,
            error_msg: '加载中...',
            has_charge_info_loaded: false,
            has_prompt_loaded: false,
            prompt_text: '???',

            search_form: {
                charge_id: '',
                house_id: '',
                owner_id: '',
                type: '',
                number: '',
                charge: '',
                charge_ym_start: '',
                charge_ym_end: '',
                date: '',
                staff_id: '',
            },
            collapse_active_key: [],
        }
    },
    created: function(){
        this.loadChargeInfo()
    },
    methods: {
        loadChargeInfo(){
            var that = this
            that.is_manager = false
            that.has_charge_info_loaded = false
            var token = util.getCookie("token")
            var body_data = {...that.search_form}
            fetch(
                "/api/get_charge_info?token="+token,
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
                    that.charge_info_table_data = res.data.charges
                    // console.log(res.data.charges)
                    that.is_manager = true
                    that.has_charge_info_loaded = true
                    that.collapse_active_key = []
                }else if(res.code === -1)
                {
                    util.logoutAndJumpToLoginPage(that)
                }else if(res.code === -2)
                {
                    that.is_manager = false
                    that.error_msg = res.msg
                }else{
                    util.message.error(res.msg)
                }
            })})
        },
        onPromptVisibleChanged(visible, record, key){
            var that = this
            if(visible)
            {
                that.has_prompt_loaded = false
                // console.log(key)
                // console.log(record)
                var token = util.getCookie("token")
                var url = ""
                if(key === 'owner_id')
                {
                    url = '/api/get_house_owner_name?token='+token+'&house_owner_id='+record[key]
                }else if(key === 'staff_id')
                {
                    url = '/api/get_staff_name?token='+token+'&staff_id='+record[key]
                }
                fetch(url).then(function(res){res.json().then(function(res){
                    that.has_prompt_loaded = true
                    if(res.code === 0)
                    {
                        that.prompt_text = res.data
                    }else if(res.code === -3)
                    {
                        that.prompt_text = res.msg
                    }else that.has_prompt_loaded = false
                })})
            }
        },
        onRefreshButtonClicked(){
            var that = this
            that.has_charge_info_loaded = false
            setTimeout(function(){
                that.loadChargeInfo()
            }, 1000)
        },
        onResetButtonClicked(){
            this.$refs.search_form.resetFields()
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
</style>