export default {
  methods: {
    shadeColor(color, percent) {
      var R = parseInt(color.substring(1, 3), 16);
      var G = parseInt(color.substring(3, 5), 16);
      var B = parseInt(color.substring(5, 7), 16);

      R = parseInt((R * (100 + percent)) / 100);
      G = parseInt((G * (100 + percent)) / 100);
      B = parseInt((B * (100 + percent)) / 100);

      R = R < 255 ? R : 255;
      G = G < 255 ? G : 255;
      B = B < 255 ? B : 255;

      var RR =
        R.toString(16).length == 1 ? "0" + R.toString(16) : R.toString(16);
      var GG =
        G.toString(16).length == 1 ? "0" + G.toString(16) : G.toString(16);
      var BB =
        B.toString(16).length == 1 ? "0" + B.toString(16) : B.toString(16);

      return "#" + RR + GG + BB;
    },
    flatten(elements, color) {
      elements.forEach(
        function(element) {
          if (element.children.length > 0) {
            element.color = this.shadeColor(color, -5);
            this.flatten(element.children, element.color);
          }
          element.color = this.shadeColor(color, -5);
        }.bind(this)
      );
      return elements;
    },
    find_set(data, id, number_id) {
      var BreakException = {};
      var reorder = [];
      try {
        data.forEach(
          function(element) {
            if (id == element.p_id) {
              data.forEach(function(sub_element) {
                reorder.push({
                  id: sub_element.id
                });
              });
              throw BreakException;
            } else {
              if (element.children.length > 0) {
                this.find_set(element.children, id, number_id);
              }
            }
          }.bind(this)
        );
        if (reorder.length > 0) {
          let json = JSON.stringify(reorder);
          this.post({
            router: "update_tree_order",
            json_order: json,
            number_id: number_id
          });

          //console.log(JSON.stringify(reorder));
        }
      } catch (e) {
        if (reorder.length > 0) {
          let json = JSON.stringify(reorder);
          this.post({
            router: "update_tree_order",
            json_order: json,
            number_id: number_id
          });
          //console.log(JSON.stringify(reorder));
        }
      }
    }
  }
};
