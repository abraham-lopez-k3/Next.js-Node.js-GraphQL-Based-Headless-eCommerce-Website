import Auth from "./auth";
import axios from "axios";
import { isEmpty, client_app_route_url } from "./helper";
import APclient from "../Client";
import cookie from "react-cookies";
import { get } from "lodash";
// const location = window.location.origin;
// const location = "http://localhost:8000";
// const location = "https://demo1.ravendel.io";
const location = "https://demo1-ravendel.hbwebsol.com";

export const mutation = async (query, variables) => {
  try {
    
    const response = await APclient.mutate({
      mutation: query,
      variables,
      fetchPolicy: "no-cache",
    });
    return Promise.resolve(response);
  } catch (error) {
    const errors = JSON.parse(JSON.stringify(error));
    const { graphQLErrors, networkError } = errors;

    if (graphQLErrors?.length && !isEmpty(graphQLErrors[0]?.message)) {
      return Promise.reject(get(graphQLErrors[0], "message"));
    }

    if (networkError && networkError.statusCode === 400) {
      return Promise.reject(get(errors, "message"));
    }

    const networkErrorExtensions = get(
      networkError,
      "result.errors[0].extensions"
    );
    if (networkErrorExtensions?.code === 401) {
      cookie.remove("auth");
      Auth.logout();
      return Promise.reject(get(networkError, "result.errors[0].message"));
    }
    return Promise.reject("Something went wrong");
  }
};

export const query = async (query, variables) => {
  try {
    const response = await APclient.query({
      query: query,
      variables,
      fetchPolicy: "no-cache", //fetchPolicy "cache-first" | "network-only" | "cache-only" | "no-cache" | "standby"
    });
    return Promise.resolve(response);
  } catch (error) {
    const errors = JSON.parse(JSON.stringify(error));
    const { graphQLErrors, networkError } = errors;

    if (graphQLErrors?.length && !isEmpty(graphQLErrors[0]?.message)) {
      return Promise.reject(get(graphQLErrors[0], "message"));
    }

    if (networkError && networkError.statusCode === 400) {
      return Promise.reject(get(errors, "message"));
    }

    const networkErrorExtensions = get(
      networkError,
      "result.errors[0].extensions"
    );
    if (networkErrorExtensions?.code === 401) {
      cookie.remove("auth");
      Auth.logout();
      return Promise.reject(get(networkError, "result.errors[0].message"));
    }

    return Promise.reject("Something went wrong");
  }
};

const service = (config, navigate) => {
  if (Auth.getToken()) {
    const token = Auth.getToken();
    config.headers = {
      authorization: token,
    };
  }

  //interceptors handle network error
  axios.interceptors.response.use(
    (response) => {
      return response;
    },
    function (error) {
      if (!error?.response) {
        error={response : {
          data: "Network error",
          status: 500,
        }}
      }
      if (error.response.status === 401) {
        Auth.logout();
        navigate(`${client_app_route_url}login`);
      }
      return Promise.reject(get(error,'response.data'),'Something went wrong');
    }
  );
  return axios(config);
};
export default service;

export const login = (email, password, navigate) => {
  const body = {
    email: email,
    password: password,
  };
  return service(
    {
      method: "POST",
      url: `${location}/apis/users/login`,
      data: body,
    },
    navigate
  ).then(async (res) => {
    await Auth.setUserToken(res.data);
    return res;
  });
};

export const getUpdatedUrl = (table, url) => {
  return service({
    method: "POST",
    url: `${location}/apis/misc/checkurl`,
    data: { url: url, table: table },
  }).then((res) => {
    if (res.data.success) {
      return Promise.resolve(res.data.url);
    }
  });
};

export const deleteProductVariation = (id) => {
  return service({
    method: "POST",
    url: `${location}/apis/misc/delete_variation`,
    data: { id: id },
  }).then((res) => {
    if (res.data.success) {
      return Promise.resolve(true);
    }
  });
};

export const deleteProductVariationImage = (obj) => {
  return service({
    method: "POST",
    url: `${location}/apis/misc/delete_image`,
    data: { image: obj },
  }).then((res) => {
    if (res.data.success) {
      return Promise.resolve(true);
    }
  });
};
