<template>
    <div class="white-box">
        <!-- <a-icon v-if="!has_loaded_info" type="loading" /> -->
        <a-skeleton v-if="!has_loaded_info" active :paragraph="{ rows: 9 }" />
        <div v-if="has_loaded_info">
            <a-descriptions title="员工信息" :column="1">
                <a-descriptions-item label="员工号">
                {{ user_info.staff_id }}
                </a-descriptions-item>
                <a-descriptions-item label="姓名">
                {{ user_info.name }}
                </a-descriptions-item>
                <a-descriptions-item label="年龄">
                {{ user_info_age }}
                </a-descriptions-item>
                <a-descriptions-item label="出生年月">
                {{ user_info.birthday }}
                </a-descriptions-item>
                <a-descriptions-item label="性别">
                {{ user_info.gender }}
                </a-descriptions-item>
                <a-descriptions-item label="联系电话">
                {{ user_info.phone }}
                </a-descriptions-item>
                <a-descriptions-item label="住址">
                {{ user_info.address }}
                </a-descriptions-item>
                <a-descriptions-item label="部门">
                {{ user_info.dept_name }}
                </a-descriptions-item>
                <a-descriptions-item label="职务">
                {{ user_info.position }}
                </a-descriptions-item>
            </a-descriptions>
        </div>
    </div>
</template>

<script>
import util from '../../util'

export default {
    name: "InfoSubpage",
    data: function() {
        return {
            has_loaded_info: false,
            user_info: {
                staff_id: "2333",
                name: "杰克",
                birthday: "2009-06",
                gender: "男",
                phone: "13812345678",
                address: "北纬一路32号",
                dept_name: "收费部",
                position: "部门经理"
            }
        }
    },
    computed: {
        user_info_age(){
            return util.calcAgeFromBirth(this.user_info.birthday)
        }
    },
    created: function() {
        // 加载页面后判断是否已经登陆
        // 若已经登陆，则向后端请求该员工的信息
        var that = this
        
        setTimeout(function(){
            // console.log(that.$store.state.login)
            if(!that.$store.state.login)
            {
                return
            }

            var token = util.getCookie("token")
            fetch("/api/get_user_info?token=" + token)
            .then(function(res){res.json().then(function(res){
                // console.log(res)
                if(res.code === 0)
                {
                    var dept_id = res.data.info.dept_id
                    that.user_info = {
                        staff_id: res.data.info.staff_id,
                        name: res.data.info.name,
                        birthday: res.data.info.birthday,
                        gender: res.data.info.gender,
                        phone: res.data.info.phone,
                        address: res.data.info.address,
                        dept_name: "Unkown("+dept_id+")",
                        position: res.data.info.position
                    }

                    //通过部门号获取部门的名字


                    that.has_loaded_info = true
                }else if(res.code === -1)
                {// invalid token
                    util.logoutAndJumpToLoginPage(that)
                }
            })})
        }, that.$store.state.login ? 0 : 3000)
    }
}
</script>

<style scoped>
p {
    font-size: 32px;
}
</style>