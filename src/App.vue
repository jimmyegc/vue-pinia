<script setup>
import TheHeader from "@/components/TheHeader.vue";
import ProductCard from "@/components/ProductCard.vue";
import { ref, reactive } from 'vue'
import { useProductStore } from "./stores/ProductStore";
import { useCartStore } from "./stores/CartStore";
const productStore = useProductStore()
const cartStore = useCartStore()
const history = reactive([])
const future = reactive([])
const doingHistory = ref(false)

history.push(JSON.stringify(cartStore.$state))

cartStore.$subscribe((mutation, state) => {
  if(!doingHistory.value) {
    history.push( JSON.stringify(state))
    future.splice(0, future.length)
  }
  /* console.log({ state })
  console.log({ mutation })   */
})

const redo =() => {
  const latetsState = future.pop()
  if(!latetsState) return
  doingHistory.value = true 
  history.push(latetsState)
  cartStore.$state = JSON.parse(latetsState)
  doingHistory.value = false
}

const undo = () => {
  if(history.length === 1) return
  doingHistory.value = true 
  future.push(history.pop())
  cartStore.$state = JSON.parse(history.at(-1))
  doingHistory.value = false
}

cartStore.$onAction(({ name, store, args, after, onError })=> {
  if(name == 'addItems') {
    after((result)=> {
      //console.log(args[0])      
    })    
    onError((error)=> {
      console.log("Error...  ", error.message)
    })
  }
}) 

productStore.fill()

</script>


<template>
  <div class="container">
    <TheHeader />
    <div class="mb-5 flex justify-end">
      <AppButton @click="undo">Undo</AppButton> 
      <AppButton class="ml-2" @click="redo">Redo</AppButton>
    </div>
    <ul class="sm:flex flex-wrap lg:flex-nowrap gap-5">
      <ProductCard
        v-for="product in productStore.products"
        :key="product.name"
        :product="product"
        @addToCart="cartStore.addItems($event, product)"
      />
    </ul>
  </div>
</template>
