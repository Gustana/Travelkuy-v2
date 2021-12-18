<template>
    <v-main class="list">
        <h3 class="text-h3 font-weight-medium mb-5">Destination</h3>

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

            <v-data-table :headers="headers" :items="destinations" :search="search">
                
                <template v-slot:[`item.actions`]="{item}">
                    <v-btn small class="mr-2" @click="buyTicketHandler(item.harga_wisata, item.id_wisata)">Buy</v-btn>
                </template>

            </v-data-table>
        </v-card>
        
        <v-dialog v-model="dialog" persistent max-width="600px">
            <v-card>
                <v-card-title>
                    <span class="headline">Buy Ticket</span>
                </v-card-title>
                <v-card-text>
                    <v-container>
                        <v-text-field
                        v-model="form.jumlah_tiket"
                        type="number"
                        label="Jumlah"
                        required></v-text-field> 

                    </v-container>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="blue darken-1" text @click="cancel">Cancel</v-btn>
                    <v-btn color="blue darken-1" text @click="buyTicket">Buy Ticket</v-btn>
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
            id_wisata: null,
            harga_wisata: null,
            color: '',
            search: null,
            dialog: false,
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
                jumlah_tiket:null
            },
        }
    },
    methods:{
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
        buyTicketHandler(harga_wisata, id_wisata){
            this.id_wisata = id_wisata
            this.harga_wisata = harga_wisata;
            this.dialog = true
        },
        buyTicket(){
            let newData = {
                id_wisata: this.id_wisata,
                id_user: localStorage.getItem('id'),
                jumlah_tiket: this.form.jumlah_tiket,
                total_harga: this.form.jumlah_tiket * this.harga_wisata,
            }

            var url = this.$api + '/ticket/'
            this.load = true
            this.$http.post(url, newData, {
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