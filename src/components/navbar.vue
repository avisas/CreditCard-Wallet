<template>
    <nav>
        <div class="navbar navbar-expand-lg navbar-light bg-dark">
            <div class="container">
                <a class="navbar-brand" href="#">
                    <div class="logo-image">
                    <img src="../assets/ivisa-logo-navbar.png" class="img-fluid">
                    </div>
                </a>
                <router-link to="/" class="brand-logo">My Cards</router-link>
            </div>
        </div>
    </nav>
</template>

<style scoped>
.logo-image{
    width: 25%;
    height: 25%;
    border-radius: 50%;
    overflow: hidden;
    margin-top: -6px;
}
</style>