<template>
    <div :class="alertClass" v-if="visible">
      <span>{{ message }}</span>
      <button v-if="closable" class="app-alert__close-btn" @click="closeAlert">&times;</button>
    </div>
  </template>
  
  <script>
  export default {
    props: {
      message: {
        type: String,
        required: true,
      },
      type: {
        type: String,
        default: '',
        validator: (value) => ['success', 'error', 'warning'].includes(value) || value === '',
      },
      closable: {
        type: Boolean,
        default: true,
      },
    },
    data() {
      return {
        visible: true,
      };
    },
    computed: {
      alertClass() {
        return {
          'app-alert': true,
          'app-alert--success': this.type === 'success',
          'app-alert--error': this.type === 'error',
          'app-alert--warning': this.type === 'warning',
        };
      },
    },
    methods: {
      closeAlert() {
        this.visible = false;
        this.$emit('close');
      },
    },
  };
  </script>
  
  <style scoped>
  .app-alert {
    padding: 10px 20px;
    margin: 10px 0;
    border-radius: 5px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  
  .app-alert--success {
    background-color: #d4edda;
    color: #155724;
  }
  
  .app-alert--error {
    background-color: #f8d7da;
    color: #721c24;
  }
  
  .app-alert--warning {
    background-color: #fff3cd;
    color: #856404;
  }
  
  .app-alert__close-btn {
    background: none;
    border: none;
    font-size: 20px;
    cursor: pointer;
    color: inherit;
  }
  </style>
  