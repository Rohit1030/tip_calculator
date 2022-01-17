const id_bill = document.querySelector("#bill");
const reset_btn = document.querySelector(".reset");
const id_custom = document.querySelector("#custom");
const id_people = document.querySelector("#people");
const tip_btns = document.querySelectorAll(".tip-btn");
const people_error = document.querySelector(".people-error");
const bill_error = document.querySelector(".bill-error");
let amount;
let tip;
let people_count;
let tip_per_head;
let amount_per_head;
let people_regex = /^[0-9]*[1-9]+$|^[1-9]+[0-9]*$/;
let bill_regex = /^(?!0\d)\d*(\.\d+)?$/;
let custom_regex = /^\d+$/;
let bool_one;
let bool_two;
let bool_three;
let show_amounts = document.querySelectorAll(".amount");
let storeBtn;
let notClicked = true;

window.addEventListener("DOMContentLoaded", setInitial);

people_count = id_people.value;

id_bill.addEventListener("focus", function(){
    if(people_count==="" || people_count===undefined){
        peopleError(id_bill);
    }
    else if(people_count!==undefined && tip===undefined){
        bill_error.style.display = "inline";
        bill_error.textContent = "Enter Tip";
        id_bill.setAttribute('disabled', 'disabled');
    }
    else {
        id_people.setAttribute('disabled', 'disabled');
        tip_btns.forEach(function(item){
            item.setAttribute('disabled', 'disabled');
        });
        id_custom.setAttribute('disabled', 'disabled');
        reset_btn.removeAttribute("disabled");
        reset_btn.style.setProperty("--resetColor", "hsl(172, 67%, 45%)");
        reset_btn.style.setProperty("--resetHover", "hsl(185, 41%, 84%)");
        reset_btn.style.setProperty("--cursor", "pointer");
    }
});

id_bill.addEventListener('input', function(){
    amount = id_bill.value;
    bool_two = bill_regex.test(amount);
        if(bool_two===false){
            if(amount==='0'){
                bill_error.textContent = "Can't be zero";
            }
            else {
                bill_error.textContent = "Enter valid amount!";
            }
            bill_error.style.display = "inline";
            id_bill.style.setProperty('--color', 'rgb(238, 120, 120)');
        }
        else {
            bill_error.style.display = "none";
            id_bill.style.setProperty("--color", "hsl(172, 67%, 45%)");
            if(amount!==""){
                amount = parseFloat(amount);
                calculateAmounts();
            }
            else if(amount===""){
                show_amounts[0].textContent = `0.00`;
                show_amounts[1].textContent = `0.00`;
            }
        }
});

tip_btns.forEach(function(item){
    item.addEventListener('click', function(){
        id_custom.style.setProperty("--color", "hsl(172, 67%, 45%)");
        id_custom.value = "";
        if(people_count==="" || people_count===undefined){
            peopleError(item);
        }
        else {
            tip = parseFloat(item.value);
            id_bill.removeAttribute('disabled');
            bill_error.style.display = "none";
            if(notClicked){
                item.style.setProperty("--btnBackground", "hsl(172, 67%, 45%)");
                item.style.setProperty("--btnColor", "hsl(183, 100%, 15%)");
                storeBtn = item;
                notClicked = false;
            }
            else {
                setStore();
                item.style.setProperty("--btnBackground", "hsl(172, 67%, 45%)");
                item.style.setProperty("--btnColor", "hsl(183, 100%, 15%)");
                storeBtn = item;
            }
        }
    });
});

id_people.addEventListener('input', function(){
    people_count = id_people.value;
    bool_one = people_regex.test(people_count);
        if(bool_one===false){
            if(people_count==='0'){
                people_error.textContent = "Can't be zero";
            }
            else {
                people_error.textContent = "Enter valid number!";
            }
            people_error.style.display = "inline";
            id_bill.setAttribute('disabled', 'disabled');
            id_custom.setAttribute('disabled', 'disabled');
            tip_btns.forEach(function(item){
                item.setAttribute("disabled", "disabled");
            });
            id_people.style.setProperty('--color', 'rgb(238, 120, 120)');
        }
        else {
            id_bill.removeAttribute('disabled');
            id_custom.removeAttribute("disabled");
            tip_btns.forEach(function(item){
                item.removeAttribute('disabled');
            });
            people_count = parseInt(people_count);
            people_error.style.display = 'none';
            id_people.style.setProperty("--color", "hsl(172, 67%, 45%)");
        }
});

reset_btn.addEventListener("click", function(){
    people_count = undefined;
    amount = undefined;
    tip = undefined;
    amount_per_head = undefined;
    tip_per_head = undefined;
    reset_btn.setAttribute("disabled", "disabled");
    reset_btn.style.setProperty("--resetColor", "hsl(186, 14%, 43%)");
    reset_btn.style.setProperty("--resetHover", "hsl(186, 14%, 43%)");
    reset_btn.style.setProperty("--cursor", "default");
    id_bill.value = "";
    id_people.value = "";
    id_custom.value = "";
    id_people.removeAttribute('disabled');
    id_custom.removeAttribute('disabled');
        tip_btns.forEach(function(item){
            item.removeAttribute('disabled');
        });
    setInitial();
    if(storeBtn!==undefined){
        restore();
    }
});

id_custom.addEventListener("focus", function(){
    tip = undefined;
    if(people_count==="" || people_count===undefined){
        peopleError(id_custom);
    }
    else {
        if(storeBtn!==undefined){
            restore();
        }
    }
});

id_custom.addEventListener("input", function(){
    if(custom_regex.test(id_custom.value)){
        let x = id_custom.value;
        tip = parseInt(x)/100;
        id_custom.style.setProperty("--color", "hsl(172, 67%, 45%)");
        id_bill.removeAttribute('disabled');
        bill_error.style.display = "none";
    }
    else {
        id_custom.style.setProperty('--color', 'rgb(238, 120, 120)');
        id_bill.setAttribute("disabled", "disabled");
    }
});

function peopleError(item){
    people_error.style.display = "inline";
    people_error.textContent = "Can't be zero";
    item.setAttribute("disabled", "disabled");
    id_people.style.setProperty('--color', 'rgb(238, 120, 120)');
    id_people.focus();
}

function setInitial(){
    reset_btn.setAttribute("disabled", "disabled");
    show_amounts[0].textContent = "0.00";
    show_amounts[1].textContent = "0.00";
}

function calculateAmounts(){
    amount_per_head = Math.round(((((tip*amount) + amount))/people_count + Number.EPSILON)*100)/100;
        tip_per_head = Math.round((tip*amount/people_count + Number.EPSILON)*100)/100;
        show_amounts[0].textContent = `${tip_per_head}`;
        show_amounts[1].textContent = `${amount_per_head}`;    
}

function setStore(){
    storeBtn.style.setProperty("--btnBackground", "hsl(183, 100%, 15%)");
    storeBtn.style.setProperty("--btnColor", "hsl(189, 41%, 97%)");
}

function restore(){
    setStore();
    notClicked = true;
    storeBtn = undefined;
}