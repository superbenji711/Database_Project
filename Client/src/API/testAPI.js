import axios from "axios";
import API from "./baseAPI.js";

const testCall = async () => {
    let axiosResponse = API.get("/sector")
      .then((response) => {
          console.log(response.data)
        return response.data;
      })
      .catch(error => {
        if (error.response) {
          return { error: error.response.data.error };
        }
        return {
          error: "Unable to retrieve client!",
        };
      });
    return axiosResponse;
  };


  export {testCall};