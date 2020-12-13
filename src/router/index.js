import Vue from "vue";
import VueRouter from "vue-router";
import Login from "../views/Login.vue";
import Register from "../views/Register.vue";
import Cards from "../components/cards.vue";
import Qrscane from "../views/Qrscane.vue";
import answerBox from "../views/answerBox.vue";
import howToUse from "../views/howToUse.vue";
import Scenarios from "../views/Scenarios.vue";
import GetScenario from "../components/GetScenario.vue";
import RemoteAccount from "../views/RemoteAccount.vue";
import ConfirmEmail from "../views/ConfirmEmail.vue";
import ResendActivation from "../views/ResendActivation.vue";
import Settings from "../views/Settings.vue";
import GetSettings from "../components/GetSettings.vue";
import forTest from "../views/forTest.vue";
import Reports from "../views/Reports.vue";
import GetReports from "../components/GetReports.vue";
import thisReport from "../components/ReportComponents.vue";
import MujeebkAi from "../views/MujeebkAi.vue";
import SellerDashboard from "../views/SellerDashboard.vue";
import GeneralStatistics from "../views/GeneralStatistics.vue";
import Privacy from "../views/Privacy.vue";
import Payments from "../views/Payments.vue";
import BotStatus from "../views/BotStatus.vue";
import GetBotStatus from '../components/GetBotStatus.vue'
import SchMessage from '../views/SchMessage.vue'
import GetSchMessages from '../components/GetSchMessages'
import AddSch from '../components/AddSch'
import ForgetPassword from '../views/ForgetPassword.vue'
import ForgetenPassword from '../views/ForgetenPassword.vue'
import Plans from '../views/PLans.vue'
import WhatsappWidget from '../views/WhatsappWidget.vue'
import GetWidget from '../components/GetWidget.vue'
import Support from '../views/Support.vue'
import AuthAgent from '../views/AuthAgent.vue'
import Paypal from '../views/Paypal.vue'
Vue.use(VueRouter);

const routes = [
  {
    path: "/auth_agent",
    component: AuthAgent,
    beforeEnter: (to, from, next) => {
      if (to.path == '/auth_agent' && !localStorage.getItem('session_id')) {
        next({path: "/login"})
        localStorage.clear()
      } else {
        next()
      }
    }
  },
  {
    path: "/sch_messages",
    component: GetSchMessages,
    beforeEnter: (to, from, next) => {
      if (to.path == '/sch_messages' && !localStorage.getItem('session_id')) {
        next({path: "/login"})
      } else {
        next()
      }
    }
  },
  {
    path: "/widget_settings",
    component: GetWidget,
    beforeEnter: (to, from, next) => {
      if (to.path == '/settings_widget' && !localStorage.getItem('session_id')) {
        next({path: "/login"})
      } else {
        next()
      }
    }
  },
  {
    path: "/widget_settings/:id",
    component: WhatsappWidget,
    beforeEnter: (to, from, next) => {
      if (to.path == `/settings_widget/${to.params.id}` && !localStorage.getItem('session_id')) {
        next({path: "/login"})
      } else {
        next()
      }
    }
  },
  {
    path: "/sch_messages/:id",
    component: AddSch,
    beforeEnter: (to, from, next) => {
      if (to.path == `/sch_messages/${to.params.id}` && !localStorage.getItem('session_id')) {
        next({path: "/login"})
      } else {
        next()
      }
    }
  },
  {
    path: "/sch_messages/:id/:new",
    name: "newSch",
    component: SchMessage,
    beforeEnter: (to, from, next) => {
      if (to.path == `/sch_messages/${to.params.id}/${to.params.new}` && !localStorage.getItem('session_id')) {
        next({path: "/login"})
      } else {
        next()
      }
    }
  },
  {
    path: "/bot_status",
    component: GetBotStatus,
    beforeEnter: (to, from, next) => {
      if (to.path == '/bot_status' && !localStorage.getItem('session_id')) {
        next({path: "/login"})
      } else {
        next()
      }
    }
  },
  {
    path: "/bot_status/:id",
    component: BotStatus,
    beforeEnter: (to, from, next) => {
      if (to.path == `/bot_status/${to.params.id}` && !localStorage.getItem('session_id')) {
        next({path: "/login"})
      } else {
        next()
      }
    }
  },
  {
    path: "/seller_dashboard",
    component: SellerDashboard,
    beforeEnter: (to, from, next) => {
      if (to.path == '/seller_dashboard' && !localStorage.getItem('session_id')) {
        next({path: "/login"})
      } else {
        next()
      }
    }
  },
  {
    path: "/general_statistics",
    component: GeneralStatistics,
    beforeEnter: (to, from, next) => {
      if (to.path == '/general_statistics' && !localStorage.getItem('session_id')) {
        next({path: "/login"})
      } else {
        next()
      }
    }

  },
  {
    path: "/privacy_and_security",
    component: Privacy,
    beforeEnter: (to, from, next) => {
      if (to.path == '/privacy_and_security' && !localStorage.getItem('session_id')) {
        next({path: "/login"})
      } else {
        next()
      }
    }
  },
  {
    path: "/payments_and_bills/:id",
    component: Payments,
    beforeEnter: (to, from, next) => {
      if (to.path == `/payments_and_bills/${to.params.id}` && !localStorage.getItem('session_id')) {
        next({path: "/login"})
      } else {
        next()
      }
    }
  },
  {
    path: "/mujeebk_ai",
    component: MujeebkAi,
    beforeEnter: (to, from, next) => {
      if (to.path == '/mujeebk_ai' && !localStorage.getItem('session_id')) {
        next({path: "/login"})
      } else {
        next()
      }
    }
  },
  {
    path: "/report/:id/:number",
    component: thisReport,
    beforeEnter: (to, from, next) => {
      if (to.path == `/report/${to.params.id}/${to.params.number}` && !localStorage.getItem('session_id')) {
        next({path: "/login"})
      } else {
        next()
      }
    }
  },
  {
    path: "/reports",
    component: GetReports,
    beforeEnter: (to, from, next) => {
      if (to.path == '/reports' && !localStorage.getItem('session_id')) {
        next({path: "/login"})
      } else {
        next()
      }
    }
  },
  {
    path: "/reports/:id",
    component: Reports,
    beforeEnter: (to, from, next) => {
      console.log(to);
      if (to.path == `/reports/${to.params.id}` && !localStorage.getItem('session_id')) {
        next({path: "/login"})
      } else {
        next()
      }
    }
  },
  {
    path: "/test",
    component: forTest,
    beforeEnter: (to, from, next) => {
      if (to.path == '/test' && !localStorage.getItem('session_id')) {
        next({path: "/login"})
      } else {
        next()
      }
    }
  },
  {
    path: "/settings",
    name: "Settings",
    component: GetSettings,
    beforeEnter: (to, from, next) => {
      if (to.path == '/settings' && !localStorage.getItem('session_id')) {
        next({path: "/login"})
      } else {
        next()
      }
    }
  },
  {
    path: "/settings/:id",
    name: "SettingsID",
    component: Settings,
    beforeEnter: (to, from, next) => {
      if (to.path == `/settings${to.params.id}` && !localStorage.getItem('session_id')) {
        next({path: "/login"})
      } else {
        next()
      }
    }
  },
  {
    path: "/resend-activation/:id",
    name: "resendActivation",
    component: ResendActivation,
    beforeEnter: (to, from, next) => {
      if (to.path == `/resend-activation/${to.params.id}` && !localStorage.getItem('session_id')) {
        next()
      } else {
        next({path: '/cards'})
      }
    }
  },
  {
    path: "/confirm/:id",
    name: "confirmEmail",
    component: ConfirmEmail,
    beforeEnter: (to, from, next) => {
      console.log(to.path);
      if (to.path == `/confirm/${to.params.id}` && !localStorage.getItem('session_id')) {
        next()
      } else {
        next({path: '/cards'})
      }
    }
  },
  {
    path: "/qr",
    name: "OuterQr",
    component: RemoteAccount,
    beforeEnter: (to, from, next) => {
      if (to.path == '/qr' && !localStorage.getItem('session_id')) {
        next({path: "/login"})
      } else {
        next()
      }
    }
  },
  {
    path: "/login",
    name: "Login",
    component: Login,
    beforeEnter: (to, from, next) => {
      if (to.path == '/login' && !localStorage.getItem('session_id')) {
        next()
      } else {
        next({path: '/cards'})
      }
    }
  },
  {
    path: "/register",
    name: "Register",
    component: Register,
    beforeEnter: (to, from, next) => {
      if (to.path == '/register' && !localStorage.getItem('session_id')) {
        next()
      } else {
        next({path: '/cards'})
      }
    }
  },
  {
    path: "/forget_password",
    name: "ForgetPassword",
    component: ForgetPassword,
    beforeEnter: (to, from, next) => {
      if (to.path == '/forget_password' && !localStorage.getItem('session_id')) {
        next()
      } else {
        next({path: '/cards'})
      }
    }
  },
  {
    path: "/forgeten_password",
    name: "ForgetenPassword",
    component: ForgetenPassword,
    beforeEnter: (to, from, next) => {
      if (to.path == '/forgeten_password' && !localStorage.getItem('session_id')) {
        next()
      } else {
        next({path: '/cards'})
      }
    }
  },
  {
    path: "/cards",
    name: "Cards",
    component: Cards,
    beforeEnter: (to, from, next) => {
      if (to.path == '/cards' && !localStorage.getItem('session_id')) {
        next({path: "/login"})
        localStorage.clear()
      } else {
        next()
      }
    },
    // meta: {
    //   KeepAlive: true // Need to be cached
    // }
  },
  {
    path: "/paypal_payment/:id/:plantype/:days/:number",
    name: "PaypalPayment",
    component: Paypal,
    beforeEnter: (to, from, next) => {
      if (to.path == `/paypal_payment/${to.params.id}/${to.params.plantype}/${to.params.days}/${to.params.number}` && !localStorage.getItem('session_id')) {
        next({path: "/login"})
      } else {
        next()
      }
    }
  },
  {
    path: "/plans/:id/:number",
    name: "Plans",
    component: Plans,
    // beforeEnter: (to, from, next) => {
    //   if (to.path == `/plans/${to.params.id}/${to.params.number}` && !localStorage.getItem('session_id')) {
    //     next({path: "/login"})
    //   } else {
    //     next()
    //   }
    // }
  },
  {
    path: "/mujeebk_web",
    name: "Mujeebk Web",
    component: Qrscane,
    beforeEnter: (to, from, next) => {
      if (to.path == '/mujeebk_web' && !localStorage.getItem('session_id')) {
        next({path: "/login"})
      } else {
        next()
      }
    }
  },
  {
    path: "/scenario",
    name: "all-scenarios",
    component: GetScenario,
    beforeEnter: (to, from, next) => {
      if (to.path == '/scenario' && !localStorage.getItem('session_id')) {
        next({path: "/login"})
      } else {
        next()
      }
    }
  },
  {
    path: "/scenario/:id/:new",
    name: "box",
    component: answerBox,
    beforeEnter: (to, from, next) => {
      if (to.path == `/scenario/${to.params.id}/${to.params.new}` && !localStorage.getItem('session_id')) {
        next({path: "/login"})
      } else {
        next()
      }
    }
  },
  {
    path: "/how-to-use",
    component: howToUse,
  },
  {
    path: "/scenario/:id",
    component: Scenarios,
    beforeEnter: (to, from, next) => {
      if (to.path == `scenario/${to.params.id}` && !localStorage.getItem('session_id')) {
        next({path: "/login"})
      } else {
        next()
      }
    }
  },
  {
    path: "/support",
    component: Support,
    beforeEnter: (to, from, next) => {
      if (to.path == `support` && !localStorage.getItem('session_id')) {
        next({path: "/login"})
      } else {
        next()
      }
    }
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
  scrollBehavior () {
    // return desired position
    return { x: 0, y: 0 }
  }
});

export default router;
