import axios from "axios";
import { generateId } from '../components/automated/utils'
export default {
  data() {
    return {
      base_url: "https://mujeebk.com/api/web_api.php?rand="+ generateId()
    };
  },
  methods: {
    async post(parameters, checkSession) {
      /* eslint-disable */
        var bodyFormData = new FormData();
          try {
            if (localStorage.getItem("session") != "undefined") {
              bodyFormData.append("session_id", localStorage.getItem("session_id"));
            }
            Object.keys(parameters).forEach(function(key) {
              bodyFormData.append(key, parameters[key]);
            });
              // const respone = await axios.post(this.base_url, bodyFormData, checkSession)
              const respone = await axios.post(this.base_url+'&router_debug='+parameters['router'], bodyFormData, checkSession)
              .then( async (response) => {
                if (checkSession) {
                  if (
                    response.data.session == false
                  ) {
                    localStorage.removeItem("session_id");
                    localStorage.removeItem("lat");
                    localStorage.removeItem("lng");
                  } else {
                    if(response.data.session == true)
                    {
                      localStorage.setItem('session_id', response.data.session_id)
                    }
                  }
                } else {
                  if(response.data.session)
                  {
                    localStorage.setItem('session_id', response.data.session_id)
                  } else {
                    localStorage.removeItem("session_id");
                    localStorage.removeItem("lat");
                    localStorage.removeItem("lng");
                  }
                }
                return response
              })
              .catch((response) => {
                console.log("Axios Error: " + response);
                this.snake = true
              });
              return respone
          } catch (e) {
            console.log("Promise error" + e);
          }
      },
  },
};
