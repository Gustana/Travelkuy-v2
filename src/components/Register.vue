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
                                    <v-text-field label="Nama" v-model="name" :rules="nameRules" required></v-text-field>
                                    <v-text-field label="E-mail" v-model="email" :rules="emailRules" required></v-text-field>
                                    <v-text-field label="Password" v-model="password" type="password" min="8" :rules="passwordRules" counter required></v-text-field>
                                    <v-text-field label="Usia" type="number" v-model="age" :rules="ageRules" required></v-text-field>
                                    <v-text-field label="Jenis Kelamin" v-model="gender" :rules="genderRules" required></v-text-field>
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
            name: '',
            gender: '',
            age: '',
            email : '',
            nameRules:[
                (v) => !!v || 'Nama Tidak Boleh Kosong',
            ],
            genderRules:[
                (v) => !!v || 'Jenis Kelamin Tidak Boleh Kosong',
            ],
            ageRules:[
                (v) => !!v || 'Umur Tidak Boleh Kosong',
            ],
            passwordRules:[
                (v) => !!v || 'Password Tidak Boleh Kosong',
            ],
            emailRules:[
                (v) => !!v || 'E-mai Tidak Boleh Kosong',
            ]
        }
    },
    methods:{
        submit(){
            if(this.$refs.form.validate()){
                this.load = true
                this.$http.post(this.$api + '/register', {
                    email: this.email,
                    password: this.password,
                    name: this.name,
                    usia: this.age,
                    jenis_kelamin: this.gender
                }).then(response => {
                    this.error_message = response.data.message
                    this.color = 'green'
                    this.snackbar = true
                    this.load = false
                    this.clear()
                }).catch(error => {
                    this.error_message = error.response.data.message
                    this.color = 'red'
                    this.snackbar = true
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