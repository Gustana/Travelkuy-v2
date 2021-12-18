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

            <v-data-table :headers="headers" :items="destinations" :search="search">
                
                <template v-slot:[`item.actions`]="{item}">
                   <v-btn small class="mr-2" @click="editHandler(item)">edit</v-btn>
                   <v-btn small class="mr-2" @click="deleteHandler(item.id_wisata)">delete</v-btn>
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
                        v-model="form.nama_wisata"
                        label="Nama Wisata"
                        required></v-text-field> 

                        <v-text-field
                        v-model="form.lokasi_wisata"
                        label="Lokasi Wisata"
                        required></v-text-field> 

                        <v-text-field 
                        v-model="form.harga_wisata"
                        label="Harga"
                        required></v-text-field>

                        <v-text-field
                        v-model="form.lat"
                        label="Latitude"
                        required></v-text-field>

                        <v-text-field
                        v-model="form.lng"
                        label="Longtitude"
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
                    text: "Nama Wisata", 
                    value: "nama_wisata",
                    sortable: true,
                    align: "start"
                },
                {
                    text: "Lokasi", value: "lokasi_wisata"
                },
                {
                    text: "Harga", value: "harga_wisata"
                },
                {
                    text: "Latitude", value: "lat"
                },
                {
                    text: "Longtitude", value: "lng"
                },
                {
                    text: "Actions", value: "actions"
                }
            ],
            destination: new FormData,
            destinations: [],
            form: {
                nama_wisata:null,
                lokasi_wisata: null,
                harga_wisata: null,
                lat: null,
                lng: null,
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
            var url = this.$api + '/destination'
            this.$http.get(url, {
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem('token')
                }
            }).then(response => {
                this.destinations = response.data.data
            })
        },
        save(){
            this.destination.append('nama_wisata', this.form.nama_wisata)
            this.destination.append('lokasi_wisata', this.form.lokasi_wisata)
            this.destination.append('harga_wisata', this.form.harga_wisata)
            this.destination.append('lat', this.form.lat)
            this.destination.append('lng', this.form.lng)

            var url = this.$api + '/destination/'
            this.load = true;
            this.$http.post(url, this.destination, {
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
                nama_wisata: this.form.nama_wisata,
                lokasi_wisata: this.form.lokasi_wisata,
                harga_wisata: this.form.harga_wisata,
                lat: this.form.lat,
                lng: this.form.lng,
            }

            var url = this.$api + '/destination/'+this.editId
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
            var url = this.$api + '/destination/'+this.deleteId
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
            this.editId = item.id_wisata
            this.form.nama_wisata = item.nama_wisata
            this.form.lokasi_wisata = item.lokasi_wisata
            this.form.harga_wisata = item.harga_wisata
            this.form.lat = item.lat
            this.form.lng = item.lng
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
                nama_wisata: null,
                lokasi_wisata: null,
                harga_wisata: null,
                lat: null,
                lng: null,
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