// stateMachine.js
const { createMachine } = require('xstate');

const ecommerceMachine = createMachine({
  
  id: 'ecommerce',
  initial: 'SIGNUP',
  context: {
    
  },
  states: {
    SIGNUP:{
      on:{
       Signup:{ target: 'LOGIN',
        actions:['handleSignup','sendCtx']
       },
       Signin:{
        target: 'LOGIN',
        actions:['sendCtx']
       }
      }
    },

    LOGIN: {
      on: {
        Login:{
            target: 'ADMIN',
          actions:  ['handleLogin','sendCtx']
          },
       Sign_up:{ target: 'SIGNUP',
        actions:['sendCtx']
       },
        }
    },

    ADMIN:{
on:{
  Addproduct: {
    target: 'ADDPRODUCT',
    actions: ['sendCtx']
  },
  Editproduct:{
    target:'EDITPRODUCT',
    actions: ['sendCtx']
  },
  Deleteproduct:{
    target:'DELETEPRODUCT',
    actions: ['sendCtx']
  },
 Displayproduct:{
    target:'DISPLAYPRODUCT',
    actions: ['sendCtx']
  },
  Logout:{
    target:'LOGIN',
    actions:['sendCtx']
  }
}
    },
    ADDPRODUCT:{
      on:{
        Cancel:{
          target: 'ADMIN',
          actions: ['sendCtx']
        },
        Save:{
          target:'ADMIN',
          actions: ['sendCtx']
        }
      }
    },
    EDITPRODUCT:{
      on:{
 Cancel:{
          target: 'ADMIN',
          actions: ['sendCtx']
        },
        Save:{
          target:'ADMIN',
          actions: ['sendCtx']
        }
      }
    },
    DELETEPRODUCT:{
on:{
 Delete:{
          target: 'DELETEPRODUCT',
          actions: ['sendCtx']
        },
        Cancel:{
          target:'ADMIN',
          actions: ['sendCtx']
        }
      }
    },
    DISPLAYPRODUCT:{
      on:{
        Back:{
          target:'ADMIN',
        actions:['sendCtx']      
        }
      }
    }
   
   
  }
},


{
  actions: {
   
    handleLogin: (_context, _event) => {
      console.log('Signin attempt');
    },
  
  }
});

module.exports = ecommerceMachine;