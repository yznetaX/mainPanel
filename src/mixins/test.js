export default {
  data() {
    return {
      baseUrl: "http://107.6.183.138:4567/api",
      scanned: false
    };
  },
  methods: {
    uuidv4() {
      return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
        (
          c ^
          (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))
        ).toString(16)
      );
    },
    async checkProfile() {
      while (!this.scanned) {
        var profile = await this.profileRequest();
        await this.wait(500);
        if (profile.code != 500) {
          this.scanned = true;
          document.getElementById("data").textContent = JSON.stringify(profile);
        }
      }
    },

    async wait(time) {
      return new Promise(resolve => {
        setTimeout(() => {
          resolve();
        }, time);
      });
    },
    async getQR() {
      let sessionId = this.uuidv4();
      const formData = new URLSearchParams();
      formData.set("sessionId", sessionId);
      var res = await fetch(this.baseUrl + "/profile/scanqr", {
        body: formData,
        method: "POST"
      });
      var data = await res.json();
      this.value = data.base64;
      return data.base64;
    },
    async profileRequest() {
      var res = await fetch(
        this.baseUrl + "/profile/me?sessionId=" + this.sessionId
      );
      var data = await res.json();
      return data;
    }
  },
  created() {


    this.getQR();
  }
};
