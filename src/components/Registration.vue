<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="12" md="6" lg="4">
        <v-card>
          <v-card-title class="text-h5 title">Register</v-card-title>
          <v-card-subtitle class="title">Register a new account here.</v-card-subtitle>
          <v-card-text>
            <v-form ref="form" v-model="valid">
              <v-text-field
                v-model="username"
                label="Username"
                :rules="[rules.required]"
                required
              ></v-text-field>
              <v-text-field
                v-model="password"
                label="Password"
                :rules="[rules.required, rules.min]"
                type="password"
                required
              ></v-text-field>
              <v-text-field
                v-model="confirmPassword"
                label="Confirm Password"
                :rules="[rules.required, rules.passwordMatch]"
                type="password"
                required
              ></v-text-field>
              <v-btn
                :disabled="!valid"
                @click="register"
                color="primary"
                block
              >
                Register
              </v-btn>              
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
    const confirmPassword = ref('');
    const valid = ref(false);

    const rules = {
      required: (value: string) => !!value || 'Required.',
      min: (value: string) => value.length >= 6 || 'Password must be at least 6 characters long.',
      passwordMatch: () => password.value === confirmPassword.value || 'Passwords do not match.',
    };

    const register = async () => {
      if (password.value === confirmPassword.value) {
        try {
          await store.dispatch('register', { username: username.value, password: password.value });
          router.push('/');
        } catch (error) {
          console.error('Registration failed:', error);
        }
      }
    };

    return { username, password, confirmPassword, valid, rules, register };
  }
});
</script>

<style scoped>
.v-card {
  max-width: 400px;
  margin: auto;
}

.v-btn {
  width: 100%;
}

.title{
  text-align: center;
}
</style>