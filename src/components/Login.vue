<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="12" md="6" lg="4">
        <v-card>
          <v-card-title class="text-h5 title">
            <span>Login</span>
          </v-card-title>
          <v-card-subtitle class="title">Please enter your credentials to login.</v-card-subtitle>
          <v-card-text>
            <!-- Show error alert if there is an error -->
            <v-alert v-if="errorMessage" type="error" dismissible>
              {{ errorMessage }}
            </v-alert>

            <v-form @submit.prevent="login">
              <v-text-field
                v-model="username"
                label="Username"
                required
              ></v-text-field>
              <v-text-field
                v-model="password"
                label="Password"
                type="password"
                required
              ></v-text-field>
              <v-btn type="submit" color="primary" block :disabled="username === '' || password === ''">Login</v-btn>
            </v-form>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';

export default defineComponent({
  setup() {
    const router = useRouter();
    const store = useStore();
    const username = ref('');
    const password = ref('');
    const errorMessage = ref(''); // Variable to store error messages

    const login = async () => {
      errorMessage.value = ''; // Clear any previous error message
      try {
        await store.dispatch('login', { username: username.value, password: password.value });
        await store.dispatch('loadTodos');
        router.push('/home');
      } catch (error: any) {
        // Check the error response and display appropriate messages
        if (error.response && error.response.status === 400) {
          errorMessage.value = 'Invalid credentials. Please try again.';
        } else if (error.response && error.response.status === 500) {
          errorMessage.value = 'Server error. Please try again later.';
        } else {
          errorMessage.value = 'Network error. Please check your connection.';
        }
        console.error('Login failed:', error);
      }
    };

    return { username, password, login, errorMessage };
  }
});
</script>

<style scoped>
.title {
  text-align: center;
}

.v-card {
  max-width: 400px;
  margin: auto;
}

.v-btn {
  width: 100%;
}
</style>
