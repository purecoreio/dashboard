<template>
    <router-view />
</template>
<script>
export default {
    async beforeMount() {
        try {
            this.$emit("identity", {
                links: [
                    {
                        path: "billing",
                        name: "Billing",
                        icon: "credit-card-outline",
                    },
                    {
                        path: "machines",
                        name: "Machines",
                        icon: "server-network",
                    },
                    {
                        path: "profiles",
                        name: "Profiles",
                        icon: "account-box-multiple-outline",
                    },
                    {
                        path: "account",
                        name: "Account",
                        icon: "account-circle-outline",
                    },
                ],
            })
        } catch (error) {
            this.$router.push("/");
        }
    },
}
</script>