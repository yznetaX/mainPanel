import axios from "axios";
const baseUrl = "https://mujeebk.com/api/";
const checkApiUrl = baseUrl + "web_api.php";
//  const checkApiUrl = baseUrl + "test_api.php";
const saveApiUrl = baseUrl + "web_api.php";
//  const saveApiUrl = baseUrl + "test_api.php";
export const generateId = function() {
  // Math.random should be unique because of its seeding algorithm.
  // Convert it to base 36 (numbers + letters), and grab the first 9 characters
  // after the decimal.
  return Math.random()
    .toString(36)
    .substr(2, 9);
};

export const deepClone = function(obj) {
  return JSON.parse(JSON.stringify(obj));
};

export const saveToLocalStorage = function(obj, storage) {
  if (obj) {
    localStorage.setItem(storage, JSON.stringify(obj));
  }
};


export const loadFromLocalStorage = function(storage) {
  if (
    localStorage.getItem(storage) &&
    localStorage.getItem(storage).length > 0
  ) {
    return JSON.parse(localStorage.getItem(storage));
  }
  return null;
};

export const sleep = function(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

export const mergeArrays = function(...arrays) {
  let jointArray = [];

  arrays.forEach((array) => {
    jointArray = [...jointArray, ...array];
  });
  const uniqueArray = jointArray.reduce((newArray, item) => {
    if (newArray.includes(item)) {
      return newArray;
    } else {
      return [...newArray, item];
    }
  }, []);
  return uniqueArray;
};

export const postSchDataToServer = function(data){
let formData = new FormData();
  formData.append("dialogId", data.dialogId);
  formData.append("option", JSON.stringify(data.option));
  
  formData.append("session_id", localStorage.getItem("session_id"));// true? وبجنا نمرر الراوتر  لحظة
  formData.append("router", "validate_dialog");
  if (data.inputs.url) {
    formData.append("url", data.inputs.url);
  }
  if (data.dialogId) {
    formData.append("id", data.dialogId);
  }
if(data.inputs.message)
{
  formData.append("message", data.inputs.message);
}
  if(data.inputs.voice_type){
    formData.append("voice_type", data.inputs.voice_type.value);
  }
  if(data.inputs.position){
    formData.append("send_gps_location", JSON.stringify(data.inputs.position));
  }
  if(data.inputs.zoom){
    formData.append("zoom", data.inputs.zoom);
  }
  if(data.inputs.card_number){
    formData.append("card_number", data.inputs.card_number);
  }
  if(data.inputs.display_name){
    formData.append("display_name", data.inputs.display_name);
  }
  if(data.inputs.ttsMessage){
    formData.append("tts_message", data.inputs.ttsMessage);
  }
  if(data.inputs.listmessage){
    formData.append("list_message", JSON.stringify(data.inputs.listmessage));
  }
  if (data.inputs.file) {
    formData.append(
      "file",
      data.inputs.file,
      // data.inputs.file.name
    );
  }
  if (data.botTime) {
    formData.append("botTime", data.botTime);
  }
  if (data.date) {
    formData.append("date", data.date);
  }
  if (data.timezone) {
    formData.append("timezone", data.timezone);
  }
  if (data.allowedNumber) {
    formData.append("allowedNumber", data.allowedNumber);
  }

  return axios
    .post(checkApiUrl, formData)
    .then((response) => {
      return response.data;
    })
    .catch((er) => {
      return { success: false, error: er, url: null };
    });
}
export const postImgToServer = (imgData) =>{
  let formData = new FormData();
  formData.append("router", "validate_dialog");
  formData.append("session_id", localStorage.getItem("session_id"));
  if(imgData.file){
    formData.append("file", imgData.file);
  }
  if(imgData.url){
    formData.append("url", imgData.url);
  }
  formData.append("JumpTo", null)
  formData.append("option", '{"id": "send_photo"}');
  return axios
    .post(checkApiUrl, formData)
    .then((response) => {
      return response.data;
    })
    .catch((er) => {
      return { success: false, error: er, url: null };
    });
}
export const postDataToServer = function(dialogData) {
  // post to the server
  // response must be an object like
  /* 
      {
        success:true,// true or false
        error:"",// error message if exists
        url:"", // url to the file or the url set by user
      }
  */
  let formData = new FormData();
  formData.append("dialogId", dialogData.dialogId);
  formData.append("option", JSON.stringify(dialogData.option));
  
  formData.append("session_id", localStorage.getItem("session_id"));// true? وبجنا نمرر الراوتر  لحظة
  formData.append("router", "validate_dialog");
  if (dialogData.inputs.url) {
    formData.append("url", dialogData.inputs.url);
  }
  if (dialogData.dialogId) {
    formData.append("id", dialogData.dialogId);
  }
if(dialogData.inputs.message)
{
  formData.append("message", dialogData.inputs.message);
}
  if(dialogData.inputs.voice_type){
    formData.append("voice_type", dialogData.inputs.voice_type.value);
  }
  if(dialogData.inputs.position){
    formData.append("send_gps_location", JSON.stringify(dialogData.inputs.position));
  }
  if(dialogData.inputs.zoom){
    formData.append("zoom", dialogData.inputs.zoom);
  }
  if(dialogData.inputs.card_number){
    formData.append("card_number", dialogData.inputs.card_number);
  }
  if(dialogData.inputs.display_name){
    formData.append("display_name", dialogData.inputs.display_name);
  }
  if(dialogData.inputs.ttsMessage){
    formData.append("tts_message", dialogData.inputs.ttsMessage);
  }
  if(dialogData.inputs.listmessage){
    formData.append("list_message", JSON.stringify(dialogData.inputs.listmessage));
  }
  if(dialogData.inputs.multiMessage){
    formData.append("send_multiple_messages", JSON.stringify(dialogData.inputs.multiMessage));
  }
  
  if (dialogData.inputs.file) {
    formData.append(
      "file",
      dialogData.inputs.file,
      dialogData.inputs.file.name
    );
  }

  return axios
    .post(checkApiUrl, formData)
    .then((response) => {
      return response.data;
    })
    .catch((er) => {
      return { success: false, error: er, url: null };
    });
};

export const postSavedDataToServer = function(chain, deletedUrls, number_id, title, scenario_id ,deleteIds) {
  // post to the server
  // response must be an object like
  /* 
      {
        success:true,// true or false
        error:"",// error message if exists
      }
  */
 let formData = new FormData();
  // شو؟
  formData.append("deletedUrls", JSON.stringify(deletedUrls))
  formData.append("deleteIds", JSON.stringify(deleteIds))
  formData.append("session_id", localStorage.getItem("session_id"));
  formData.append("router", "save_scenario");
  formData.append("number_id", number_id)
  formData.append("MultipleLine", null)
  formData.append("title", title)
  formData.append("scenario_json", JSON.stringify(chain));
  if(scenario_id && scenario_id != "new")
  {
    formData.append("scenario_id" , scenario_id);
  }
  return axios
    .post(saveApiUrl, formData)
    .then((response) => {
      return response.data;
    })
    .catch((er) => {
      return { success: false, error: er };
    });
};
