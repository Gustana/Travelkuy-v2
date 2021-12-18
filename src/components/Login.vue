<template>
    <main>
        <v-container fluid fill-height class="posisinya">
            <v-layout flex align-center justify-center>
                <v-flex xs12 sm6 elevation-6>
                    <v-toolbar class="grey darken-3">
                        <v-toolbar-title class="grey--text">
                            <h1>Welcome</h1>
                        </v-toolbar-title>
                    </v-toolbar>
                    <v-card>
                        <v-card-text class="pt-4">
                            <div>
                                <v-form v-model="valid" ref="form">
                                    <v-text-field label="E-mail" v-model="email" :rules="emailRules" required></v-text-field>
                                    <v-text-field label="Password" v-model="password" type="password" min="8" :rules="passwordRules" counter required></v-text-field>
                                    <v-layout justify-end>
                                        <v-btn class="mr-2" @click="submit" :class="{'grey darken-1 white--text': valid, disabled: !valid}">Go</v-btn>
                                        <v-btn @click="clear" class="grey darken-3 white--text">Clear</v-btn>
                                    </v-layout>
                                </v-form>
                            </div>
                        </v-card-text>
                    </v-card>
                    <v-snackbar v-model="snackbar" :color="color" timeout="20000" bottom>{{error_message}}</v-snackbar>
                </v-flex>
            </v-layout>
        </v-container>
    </main>
</template>

<style>
@import url('https://fonts.googleapis.com/css2?family=Jolly+Lodger');
.grey--text{
    font-family: "Jolly Lodger";
}

.posisinya{
    position: absolute;
    top: 20px;
    left: 0;
    right: 0;
}
</style>

<script>
export default {
    name: "Login",
    data(){
        return {
            load: false,
            snackbar: false,
            error_message: '',
            color: '',
            valid: false,
            password: '',
            passwordRules:[
                (v) => !!v || 'Password Tidak Boleh Kosong',
            ],
            email: '',
            emailRules:[
                (v) => !!v || 'E-mai Tidak Boleh Kosong',
            ]
        }
    },
    methods:{
        submit(){
            console.log(this.$api)
            if(this.$refs.form.validate()){
                this.load = true
                    this.$axios.post(this.$api + '/login', {
                    email: this.email,
                    password: this.password
                }).then(response => {
                    localStorage.setItem('id', response.data.user.id_user)
                    localStorage.setItem('token', response.data.access_token)
                    this.error_message = response.data.message
                    this.color = 'green'
                    this.snackbar = true
                    this.load = false
                    this.clear()

                    if(response.data.user.level == 0){
                        console.log('logged in as admin')
                        this.$router.push({
                            name: 'admin/Destination'
                        })
                    }else{
                        console.log('logged in as user')
                        this.$router.push({
                            name: 'user/Destination'
                        })
                    }
                }).catch(error => {
                    console.log(error.response)
                    this.error_message = error.response.data.message
                    this.color = 'red'
                    this.snackbar = true
                    localStorage.removeItem('token')
                    localStorage.removeItem('id')
                    this.load = false
                })
            }
        },
        clear(){
            this.$refs.form.reset()
        }
    }
}
</script>