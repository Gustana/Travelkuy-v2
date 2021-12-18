import Vue from "vue"
import VueRouter from "vue-router"

Vue.use(VueRouter);

function importComponent(path){
    return () => import(`./components/${path}.vue`);
}

const router = new VueRouter({
    mode: "history",
    routes: [
        {
            path: "/admin",
            component: importComponent("DashboardAdmin"),
            children:[
                {
                    path: "/admin/destination",
                    name: "admin/Destination",
                    meta: {title: 'Destination'},
                    component: importComponent("DataMasterAdmin/Destination"),
                },
                {
                    path: "/admin/ticket",
                    name: "admin/Ticket",
                    meta: {title: 'Ticket'},
                    component: importComponent("DataMasterAdmin/Ticket"),
                },
                {
                    path: "/admin/souvenir",
                    name: "admin/Souvenir",
                    meta: {title: 'Souvenir'},
                    component: importComponent("DataMasterAdmin/Souvenir"),
                },
            ],
        },
        {
            path: "/user",
            component: importComponent("DashboardUser"),
            children:[
                {
                    path: "/user/destination",
                    name: "user/Destination",
                    meta: {title: 'Destination'},
                    component: importComponent("DataMasterUser/Destination"),
                },
                {
                    path: "/user/ticket",
                    name: "user/Ticket",
                    meta: {title: 'My Ticket'},
                    component: importComponent("DataMasterUser/Ticket"),
                },
            ],
        },
        {
            path: '/',
            name: 'Login',
            meta: {title: 'Login'},
            component: importComponent('Login')
        },
        {
            path: '/register',
            name: 'Register',
            meta: {title: 'Register'},
            component: importComponent('Register')
        },
        {
            path: '*',
            redirect: '/'
        }
    ],
});

router.beforeEach((to, from ,next) => {
    document.title = to.meta.title
    next()
})

export default router;