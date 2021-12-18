<template>
    <v-main class="list">
        <h3 class="text-h3 font-weight-medium mb-5">Wisata</h3>

        <v-card>
            <v-card-title>
                <v-text-field
                v-model="search"
                append-icon="mdi-magnify"
                label="Search"
                single-line
                hide-details>
                </v-text-field>
                <v-spacer></v-spacer>
                <v-btn color="success" dark @click="dialog = true">Tambah</v-btn>
            </v-card-title>

            <v-data-table :headers="headers" :items="souvenirs" :search="search">
                
                <template v-slot:[`item.actions`]="{item}">
                   <v-btn small class="mr-2" @click="editHandler(item)">edit</v-btn>
                   <v-btn small class="mr-2" @click="deleteHandler(item.id_sovenir)">delete</v-btn>
                </template>

            </v-data-table>
        </v-card>
        
        <v-dialog v-model="dialog" persistent max-width="600px">
            <v-card>
                <v-card-title>
                    <span class="headline">{{formTitle}} Course</span>
                </v-card-title>
                <v-card-text>
                    <v-container>
                        <v-text-field
                        v-model="form.nama_sovenir"
                        label="Nama Sovenir"
                        required></v-text-field> 

                        <v-text-field
                        v-model="form.jumlah"
                        label="Jumlah"
                        required></v-text-field> 

                        <v-text-field 
                        v-model="form.harga"
                        label="Harga"
                        required></v-text-field>

                    </v-container>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="blue darken-1" text @click="cancel">Cancel</v-btn>
                    <v-btn color="blue darken-1" text @click="setForm">Save</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

        <v-dialog v-model="dialogConfirm" persistent max-width="400px">
            <v-card>
                <v-card-title>
                    <span class="headline">Warning!</span>
                </v-card-title>
                <v-card-text>Yakin Hapus ?</v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="blue darken-1" text @click="deleteData">Yes</v-btn>
                    <v-btn color="blue darken-1" text @click="dialogConfirm = false">Cancel</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

        <v-snackbar v-model="snackbar" :color="color" timeout="20000" bottom>{{error_message}}</v-snackbar>

    </v-main>
</template>

<script>
export default {
    name: "List",
    data(){
        return{
            inputType: 'Tambah',
            load:false,
            snackbar: false,
            error_message: '',
            color: '',
            search: null,
            dialog: false,
            dialogConfirm: false,
            headers:[
                {
                    text: "Nama Sovenir", 
                    value: "nama_sovenir",
                    sortable: true,
                    align: "start"
                },
                {
                    text: "Jumlah", value: "jumlah"
                },
                {
                    text: "Harga", value: "harga"
                },
                {
                    text: "Actions", value: "actions"
                }
            ],
            souvenir: new FormData,
            souvenirs: [],
            form: {
                nama_sovenir:null,
                jumlah: null,
                harga: null,
            },
            deleteId: '',
            editId: ''
        }
    },
    methods:{
        setForm(){
            if(this.inputType !== 'Tambah'){
                this.update()
            }else{
                this.save()
            }
        },
        readData(){
            var url = this.$api + '/souvenir'
            this.$http.get(url, {
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem('token')
                }
            }).then(response => {
                this.souvenirs = response.data.data
            })
        },
        save(){
            this.souvenir.append('nama_sovenir', this.form.nama_sovenir)
            this.souvenir.append('jumlah', this.form.jumlah)
            this.souvenir.append('harga', this.form.harga)

            var url = this.$api + '/souvenir/'
            this.load = true;
            this.$http.post(url, this.souvenir, {
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem('token')
                }
            }).then(response => {
                this.error_message = response.data.message
                this.color= 'green'
                this.snackbar= true
                this.load = true
                this.close()
                this.readData()
                this.resetForm()
            }).catch(error => {
                this.error_message = error.response.data.message
                this.color = 'red'
                this.snackbar = true
                this.load = false
            })
        },
        update(){
            let newData = {
                nama_sovenir: this.form.nama_sovenir,
                jumlah: this.form.jumlah,
                harga: this.form.harga,
            }

            var url = this.$api + '/souvenir/'+this.editId
            this.load = true
            this.$http.put(url, newData, {
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem('token')
                }
            }).then(response => {
                this.error_message = response.data.message
                this.color= 'green'
                this.snackbar= true
                this.load = true
                this.close()
                this.readData()
                this.resetForm()
                this.inputType = 'Tambah'
            }).catch(error => {
                this.error_message = error.response.data.message
                this.color = 'red'
                this.snackbar = true
                this.load = false
            })
        },
        deleteData(){
            var url = this.$api + '/souvenir/'+this.deleteId
            this.load = true
            this.$http.delete(url, {
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem('token')
                }
            }).then(response => {
                this.error_message = response.data.message
                this.color= 'green'
                this.snackbar= true
                this.load = true
                this.close()
                this.readData()
                this.resetForm()
                this.inputType = 'Tambah'
            }).catch(error => {
                this.error_message = error.response.data.message
                this.color = 'red'
                this.snackbar = true
                this.load = false
            })
        },
        editHandler(item){
            this.inputType = 'Ubah'
            this.editId = item.id_sovenir
            this.form.nama_sovenir = item.nama_sovenir
            this.form.jumlah = item.jumlah
            this.form.harga = item.harga
            
            this.dialog = true
        },
        deleteHandler(id){
            this.deleteId = id
            this.dialogConfirm= true
        },
        close(){
            this.dialog = false
            this.inputType = 'Tambah'
            this.dialogConfirm = false
            this.readData()
        },
        cancel(){
            this.resetForm()
            this.readData()
            this.dialog = false
            this.dialogConfirm = false
            this.inputType = 'Tambah'
        },
        resetForm(){
            this.form = {
                nama_sovenir: null,
                jumlah: null,
                harga: null,
            }
        },
    },
    computed: {
        formTitle(){
            return this.inputType
        },
    },
    mounted(){
        this.readData()
    }
}
</script>