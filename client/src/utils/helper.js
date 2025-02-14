import { get } from "lodash";
import NoImagePlaceHolder from "../assets/images/NoImagePlaceHolder.png";
import { CASH_ON_DELIVERY, STRIPE, PAYPAL, RAZORPAY, BANKTRANSFER } from "./constant";
export const isEmpty = (value) =>
  value === undefined ||
  value === null ||
  (typeof value === "object" && Object.keys(value).length === 0) ||
  (typeof value === "string" && value.trim().length === 0);

// export const baseUrl = "https://demo1.ravendel.io/";
export const baseUrl = "https://demo1-ravendel.hbwebsol.com/";
// export const baseUrl = "http://localhost:8000/";
export const client_app_route_url = "/admin/";

export var bucketName = "revendal-image";
export var bucketBaseURL = `https://${bucketName}.s3.amazonaws.com/`;

if (process.env.NODE_ENV === "production") {
  bucketName = "revendal-image-prod";
  bucketBaseURL = `https://${bucketName}.s3.amazonaws.com/`;
}

/*-------------------------------------------------------------------------------------------------------------------------------------- */
//simple category array to Tree array
export const imageOnError = (event) => {
  event.target.src = NoImagePlaceHolder;
};
export const unflatten = (arr) => {
  var tree = [],
    mappedArr = {},
    arrElem,
    mappedElem;

  // First map the nodes of the array to an object -> create a hash table.
  for (var i = 0, len = arr.length; i < len; i++) {
    arrElem = arr[i];
    mappedArr[arrElem.id] = arrElem;
    mappedArr[arrElem.id]["children"] = [];
  }

  for (var id in mappedArr) {
    if (mappedArr.hasOwnProperty(id)) {
      mappedElem = mappedArr[id];
      // If the element is not at the root level, add it to its parent array of children.

      if (mappedElem.parentId && mappedArr[mappedElem["parentId"]]) {
        mappedArr[mappedElem["parentId"]]["children"].push(mappedElem);
      }
      // If the element is at the root level, add it to first level elements array.
      else {
        tree.push(mappedElem);
      }
    }
  }
  return tree;
};

/*----------------------------------------------------------------------------------------------------------------------------------------- */

export var categoriesPrint = "";
export const printTree = (tree) => {
  categoriesPrint += "<ul className='category-dropdown'>";

  for (let i in tree) {
    categoriesPrint += `<li className="${
      tree[i].children && tree[i].children.length ? "has-submenu" : ""
    }">                               
                        <label for="${
                          tree[i].name
                        }" className="checkmark-container">${tree[i].name}
                          <input type='checkbox' name="abc" id="${
                            tree[i].name
                          }">
                          <span className="checkmark"></span>
                        </label>`;
    if (tree[i].children && tree[i].children.length) {
      printTree(tree[i].children);
    }
    categoriesPrint += "</li>";
  }

  categoriesPrint += "</ul>";
};

/*------------------------------------------------------------------------------------------------------------------------------------------ */

export const toUrl = (text) => {
  let url = text.replace(/[^a-z0-9\s]/gi, "-");
  return url.toLowerCase();
};

/*---------------------------------------------------------------------------------------------------------------------*/

export const allPossibleCases = (arr) => {
  if (arr.length === 1) {
    let comb = [];
    for (const i of arr[0]) {
      comb.push([i]);
    }

    return comb;
  } else {
    var result = [];
    var allCasesOfRest = allPossibleCases(arr.slice(1)); // recur with the rest of array
    for (var i = 0; i < allCasesOfRest.length; i++) {
      for (var j = 0; j < arr[0].length; j++) {
        let comb = [];
        comb.push(arr[0][j]);
        if (Array.isArray(allCasesOfRest[i])) {
          for (const k of allCasesOfRest[i]) {
            comb.push(k);
          }
        } else {
          comb.push(allCasesOfRest[i]);
        }
        result.push(comb);
      }
    }
    return result;
  }
};

/*------------------------------------------------------------------------------------------------------------------------------*/

export const getResponseHandler = (response, key) => {
  let success = false;
  let error = false;
  let message = "";
  let data = [];

  if (response && response.data && response.data[key]) {
    let res = response.data[key];
    if (res.message) {
      if (res.message.success) {
        if (res.data) {
          data = res.data;
        }
        success = true;
      } else {
        error = true;
      }
      if (res.message.message) {
        message = res.message.message;
      } else {
        message = "Something went wrong!";
      }
    } else {
      error = true;
      message = "Something went wrong!";
    }
  } else {
    message = "Something went wrong!";
  }

  return [error, success, message, data];
};

export const mutationResponseHandler = (response, key) => {
  let success = false;
  let error = false;
  let message = "";

  try {
    if (response && response.data && response.data[key]) {
      let res = response.data[key];
      if (res.message) {
        if (res.success) {
          success = true;
        } else {
          error = true;
        }
        if (res.message) {
          message = res.message;
        } else {
          message = "Something went wrong!";
        }
      } else {
        error = true;
        message = "Something went wrong!";
      }
    } else {
      message = "Something went wrong!";
    }
  } catch (e) {
    console.log("er", e);
  }
  console.log(success);

  return [error, success, message];
};

export const getBaseUrl = (setting) => {
  let status = get(setting, "settings.imageStorage.status", "");
  return status === "localStorage" ? baseUrl : bucketBaseURL;
};

export const getValue = (value) => {
  return value === null ? "" : value;
};

export const getPaymentMethodLabel = (paymentMethod) => {
  switch (paymentMethod) {
    case CASH_ON_DELIVERY:
      return "Cash On Delivery";
    case STRIPE:
      return "Stripe";
    case PAYPAL:
      return "Paypal";
    case RAZORPAY:
      return "Razor Pay";
    case BANKTRANSFER:
      return "Bank Transfer";
    default:
      return "Cash On Delivery";
  }
};
export const getCheckedIds = (data) => {
  const checkedIds = [];

  function checkNode(node) {
    if (node?.checked || hasCheckedChild(node)) {
      checkedIds.push(node.id);
    }
    if (node?.children && node?.children?.length > 0) {
      node?.children?.forEach((child) => checkNode(child));
    }
  }

  data?.forEach(checkNode);
  return checkedIds;
};
export const hasCheckedChild = (cat) => {
  if (cat?.checked) {
    return true;
  }
  if (cat?.children && Array.isArray(cat?.children)) {
    for (const child of cat?.children) {
      if (hasCheckedChild(child)) {
        return true;
      }
    }
  }
  return false;
};

export const calculateDiscount = (price, sellPrice) => {
  if (sellPrice && sellPrice > 0 && sellPrice < price) {
    const discountPercentage = Math.floor(((price - sellPrice) / price) * 100);
    console.log(discountPercentage,'discountPercentage')
    return discountPercentage || 0;
  }

return 0;
};

export const filterTreeData = (data) => {
  return data.reduce((acc, category) => {
    const filteredCategory = {
      id: category?.id,
      name: category.name,
      checked: category.checked, 
      url: category.url, 

    };
    if (category?.children && category?.children?.length > 0) {
      filteredCategory.children = category?.children;
    }

    if (category?.checked) {
      acc.push(filteredCategory);
    }

   else if (category?.children && category?.children?.length > 0) {
      filteredCategory.children = filterTreeData(category?.children);
      if (filteredCategory.children.length > 0) {
        acc.push(filteredCategory);
      }
    }

    return acc;
  }, []);
};