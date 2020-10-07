<template>
    <div class="white-box">
        <a-modal v-model="charge_result_window_visibility" title="收费单">
            <template slot="footer">
                <a-button key="submit" type="primary" @click="onPrintButtonClicked"> 打印 </a-button>
            </template>

            <div id="print-box" style="width: 100%;height: 100%;">
                <div style="float: left;"> 房号：{{ charge_result_window_data_source.house_id }} </div>
                <div style="float: left;margin-left: 35px;"> 缴纳月份：{{ charge_result_window_data_source.charge_date_interval }} </div>
                <div style="float: right;"> 业主：{{ charge_result_window_data_source.house_owner_name }} </div>

                <a-table :columns="charge_result_window_charges_table_columns" :data-source="charge_result_window_data_source.charges" bordered :pagination='false'>
                </a-table>

                <div style="float: left;"> 收费日期：{{ charge_result_window_data_source.charge_date }} </div>
                <div style="float: right;"> 员工号：{{ charge_result_window_data_source.staff_id }} </div>
            </div>
        </a-modal>

        <div id="title"> 收费 </div>
        <a-form-model ref="charge_form" :model="charge_form" :rules='charge_form_rules' :label-col="{span:4}" :wrapper-col="{span:14}">
            <a-form-model-item label="房号" prop="house_id">
                <a-select v-model="charge_form.house_id" placeholder="请选择房号" :loading="!has_houses_loaded">
                    <a-select-option v-for="house in houses" :key="house.house_id" :value="house.house_id">
                        {{ house.house_id }} | {{ house.house_owner_name }}
                    </a-select-option>
                </a-select>
            </a-form-model-item>

            <a-form-model-item label="收费开始月份" prop="charge_ym_start">
                <a-month-picker :locale="locale" v-model="charge_form.charge_ym_start" placeholder="请选择收费开始月份" /> 
            </a-form-model-item>
            <a-form-model-item label="收费结束月份" prop="charge_ym_end">
                <a-month-picker :locale="locale" v-model="charge_form.charge_ym_end" placeholder="请选择收费结束月份" /> 
            </a-form-model-item>

            <div v-for="(charge, index) in charge_form.multy_charges" :key="index" class="charge-box">
                <div> 序号: {{ index }} </div>

                <a-form-model-item label="收费类型" :prop="'multy_charges.' + index + '.type'" :rules="{
                    required: true,
                    message: '请选择收费类型',
                    trigger: 'change',
                }">
                    <a-select v-model="charge.type" placeholder="请选择收费类型">
                        <a-select-option value="物业费">
                            物业费
                        </a-select-option>
                        <a-select-option value="电梯费">
                            电梯费
                        </a-select-option>
                        <a-select-option value="水费">
                            水费
                        </a-select-option>
                        <a-select-option value="电费">
                            电费
                        </a-select-option>
                    </a-select>
                </a-form-model-item>

                <a-form-model-item label="数量" :prop="'multy_charges.' + index + '.number'" :rules="{
                    required: true,
                    message: '请输入收费数量',
                    trigger: 'blur',
                }">
                    <a-input-number v-model="charge.number" :step="0.01" />
                </a-form-model-item>

                <a-icon class="close-button" type="close" @click="onChargeBoxClosed(index)" />
            </div>

        </a-form-model>

        <a-button type="dashed" style="width: 100%;margin-top: 15px;" @click="onAddChargeItemButtonClicked">
            <a-icon type="plus" />
            添加一个收费条目
        </a-button>

        <a-button type="primary" style="margin-top: 15px;" @click="onChargeButtonClicked" :loading="is_charging">
            <a-icon type="dollar" />
            确认收费
        </a-button>

        <a-button style="margin-top: 15px;margin-left: 15px;" @click="onResetButtonClicked">
            <a-icon type="reload" />
            重置收费
        </a-button>
    </div>
</template>

<script>
import locale from 'ant-design-vue/es/date-picker/locale/zh_CN';
import util from '../../util';

const renderNumberColumnContent = (value, row) => {
    const obj = {
        children: value,
        attrs: {},
    };
    // console.log(value + ':' + JSON.stringify(row) + ':' + index)
    if(row.key === '合计')
    {
        obj.attrs.colSpan = 0;
    }
    return obj;
};

const renderTypeColumnContent = (value, row) => {
    const obj = {
        children: value,
        attrs: {},
    };
    // console.log(value + ':' + JSON.stringify(row) + ':' + index)
    if(row.key === '合计')
    {
        obj.attrs.colSpan = 2;
    }
    return obj;
};

export default {
    name: "ChargeSubpage",
    data: function(){
        return {
            locale,
            charge_form: {
                house_id: -1,
                multy_charges: [
                    // {
                    //     type: "",
                    //     number: 0,
                    // }
                ],
                charge_ym_start: "",
                charge_ym_end: "",
            },
            houses: [
                {
                    house_id: 0,
                    house_owner_name: '加载中...',
                },
            ],
            has_houses_loaded: false,
            is_charging: false,

            charge_result_window_visibility: false,
            charge_result_window_data_source: {},
            charge_result_window_charges_table_columns: [
                {
                    title: '序号',
                    dataIndex: 'key',
                },
                {
                    title: '收费类型',
                    dataIndex: 'type',
                    customRender: renderTypeColumnContent,
                },
                {
                    title: '数量',
                    dataIndex: 'number',
                    customRender: renderNumberColumnContent,
                },
                {
                    title: '金额',
                    dataIndex: 'charge',
                },
            ],
            charge_form_rules: {
                charge_ym_start: [
                    {required: true, message: '请选择收费开始日期', trigger: 'change'},
                    {message: '开始日期不能晚于结束日期！', trigger: 'change', validator(rule) {
                        if(rule.that.charge_form.charge_ym_end == '') return true
                        return (new Date(rule.that.charge_form.charge_ym_start)) <= (new Date(rule.that.charge_form.charge_ym_end));
                    }, that: this}
                ],
                charge_ym_end: [
                    {required: true, message: '请选择收费结束日期', trigger: 'change'},
                    {message: '结束日期不能早于开始日期！', trigger: 'change', validator(rule) {
                        if(rule.that.charge_form.charge_ym_start == '') return true
                        return (new Date(rule.that.charge_form.charge_ym_start)) <= (new Date(rule.that.charge_form.charge_ym_end));
                    }, that: this}
                ],
                house_id: [
                    {required: true, message: '请选择要收费的房号', trigger: 'change'},
                ]
            }
        }
    },
    created: function(){
        this.loadHousesInfo()
        this.charge_form.house_id = 0
    },
    methods: {
        onChargeBoxClosed(index){
            // console.log("close " + index +"!")
            let new_charges = []
            for(let i=0; i<this.charge_form.multy_charges.length; ++i)
            {
                if(i === index) continue
                new_charges.push(this.charge_form.multy_charges[i])
            }
            this.charge_form.multy_charges = new_charges
        },
        onAddChargeItemButtonClicked(){
            this.charge_form.multy_charges.push({
                type: "",
                number: 0,
            })
        },
        loadHousesInfo(){
            this.has_houses_loaded = false

            var that = this
            var token = util.getCookie("token")
            fetch("/api/get_houses_info?token="+token).then(function(res){res.json().then(function(res){
                if(res.code === 0)
                {
                    that.houses = res.data.houses
                }else if(res.code === -1)
                {
                    util.logoutAndJumpToLoginPage(that)
                }else{
                    util.message.error(res.msg)
                }
                that.has_houses_loaded = true
            })})
        },
        onChargeButtonClicked(){
            var that = this

            this.$refs.charge_form.validate(valid => {
                if(valid)
                {
                    if(that.charge_form.multy_charges.length === 0)
                    {
                        util.message.error("请至少添加一项收费条目！")
                    }else{
                        that.letsCharge()
                    }
                }else{
                    return false
                }
            })
        },
        letsCharge(){
            var that = this
            that.is_charging = true
            var token = util.getCookie("token")
            let body_data = {...that.charge_form}
            body_data.charge_ym_start = util.dateToString(new Date(body_data.charge_ym_start))
            body_data.charge_ym_end = util.dateToString(new Date(body_data.charge_ym_end))
            fetch(
                "/api/charge?token="+token,
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
                    util.message.success("收费成功！")
                    that.onResetButtonClicked()

                    that.charge_result_window_data_source = {...res.data.charge_info}
                    that.charge_result_window_data_source.charges.push({
                        key: '合计',
                        type: util.fixed2NumberToChineseNumber(res.data.charge_info.charge_sum),
                        number: 0,
                        charge: res.data.charge_info.charge_sum,
                    })
                    that.charge_result_window_visibility = true

                    // console.log(res.data.charge_info)
                }else if(res.code === -1)
                {
                    util.logoutAndJumpToLoginPage(that)
                }else{
                    util.message.error(res.msg)
                }
                that.is_charging = false
            })})
        },
        onResetButtonClicked(){
            let s = this.charge_form.charge_ym_start
            let e = this.charge_form.charge_ym_end

            this.$refs.charge_form.resetFields()
            this.charge_form.multy_charges = []
            this.charge_form.charge_ym_start = s
            this.charge_form.charge_ym_end = e
        },
        onPrintButtonClicked(){
            util.printJS('print-box', 'html')
            // console.log('printing?...')
        }
    }
}
</script>

<style scoped>
#title {
  font-size: 20px;
  text-align: left;
  margin-bottom: 10px;
}
.charge-box {
    padding: 15px;
    border-radius: 10px;
    border-style: dashed;
    border-color: white;
    border-width: 1px;
    position: relative;
    transition: border-color 0.3s;
}
.charge-box:hover {
    border-color: #E8E8E8;
}
.close-button {
    position: absolute;
    top: 5px;
    right: 5px;
    opacity: 0.0;
    transition: opacity 0.3s;
}
.charge-box:hover .close-button{
    opacity: 1.0;
}
</style>