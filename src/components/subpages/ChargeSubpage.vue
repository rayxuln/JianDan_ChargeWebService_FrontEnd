<template>
    <div class="white-box">
        <div id="title"> 收费 </div>
        <a-form-model ref="charge_form" :model="charge_form" :label-col="{span:4}" :wrapper-col="{span:14}">
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

                <a-form-model-item label="收费类型" prop="type">
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

                <a-form-model-item label="数量" prop="number">
                    <a-input-number v-model="charge.number" :step="0.01" />
                </a-form-model-item>

                <a-icon class="close-button" type="close" @click="onChargeBoxClosed(index)" />
            </div>

        </a-form-model>

        <a-button type="dashed" style="width: 100%;margin-top: 15px;" @click="onAddChargeItemButtonClicked">
            <a-icon type="plus" />
            添加一个收费条目
        </a-button>

        <a-button type="primary" style="margin-top: 15px;text-align: center;">
            <a-icon type="dollar" />
            确认收费
        </a-button>
    </div>
</template>

<script>
import locale from 'ant-design-vue/es/date-picker/locale/zh_CN';
import util from '../../util';

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
                    house_owner_name: '望天吧',
                },
                {
                    house_id: 1,
                    house_owner_name: '望天吧',
                },
                {
                    house_id: 2,
                    house_owner_name: '帕普斯',
                },
                {
                    house_id: 3,
                    house_owner_name: '衫斯',
                },
            ],
            has_houses_loaded: false
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