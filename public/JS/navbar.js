$(document).ready(function(){
    $('.btn').click(function(){
      $('.items').toggleClass("show");
      $('ul li').toggleClass("hide");
    });
  });


  document.querySelector(".dropdown-main").addEventListener("click", function(){
    this.classList.toggle("active");
  });
  