var d= new Date();
 var DaysOfWeek=[
    'MON',
    'TUE',
    'WED',
    'THU',
    'FRI',
    'SAT',
    'SUN'
    ];

 var Months=['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec' ];

var Currentmonth= Months[d.getMonth()];

this.CurrentMonth = d.getMonth();
this.CurrentYear = d.getFullYear();

display(this.CurrentMonth,this.CurrentYear);
var k=d.getMonth();
document.getElementById("monthyear").innerHTML=Currentmonth +" "+ this.CurrentYear;

function display(m,y){

  var firstDayOfCurrentMonth = new Date(y, m, 1).getDay();
  var lastDateOfCurrentMonth = new Date(y, m+1, 0).getDate();
  
  let html='<table id="dates">';
  html += '<tr>';
  for( x=0; x<7; x++ ) {
    html += '<th class="daysheader">' + this.DaysOfWeek[x] + '</th>';
  }
  html +='</tr>';
  
  var day = 1;

for (var i = 0; i <= 42; i++) {
  html += '<td class="calendar-day id="today">';
 
  if(i>=firstDayOfCurrentMonth){
    
   if((day==d.getDate())&&(m==d.getMonth())){
    
    html +='<p id="date" style="background-color:#FEC0CE; cursor:pointer;"  >'+ day+'</p>';
      
   }
    
    else{
      html +='<p id="date" style="cursor:pointer;" >'+ day+'</p>';
     
       
    }
      day++;
    
  }
 
  
   if(i%7==0){
    
   html += '<tr></tr>';
  }
  if (day > lastDateOfCurrentMonth) {
    break;
  }
} 

document.getElementById("days").innerHTML = html;
  
}

function prevYear(){
k--;
  
   document.getElementById("monthyear").innerHTML=Months[k] +" "+ this.CurrentYear;
  this.CurrentMonth=k;
  display(k,this.CurrentYear);
}
function nextYear(){
k++;
 
   document.getElementById("monthyear").innerHTML=Months[k] +" "+ this.CurrentYear;
  this.CurrentMonth=k;
  display(k,this.CurrentYear);
}


function submit_task(){
  display(this.CurrentMonth,this.CurrentYear);
}



