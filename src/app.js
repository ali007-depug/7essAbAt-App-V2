// import calc functions
import {
  toggleCalc,
  handelCalcNumbers,
  handelCalcOperations,
  handelCalcEqual,
  handelCalcRemoveBtn,
  handelClearCalcResult,
  handelCalcClose,
} from "./calc.js";

//inputs & labels
// ==== selsect 4 inputs field ======
const catg = document.querySelector("#catg");
const number = document.querySelector("#number");
const price = document.querySelector("#price");
const sellPrice = document.querySelector("#sellPrice");

// ==== price & sell price wrappers ====
const priceWrap = document.querySelector(".priceWrap");
const sellPriceWrap = document.querySelector(".sellPriceWrap");

// ==== select main app's button ====
const addToStackButton = document.querySelector("#addToStack");
const calcProfitButton = document.querySelector("#calcProfit");
const showProfitButton = document.querySelector("#showProfit");
const showDataButton = document.querySelector("#showData");
const hideDataButton = document.querySelector("#hideData");
const openSellsButton = document.querySelector("#openSells");
const closeSellsButton = document.querySelector("#closeSells");
const updateStack = document.querySelector("#updateStack");
const emptyStackButton = document.querySelector("h6");
const clearProfit = document.querySelector("#zero");
const btnCalc = document.querySelector("#btnCalc");

// ==== select wrappers =====
const data = document.querySelector(".data");
const inputsHolder = document.querySelector(".inputsHolder");
const dateHolder = document.querySelector(".dateHolder");
const buttons = document.querySelector(".buttons");

// === Calculator's Elements ===
const calculator = document.querySelector(".calc");
const numbers = document.querySelectorAll(".calc__numbers div");
const result = document.querySelector(".calc__result");
const equal = document.querySelector(".equal");
const btnClear = document.querySelector(".clear");
const btnRemove = document.querySelector(".remove");
const btnClose = document.querySelector(".calc__btnClose");
const allOperations = document.querySelectorAll(".right-panel div");

// ==== select overlay and popup ====
const overlay = document.querySelector(".overlay");
const popup = document.querySelector(".popup");

const goodsPriceWrapper = document.querySelector(".allMoney__actualGoodsPrice");
const allMoneyIcon = document.querySelector(".allMoeny__eyeIcon");

// ===== register the service worker =====
if ("serviceWorker" in navigator) {
  window.addEventListener("load", function () {
    navigator.serviceWorker
      .register("./serviceWorker.js")
      .then((res) => console.log(`service worker register`))
      .catch((err) => {
        console.log(`service worker is not registered:${err}`);
      });
  });
}
// ===== store 4 inputs in array =====
let inputs = [catg, number, price, sellPrice];

// ===== array of items,which contain objects that holds data about item =====
let arrOfItems = [];

// ===== Invoke showDate function that show date on the top of page =====
showDate(dateHolder);

// ===== check if there is data on local storage,if it's exist then assingd it to arrOfItems =====
if (getDataFromls("data")) {
  arrOfItems = JSON.parse(localStorage.getItem("data"));
}

// ===== get data from local storage =====
getDataFromls("data");

/**
 * ===== remove item when click on trash icon =====
 * ===== And :
 * ===== show inforamtion about the item =====
 *  */
data.addEventListener("click", (e) => {
  if (e.target.parentElement.classList.contains("remove")) {
    let itemId =
      e.target.parentElement.parentElement.parentElement.getAttribute(
        "item-id"
      );

    removeItemWith(itemId, getDataFromls("data"));
    e.target.parentElement.parentElement.parentElement.remove();
  }

  // === when user click on info icon , invoke infoPopup function ===
  if (e.target.classList.contains("info")) {
    let name = e.target.parentElement.parentElement.children[1].innerHTML;
    let number = e.target.parentElement.parentElement.children[2].innerHTML;
    let modfiedTime =
      e.target.parentElement.parentElement.getAttribute("item-id");
    let soldItem = e.target.parentElement.parentElement.children[7].innerHTML;

    infoPopup(name, number, modfiedTime, soldItem);
  }
});

// ===== remove the items data from local storage =====
emptyStackButton.addEventListener("click", () => {
  let oldInputs = getDataFromls("data");
  if (oldInputs) {
    EmptyStackPopup();
    emptyInputs(inputs);
  } else {
    data.innerHTML = "";
    data.style.display = "flex";
    data.classList.add("addBorder");
    data.appendChild(document.createTextNode("عذراً،لا توجد عناصر في المتجر"));
  }
});

/**
 *  ===== event to handel the addToStack button =====
 *
 * which invoke handelInputs() & add Data to local storage function
 */
addToStackButton.addEventListener("click", () => {
  let numberTest = false;
  let priceTest = false;
  let sellPriceTest = false;
  //if it's empty then it won't work
  if (
    catg.value != "" &&
    number.value != "" &&
    price.value != "" &&
    sellPrice.value != ""
  ) {
    // also check if the last three inputs must be numbers
    numberTest = checkIfItNum(number.value);
    priceTest = checkIfItNum(price.value);
    sellPriceTest = checkIfItNum(sellPrice.value);
    if (numberTest && priceTest && sellPriceTest) {
      //before that if show data was clicked then hide data would be in it's place which it must be show data
      if (hideDataButton.style.display === "flex") {
        hideDataButton.style.display = "none";
        showDataButton.style.display = "flex";
      }
      // if it's number then :
      handelInputs(getDataFromls("data"));
      emptyInputs(inputs);
      data.innerHTML = "";
      data.style.display = "flex";
      data.classList.add("addBorder");

      // data.appendChild(document.createTextNode("Added succefuly"));
      const updateMessage = document.createElement("span");
      updateMessage.className = "updateMessage";
      const updateMessageText = document.createTextNode(
        "أضيف إلى المتجر بنجاح"
      );
      const updateMessageIcon = document.createElement("i");
      updateMessageIcon.className = "fa-solid fa-circle-check";
      updateMessage.appendChild(updateMessageText);
      updateMessage.appendChild(updateMessageIcon);
      data.appendChild(updateMessage);

      data.appendChild(updateMessage);
    }

    //if it's not number then :
    else {
      data.innerHTML = "";
      data.style.display = "flex";
      data.classList.add("addBorder");
      data.appendChild(
        document.createTextNode(
          `الرجاء إدخال أرقام بدلاً عن : {${findFalse(
            number.value,
            price.value,
            sellPrice.value
          )}}`
        )
      );
    }
  }

  //if it's empty then :
  else {
    data.innerHTML = "";
    data.style.display = "flex";
    data.classList.add("addBorder");

    data.appendChild(
      document.createTextNode("الرجاء ملء جميع الحقول  الفارغة")
    );
  }
});

/**
 * === function to handel inputs ===
 *
 * @param {array} oldInputs
 */
function handelInputs(oldInputs) {
  // case 1 : no data on ls
  if (!oldInputs) {
    const item = {
      catName: catg.value.trim(),
      number: number.value.trim(),
      price: price.value.trim(),
      sellPrice: sellPrice.value.trim(),
      id: Date.now(),
      profit: 0,
      clonedNumber: 0,
      soldItem: 0,
    };
    arrOfItems.push(item);
  }
  //case 2 : there is data but they arn't same
  if (oldInputs) {
    //case 2.1 : create a copy of item
    // when notPriceSameIndex return a positve number, mean that there is a match with the data on local storge with the same name but different in price, this conditon will allow us to invoke the updated function;
    let notPriceSameIndex = oldInputs.findIndex((e) => {
      return e.catName === catg.value.trim() && e.price !== price.value.trim();
    });

    if (notPriceSameIndex !== -1) {
      //this function works only if the users try to add an exist item
      updateNameIfItsExist(oldInputs, catg.value.trim(), price.value.trim());
    }
    //case 2.2 : create new item
    //if the users add a not exist item then creat a new one
    else {
      const item = {
        catName: catg.value.trim(),
        number: number.value.trim(),
        price: price.value.trim(),
        sellPrice: sellPrice.value.trim(),
        id: Date.now(),
        profit: 0,
        clonedNumber: 0,
        soldItem: 0,
      };
      arrOfItems.push(item);
    }
    //case 3.1: update the number of items:
    //when user insert a new item same as on of old items in name and price
    let samePriceIndex = oldInputs.findIndex((ele) => {
      return (
        ele.catName === catg.value.trim() && ele.price === price.value.trim()
      );
    });
    //update the number
    if (samePriceIndex !== -1) {
      oldInputs[samePriceIndex].number =
        +oldInputs[samePriceIndex].number + +number.value;
      arrOfItems = oldInputs;
    }
  }
  addDataTols("data", arrOfItems);
}

/**
 *
 * @param {array} oldInputs
 * @param {string} itemName
 * @param {string} priceValue
 * function for create a new copy for exist item with different in the price value.
 * if user add an (item) to stack,and this item is exist already but there is different in the price then add a unique number at the end of its name EX:(item1,item2,item3) to stack
 */
function updateNameIfItsExist(oldInputs, itemName, priceValue) {
  for (let i = 0; i < oldInputs.length; i++) {
    //case 1: if the searched is exist but one time
    if (itemName == oldInputs[i].catName) {
      if (priceValue !== oldInputs[i].price) {
        // update clonedNumber property
        oldInputs[i].clonedNumber += 1;
        arrOfItems = oldInputs;
        const item = {
          catName: `${oldInputs[i].catName}${oldInputs[i].clonedNumber}`.trim(),
          number: number.value.trim(),
          price: price.value.trim(),
          sellPrice: sellPrice.value.trim(),
          id: Date.now(),
          profit: 0,
          clonedNumber: 0,
          soldItem: 0,
        };
        arrOfItems.push(item);
      }
    }
  }
  addDataTols("data", arrOfItems);
}

/**
 * === function to empty inputs fields ===
 * @param {array} inputs
 */
function emptyInputs(inputs) {
  for (let i = 0; i < inputs.length; i++) {
    inputs[i].value = "";
  }
}

/**
 * === function to add data to local storage ===
 * @param {string} name
 * @param {array} array
 */
function addDataTols(dataName, array) {
  localStorage.setItem(dataName, JSON.stringify(array));
}

/**
 * === function to get data from local storage ===
 *
 * @param {string} dataName
 * @returns data on local storage
 */
function getDataFromls(dataName) {
  return JSON.parse(localStorage.getItem(dataName));
}

/**
 * === calculate all items profit ====
 *
 * case senario :
 * 1- loop on all data
 *
 * 2- add every item profit to another to find the sum of all
 *
 * @param {array} oldInputs
 * @param {string} message
 */
function calcAllProfits(oldInputs, message) {
  if (oldInputs) {
    let res = 0;
    for (let i = 0; i < oldInputs.length; i++) {
      res += oldInputs[i].profit;
    }
    data.innerHTML = "";
    data.style.display = "flex";
    data.classList.add("addBorder");

    let span = document.createElement("span");
    let theProfit = document.createTextNode(`${message} : ${res} جنيه سوداني`);
    span.appendChild(theProfit);
    data.appendChild(span);
  } else data.innerHTML = "";
}

/**
 * ===== event to show profit =====-
 */
showProfitButton.onclick = function () {
  let oldInputs = getDataFromls("data");
  if (hideDataButton.style.display === "flex") {
    hideDataButton.style.display = "none";
    showDataButton.style.display = "flex";
  }
  if (oldInputs) calcAllProfits(getDataFromls("data"), " أرباحك هي ");
  else {
    data.innerHTML = "";
    data.style.display = "flex";
    data.classList.add("addBorder");

    data.appendChild(document.createTextNode("عذراً، لا توجد عناصر في المتجر"));
  }
};

/**
 * ===== event to calculate profit =====
 *
 * case senario :
 * 1- mainpulate buttons
 *
 * 2- invoke funtion to calculate profit for all items
 */
calcProfitButton.onclick = function () {
  if (hideDataButton.style.display === "flex") {
    hideDataButton.style.display = "none";
    showDataButton.style.display = "flex";
  }
  if (getDataFromls("data"))
    calcAllProfits(getDataFromls("data"), "أرباح اليوم هي  ");
  else {
    data.innerHTML = "";
    data.style.display = "flex";
    data.classList.add("addBorder");

    data.appendChild(document.createTextNode("عذراً، لا توجد عناصر في المتجر"));
  }
};

/**
 * ==== show data event =====
 * case senario :
 *
 * 1- mainpulate data
 *
 * 2- invoke function that handel the show data operation
 */
showDataButton.onclick = function () {
  // let oldInputs = getDataFromls("data");
  data.innerHTML = "";
  data.style.display = "flex";
  data.classList.add("addBorder");
  addItemsToPage(getDataFromls("data"));
};

/**
 * ===== function to add items on page ====
 * usage :
 *
 * create item and wrap all its details on it and add it to the data wrapper
 *
 * @param {array} oldInputs
 */
function addItemsToPage(oldInputs) {
  if (oldInputs) {
    // loop on arrOfItems and create item to wrap all item's detail on it, & do this action to all items
    arrOfItems.forEach((item, i) => {
      let itemm = document.createElement("div");
      itemm.className = "item";
      itemm.setAttribute("item-id", item.id);

      let itemIndex = document.createTextNode(`${i + 1}-`);
      let itemIndexWrapper = document.createElement("span");
      itemIndexWrapper.appendChild(itemIndex);

      // let itemName = document.createTextNode(` Name : ${item.catName} `);
      let itemName = document.createTextNode(`الاسم : ${item.catName} `);
      // let someicon = document.createElement("i");
      // someicon.className = "fa fa-shop";
      let itemNameWrapper = document.createElement("span");
      itemNameWrapper.appendChild(itemName);
      // itemNameWrapper.appendChild(someicon)

      // let itemNumber = document.createTextNode(`- Number : ${item.number} `);
      let itemNumber = document.createTextNode(`- العدد :  ${item.number}`);
      let itemNumberWrapper = document.createElement("span");
      itemNumberWrapper.appendChild(itemNumber);

      // let itemPrice = document.createTextNode(`- Price : ${item.price} - `);
      let itemPrice = document.createTextNode(
        `- سعر الشراء : ${item.price} - `
      );
      let itemPriceWrapper = document.createElement("span");
      itemPriceWrapper.appendChild(itemPrice);

      let itemSellPrice = document.createTextNode(
        `سعر البيع : ${item.sellPrice} - `
      );
      let itemSellPriceWrapper = document.createElement("span");
      itemSellPriceWrapper.appendChild(itemSellPrice);

      let itemProfit = document.createTextNode(`الربح : ${item.profit}`);
      let itemProfitWrapper = document.createElement("span");
      itemProfitWrapper.appendChild(itemProfit);

      let removeInfoWrapper = document.createElement("div");
      removeInfoWrapper.className = "removeInfoWrapper";

      let remove = document.createElement("span");
      remove.className = "remove";
      remove.title = "Remove Item";
      let icon = document.createElement("i");
      icon.className = "fa-solid fa-trash";
      icon.setAttribute("role", "button");
      remove.appendChild(icon);

      // ==== create hidden sold item to access it when click on info icon,instead of looping on the data to find the match one ====
      let hidSoldItemWrapper = document.createElement("span");
      hidSoldItemWrapper.setAttribute("hidden", "true");
      let soldItem = document.createTextNode(item.soldItem);
      hidSoldItemWrapper.appendChild(soldItem);
      // === info icon ====
      let info = document.createElement("i");
      info.className = "fa fa-info";
      info.title = "information";
      let infoWrapper = document.createElement("span");
      infoWrapper.className = "info";
      infoWrapper.appendChild(info);

      removeInfoWrapper.appendChild(remove);
      removeInfoWrapper.appendChild(infoWrapper);
      itemm.appendChild(itemIndexWrapper);
      itemm.appendChild(itemNameWrapper);
      itemm.appendChild(itemNumberWrapper);
      itemm.appendChild(itemPriceWrapper);
      itemm.appendChild(itemSellPriceWrapper);
      itemm.appendChild(itemProfitWrapper);
      itemm.appendChild(removeInfoWrapper);
      itemm.appendChild(hidSoldItemWrapper);
      data.appendChild(itemm);
      showDataButton.style.display = "none";
      hideDataButton.style.display = "flex";
    });
  } else {
    //make it flex because when you remove the data with the red button it make it none
    data.style.display = "flex";
    data.classList.add("addBorder");
    showDataButton.style.display = "none";
    hideDataButton.style.display = "flex";
    data.appendChild(document.createTextNode("لا توجد عناصر لعرضها"));
  }
}

//event to hide data & mainpulate some buttons
hideDataButton.onclick = function () {
  data.style.display = "none";
  data.classList.remove("addBorder");
  showDataButton.style.display = "flex";
  hideDataButton.style.display = "none";
};

//when click on open sells ==> minpulate other buttons
openSellsButton.onclick = function () {
  priceWrap.classList.add("hide");
  sellPriceWrap.classList.add("hide");
  //mainpulate buttons
  buttons.classList.add("toUp");
  //hide buttons
  addToStackButton.style.display = "none";
  openSellsButton.style.display = "none";
  showProfitButton.style.display = "none";
  //show buttons
  closeSellsButton.style.display = "flex";
  updateStack.style.display = "flex";
  calcProfitButton.style.display = "flex";
  //change poistion for one buttons
  updateStack.style.order = "-1";
};

//when click on close sells ==> minpulate other buttons
closeSellsButton.onclick = function () {
  priceWrap.classList.remove("hide");
  sellPriceWrap.classList.remove("hide");
  buttons.classList.remove("toUp");
  //hide buttons
  calcProfitButton.style.display = "none";
  updateStack.style.display = "none";
  closeSellsButton.style.display = "none";
  //show buttons
  showProfitButton.style.display = "flex";
  openSellsButton.style.display = "flex";
  addToStackButton.style.display = "flex";
};

/**
==== event fot update stack ====
 * case senario :
 * 1- check if category and number fields are not empty.
 *
 * 2- mainpulate buttons
 * 
 * 3- if the item has 0 number then don't updated
 * 
 * 4- invoke function to handel profits & other to empty inputs fields
 * 
 * 5- show some meesages to user 
 * 
*/
updateStack.onclick = function () {
  if (catg.value != "" && number.value != "") {
    data.style.display = "flex";
    data.classList.add("addBorder");
    //Show and hide data's buttons
    if (hideDataButton.style.display === "flex") {
      hideDataButton.style.display = "none";
      showDataButton.style.display = "flex";
    }
    // if one of items == zero then don't

    handelProfits(getDataFromls("data"));
  } else {
    data.innerHTML = "";
    data.style.display = "flex";
    data.classList.add("addBorder");
    data.appendChild(document.createTextNode("الرجاء ملء جميع الحقول"));
  }
};

/**
 * ====== handel profites function ======
 *
 * case senario :
 *
 * 1- loop on data & store the matched item {which has same name on (input field [category name] & and the data items)}
 *
 * 2- if there is matchItem update the match item's number and profits
 *
 * 3- set soldItem == number.value &&& this important to show the sold item on info popup &&&
 *
 * 4- updata the data on locals storage by assign the arrOfItems to the mainpulated data.
 *
 * @param {array} oldInputs
 */
function handelProfits(oldInputs) {
  if (oldInputs) {
    // find the match input in the data on local storage
    let matchIndex = oldInputs.findIndex((e) => {
      return e.catName == catg.value.trim();
    });
    // === if there is match ===
    if (matchIndex !== -1) {
      // check if the number value is not greater than data on ls
      if (+number.value <= +oldInputs[matchIndex].number) {
        if (oldInputs[matchIndex].number !== 0) {
          console.log("exist and not = 0");
          // === substract the number of items ===
          oldInputs[matchIndex].number =
            +oldInputs[matchIndex].number - +number.value;
          // === calc the profit ===
          oldInputs[matchIndex].profit +=
            (+oldInputs[matchIndex].sellPrice - +oldInputs[matchIndex].price) *
            +number.value;
          // === assaign sold item prop , to show it in info ===
          oldInputs[matchIndex].soldItem += Number(number.value);

          // new update
          arrOfItems = oldInputs;
          emptyInputs(inputs);
          data.innerHTML = "";
          data.style.display = "flex";
          data.classList.add("addBorder");

          const updateMessage = document.createElement("span");
          updateMessage.className = "updateMessage";
          const updateMessageText = document.createTextNode("تم تحديث المتجر");
          const updateMessageIcon = document.createElement("i");
          updateMessageIcon.className = "fa-solid fa-circle-check";
          updateMessage.appendChild(updateMessageText);
          updateMessage.appendChild(updateMessageIcon);
          data.appendChild(updateMessage);
        }

        // if it's matched but it's number equal to zero then show an error meesage
        else {
          data.innerHTML = "";
          data.style.display = "flex";
          data.classList.add("addBorder");
          data.appendChild(
            document.createTextNode("عذراً، هذا العنصر لديك صفر")
          );
        }
      } else {
        console.log("not work");
        data.innerHTML = "";
        data.style.display = "flex";
        data.classList.add("addBorder");
        data.appendChild(
          document.createTextNode(
            `عذراً،العناصر في المتجر أقل من (${number.value})`
          )
        );
      }
    }
    // if there is not match ever
    else {
      console.log("notExist");
      data.innerHTML = "";
      data.style.display = "flex";
      data.classList.add("addBorder");
      data.appendChild(
        document.createTextNode("عذراً، هذا العنصر غير موجود في متجرك")
      );
    }
  }
  // if there is not data on local storage
  else {
    data.innerHTML = "";
    data.style.display = "flex";
    data.classList.add("addBorder");
    data.appendChild(document.createTextNode("لا توجد بيانات"));
  }
  addDataTols("data", arrOfItems);
}

/**
 * ===== remove item =====
 * function to remove item from local storage
 *
 * case senario :
 * 1- loop on data
 *
 * 2- filter the data by :
 *  2.1 return all items that dosn't match item id argument
 *
 * 3- update the data on local storage
 * @param {string} itemId
 * @param {array} oldInputs
 */
function removeItemWith(itemId, oldInputs) {
  arrOfItems = oldInputs.filter((ele) => {
    return ele.id != itemId;
  });

  addDataTols("data", arrOfItems);

  // when there is only on item left
  if (arrOfItems.length == 0) {
    arrOfItems = [];
    localStorage.removeItem("data");

    // manipulate buttons
    showDataButton.style.display = "flex";
    hideDataButton.style.display = "none";
    // manipulate data
    data.classList.remove("addBorder");
    data.style.display = "none";
  }
}

/**
 * ==== show date function =====
 * Responsible of :
 * show date on the page
 * @param {DomELement} container
 */
function showDate(container) {
  let now = Date.now();
  let date = new Date(now);
  date = date.toString();
  // the format would be like : 8-3-2023
  // the date output as : Thu Aug 03 2023 14:26
  let day = date.substring(8, 10); //03
  let month = date.substring(4, 7); // aug
  let year = date.substring(11, 15); // 2023
  // let time = date.substring(16, 21); // 14:26
  let span = document.createElement("span");
  span.appendChild(document.createTextNode(`${day}-${month}-${year}`));

  container.appendChild(span);
}

/**
 * ==== function for popup when user click on set profit to zero =====
 */
function setProfitToZeroPopup() {
  overlay.classList.add("showOverlay");
  // create popup content to set yes or not to remove locacl storge
  let span = document.createElement("span");
  span.className = "popupTitle";
  span.appendChild(document.createTextNode("هل أنت متأكد؟"));
  popup.appendChild(span);
  let yes = document.createElement("span");
  yes.className = "yes";
  yes.appendChild(document.createTextNode("نعم"));
  let no = document.createElement("span");
  no.className = "no";
  no.appendChild(document.createTextNode("لا"));
  //create holder for yes and no
  let holderYandNo = document.createElement("div");
  holderYandNo.className = "holderYandNo";
  holderYandNo.appendChild(yes);
  holderYandNo.appendChild(no);
  popup.appendChild(holderYandNo);
  popup.classList.add("showPopup");
  holderYandNo.addEventListener("click", (e) => {
    if (e.target.classList.contains("yes")) {
      let oldInputs = getDataFromls("data");
      if (oldInputs) {
        for (let i = 0; i < oldInputs.length; i++) {
          oldInputs[i].profit = 0;
        }
        arrOfItems = oldInputs;
        addDataTols("data", arrOfItems);

        // show message on data
        data.innerHTML = "";
        data.style.display = "flex";
        data.appendChild(document.createTextNode("تم تصفير الأرباح بنجاح"));
      } else {
        data.innerHTML = "";
        data.style.display = "flex";
        data.appendChild(
          document.createTextNode("عذراً،لا توجد عناصر في المتجر")
        );
      }

      overlay.classList.remove("showOverlay");
      popup.classList.remove("showPopup");
    } else {
      if (e.target.classList.contains("no")) {
        overlay.classList.remove("showOverlay");
        popup.classList.remove("showPopup");
      }
    }
    popup.innerHTML = "";
  });
  holderYandNo.addEventListener("mouseover", (e) => {
    if (e.target.classList.contains("yes")) {
      e.target.classList.add("btnRed");
    } else {
      e.target.classList.add("btnGreen");
    }
  });
  holderYandNo.addEventListener("mouseout", (e) => {
    if (e.target.classList.contains("yes")) {
      e.target.classList.remove("btnRed");
    } else e.target.classList.remove("btnGreen");
  });
}

// ==== event to set all item's profit to zero ====
/**
 * when user click on ser profit to zero button :
 *  invoke setProfitToZeroPopup() ==> to handel all item's profit
 */
clearProfit.onclick = function () {
  setProfitToZeroPopup();
  data.style.display = "none";
  showDataButton.style.display = "flex";
  hideDataButton.style.display = "none";
};

/**
 * ==== Empty stack popup function ====
 *
 * This function responsible of :
 *
 * 1- show overlay
 *
 * 2- show popup with Yes & No opitons
 *
 * 3- handel event for Yes & No
 *
 * 4- remove the item's data form local storage
 */
function EmptyStackPopup() {
  overlay.classList.add("showOverlay");
  // create popup content to set yes or not to remove locacl storge
  let span = document.createElement("span");
  span.className = "popupTitle";
  span.appendChild(document.createTextNode("هل أنت متأكد ؟"));
  popup.appendChild(span);
  let yes = document.createElement("span");
  yes.className = "yes";
  yes.appendChild(document.createTextNode("نعم"));
  let no = document.createElement("span");
  no.className = "no";
  no.appendChild(document.createTextNode("لا"));
  //create holder for yes and no
  let holderYandNo = document.createElement("div");
  holderYandNo.className = "holderYandNo";
  holderYandNo.appendChild(yes);
  holderYandNo.appendChild(no);
  popup.appendChild(holderYandNo);
  popup.classList.add("showPopup");
  holderYandNo.addEventListener("click", (e) => {
    if (e.target.classList.contains("yes")) {
      arrOfItems = [];
      localStorage.removeItem("data");
      data.style.display = "none";
      overlay.classList.remove("showOverlay");
      popup.classList.remove("showPopup");
    } else {
      if (e.target.classList.contains("no")) {
        overlay.classList.remove("showOverlay");
        popup.classList.remove("showPopup");
      }
    }
    popup.innerHTML = "";
  });
  // ==== when hover on yes and no
  holderYandNo.addEventListener("mouseover", (e) => {
    if (e.target.classList.contains("yes")) {
      e.target.classList.add("btnRed");
    } else {
      e.target.classList.add("btnGreen");
    }
  });
  holderYandNo.addEventListener("mouseout", (e) => {
    if (e.target.classList.contains("yes")) {
      e.target.classList.remove("btnRed");
    } else e.target.classList.remove("btnGreen");
  });
}

/**
 * ==== The function below for ====
 * checking if the input value contain number.
 * usage : to prevent 'add to stack' function if user insert char in numeric field
 *
 * the checking process is done by RegExp
 * @param {string} inputValue
 * @returns {boolean} if it's numbers
 */
function checkIfItNum(inputValue) {
  let regExp = /^[0-9]+$/;
  let result;
  if (!regExp.test(inputValue)) {
    result = false;
  } else result = true;

  return result;
}

/**
 * ==== The function below for : ====
 * Find the false value (which is contain chars or any marks) in the 3 numeric input field
 *
 * usage : to tell user where the insert was worng.
 *
 * @param {string} numberValue
 * @param {string} sellPriceValue
 * @param {string} priceValue
 * @returns {array} of all false values
 */
function findFalse(numberValue, priceValue, sellPriceValue) {
  let a = [numberValue, priceValue, sellPriceValue];
  let regExp = /^[0-9]+$/;
  let falses = [];
  for (let i = 0; i < a.length; i++) {
    if (!regExp.test(a[i])) {
      falses.push(a[i]);
    }
  }
  return falses;
}

/**
 * ===== info popup function =====
 *
 * the function below is responsible of :
 *
 * 1- show overlay
 *
 * 2- create popup which contain :
 *  2.1 popup title
 *  2.2 popup close icon
 *  2.3 popup content which is a functions arguments [item name and number,itemID{time},sold item]
 *
 * 3. event for close icon
 *
 *
 * @param {string} nameAndNumber
 * @param {string} modifiedTime
 * @param {string} soldItem
 */
function infoPopup(itemName, itemNumber, modifiedTime, soldItem) {
  overlay.classList.add("showOverlay");
  // ===== popup Close =====
  let popupClose = document.createElement("span");
  popupClose.className = "popupClose";
  // popupClose.appendChild(document.createTextNode("X"));
  let closeIcon = document.createElement("i");
  closeIcon.className = "fa fa-close";
  popupClose.appendChild(closeIcon);
  // ===== popup title =====
  let popupTitle = document.createElement("span");
  popupTitle.className = "popupTitle";
  popupTitle.appendChild(document.createTextNode("معلومات"));

  // ==== create popup Content wrapper ====
  let popupCont = document.createElement("div");
  popupCont.className = "popupCont";
  // ==== create div to show name and number =====
  let div = document.createElement("div");
  let item_Name = document.createTextNode(itemName);
  let item_Number = document.createTextNode(itemNumber);
  div.appendChild(item_Name);
  div.appendChild(item_Number);

  // ===== show date modified =======
  let timeMod = document.createElement("div");
  timeMod.className = "timeModified";
  let date = new Date(Number(modifiedTime));
  date = date.toString();
  // the format would be like : 8-3-2023
  // the date output as : Thu Aug 03 2023 14:26
  let day = date.substring(8, 10); //03
  let month = date.substring(4, 7); // aug
  let year = date.substring(11, 15); // 2023
  let timee = date.substring(16, 21); // 14:26

  timeMod.appendChild(
    document.createTextNode(`${day}-${month}-${year}- ${timee}`)
  );

  // ==== show sold item ====
  let soldItemWrapper = document.createElement("div");
  soldItemWrapper.className = "soldItemWrapper";
  let soldItemData = document.createTextNode(`تم بيع : ${soldItem}`);
  soldItemWrapper.appendChild(soldItemData);
  // ===== add all created things to popup and then to body =====
  popupCont.appendChild(div);
  popupCont.appendChild(soldItemWrapper);
  popupCont.appendChild(timeMod);
  popup.appendChild(popupClose);
  popup.appendChild(popupTitle);
  popup.appendChild(popupCont);
  popup.classList.add("showPopup");
  // document.body.appendChild(popup);

  //
  popupClose.onclick = function () {
    popup.classList.remove("showPopup");
    popup.innerHTML = "";
    overlay.classList.remove("showOverlay");
    // overlay.style.display = "none";
  };
}

// func to calc all goods price
function calcAllGoodPrices() {
  let data = getDataFromls("data");

  let filteredArray = []
  let mapThroughData = data.map((ele)=>{
    if(ele.number !== 0){
    filteredArray.push(ele)
    }
    return filteredArray;
  })

  let allMoney = filteredArray.reduce((curr, acc) => {
    let result = +curr + (+acc.price * +acc.number);
    return result;
  }, 0);

  return allMoney.toLocaleString();
}
calcAllGoodPrices();

goodsPriceWrapper.innerHTML = calcAllGoodPrices();

// toggle good price via eye icon button

allMoneyIcon.addEventListener("click", (e) => {
  console.log("eye icon clicked");

  // hide the eye icon + goods price
  if (e.target.className === "fa fa-eye") {
    const icon = document.querySelector("#eye");
    icon.className = "fa fa-eye-slash";
    goodsPriceWrapper.innerHTML = "*****";
  } else {
    const icon = document.querySelector("#eye");
    icon.className = "fa fa-eye";
    goodsPriceWrapper.innerHTML = calcAllGoodPrices();
  }
});
/**
 * ======= Calc module =========
 *
 */

// show and hide calculator
toggleCalc(btnCalc, calculator);

// handel numbers
handelCalcNumbers(numbers, result, btnRemove);

// handel operations
handelCalcOperations(allOperations, result);

// handel equal btn
handelCalcEqual(equal, result);

// handel remove
handelCalcRemoveBtn(btnRemove, result);

// handel clear
handelClearCalcResult(btnClear, result, btnRemove);

// handel close
handelCalcClose(btnClose);
/**
 *  ======= Future Updates =======
 * use parentheses
 * 
 * ======= some event shape =======
 * 
 btnParentheses.onclick = function () {
   // if (result.innerHTML == "") {
     console.log("invaild");
    if (result.innerHTML.charAt(0) == "(") {
     result.innerHTML = `${result.innerHTML})`;
   } else result.innerHTML = `(${result.innerHTML}`;
  };
 * 
 */
