<template>
    <v-main class="list">
        <h3 class="text-h3 font-weight-medium mb-5">Ticket</h3>

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
            </v-card-title>

            <v-data-table :headers="headers" :items="tickets" :search="search">
                <template v-slot:[`item.actions`]="{item}">
                   <v-btn small class="mr-2" @click="editHandler(item.id_tiket, item.harga_wisata)">edit</v-btn>
                   <v-btn small class="mr-2" @click="deleteHandler(item.id_tiket)">delete</v-btn>
                </template>
            </v-data-table>
        </v-card>
        
        <v-dialog v-model="dialog" persistent max-width="600px">
            <v-card>
                <v-card-title>
                    <span class="headline">Edit Tiket</span>
                </v-card-title>
                <v-card-text>
                    
                    <v-container>
                        <v-text-field
                        v-model="form.jumlah_tiket"
                        label="Jumlah Tiket"
                        required></v-text-field> 

                    </v-container>

                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="blue darken-1" text @click="cancel">Cancel</v-btn>
                    <v-btn color="blue darken-1" text @click="update">Update</v-btn>
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
                    <v-btn color="blue darken-1" text @click="dialogConfirm = false">Cancel</v-btn>
                    <v-btn color="blue darken-1" text @click="deleteTicket">Yes</v-btn>
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
            load:false,
            snackbar: false,
            error_message: '',
            harga_wisata: null,
            color: '',
            search: null,
            dialogConfirm: false,
            dialog: false,
            headers:[
                {
                    text: "Nama Wisata", 
                    value: "nama_wisata",
                    sortable: true,
                    align: "start"
                },
                {
                    text: "Nama Pemesan", value: "name"
                },
                {
                    text: "Jumlah", value: "jumlah_tiket"
                },
                {
                    text: "Total Harga", value: "total_harga"
                },
                {
                    text: "Actions", value: "actions"
                }
            ],
            ticket: new FormData,
            tickets: [],
            form: {
                jumlah_tiket: null,
                total_harga: null
            },
            deleteId: '',
            editId: ''
        }
    },
    methods:{
        readData(){
            var url = this.$api + '/ticket/'+localStorage.getItem('id')
            this.$http.get(url, {
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem('token')
                }
            }).then(response => {
                this.tickets = response.data.data
            })
        },
        update(){
            let newData = {
                jumlah_tiket: this.form.jumlah_tiket,
                total_harga: this.form.jumlah_tiket * this.harga_wisata
            }

            var url = this.$api + '/ticket/'+this.editId
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
            }).catch(error => {
                console.log(error)
                // this.error_message = error.response.data.message
                this.color = 'red'
                this.snackbar = true
                this.load = false
            })
        },
        editHandler(id_tiket, harga_wisata){
            this.harga_wisata = harga_wisata
            this.editId = id_tiket
            this.dialog = true
        },
        deleteHandler(id_tiket){
            this.deleteId = id_tiket
            this.dialogConfirm = true
        },
        deleteTicket(){
            var url = this.$api + '/ticket/'+this.deleteId
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
            }).catch(error => {
                this.error_message = error.response.data.message
                this.color = 'red'
                this.snackbar = true
                this.load = false
            })
        },
        close(){
            this.dialog = false
            this.dialogConfirm = false
            this.readData()
        },
        cancel(){
            this.resetForm()
            this.readData()
            this.dialog = false
            this.dialogConfirm = false
        },
        resetForm(){
            this.form = {
                jumlah_tiket: null
            }
        },
    },
    mounted(){
        this.readData()
    }
}
</script>