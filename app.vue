<template>
  <div>
    <h1>My Nuxt Application</h1>
    data from DB:
    <ul>
      <li>Username: {{ client.data[0].attributes["username"] }}</li>
      <li>Email: {{ client.data[0].attributes["email"] }}</li>
    </ul>
  </div>
</template>

<script lang="ts" setup>
const {find} = useStrapi()

const client = await find("clients", {fields: ["email", "username"]})
</script>