<template>
  <div>
    <h1
      class="text-2xl p-4 text-gray-700 hover:text-gray-800 hover:underline font-semibold hover:font-bold"
    >user details</h1>
  </div>
</template>

<script lang="ts" setup>
const route = useRoute()
useSeoPage({
  title: `User #${route.params.id}`,
  description: "User account details.",
  noindex: true,
})
</script>