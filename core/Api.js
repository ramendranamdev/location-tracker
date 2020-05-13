import axios from "axios";
import { emailValidator, passwordValidator } from "./utils";
import { api_base_url } from "./../config";

const base_url = "http://192.168.43.166:3000";
const login_url = base_url + "/login";

export const getData = function (token) {
  return axios
    .get(base_url, {
      "content-type": "Application/Json",
      "api-access-token": token,
    })
    .then((data) => {
      return data;
    })
    .catch((err) => {
      console.log(err);
      throw err;
    });
};

export const registerUser = (name, email, password) =>
  //Sanitize Data here first
  {
    return new Promise((resolve, reject) => {
      let user = {
        name,
        email,
        password,
      };
      axios
        .post("http://192.168.43.166:3000/users", user, {
          "content-type": "Application/Json",
        })
        .then((result) => {
          //   console.log(result.data);
          resolve(result.data);
        })
        .catch((err) => {
          reject(err);
        });
      //   console.log("Nothing Happend");
    });
  };

export const loginUser = (email, password) => {
  return new Promise((resolve, reject) => {
    let user = {
      email,
      password,
    };

    axios
      .post(login_url, user, { "content-type": "Application/Json" })
      .then((result) => {
        const data = result.data;
        resolve(data);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

// axios
//     .post("http://192.168.43.166:3000/users", user, {
//       "content-type": "Application/Json",
//     })
//     .then((data) => {
//       console.log(data.data);

//       return data;
//     })
//     .catch((err) => {
//       console.log(err);
//       throw err;
//     });
//   //   console.log(user);
//   //   return user;
// };
