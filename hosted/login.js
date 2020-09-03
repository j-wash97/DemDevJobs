"use strict";var ErrorAlert=function(a){return/*#__PURE__*/React.createElement("div",{className:"alert alert-danger mt-3 mx-2"},a.error)},sendAjax=function(a,b,c,d,e){$.ajax({cache:!1,type:a,url:b,data:c,dataType:"json",success:d,error:e})},handleLogin=function(a){return(a.preventDefault(),""==$("#loginForm").find("#user").val()||""==$("#loginForm").find("#pass").val())?(ReactDOM.render(/*#__PURE__*/React.createElement(ErrorAlert,{error:"A username and password are required"}),document.querySelector("#errorAlert")),!1):(sendAjax("POST",$("#loginForm").attr("action"),$("#loginForm").serialize(),function(a){return window.location=a.redirect},function(a){return ReactDOM.render(/*#__PURE__*/React.createElement(ErrorAlert,{error:JSON.parse(a.responseText).error}),document.querySelector("#errorAlert"))}),!1)},handleSignup=function(a){return(a.preventDefault(),""==$("#signupForm").find("#user").val()||""==$("#signupForm").find("#pass").val()||""==$("#signupForm").find("#pass2").val())?(ReactDOM.render(/*#__PURE__*/React.createElement(ErrorAlert,{error:"All fields are required"}),document.querySelector("#errorAlert")),!1):$("#signupForm").find("#pass").val()===$("#signupForm").find("#pass2").val()?(sendAjax("POST",$("#signupForm").attr("action"),$("#signupForm").serialize(),function(a){return window.location=a.redirect},function(a){return ReactDOM.render(/*#__PURE__*/React.createElement(ErrorAlert,{error:JSON.parse(a.responseText).error}),document.querySelector("#errorAlert"))}),!1):(ReactDOM.render(/*#__PURE__*/React.createElement(ErrorAlert,{error:"Passwords do not match"}),document.querySelector("#errorAlert")),!1)},titleBarLinks=/*#__PURE__*/React.createElement("ul",{className:"navbar-nav",id:"titleBarLinks"},/*#__PURE__*/React.createElement("li",{className:"nav-item"},/*#__PURE__*/React.createElement("a",{className:"nav-link",href:"/"},"View Jobs")));window.onload=function(){ReactDOM.render(titleBarLinks,document.querySelector("#linkList")),$("#loginForm").submit(handleLogin),$("#signupForm").submit(handleSignup)};