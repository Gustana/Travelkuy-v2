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
            </v-card-title>

            <v-data-table :headers="headers" :items="tickets" :search="search">

            </v-data-table>
        </v-card>

    </v-main>
</template>

<script>
export default {
    name: "List",
    data(){
        return{
            search: null,
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
            ],
            ticket: new FormData,
            tickets: [],
            form: {
                nama_wisata:null,
                name:null,
                jumlah_tiket: null,
                total_harga: null,
            },
            deleteId: '',
            editId: ''
        }
    },
    methods:{
        readData(){
            var url = this.$api + '/ticket'
            this.$http.get(url, {
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem('token')
                }
            }).then(response => {
                this.tickets = response.data.data
            })
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